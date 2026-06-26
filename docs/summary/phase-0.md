# Фаза 0 — Scaffold + tooling (саммари)

Дата: 2026-06-26. План: `~/.claude/plans/0-pure-steele.md`. Цель — поднять фундамент
(приложение, БД, линт/тесты/CI, репо), чтобы домен-петля Фазы 1+ ложилась на готовые chokepoint'ы.
Статус: **завершена**.

## Сделано

### Scaffold + тулинг
- Next.js 16 App Router, React 19, Turbopack, Tailwind v4, `src/`, alias `@/*`, **без ESLint** (`--no-eslint`).
- `tsconfig.json`: добавлен `noUncheckedIndexedAccess: true`; alias `@/drizzle/*`.
- Biome + Ultracite (`biome.jsonc`, модульные `extends: ultracite/biome/{core,react,next,vitest}`).
- Lefthook (`lefthook.yml`): pre-commit `biome check --write` на staged; pre-push — блок прямого пуша в `main` + `tsc --noEmit` + `vitest run`.
- Vitest (`vitest.config.ts`, плагин `vite-tsconfig-paths` для резолва `@/`), колокация `*.test.ts`.
- `.vscode/settings.json`: `css.lint.unknownAtRules: ignore` (заглушить ложные ворнинги на `@apply`/`@theme`).

### shadcn/ui
- `shadcn init` (Base UI variant, preset `base-nova`), блок `sidebar-07` («collapses to icons»).
- ⚠️ Base UI ≠ Radix: проброс компонента через `render={<Link/>}`, НЕ `asChild`.
- Вендоренные `src/components/ui/**`, `src/hooks/**` — линтер выключен в override.

### БД — Drizzle + Neon
- `drizzle-orm` + `@neondatabase/serverless` (driver `neon-http`), `drizzle-kit`, `drizzle-valibot`.
- `src/lib/env.ts` — valibot-валидация `DATABASE_URL` при импорте (dotenv грузит `.env.local`).
- `drizzle/schema.ts` — все таблицы по `DATA_MODEL.md`: users, teams, players, trainings
  (unique `(teamId,date,category)`), playerTrainings (unique `(playerId,trainingId)`), calendarEvents.
  Длительности — `integer` секунды; rpe/sessionLoad nullable; distance/speed/HR — `numeric`. Индексы teamId/date.
- `drizzle-kit push` прошёл; seed создал 1 команду (id `5f83e28d-…`).

### Chokepoint'ы (каркасы)
- `src/lib/team.ts` — `getCurrentTeamId()` (React `cache()`, первая команда).
- `src/lib/cache-tags.ts` — билдеры `team:{id}:trainings|players|calendar`.
- `src/lib/time.ts` — `clockToSeconds`/`secondsToClock`, `TEAM_TIMEZONE`, `teamDayKey()` (+ 7 тестов).
- `src/types/domain.ts` (`PlayerTrainingMetrics`, только числа) + `src/lib/mappers.ts` (row→domain, `numeric` string→number на границе, throw на NaN).

### Layout
- `src/app/layout.tsx`: SidebarProvider + AppSidebar + header, `lang="ru"`.
- `src/components/app-sidebar.tsx`: навигация Trainings/Players/Import/Calendar, лого `ActivityIcon`, `collapsible="icon"`.
- Роуты-заглушки: `/`, `/trainings`, `/players`, `/import`, `/calendar` (тонкие).

### Git + GitHub + CI
- Репо `agapovk/team-dashboard` (public), ветка `main` дефолтная.
- `.github/workflows/ci.yml` — на PR в `main`: biome → tsc → vitest → build. Job-env dummy `DATABASE_URL` (build не коннектится к БД).
- `.github/pull_request_template.md`.
- Ruleset **«protect main» (active)**: запрет прямого пуша в `main`, PR обязателен.

## Принятые решения (не выводимы из кода)
- **valibot вместо Zod** (легче на клиенте, Standard Schema, `drizzle-valibot`). Доки синхронены Zod→valibot.
- **neon-http driver** оставлен (корректен для serverless/Vercel). Сбои seed локально — VPN + мёртвый IP у хоста (3 A-записи, один таймаутит), НЕ баг кода. На CI/Vercel ок.
- **Без NODE_OPTIONS-костылей**; alias резолвится нативно (tsx) + `vite-tsconfig-paths` (vitest).
- **useSortedInterfaceMembers выключен** — смысловой порядок полей домена/DTO важнее алфавитного.

## Грабли (на будущее)
- Первый пуш в `main` ловит pre-push хук → первый пуш `--no-verify`; branch protection включать ПОСЛЕ.
- Base UI: `render` prop, не `asChild`.
- Font vars: `next/font` отдаёт `--font-geist-sans`/`--font-geist-mono` — в `@theme` маппить именно их (была опечатка `--font-sans: var(--font-sans)`, шрифт не грузился).

## Проверка (зелёное)
`tsc --noEmit` чисто · 7 vitest тестов · `next build` ок · dev все роуты 200.
