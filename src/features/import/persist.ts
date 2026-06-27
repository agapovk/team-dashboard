"use server";

import { updateTag } from "next/cache";
import { trainings } from "@/drizzle/schema";
import { teamCacheTags } from "@/lib/cache-tags";
import { db } from "@/lib/db";
import { upsertPlayerTraining } from "@/lib/player-training";
import { type PlayerCache, resolvePlayer } from "@/lib/players";
import { getCurrentTeamId } from "@/lib/team";
import type { SessionImport } from "@/types/import";

// Запись SessionImport[] → БД. Источник-агностик: не знает про xlsx (см. docs/ARCHITECTURE.md).
// Дедуп сессий по (teamId, date, category). Игроки — через resolvePlayer (chokepoint identity).
// RPE — через upsertPlayerTraining (chokepoint write-path). Per-session коммит + partial-fail.

export interface ImportFailure {
  session: { date: string; category: string };
  error: string;
}

export interface ImportReport {
  imported: number; // успешно записанных сессий
  players: number; // суммарно записанных строк игроков
  failed: ImportFailure[];
}

export type ImportResult =
  | { ok: true; data: ImportReport }
  | { ok: false; error: string };

// Upsert тренировки с дедупом (teamId, date, category) → возвращает id.
async function upsertTraining(
  session: SessionImport,
  teamId: string
): Promise<string> {
  const [row] = await db
    .insert(trainings)
    .values({
      teamId,
      date: session.date,
      category: session.category,
      type: session.type,
      notes: session.notes,
      duration: session.duration,
      // kind по умолчанию "field" (импорт; матч/зал — ручной ввод, фаза 3)
    })
    .onConflictDoUpdate({
      target: [trainings.teamId, trainings.date, trainings.category],
      set: {
        type: session.type,
        notes: session.notes,
        duration: session.duration,
      },
    })
    .returning({ id: trainings.id });
  if (!row) {
    throw new Error("Не удалось записать тренировку");
  }
  return row.id;
}

async function persistSession(
  session: SessionImport,
  teamId: string,
  cache: PlayerCache
): Promise<number> {
  const trainingId = await upsertTraining(session, teamId);
  for (const p of session.players) {
    const playerId = await resolvePlayer(p.name, teamId, cache, p.position);
    await upsertPlayerTraining({
      playerId,
      trainingId,
      starter: p.starter,
      duration: p.duration,
      totalTime: p.totalTime,
      rpe: p.rpe,
      distance: p.distance,
      maxSpeed: p.maxSpeed,
      maxSpeedPct: p.maxSpeedPct,
      maxAcc: p.maxAcc,
      maxDec: p.maxDec,
      distanceSpeedZ2: p.distanceSpeedZ2,
      distanceSpeedZ3: p.distanceSpeedZ3,
      accEvents: p.accEvents,
      decEvents: p.decEvents,
      avgHR: p.avgHR,
      maxHR: p.maxHR,
      avgHRPct: p.avgHRPct,
      maxHRPct: p.maxHRPct,
      timeHRZ3plus: p.timeHRZ3plus,
      distanceAccZ2plus: p.distanceAccZ2plus,
    });
  }
  return session.players.length;
}

export async function persistSessions(
  sessions: SessionImport[]
): Promise<ImportResult> {
  let teamId: string;
  try {
    teamId = await getCurrentTeamId();
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }

  const cache: PlayerCache = new Map();
  const report: ImportReport = { imported: 0, players: 0, failed: [] };

  // Per-session коммит: битая сессия не валит батч.
  for (const session of sessions) {
    try {
      const n = await persistSession(session, teamId, cache);
      report.imported += 1;
      report.players += n;
    } catch (e) {
      report.failed.push({
        session: {
          date: session.date.toISOString(),
          category: session.category,
        },
        error: (e as Error).message,
      });
    }
  }

  if (report.imported > 0) {
    updateTag(teamCacheTags.trainings(teamId));
    updateTag(teamCacheTags.players(teamId));
  }

  return { ok: true, data: report };
}
