# План реализации

Домен-first: петля «импорт сессии → нагрузка» собирается рано. Каждая фаза даёт законченный,
деплоябельный результат. Auth в MVP нет (см. стадии после MVP).

**UI:** дизайн-система — `docs/UI_KIT.md` (канон). Фундамент (токены/шрифты/shell/тема) лежит в
отдельной **`Фазе U`** между Phase 0 и Phase 1; `§7`-компоненты строятся **on-demand** по мере
нужды фичи. План интеграции — `docs/UI_KIT.md §10`.

## Фаза 0 — Scaffold + tooling ✅ (готово, см. `docs/summary/phase-0.md`)

**Приложение:**
- [x] `pnpm create next-app` (Next.js 16, App Router, TS strict + `noUncheckedIndexedAccess`, Tailwind v4) — пакетный менеджер pnpm
- [x] shadcn/ui
- [x] Drizzle + Neon (DATABASE_URL), схема всех таблиц — **длительности в секундах**, `date` в UTC, unique `(teamId,date,category)`
- [x] `drizzle-kit push`, типизированный `env.ts` (Valibot) + `.env.example`
- [x] **Chokepoint'ы-фундамент** (см. `docs/ARCHITECTURE.md`): `lib/team.ts` (`getCurrentTeamId`, MVP → seed-команда), `lib/cache-tags.ts` (`team:{id}:…`), `lib/mappers.ts` + `types/domain.ts` (row→domain), `lib/time.ts` (день команды/TZ)
- [x] Layout с сайдбаром (заглушки), desktop-first
- [x] Vitest подключён; seed: одна команда

**Тулинг (детали — `docs/CODE_STYLE.md`):**
- [x] Biome+Ultracite, format-on-save, Lefthook (pre-commit → biome; pre-push → tsc+vitest+блок `main`), `.gitignore` (`.env*`, `node_modules`, `.next`)

**Git / GitHub:**
- [x] `git init`, первый коммит; переименовать `master` → `main`
- [x] Создать **public** GitHub-репозиторий (`gh repo create`), запушить
- [x] CI workflow `.github/workflows/ci.yml`: `biome check` → `tsc --noEmit` → `vitest run` → `next build`
- [x] `.github/pull_request_template.md`
- [x] Ruleset / branch protection: запрет прямого пуша в `main`, требовать прохождение CI

**Результат:** запускается, БД создана, тесты/линт гоняются, репозиторий на GitHub с защищённым `main`.

## Фаза U — UI-фундамент

Интеграция дизайн-системы `docs/UI_KIT.md` в код — слой, на котором строятся все фичевые фазы.
UI-кит — **канон**; shadcn-имена токенов алиасим на токены кита (не наоборот). Детали — `docs/UI_KIT.md`.

- [x] **Токены `§3` → `globals.css` + Tailwind v4 `@theme inline`:**
  - [x] Лестница поверхностей `--surface-0/1/2`; `--bg=--surface-0`, `--bg-card=--surface-2`
  - [x] База `§3.2`: `--fg`, `--fg-muted`, `--muted`, `--border`, **`--border-strong`** (новый), `--primary`/`--primary-fg`, `--secondary`, `--accent`, `--ring=var(--brand)`
  - [x] Семантика `§3.3`: success / warning / **info** (новые — у shadcn только destructive); `*-bg` через `color-mix` от токена
  - [x] Акцент `§3.4`: `--brand` (мята) + `--brand-fg`/`--brand-bg`/`--brand-strong` (`color-mix`) — всё на одной переменной (будущий picker)
  - [x] Бридж к shadcn: `--background→--surface-0`, `--card→--surface-2`, `--foreground→--fg`, `--muted-foreground→--fg-muted`, `--primary-foreground→--primary-fg`, `--ring→--brand`, sidebar-токены прозрачные/`--surface-0` — чтобы 11 вендорных компонентов унаследовали систему без переписи
  - [x] Light + dark (`.dark` = тёплый графит `§8`: фон ≥ 0.18, карточки +0.04/ярус, `--secondary` светлее карточки)
