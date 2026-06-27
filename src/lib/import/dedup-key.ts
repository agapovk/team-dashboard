// Дедуп-ключ сессии = `${date ISO}|${category}` — зеркалит unique-constraint
// (teamId, date, category) в trainings (точный timestamp, не день команды). По нему
// persist делает onConflictDoUpdate; в превью совпавшая сессия = «уже импортировано».
// Чистый хелпер (без "use server") — общий клиент/сервер.
export function sessionDedupKey(date: Date, category: string): string {
  return `${date.toISOString()}|${category}`;
}
