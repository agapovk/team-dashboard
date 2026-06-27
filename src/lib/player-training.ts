import { playerTrainings } from "@/drizzle/schema";
import { db } from "@/lib/db";
import { sessionLoad } from "@/lib/sports/srpe";

// Chokepoint: единый write-path RPE. ЛЮБАЯ запись rpe (импорт, ручной ввод, правка задним
// числом, позже PWA) идёт сюда — всегда пересчитывает sessionLoad через lib/sports/srpe.
// Семантика null ≠ 0 живёт в одном месте. См. docs/LOAD_MONITORING.md.

// Метрики игрока на запись (числа; numeric → строка на границе Drizzle ниже).
export interface PlayerTrainingWrite {
  playerId: string;
  trainingId: string;
  starter: boolean;
  duration: number; // секунды
  totalTime: number; // секунды
  rpe: number | null; // 1–10; null = пробел
  distance: number;
  maxSpeed: number;
  maxSpeedPct: number;
  maxAcc: number;
  maxDec: number;
  distanceSpeedZ2: number;
  distanceSpeedZ3: number;
  accEvents: number;
  decEvents: number;
  avgHR: number;
  maxHR: number;
  avgHRPct: number;
  maxHRPct: number;
  timeHRZ3plus: number; // секунды
  distanceAccZ2plus: number;
  imported?: boolean;
}

// numeric-колонки Drizzle принимают строку. null остаётся null.
const numStr = (n: number): string => String(n);

// Upsert по (playerId, trainingId). sessionLoad всегда пересчитывается из rpe + duration.
export async function upsertPlayerTraining(
  input: PlayerTrainingWrite
): Promise<void> {
  const load = sessionLoad(input.rpe, input.duration);

  const values = {
    playerId: input.playerId,
    trainingId: input.trainingId,
    starter: input.starter,
    duration: input.duration,
    totalTime: input.totalTime,
    sessionLoad: load === null ? null : numStr(load),
    distance: numStr(input.distance),
    rpe: input.rpe,
    maxSpeed: numStr(input.maxSpeed),
    maxSpeedPct: numStr(input.maxSpeedPct),
    maxAcc: numStr(input.maxAcc),
    maxDec: numStr(input.maxDec),
    distanceSpeedZ2: numStr(input.distanceSpeedZ2),
    distanceSpeedZ3: numStr(input.distanceSpeedZ3),
    accEvents: input.accEvents,
    decEvents: input.decEvents,
    avgHR: input.avgHR,
    maxHR: input.maxHR,
    avgHRPct: numStr(input.avgHRPct),
    maxHRPct: numStr(input.maxHRPct),
    timeHRZ3plus: input.timeHRZ3plus,
    distanceAccZ2plus: numStr(input.distanceAccZ2plus),
    imported: input.imported ?? true,
  };

  await db
    .insert(playerTrainings)
    .values(values)
    .onConflictDoUpdate({
      target: [playerTrainings.playerId, playerTrainings.trainingId],
      set: values,
    });
}
