-- CreateEnum
CREATE TYPE "event_type" AS ENUM ('GAME', 'TRAINING');

-- CreateEnum
CREATE TYPE "competition" AS ENUM ('CHAMPIONAT', 'CUP', 'FRIENDLY');

-- CreateTable
CREATE TABLE "injury" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "diagnosis" TEXT NOT NULL,
    "athleteId" INTEGER NOT NULL,
    "estimated_recovery" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "injury_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "athlete" (
    "id" INTEGER NOT NULL,
    "name" TEXT,
    "last_name" TEXT,
    "first_name" TEXT,
    "short_name" TEXT,
    "birthday" TIMESTAMP(3),
    "height" INTEGER,
    "isInTeam" BOOLEAN NOT NULL DEFAULT false,
    "isInjured" BOOLEAN NOT NULL DEFAULT false,
    "number" INTEGER,
    "photo" TEXT,
    "weight" INTEGER,
    "position_id" INTEGER,
    "foot" TEXT,

    CONSTRAINT "athlete_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "position" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "position_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "athlete_session" (
    "id" INTEGER NOT NULL,
    "athlete_id" INTEGER NOT NULL,
    "session_id" INTEGER NOT NULL,
    "average_time" DOUBLE PRECISION,
    "total_distance" DOUBLE PRECISION,
    "average_v" DOUBLE PRECISION,
    "athletesessionspeedzone_distance_1" DOUBLE PRECISION,
    "athletesessionspeedzone_distance_2" DOUBLE PRECISION,
    "athletesessionspeedzone_distance_3" DOUBLE PRECISION,
    "athletesessionspeedzone_distance_4" DOUBLE PRECISION,
    "athletesessionspeedzone_distance_5" DOUBLE PRECISION,
    "max_values_speed" DOUBLE PRECISION,
    "speed_events" INTEGER,
    "tot_burst_events" INTEGER,
    "tot_brake_events" INTEGER,
    "eccentric_index" DOUBLE PRECISION,
    "athletesessionpowerzone_distance_1" DOUBLE PRECISION,
    "athletesessionpowerzone_distance_2" DOUBLE PRECISION,
    "athletesessionpowerzone_distance_3" DOUBLE PRECISION,
    "average_p" DOUBLE PRECISION,
    "max_values_power" DOUBLE PRECISION,
    "equivalent_distance_index" DOUBLE PRECISION,
    "equivalent_distance" DOUBLE PRECISION,
    "total_energy" DOUBLE PRECISION,
    "anaerobic_energy" DOUBLE PRECISION,
    "anaerobic_index" DOUBLE PRECISION,
    "aerobic_ratio" DOUBLE PRECISION,
    "average_power_aer" DOUBLE PRECISION,
    "power_events" INTEGER,
    "power_events_avg_time" DOUBLE PRECISION,
    "power_events_avg_power" DOUBLE PRECISION,
    "recovery_average_time" DOUBLE PRECISION,
    "recovery_average_power" DOUBLE PRECISION,
    "athletesessionpowereventdurationzone_events_1" INTEGER,
    "athletesessionpowereventdurationzone_events_2" INTEGER,
    "athletesessionpowereventdurationzone_events_3" INTEGER,
    "athletesessionpowereventdistancezone_events_1" INTEGER,
    "athletesessionpowereventdistancezone_events_2" INTEGER,
    "athletesessionpowereventdistancezone_events_3" INTEGER,
    "athletesessionpowereventmaxspeedzone_events_1" INTEGER,
    "athletesessionpowereventmaxspeedzone_events_2" INTEGER,
    "athletesessionpowereventmaxspeedzone_events_3" INTEGER,
    "external_work" DOUBLE PRECISION,
    "ext_work_over" DOUBLE PRECISION,
    "ext_work_over_neg" DOUBLE PRECISION,
    "average_external_power" DOUBLE PRECISION,
    "ext_work_over_zone0" DOUBLE PRECISION,
    "ext_work_over_zone1" DOUBLE PRECISION,
    "ext_work_over_zone2" DOUBLE PRECISION,
    "ext_work_over_zone0_neg" DOUBLE PRECISION,
    "ext_work_over_zone1_neg" DOUBLE PRECISION,
    "ext_work_over_zone2_neg" DOUBLE PRECISION,
    "average_hr" DOUBLE PRECISION,
    "average_hr_percentual" DOUBLE PRECISION,
    "max_values_cardio" DOUBLE PRECISION,
    "max_values_cardio_percentual" DOUBLE PRECISION,
    "athletesessionheartratezone_time_2" DOUBLE PRECISION,
    "athletesessionheartratezone_time_3" DOUBLE PRECISION,
    "athletesessionheartratezone_time_4" DOUBLE PRECISION,

    CONSTRAINT "athlete_session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" INTEGER NOT NULL,
    "team_id" INTEGER,
    "name" VARCHAR(255),
    "start_timestamp" TIMESTAMP(3) NOT NULL,
    "end_timestamp" TIMESTAMP(3) NOT NULL,
    "category_name" VARCHAR(255),
    "notes" VARCHAR(255),
    "total_time" INTEGER,
    "n_tracks" INTEGER,
    "event_id" TEXT,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "type" "event_type" NOT NULL DEFAULT 'TRAINING',
    "place" TEXT,
    "vs" TEXT,
    "competition" "competition",
    "isHome" BOOLEAN DEFAULT true,

    CONSTRAINT "event_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "athlete_number_key" ON "athlete"("number");

-- CreateIndex
CREATE UNIQUE INDEX "session_event_id_key" ON "session"("event_id");

-- AddForeignKey
ALTER TABLE "injury" ADD CONSTRAINT "injury_athleteId_fkey" FOREIGN KEY ("athleteId") REFERENCES "athlete"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "athlete" ADD CONSTRAINT "athlete_position_id_fkey" FOREIGN KEY ("position_id") REFERENCES "position"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "athlete_session" ADD CONSTRAINT "athlete_session_athlete_id_fkey" FOREIGN KEY ("athlete_id") REFERENCES "athlete"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "athlete_session" ADD CONSTRAINT "athlete_session_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "event"("id") ON DELETE SET NULL ON UPDATE CASCADE;