- [x] **Радиусы/тени `§6`** в токены: `--radius-sm/-/-lg/-xl`, `--shadow-sm/-lg/-card-float/-float`
- [x] **Шрифты `§5`** (`next/font/google` + перепривязка `@theme inline`): Inter (текст/заголовки `--font-sans`), Inter Tight (данные/таблицы/метрики, отдельная переменная), JetBrains Mono (числа `--font-mono`, `tabular-nums`) — замена Geist
- [x] **App Shell `§2` (rewrite):** утопленный chrome (сайдбар + оба этажа хедера без фона = `--surface-0`), парящие карточки (`--surface-2` + `--shadow-card-float`)
  - [x] floor-1 (глобальный) — минимум: триггер сайдбара + тумблер темы (☀️↔🌙). Workspace/поиск/уведомления/user-chip отложены до своих фаз
  - [x] floor-2 (страница): breadcrumb + `<h1>` + подзаголовок · справа page-actions — компонент `PageHeader`
  - [x] Навигация — в сайдбаре (без pill-nav); «ты здесь» = активный пункт сайдбара (`--brand`/`--brand-fg`)
  - [x] Тема: `next-themes` (переключатель + персист `.dark` на `<html>`, `system` + анти-FOUC)
- [x] **`/kit` showcase (dev-only):** `app/kit/page.tsx`, гейт `notFound()` вне `development`; свотчи токенов (light+dark) + установленные компоненты/варианты. Растёт по мере добавления `§7`-компонентов; якорь для проверки контраста тёмной темы `§8`

**Результат:** дизайн-система кита живёт в коде, shell соответствует `§2`, `/kit` показывает токены и тему; фичевые фазы строят UI поверх готового фундамента.

## Фаза 1 — Импорт XLSX + парсер (тесты с самого старта)

Граница **parse ↔ persist** через нейтральный DTO `SessionImport` (`src/types/import.ts`) —
один код записи под xlsx сейчас, API/ручной ввод позже. См. `docs/ARCHITECTURE.md`, `docs/XLSX_FORMAT.md`.

