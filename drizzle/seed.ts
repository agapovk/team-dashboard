import { teams } from "@/drizzle/schema";
import { db } from "@/lib/db";

// MVP-seed: одна команда (см. lib/team.ts → getCurrentTeamId).
async function seed() {
  const existing = await db.select({ id: teams.id }).from(teams).limit(1);
  if (existing[0]) {
    console.log(`Team already exists: ${existing[0].id}`);
    return;
  }
  const [team] = await db
    .insert(teams)
    .values({ name: "My Team" })
    .returning({ id: teams.id });
  console.log(`Seeded team: ${team?.id}`);
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
