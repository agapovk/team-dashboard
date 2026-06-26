// Chokepoint: билдеры кэш-тегов, скоупленных по teamId.
// Все revalidateTag/теги — через эти хелперы, не строками вручную.

export const teamCacheTags = {
  trainings: (teamId: string) => `team:${teamId}:trainings`,
  players: (teamId: string) => `team:${teamId}:players`,
  calendar: (teamId: string) => `team:${teamId}:calendar`,
} as const;
