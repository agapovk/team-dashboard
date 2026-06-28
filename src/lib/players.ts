import { and, eq, inArray, sql } from "drizzle-orm";
import { players } from "@/drizzle/schema";
import { db } from "@/lib/db";

// Chokepoint: identity игрока. Матчинг ТОЛЬКО здесь — по нормализованному имени.
// Тот же путь переиспользует будущий PWA-импорт RPE. См. docs/ARCHITECTURE.md.

// Нормализация имени: trim, схлоп пробелов, lower. БД хранит оригинал, матчим по норме.
export function normalizeName(name: string): string {
  return name.trim().replace(/\s+/g, " ").toLowerCase();
}

// Кэш батча: нормализованное имя → playerId. Один `PLAYER 1` на пачку файлов резолвится раз.
export type PlayerCache = Map<string, string>;

// Находит игрока по нормализованному имени в команде; создаёт, если нет. Возвращает id.
// cache опционален — для батч-импорта (persist создаёт один Map на весь батч).
export async function resolvePlayer(
  name: string,
  teamId: string,
  cache?: PlayerCache,
  position?: string | null
): Promise<string> {
  const norm = normalizeName(name);
  const cached = cache?.get(norm);
  if (cached) {
    return cached;
  }

  const [existing] = await db
    .select({ id: players.id })
    .from(players)
    .where(
      and(eq(players.teamId, teamId), eq(sql`lower(${players.name})`, norm))
    )
    .limit(1);

  let id = existing?.id;
  if (!id) {
    const [created] = await db
      .insert(players)
      .values({ name: name.trim(), teamId, position: position ?? null })
      .returning({ id: players.id });
    if (!created) {
      throw new Error(`Не удалось создать игрока: ${name}`);
    }
    id = created.id;
  }

  cache?.set(norm, id);
  return id;
}

// Батч-резолв: тот же chokepoint identity, но для пачки игроков за ~2 round-trip
// (1 SELECT существующих + 1 INSERT отсутствующих) вместо 2N. Возвращает Map norm→id.
// Дедуп по нормализованному имени внутри пачки; position берётся из первого вхождения.
export async function resolvePlayers(
  entries: { name: string; position?: string | null }[],
  teamId: string,
  cache?: PlayerCache
): Promise<Map<string, string>> {
  const result = new Map<string, string>();

  // norm → {name, position} первого вхождения (для INSERT), порядок не важен.
  const wanted = new Map<string, { name: string; position: string | null }>();
  for (const e of entries) {
    const norm = normalizeName(e.name);
    const cached = cache?.get(norm);
    if (cached) {
      result.set(norm, cached);
      continue;
    }
    if (!wanted.has(norm)) {
      wanted.set(norm, { name: e.name.trim(), position: e.position ?? null });
    }
  }

  if (wanted.size === 0) {
    return result;
  }

  const norms = [...wanted.keys()];
  const existing = await db
    .select({ id: players.id, name: players.name })
    .from(players)
    .where(
      and(
        eq(players.teamId, teamId),
        inArray(sql`lower(${players.name})`, norms)
      )
    );
  for (const row of existing) {
    const norm = normalizeName(row.name);
    result.set(norm, row.id);
    wanted.delete(norm);
  }

  if (wanted.size > 0) {
    const created = await db
      .insert(players)
      .values(
        [...wanted.values()].map((w) => ({
          name: w.name,
          teamId,
          position: w.position,
        }))
      )
      .returning({ id: players.id, name: players.name });
    for (const row of created) {
      result.set(normalizeName(row.name), row.id);
    }
  }

  // Прогреть cache батча.
  if (cache) {
    for (const [norm, id] of result) {
      cache.set(norm, id);
    }
  }

  return result;
}
