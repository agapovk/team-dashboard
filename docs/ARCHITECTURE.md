# Архитектура приложения

## Стэк

| Компонент | Выбор |
|-----------|-------|
| Framework | Next.js 16 (App Router) |
| Database | Neon (PostgreSQL serverless) |
| ORM | Drizzle |
| Auth | Better Auth (email + password) — **стадия 2**, не в MVP (см. ROADMAP) |
| UI | Tailwind CSS v4 + shadcn/ui |
| Forms | TanStack Forms + Valibot |
| Data Fetching | TanStack Query |
| XLSX Parsing | SheetJS (клиент, через dynamic import) |
| Charts | recharts + shadcn/chart |
| Tables | shadcn Table / TanStack Table |
| Dates | date-fns |
| Target platform | **Desktop-first, tablet-tolerant** (аналитика/планирование на большом экране) |

## Архитектурный стиль: Modular by Feature

```
drizzle/                 — DB-инфра (конвенция drizzle-kit, корень репо)
  schema.ts              — Drizzle-схема
  migrations/            — сгенерированные миграции
  seed.ts                — MVP-seed (tsx drizzle/seed.ts)
src/
  app/                   — только роуты и лэйауты (каждый файл < 20 строк)
  components/            — общие компоненты (sidebar, header, theme)
    ui/                  — shadcn/ui компоненты (конвенция shadcn)
  hooks/                 — generic-хуки (use-mobile; конвенция shadcn)
  features/              — модули-фичи
    auth/                — Better Auth, формы входа/регистрации
    players/             — CRUD, список, карточки игроков
    trainings/           — таймлайн тренировок, таблица метрик
    import/              — загрузка .xlsx, предпросмотр, парсинг
    calendar/            — события, игры (позже — календарная сетка)
  lib/                   — общие утилиты
    db.ts                — Drizzle клиент
    auth.ts              — Better Auth конфиг (стадия 2, не MVP)
    team.ts              — getCurrentTeamId() — единый team-scoping (MVP: seed-команда)
    player-training.ts   — upsertPlayerTraining() — единый write-path RPE + пересчёт sessionLoad
    players.ts           — resolvePlayer(name, teamId) — единый матчинг игрока по имени
    mappers.ts           — DB-row → domain (numeric-строки → number) на границе
    cache-tags.ts        — билдеры тегов team:{id}:… для revalidateTag
    import/              — импорт сессий (граница parse ↔ persist)
      xlsx-adapter.ts    — File → SessionImport[] (чистый, под Vitest)
      persist.ts         — SessionImport[] → DB (Server Action, источник-агностик)
    time.ts              — clockToSeconds / secondsToClock + граница «дня команды» (TZ)
    sports/              — чистые расчёты: sRPE, агрегаты, позже EWMA/monotony (только number, под тесты)
  schemas/               — Valibot схемы (общие между клиентом и сервером)
  types/                 — глобальные TypeScript типы
    import.ts            — SessionImport / PlayerRow (нейтральный DTO импорта)
    domain.ts            — доменные типы (числа), отдельно от Drizzle-inferred
```

### Правила модульности

1. Каждая фича самодостаточна: содержит компоненты, Server Actions, TanStack Query hooks, Valibot схемы
2. Фичи не импортят друг друга напрямую — только через `lib/` или `types/`
3. Если фича разрастается — выносится в отдельную директорию `packages/` (будущий monorepo)
4. Server Components — по умолчанию. Client Components — только где нужна интерактивность
5. Сквозная инфра — не фичи: `drizzle/` (схема/миграции/seed — конвенция drizzle-kit), `components/` +
   `hooks/` (конвенция shadcn, прибиты к алиасам `components.json`). Их топ-левел не нарушает
   modular-by-feature. `lib/` — единый shared-бакет (чокпойнты ниже); отдельного `shared/` нет
   намеренно: иначе churn доков + конфликт с алиасами shadcn/drizzle. Запрет ровно один — фичи не
   импортят друг друга (см. п. 2)

### Chokepoint'ы (единые точки — закладываются сразу)

Структурные решения «дёшево сейчас, сквозная переделка/миграция позже». Фичи **обязаны**
ходить через них, не дублируя логику:

