/*
  Warnings:

  - You are about to drop the column `event_id` on the `session` table. All the data in the column will be lost.
  - You are about to drop the `event` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `injury` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "injury" DROP CONSTRAINT "injury_athleteId_fkey";

-- DropForeignKey
ALTER TABLE "session" DROP CONSTRAINT "session_event_id_fkey";

-- DropIndex
DROP INDEX "athlete_number_key";

-- DropIndex
DROP INDEX "session_event_id_key";

-- AlterTable
ALTER TABLE "athlete" ALTER COLUMN "weight" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "session" DROP COLUMN "event_id",
ADD COLUMN     "aerobic_ratio" DOUBLE PRECISION,
ADD COLUMN     "anaerobic_energy" DOUBLE PRECISION,
ADD COLUMN     "anaerobic_index" DOUBLE PRECISION,
ADD COLUMN     "athletesessionheartratezone_time_2" DOUBLE PRECISION,
ADD COLUMN     "athletesessionheartratezone_time_3" DOUBLE PRECISION,
ADD COLUMN     "athletesessionheartratezone_time_4" DOUBLE PRECISION,
ADD COLUMN     "athletesessionpowereventdistancezone_events_1" INTEGER,
ADD COLUMN     "athletesessionpowereventdistancezone_events_2" INTEGER,
ADD COLUMN     "athletesessionpowereventdistancezone_events_3" INTEGER,
ADD COLUMN     "athletesessionpowereventdurationzone_events_1" INTEGER,
ADD COLUMN     "athletesessionpowereventdurationzone_events_2" INTEGER,
ADD COLUMN     "athletesessionpowereventdurationzone_events_3" INTEGER,
ADD COLUMN     "athletesessionpowereventmaxspeedzone_events_1" INTEGER,
ADD COLUMN     "athletesessionpowereventmaxspeedzone_events_2" INTEGER,
ADD COLUMN     "athletesessionpowereventmaxspeedzone_events_3" INTEGER,
ADD COLUMN     "athletesessionpowerzone_distance_1" DOUBLE PRECISION,
ADD COLUMN     "athletesessionpowerzone_distance_2" DOUBLE PRECISION,
ADD COLUMN     "athletesessionpowerzone_distance_3" DOUBLE PRECISION,
ADD COLUMN     "athletesessionspeedzone_distance_1" DOUBLE PRECISION,
ADD COLUMN     "athletesessionspeedzone_distance_2" DOUBLE PRECISION,
ADD COLUMN     "athletesessionspeedzone_distance_3" DOUBLE PRECISION,
ADD COLUMN     "athletesessionspeedzone_distance_4" DOUBLE PRECISION,
ADD COLUMN     "athletesessionspeedzone_distance_5" DOUBLE PRECISION,
ADD COLUMN     "average_external_power" DOUBLE PRECISION,
ADD COLUMN     "average_hr" DOUBLE PRECISION,
ADD COLUMN     "average_hr_percentual" DOUBLE PRECISION,
ADD COLUMN     "average_p" DOUBLE PRECISION,
ADD COLUMN     "average_power_aer" DOUBLE PRECISION,
ADD COLUMN     "average_time" DOUBLE PRECISION,
ADD COLUMN     "average_v" DOUBLE PRECISION,
ADD COLUMN     "eccentric_index" DOUBLE PRECISION,
ADD COLUMN     "equivalent_distance" DOUBLE PRECISION,
ADD COLUMN     "equivalent_distance_index" DOUBLE PRECISION,
ADD COLUMN     "ext_work_over" DOUBLE PRECISION,
ADD COLUMN     "ext_work_over_neg" DOUBLE PRECISION,
ADD COLUMN     "ext_work_over_zone0" DOUBLE PRECISION,
ADD COLUMN     "ext_work_over_zone0_neg" DOUBLE PRECISION,
ADD COLUMN     "ext_work_over_zone1" DOUBLE PRECISION,
ADD COLUMN     "ext_work_over_zone1_neg" DOUBLE PRECISION,
ADD COLUMN     "ext_work_over_zone2" DOUBLE PRECISION,
ADD COLUMN     "ext_work_over_zone2_neg" DOUBLE PRECISION,
ADD COLUMN     "external_work" DOUBLE PRECISION,
ADD COLUMN     "max_values_cardio" DOUBLE PRECISION,
ADD COLUMN     "max_values_cardio_percentual" DOUBLE PRECISION,
ADD COLUMN     "max_values_power" DOUBLE PRECISION,
ADD COLUMN     "max_values_speed" DOUBLE PRECISION,
ADD COLUMN     "power_events" INTEGER,
ADD COLUMN     "power_events_avg_power" DOUBLE PRECISION,
ADD COLUMN     "power_events_avg_time" DOUBLE PRECISION,
ADD COLUMN     "recovery_average_power" DOUBLE PRECISION,
ADD COLUMN     "recovery_average_time" DOUBLE PRECISION,
ADD COLUMN     "speed_events" INTEGER,
ADD COLUMN     "tot_brake_events" INTEGER,
ADD COLUMN     "tot_burst_events" INTEGER,
ADD COLUMN     "total_distance" DOUBLE PRECISION,
ADD COLUMN     "total_energy" DOUBLE PRECISION,
ALTER COLUMN "end_timestamp" DROP NOT NULL;

-- DropTable
DROP TABLE "event";

-- DropTable
DROP TABLE "injury";

-- DropEnum
DROP TYPE "competition";

-- DropEnum
DROP TYPE "event_type";

-- CreateTable
CREATE TABLE "game" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3),
    "vs" TEXT,
    "competition" TEXT,
    "result" TEXT,
    "home" BOOLEAN,
    "total_distance" DOUBLE PRECISION,
    "speedzone4_distance" DOUBLE PRECISION,
    "speedzone5_distance" DOUBLE PRECISION,
    "avg_speed" DOUBLE PRECISION,
    "minutesPlayed" INTEGER,
    "goals" INTEGER,
    "assists" INTEGER,
    "keyPasses" INTEGER,
    "keyPassesSuccess" INTEGER,
    "keyPassesSuccess_pct" TEXT,
    "shoots" INTEGER,
    "shoots_OnTarget" INTEGER,
    "shoots_OnTarget_pct" TEXT,
    "xG" INTEGER,
    "fouls" INTEGER,
    "foulsOnPlayer" INTEGER,
    "offside" INTEGER,
    "yellowCards" INTEGER,
    "redCards" INTEGER,
    "actions" INTEGER,
    "actionsSuccess" INTEGER,
    "actionsSuccess_pct" TEXT,
    "actionsInsideBox" INTEGER,
    "chances" INTEGER,
    "chancesSuccess" INTEGER,
    "chancesSuccess_pct" TEXT,
    "lostBalls" INTEGER,
    "lostBalls_OwnHalf" INTEGER,
    "ballRecoveries" INTEGER,
    "ballRecoveries_OppositeHalf" INTEGER,
    "badBallControl" INTEGER,
    "passes" INTEGER,
    "passesSuccess" INTEGER,
    "passesSuccess_pct" TEXT,
    "passForward" INTEGER,
    "passForwardSuccess" INTEGER,
    "passForwardSuccess_pct" TEXT,
    "passBack" INTEGER,
    "passBackSuccess" INTEGER,
    "passBackSuccess_pct" TEXT,
    "passLong" INTEGER,
    "passLongSuccess" INTEGER,
    "passLongSuccess_pct" TEXT,
    "passShorMedium" INTEGER,
    "passShorMediumSuccess" INTEGER,
    "passShorMediumSuccess_pct" TEXT,
    "passInsideFinalThird" INTEGER,
    "passInsideFinalThirdSuccess" INTEGER,
    "passInsideFinalThirdSuccess_pct" TEXT,
    "passInsideBox" INTEGER,
    "passInsideBoxSuccess" INTEGER,
    "passInsideBoxSuccess_pct" TEXT,
    "crosses" INTEGER,
    "crossesSuccess" INTEGER,
    "crossesSuccess_pct" TEXT,
    "shotAssists" INTEGER,
    "shotAssistsSuccess" INTEGER,
    "shotAssistsSuccess_pct" TEXT,
    "passesReceived" INTEGER,
    "passesReceivedInsideBox" INTEGER,
    "challenges" INTEGER,
    "challengesSuccess" INTEGER,
    "challengesSuccess_pct" TEXT,
    "aerialDuels" INTEGER,
    "aerialDuelsSuccess" INTEGER,
    "aerialDuelsSuccess_pct" TEXT,
    "challengesInDefence" INTEGER,
    "challengesInDefenceSuccess" INTEGER,
    "challengesInDefenceSuccess_pct" TEXT,
    "challengesInAttack" INTEGER,
    "challengesInAttackSuccess" INTEGER,
    "challengesInAttackSuccess_pct" TEXT,
    "dribbles" INTEGER,
    "dribblesSuccess" INTEGER,
    "dribblesSuccess_pct" TEXT,
    "tackles" INTEGER,
    "tacklesSuccess" INTEGER,
    "tacklesSuccess_pct" TEXT,
    "interceptions" INTEGER,
    "freeKick" INTEGER,
    "freeKickShoots" INTEGER,
    "freeKickShootsOnTarget" INTEGER,
    "freeKickShootsOnTarget_pct" TEXT,
    "corners" INTEGER,
    "throwIns" INTEGER,
    "throwInSuccess" INTEGER,
    "throwInSuccess_pct" TEXT,

    CONSTRAINT "game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "athlete_game_fitness" (
    "id" TEXT NOT NULL,
    "athlete_id" INTEGER,
    "game_id" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "minutes" INTEGER NOT NULL,
    "total_distance" DOUBLE PRECISION,
    "speedzone4_distance" DOUBLE PRECISION,
    "speedzone5_distance" DOUBLE PRECISION,
    "avg_speed" DOUBLE PRECISION,

    CONSTRAINT "athlete_game_fitness_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "athlete_game_ttd" (
    "id" TEXT NOT NULL,
    "athlete_id" INTEGER,
    "game_id" TEXT NOT NULL,
    "number" INTEGER,
    "minutesPlayed" INTEGER,
    "goals" INTEGER,
    "assists" INTEGER,
    "keyPasses" INTEGER,
    "keyPassesSuccess" INTEGER,
    "keyPassesSuccess_pct" TEXT,
    "shoots" INTEGER,
    "shoots_OnTarget" INTEGER,
    "shoots_OnTarget_pct" TEXT,
    "xG" INTEGER,
    "fouls" INTEGER,
    "foulsOnPlayer" INTEGER,
    "offside" INTEGER,
    "yellowCards" INTEGER,
    "redCards" INTEGER,
    "actions" INTEGER,
    "actionsSuccess" INTEGER,
    "actionsSuccess_pct" TEXT,
    "actionsInsideBox" INTEGER,
    "chances" INTEGER,
    "chancesSuccess" INTEGER,
    "chancesSuccess_pct" TEXT,
    "lostBalls" INTEGER,
    "lostBalls_OwnHalf" INTEGER,
    "ballRecoveries" INTEGER,
    "ballRecoveries_OppositeHalf" INTEGER,
    "badBallControl" INTEGER,
    "passes" INTEGER,
    "passesSuccess" INTEGER,
    "passesSuccess_pct" TEXT,
    "passForward" INTEGER,
    "passForwardSuccess" INTEGER,
    "passForwardSuccess_pct" TEXT,
    "passBack" INTEGER,
    "passBackSuccess" INTEGER,
    "passBackSuccess_pct" TEXT,
    "passLong" INTEGER,
    "passLongSuccess" INTEGER,
    "passLongSuccess_pct" TEXT,
    "passShorMedium" INTEGER,
    "passShorMediumSuccess" INTEGER,
    "passShorMediumSuccess_pct" TEXT,
    "passInsideFinalThird" INTEGER,
    "passInsideFinalThirdSuccess" INTEGER,
    "passInsideFinalThirdSuccess_pct" TEXT,
    "passInsideBox" INTEGER,
    "passInsideBoxSuccess" INTEGER,
    "passInsideBoxSuccess_pct" TEXT,
    "crosses" INTEGER,
    "crossesSuccess" INTEGER,
    "crossesSuccess_pct" TEXT,
    "shotAssists" INTEGER,
    "shotAssistsSuccess" INTEGER,
    "shotAssistsSuccess_pct" TEXT,
    "passesReceived" INTEGER,
    "passesReceivedInsideBox" INTEGER,
    "challenges" INTEGER,
    "challengesSuccess" INTEGER,
    "challengesSuccess_pct" TEXT,
    "aerialDuels" INTEGER,
    "aerialDuelsSuccess" INTEGER,
    "aerialDuelsSuccess_pct" TEXT,
    "challengesInDefence" INTEGER,
    "challengesInDefenceSuccess" INTEGER,
    "challengesInDefenceSuccess_pct" TEXT,
    "challengesInAttack" INTEGER,
    "challengesInAttackSuccess" INTEGER,
    "challengesInAttackSuccess_pct" TEXT,
    "dribbles" INTEGER,
    "dribblesSuccess" INTEGER,
    "dribblesSuccess_pct" TEXT,
    "tackles" INTEGER,
    "tacklesSuccess" INTEGER,
    "tacklesSuccess_pct" TEXT,
    "interceptions" INTEGER,
    "freeKick" INTEGER,
    "freeKickShoots" INTEGER,
    "freeKickShootsOnTarget" INTEGER,
    "freeKickShootsOnTarget_pct" TEXT,
    "corners" INTEGER,
    "throwIns" INTEGER,
    "throwInSuccess" INTEGER,
    "throwInSuccess_pct" TEXT,

    CONSTRAINT "athlete_game_ttd_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "athlete_game_fitness" ADD CONSTRAINT "athlete_game_fitness_athlete_id_fkey" FOREIGN KEY ("athlete_id") REFERENCES "athlete"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "athlete_game_fitness" ADD CONSTRAINT "athlete_game_fitness_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "athlete_game_ttd" ADD CONSTRAINT "athlete_game_ttd_athlete_id_fkey" FOREIGN KEY ("athlete_id") REFERENCES "athlete"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "athlete_game_ttd" ADD CONSTRAINT "athlete_game_ttd_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
