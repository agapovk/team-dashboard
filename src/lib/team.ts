import { cache } from "react";
import { teams } from "@/drizzle/schema";
import { db } from "@/lib/db";

// Chokepoint: единый team-scoping. Все запросы/мутации/теги скоупятся отсюда.
// MVP: seed-команда (первая в БД). Стадия 2/3: id из сессии пользователя.
export const getCurrentTeamId = cache(async (): Promise<string> => {
  const [team] = await db.select({ id: teams.id }).from(teams).limit(1);
  if (!team) {
    throw new Error("No team found — выполни `pnpm db:seed`");
  }
  return team.id;
});
