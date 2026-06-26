# Code Style & Workflow

Правила разработки Team Dashboard. Цель — чистый поддерживаемый код и «взрослый»
портфолио-репозиторий. Канонический источник правил кода/workflow; `CLAUDE.md` ссылается сюда.

## Пакетный менеджер

**Только pnpm** (не npm/yarn). Команды — `pnpm dev/build`, бинарники — `pnpm exec …`.
В репозитории `pnpm-lock.yaml`; `package-lock.json`/`yarn.lock` не коммитим.

## Линт и формат

- **Biome + Ultracite** — единый линтер и форматтер (заменяет ESLint + Prettier).
  Конфиг: `biome.jsonc` с `extends: ["ultracite"]`.
- Форматирование — только Biome; format-on-save включён через `.vscode/settings.json` и `.editorconfig`.
- Перед коммитом код проходит `biome check` автоматически (хук, см. ниже).

## TypeScript

- `strict: true` + `noUncheckedIndexedAccess` в `tsconfig.json`.
- Без `any`. Для «не знаю тип» — `unknown` + сужение.
- `numeric` из Drizzle приходит строкой — парсить в `number` перед расчётами.

## Стиль кода

- **DRY.** Общая логика выносится в `lib/` (`lib/sports`, `lib/time`, `lib/db`) и переиспользуется,
  не дублируется по фичам.
- **Комментарии — короткие, ясные и только в неочевидных местах:** доменные формулы (`lib/sports`),
  edge-cases парсера (`lib/xlsx-parser`), неинтуитивные обходы. Самоочевидный код не комментируем.
- **Именование:** компоненты — `PascalCase`, функции/переменные — `camelCase`, файлы фич — `kebab-case`.
- **Server Actions** возвращают типизированный результат, без голых `throw`:
  ```ts
  type ActionResult<T> = { ok: true; data: T } | { ok: false; error: string };
  ```
  Единая обработка ошибок и тостов на клиенте.
- **Env** — типизированный (`src/lib/env.ts`, Valibot): падать сразу при отсутствии `DATABASE_URL`,
  а не в рантайме.
- **Тесты** — Vitest, колокация (`*.test.ts` рядом с модулем). Чистая логика (`lib/sports`,
  `lib/xlsx-parser`) покрывается с самого начала.

## Архитектура (кратко)

Modular-by-feature, RSC по умолчанию, TanStack Query точечно. Подробности — `docs/ARCHITECTURE.md`.

## Git-хуки (Lefthook)

Конфиг: `lefthook.yml`.

- **pre-commit** — `biome check --write` на staged-файлах (быстро).
- **pre-push** — `tsc --noEmit` + `vitest run`; блокирует прямой пуш в `main`.

## Коммиты

**Conventional Commits** как соглашение (без жёсткого commitlint-хука):

```
feat: импорт GPS-отчёта
fix: знак max dec при парсинге
chore: настройка biome
docs: спецификация мониторинга нагрузки
refactor: вынос sRPE в lib/sports
```

## Ветки и Pull Requests

- Дефолтная ветка — **`main`**. Прямой пуш в `main` запрещён (локальный хук + GitHub ruleset).
- На каждую фичу — отдельная ветка: `feat/…`, `fix/…`, `chore/…`, `docs/…`, `refactor/…`.
- Изменения попадают в `main` только через **Pull Request** (шаблон: `.github/pull_request_template.md`).
- PR мёржится только при зелёном CI.

## CI (GitHub Actions)

`.github/workflows/ci.yml`, на каждый PR в `main`:

```
biome check  →  tsc --noEmit  →  vitest run  →  next build
```

Репозиторий **public**. Секреты — только в `.env*` (в `.gitignore`), никогда в репозитории.