- [x] `src/types/import.ts` — `SessionImport` / `PlayerRow` (нейтральный DTO)
- [x] `features/import/core/xlsx-adapter.ts` — `File → SessionImport[]`, чистая логика, **парсинг по заголовкам** (не индексу), юнит-тесты на **реальном `.xlsx`** в `core/__fixtures__/` (seed обеспечивает team-scope; игроки авто-создаются через `resolvePlayer`)
- [x] Страница импорта: drag'n'drop **мультифайл** (сезон = пачка файлов, каждый = сессия), SheetJS (dynamic import, только эта страница), очередь парсинга
- [x] Предпросмотр = **список сессий** (date/category/#players) + редактор RPE (TanStack Form)/удаление строк и сессий; Valibot-валидация (RPE 1–10); флаг «уже импортировано» по дедуп-ключу
- [x] Маппинг колонок → поля; агрегатные строки (`Team`/позиции) не сохраняются; пустой RPE → `null` (НЕ 0)
- [x] `features/import/persist.ts` — Server Action `SessionImport[] → DB`: Training + PlayerTraining через `upsertPlayerTraining`; дедуп `(teamId, date, category)`; игроки через `resolvePlayer`; **per-session коммит + partial-fail**
- [x] **UI по `docs/UI_KIT.md`:** страница импорта/предпросмотр — `card`, drag'n'drop зона, RPE-инпуты (TanStack Form + Valibot), `alert`/`sonner`-toast на результат persist, dedup-`badge`; новые компоненты → в `/kit`

**Результат:** GPS-отчёты (мультифайл) → данные в БД, без дублей, источник-агностик persist.

### Фаза 1.1 — UX-полировка импорта (refactor)

Доработка флоу превью без изменения границы parse↔persist (`persist.ts`/DTO не тронуты).
Превью стало статус-управляемым: у каждой сессии lifecycle `ready → importing → done/failed`.

- [x] Сессия в превью = **свёрнутая строка** (`Collapsible`), таблица RPE раскрывается по клику — вместо всегда-раскрытой карты (компактный список без длинного скролла)
- [x] Кнопки **«Импортировать N» + «Очистить» → в `PageHeader`** (actions, всегда видны); `app/import/page.tsx` рендерит только `ImportWorkspace`, хедер живёт внутри слайса (кнопкам нужен стейт очереди)
- [x] **Lifecycle импорта** в `use-import-parse.ts`: `importState` + сеттеры `markImporting/markDone/markFailed/resetImporting`; после импорта строка флипается в `done` (read-only, приглушена), маппинг провалов по `ImportReport.failed`
- [x] **Защита от повторного импорта:** набор = только `ready`; `done` исключены, счётчик кнопки падает, кнопка `disabled`
- [x] **dup-safety:** «уже в БД» по умолчанию **исключено** из набора; `checkbox` «перезаписать» — осознанный re-import (защита правок RPE от затирания)
- [x] **bulk-RPE:** «задать RPE всем» в раскрытой строке; **RPE-fill badge** `filled/total`; пустой RPE = `null` (НЕ 0) — семантика сохранена
- [x] **Гейт по валидации:** невалидный RPE исключает строку из набора + badge ошибки
- [x] **Summary-bar** над списком (`к импорту / игроков / дублей / ошибок / готово`); **читаемые parse-ошибки** (битый/не-xlsx)
- [x] **UI по `docs/UI_KIT.md`:** новый `checkbox` (§7) добавлен в код; `Collapsible`/`Badge`-варианты/`PageHeader` переиспользованы

**Результат:** компактный статус-управляемый импорт; нельзя случайно задублировать или затереть сессию.

## Фаза 2 — Тренировки + sRPE

- [ ] Таймлайн тренировок по датам, детальная страница
- [ ] Таблица участия с метриками, группировка Squad / Individual
- [ ] Расчёт `sessionLoad` (sRPE), индикатор полноты данных
- [ ] Сортировка/фильтрация колонок
- [ ] **UI по `docs/UI_KIT.md`:** `table`/`td.num` (`tabular-nums`), **`.rpe-badge .rpe-1…10`** (шкала `§7`), `.badge-*`, `.stat-card`, индикатор полноты данных; новые компоненты → в `/kit`

**Результат:** видно нагрузку по сессиям.

## Фаза 3 — Ручной ввод (бэкофилл за столом)

- [ ] Создание сессии вручную: матч (RPE + время), gym (время + RPE опционально) — запись через `upsertPlayerTraining`
- [ ] Правка RPE задним числом — закрывает пробелы (тот же write-path, пересчёт sessionLoad)
- [ ] Корректная семантика: отдых = 0, забытый RPE = null
- [ ] **UI по `docs/UI_KIT.md`:** формы TanStack Form + Valibot в стиле кита (`.input`/`.checkbox`/`.switch`/`.form-label(-error)`); новые компоненты → в `/kit`

**Результат:** недельная нагрузка честная.

## Фаза 4 — Игроки (полный CRUD)

- [ ] Список (TanStack Table), форма (TanStack Form + Valibot), редактирование
- [ ] Фильтр squad / individual
- [ ] Карточка-профиль игрока с его трендами
- [ ] **UI по `docs/UI_KIT.md`:** `.player-card`, TanStack Table в стиле `table`, `.avatar-stack`, фильтр-чипы; новые компоненты → в `/kit`

**Результат:** управление составом.

## Фаза 5 — Недельный микроцикл + дашборд

- [ ] Представление вокруг MD- (нагрузка по дням относительно матча)
- [ ] Командные средние, тренды метрик игрока (recharts + shadcn/chart)
- [ ] Desktop-first плотные таблицы/графики
- [ ] **UI по `docs/UI_KIT.md`:** `.bar-chart`/`.spark` + recharts/shadcn-chart на токенах (`--brand` для пиков), плотные `.dash-grid`/`.panel`; новые компоненты → в `/kit`

**Результат:** рабочий инструмент мониторинга.

## Фаза 6 — Полировка + деплой

- [ ] Обработка ошибок (toast, формы), skeleton/loading
- [ ] Метаданные, деплой на Vercel
- [ ] e2e-смоук (Playwright)
- [ ] **UI по `docs/UI_KIT.md`:** доступность `§9` (WCAG AA, focus-ring `--brand`, 44×44, цвет не единственный носитель), финальный проход тёмной темы `§8`

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
