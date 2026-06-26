// Доменные типы — только числа, отдельно от Drizzle-inferred (где numeric = string).
// lib/sports/ и расчёты видят ИХ, не сырые row.

export interface PlayerTrainingMetrics {
  id: string;
  playerId: string;
  trainingId: string;
  starter: boolean;
  duration: number; // секунды
  totalTime: number; // секунды
  sessionLoad: number | null; // sRPE (AU); null = нет RPE
  distance: number;
  rpe: number | null; // 1–10; null = пробел (НЕ 0)
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
  imported: boolean;
}
