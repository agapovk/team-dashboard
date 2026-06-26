# План реализации

Домен-first: петля «импорт сессии → нагрузка» собирается рано. Каждая фаза даёт законченный,
деплоябельный результат. Auth в MVP нет (см. стадии после MVP).

## Фаза 0 — Scaffold + tooling

**Приложение:**
- [ ] `pnpm create next-app` (Next.js 16, App Router, TS strict + `noUncheckedIndexedAccess`, Tailwind v4) — пакетный менеджер pnpm
- [ ] shadcn/ui
- [ ] Drizzle + Neon (DATABASE_URL), схема всех таблиц — **длительности в секундах**, `date` в UTC, unique `(teamId,date,category)`
- [ ] `drizzle-kit push`, типизированный `env.ts` (Valibot) + `.env.example`
- [ ] **Chokepoint'ы-фундамент** (см. `docs/ARCHITECTURE.md`): `lib/team.ts` (`getCurrentTeamId`, MVP → seed-команда), `lib/cache-tags.ts` (`team:{id}:…`), `lib/mappers.ts` + `types/domain.ts` (row→domain), `lib/time.ts` (день команды/TZ)
- [ ] Layout с сайдбаром (заглушки), desktop-first
- [ ] Vitest подключён; seed: одна команда

**Тулинг (детали — `CODE_STYLE.md`):**
- [ ] Biome+Ultracite, format-on-save, Lefthook (pre-commit → biome; pre-push → tsc+vitest+блок `main`), `.gitignore` (`.env*`, `node_modules`, `.next`)

**Git / GitHub:**
- [ ] `git init`, первый коммит; переименовать `master` → `main`
- [ ] Создать **public** GitHub-репозиторий (`gh repo create`), запушить
- [ ] CI workflow `.github/workflows/ci.yml`: `biome check` → `tsc --noEmit` → `vitest run` → `next build`
- [ ] `.github/pull_request_template.md`
- [ ] Ruleset / branch protection: запрет прямого пуша в `main`, требовать прохождение CI

**Результат:** запускается, БД создана, тесты/линт гоняются, репозиторий на GitHub с защищённым `main`.

## Фаза 1 — Импорт XLSX + парсер (тесты с самого старта)

Граница **parse ↔ persist** через нейтральный DTO `SessionImport` (`src/types/import.ts`) —
один код записи под xlsx сейчас, API/ручной ввод позже. См. `docs/ARCHITECTURE.md`, `docs/XLSX_FORMAT.md`.

- [ ] `src/types/import.ts` — `SessionImport` / `PlayerRow` (нейтральный DTO)
- [ ] `lib/import/xlsx-adapter.ts` — `File → SessionImport[]`, чистая логика, **парсинг по заголовкам** (не индексу), юнит-тесты на реальном `.xlsx` (фикстура = seed)
- [ ] Страница импорта: drag'n'drop **мультифайл** (сезон = пачка файлов, каждый = сессия), SheetJS (dynamic import, только эта страница), очередь парсинга
- [ ] Предпросмотр = **список сессий** (date/category/#players) + редактор/удаление строк; Valibot-валидация (RPE 1–10, distance ≥ 0); флаг «уже импортировано» по дедуп-ключу
- [ ] Маппинг колонок → поля; агрегатные строки (`Team`/позиции) не сохраняются; пустой RPE → `null` (НЕ 0)
- [ ] `lib/import/persist.ts` — Server Action `SessionImport[] → DB`: Training + PlayerTraining через `upsertPlayerTraining`; дедуп `(teamId, date, category)`; игроки через `resolvePlayer`; **per-session коммит + partial-fail**

**Результат:** GPS-отчёты (мультифайл) → данные в БД, без дублей, источник-агностик persist.

## Фаза 2 — Тренировки + sRPE

- [ ] Таймлайн тренировок по датам, детальная страница
- [ ] Таблица участия с метриками, группировка Squad / Individual
- [ ] Расчёт `sessionLoad` (sRPE), индикатор полноты данных
- [ ] Сортировка/фильтрация колонок

**Результат:** видно нагрузку по сессиям.

## Фаза 3 — Ручной ввод (бэкофилл за столом)

- [ ] Создание сессии вручную: матч (RPE + время), gym (время + RPE опционально) — запись через `upsertPlayerTraining`
- [ ] Правка RPE задним числом — закрывает пробелы (тот же write-path, пересчёт sessionLoad)
- [ ] Корректная семантика: отдых = 0, забытый RPE = null

**Результат:** недельная нагрузка честная.

## Фаза 4 — Игроки (полный CRUD)

- [ ] Список (TanStack Table), форма (TanStack Form + Valibot), редактирование
- [ ] Фильтр squad / individual
- [ ] Карточка-профиль игрока с его трендами

**Результат:** управление составом.

## Фаза 5 — Недельный микроцикл + дашборд

- [ ] Представление вокруг MD- (нагрузка по дням относительно матча)
- [ ] Командные средние, тренды метрик игрока (recharts + shadcn/chart)
- [ ] Desktop-first плотные таблицы/графики

**Результат:** рабочий инструмент мониторинга.

## Фаза 6 — Полировка + деплой

- [ ] Обработка ошибок (toast, формы), skeleton/loading
- [ ] Метаданные, деплой на Vercel
- [ ] e2e-смоук (Playwright)

**Результат:** продакшен-готово.

---

## После MVP

- [ ] **ACWR (EWMA) + monotony/strain** → флаги риска (модель данных уже готова)
- [ ] Better Auth + ассистенты (стадия 2: несколько юзеров в одной команде)
- [ ] Мульти-тенант: другие тренеры создают свои команды (стадия 3)
- [ ] Интеграция с offline-PWA автора — импорт полевого RPE
- [ ] Экспорт отчётов (PDF/CSV)
- [ ] Сравнение тренировок (сессия vs сессия)
- [ ] i18n (RU + EN), история изменений (audit log), push-напоминания
- [ ] Интеграция с GPS-провайдерами по API (не .xlsx)
