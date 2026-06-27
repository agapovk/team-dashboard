import {
  array,
  boolean,
  date,
  type InferOutput,
  integer,
  maxValue,
  minValue,
  nonEmpty,
  nullable,
  number,
  object,
  pipe,
  string,
  trim,
} from "valibot";

// Валидация DTO импорта (src/types/import.ts) — общая клиент/сервер.
// Источник правды для превью-редактора и persist. Доменные правила: RPE 1–10 или null
// (забытый RPE = null, НЕ 0), неотрицательные дистанции/длительности, непустое имя.

const nonNegative = pipe(number(), minValue(0));
const wholeNonNeg = pipe(number(), integer(), minValue(0));

// RPE: целое 1–10 либо null (забытый = null, НЕ 0). Единственный источник правила —
// переиспользуется превью-редактором импорта (валидация поля).
export const RpeSchema = nullable(
  pipe(number(), integer(), minValue(1), maxValue(10))
);

export const PlayerRowSchema = object({
  name: pipe(string(), trim(), nonEmpty("Пустое имя игрока")),
  starter: boolean(),
  position: nullable(string()),
  duration: wholeNonNeg,
  totalTime: wholeNonNeg,
  distance: nonNegative,
  rpe: RpeSchema,
  maxSpeed: nonNegative,
  maxSpeedPct: nonNegative,
  maxAcc: number(),
  maxDec: number(), // max dec всегда отрицательная — без minValue
  distanceSpeedZ2: nonNegative,
  distanceSpeedZ3: nonNegative,
  accEvents: wholeNonNeg,
  decEvents: wholeNonNeg,
  avgHR: wholeNonNeg,
  maxHR: wholeNonNeg,
  avgHRPct: nonNegative,
  maxHRPct: nonNegative,
  timeHRZ3plus: wholeNonNeg,
  distanceAccZ2plus: nonNegative,
});

export const SessionImportSchema = object({
  date: date(),
  category: pipe(string(), trim(), nonEmpty("Пустая категория")),
  type: nullable(string()),
  notes: nullable(string()),
  duration: wholeNonNeg,
  players: array(PlayerRowSchema),
});

export type PlayerRowInput = InferOutput<typeof PlayerRowSchema>;
export type SessionImportInput = InferOutput<typeof SessionImportSchema>;
