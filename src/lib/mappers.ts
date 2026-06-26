import type { playerTrainings } from "@/drizzle/schema";
import type { PlayerTrainingMetrics } from "@/types/domain";

// Chokepoint: граница row → domain. Drizzle отдаёт numeric СТРОКОЙ — парсим в number здесь,
// чтобы string-vs-number ловился на границе, а не в расчётах.

type PlayerTrainingRow = typeof playerTrainings.$inferSelect;

// numeric (string) → number. Бросаем при мусоре — лучше упасть на границе, чем NaN в расчётах.
function num(value: string): number {
  const n = Number(value);
  if (Number.isNaN(n)) {
    throw new Error(`Expected numeric, got: ${value}`);
  }
  return n;
}

function nullableNum(value: string | null): number | null {
  return value === null ? null : num(value);
}

export function toPlayerTrainingMetrics(
  row: PlayerTrainingRow
): PlayerTrainingMetrics {
  return {
    id: row.id,
    playerId: row.playerId,
    trainingId: row.trainingId,
    starter: row.starter,
    duration: row.duration,
    totalTime: row.totalTime,
    sessionLoad: nullableNum(row.sessionLoad),
    distance: num(row.distance),
    rpe: row.rpe,
    maxSpeed: num(row.maxSpeed),
    maxSpeedPct: num(row.maxSpeedPct),
    maxAcc: num(row.maxAcc),
    maxDec: num(row.maxDec),
    distanceSpeedZ2: num(row.distanceSpeedZ2),
    distanceSpeedZ3: num(row.distanceSpeedZ3),
    accEvents: row.accEvents,
    decEvents: row.decEvents,
    avgHR: row.avgHR,
    maxHR: row.maxHR,
    avgHRPct: num(row.avgHRPct),
    maxHRPct: num(row.maxHRPct),
    timeHRZ3plus: row.timeHRZ3plus,
    distanceAccZ2plus: num(row.distanceAccZ2plus),
    imported: row.imported,
  };
}
