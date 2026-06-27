// Чистый расчёт sRPE (метод Foster). Под Vitest. Видит только number.
// session_load (AU) = RPE (1–10) × duration_minutes. См. docs/LOAD_MONITORING.md.

// Семантика пробела: rpe === null → sessionLoad === null (НЕ 0).
// Длительность хранится в секундах; в минуты переводим тут.
export function sessionLoad(
  rpe: number | null,
  durationSeconds: number
): number | null {
  if (rpe === null) {
    return null;
  }
  return rpe * (durationSeconds / 60);
}
