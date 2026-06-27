import { and, eq, sql } from "drizzle-orm";
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
