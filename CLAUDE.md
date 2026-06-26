# CLAUDE.md — инструкции для Claude Code

## Проект

Team Dashboard — дашборд **мониторинга и планирования нагрузки** футбольной команды на Next.js 16.
Ядро — спорт-аналитика (sRPE сейчас, ACWR/monotony на EWMA дальше), не обобщённый CRUD.
Desktop-first. Auth — стадия 2 (в MVP нет).

Контекст по необходимости: `docs/ARCHITECTURE.md` (стек + структура + data-flow),
`docs/DATA_MODEL.md` (схема БД), `docs/LOAD_MONITORING.md` (домен/расчёты),
`docs/XLSX_FORMAT.md` (импорт), `docs/ROADMAP.md` (фазы), `CODE_STYLE.md` (линт/git/CI).

## Стек (кратко)

Next.js 16 App Router · TS strict + `noUncheckedIndexedAccess` · Drizzle + Neon · Tailwind v4 +
shadcn/ui · TanStack Query/Form + Valibot · date-fns. Полный список — `docs/ARCHITECTURE.md`.

## Домен-правила (критично, не выводимо из кода)

- **Длительности — `integer` секунды**, не текст; форматирование в UI через `lib/time.ts`.
- **Семантика пропусков:** отдых = `0`, забытый RPE = `null` (НЕ 0). Подробно — `docs/LOAD_MONITORING.md`.
- `numeric` из Drizzle приходит строкой — парсить в `number` перед расчётами.
- Чистые расчёты (sRPE, агрегаты, EWMA) — в `lib/sports/` под Vitest.

## Архитектура-правила

- Server Components по умолчанию; Client Components — только под стейт/интерактив.
- Фичи не импортят друг друга напрямую — только через `lib/` или `types/`.
- Мутации — Server Actions, результат `{ ok: true; data } | { ok: false; error }`, без голых `throw`.
- После мутаций — `revalidatePath` / `revalidateTag`. TanStack Query — точечно на интерактиве.
- Valibot-схемы в `src/schemas/` (общие клиент/сервер); Drizzle-схема в `drizzle/schema.ts`.
- Импорт — через DTO-границу `SessionImport` (`types/import.ts`): адаптеры parse → DTO → `persist`, источник-агностик. Парсинг .xlsx по заголовкам, не по индексу. Дедуп `(teamId, date, category)`. Детали — `docs/XLSX_FORMAT.md`.
- Структурные chokepoint'ы (team-scope, write-path RPE, row→domain, кэш-теги, день/TZ) — ходить через них, не дублировать. Таблица — `docs/ARCHITECTURE.md`.
- Структура и data-flow — `docs/ARCHITECTURE.md`.

## Команды

Пакетный менеджер — **только pnpm** (не npm/yarn): `pnpm dev`, `pnpm build`, `pnpm exec drizzle-kit …`.
Скрипты — в `package.json`.

## Поддержание инструкций

Меняешь архитектуру / решение / схему — обнови соответствующий `doc` **и** этот файл, держи в синхроне.
Инструкции совершенствуются по ходу проекта: убирай дубли, тяжёлое держи в on-demand `docs/`, не здесь.
Полные правила кода и workflow — `CODE_STYLE.md`.