| Chokepoint | Файл | Инвариант |
|-----------|------|-----------|
| Team-scope | `lib/team.ts` | Все запросы/мутации/теги скоупятся по `getCurrentTeamId()`. teamId не хардкодить в фичах. MVP: seed-команда; стадия 2/3: из сессии |
| Write-path RPE | `lib/player-training.ts` | Любая запись `rpe` — через `upsertPlayerTraining`, который пересчитывает `sessionLoad`. Семантика `null` ≠ `0` в одном месте |
| Identity игрока | `lib/players.ts` | Матчинг по нормализованному имени — только `resolvePlayer(name, teamId)` |
| row → domain | `lib/mappers.ts` + `types/domain.ts` | `numeric` Drizzle (строка) → `number` на границе; `lib/sports/` видит только числа |
| Кэш-теги | `lib/cache-tags.ts` | Теги с `teamId`: `team:{id}:trainings`, `team:{id}:players`, … |
| TZ / день команды | `lib/time.ts` | `date` хранится UTC; граница «дня команды» — через хелпер, не инлайн |

## Data Flow

**Гибрид RSC + TanStack Query (осознанно).** База чтения — Server Components; мутации — Server Actions
+ `revalidatePath/Tag`. TanStack Query подключается **точечно** на интерактивных поверхностях
(редактор предпросмотра импорта, фильтры/сортировка больших таблиц метрик, оптимистичный CRUD,
дашборд с выбором игрока/диапазона). Первый рендер интерактивных экранов приходит из RSC и
гидрируется в Query через `dehydrate` / `HydrationBoundary` + `initialData` — мгновенный SSR,
дальше кэш и инвалидация на клиенте.

```
Чтение (база):
  Server Component  →  Drizzle  →  Neon   (SSR)

Мутации (скоуп по getCurrentTeamId):
  Server Action  →  Drizzle  →  Neon
       ↓
  revalidateTag(`team:{id}:…`)  / revalidatePath
       ↓
  Server Component re-render
     или TanStack Query invalidate (интерактивные экраны)

Импорт (источник-агностик через DTO-границу):
  .xlsx (мультифайл) → SheetJS (client) → xlsx-adapter ┐
  GPS API (post-MVP) → api-adapter                      ├→ SessionImport[] → предпросмотр/редактор
  ручной ввод        → форма                            ┘        → persist (Server Action) → Drizzle → Neon
```

`src/types/import.ts` (`SessionImport`/`PlayerRow`) — нейтральная граница: адаптеры не знают про
Drizzle, `persist` не знает про xlsx. Парсинг **по заголовкам колонок**, не по индексу. Дедуп
сессий — ключ `(teamId, date, category)`. Подробно — `docs/XLSX_FORMAT.md`.

## Key decisions

| Решение | Почему |
|---------|--------|
| Modular by Feature | Чистая архитектура без over-engineering, легко расширять |
| Client-side XLSX | Предпросмотр и редактирование до сохранения — лучший UX |
| DTO-граница импорта (`SessionImport`) | Один код записи под xlsx/API/ручной ввод; адаптеры меняются без трогания persist |
| Парсинг по заголовкам | Перестановка/добавление колонок провайдером не ломает молча; неизвестный заголовок → явная ошибка |
| Team-scope через `getCurrentTeamId` | Auth/мультитенант (стадия 2/3) без ретрофита teamId во все запросы/теги |
| Единый write-path `upsertPlayerTraining` | `sessionLoad` и `null` ≠ `0` не дрейфят по 3+ точкам входа RPE |
| row → domain маппер | `numeric`-строки Drizzle не текут в расчёты; string-vs-number ловится на границе |
| UTC + день команды через `lib/time` | Группировка по дню/MD- и будущий EWMA корректны; нет миграции данных позже |
| Календарь без библиотеки | На MVP хватает таймлайна на shadcn Table |
| Server Actions | Встроены в Next.js, типобезопасны, без лишних зависимостей |
| Drizzle | Быстрее Prisma в serverless, SQL-like синтаксис, малый bundle |
| TanStack Query (точечно) | Кэш/инвалидация/оптимистик на интерактиве; первый рендер из RSC. Не слепой слой для каждой страницы |
| Desktop-first | Продукт — аналитика и планирование на большом экране |
| Длительности в секундах | Агрегируемость в SQL; sRPE требует минут числом |
