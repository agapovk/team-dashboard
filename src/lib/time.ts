// Chokepoint: формат длительностей и граница «дня команды».
// Длительности в БД — integer секунды; UI-форматирование только здесь.

// Парсинг "mm:ss" или "hh:mm:ss" → секунды.
export function clockToSeconds(clock: string): number {
  const parts = clock.trim().split(":");
  if (parts.length < 2 || parts.length > 3) {
    throw new Error(`Invalid clock format: ${clock}`);
  }
  let seconds = 0;
  for (const part of parts) {
    const n = Number(part);
    if (!Number.isInteger(n) || n < 0) {
      throw new Error(`Invalid clock format: ${clock}`);
    }
    seconds = seconds * 60 + n;
  }
  return seconds;
}

// Секунды → "mm:ss" (или "h:mm:ss" при ≥ часа).
export function secondsToClock(totalSeconds: number): string {
  const s = Math.max(0, Math.round(totalSeconds));
  const hours = Math.floor(s / 3600);
  const minutes = Math.floor((s % 3600) / 60);
  const seconds = s % 60;
  const mm = String(minutes).padStart(2, "0");
  const ss = String(seconds).padStart(2, "0");
  return hours > 0 ? `${hours}:${mm}:${ss}` : `${mm}:${ss}`;
}

// TZ команды. На MVP — константа; со стадии 2 берётся из настроек команды.
export const TEAM_TIMEZONE = "Europe/Moscow";

// Ключ «дня команды» ("yyyy-MM-dd" в TZ команды) — стабильная группировка по дню / MD-.
// trainings.date хранится в UTC; день считаем через этот хелпер, не инлайн.
export function teamDayKey(
  date: Date,
  timeZone: string = TEAM_TIMEZONE
): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}
