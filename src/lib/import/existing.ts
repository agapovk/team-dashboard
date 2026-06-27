"use server";

import { eq } from "drizzle-orm";
import { trainings } from "@/drizzle/schema";
import { db } from "@/lib/db";
import { sessionDedupKey } from "@/lib/import/dedup-key";
import { getCurrentTeamId } from "@/lib/team";

// Существующие дедуп-ключи команды — для пометки «уже импортировано» в превью.
export async function findExistingKeys(): Promise<string[]> {
  const teamId = await getCurrentTeamId();
  const rows = await db
    .select({ date: trainings.date, category: trainings.category })
    .from(trainings)
    .where(eq(trainings.teamId, teamId));
  return rows.map((r) => sessionDedupKey(r.date, r.category));
}
