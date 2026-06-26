# Фаза U — UI-фундамент (саммари)

Дата: 2026-06-26. Цель — интегрировать дизайн-систему `docs/UI_KIT.md` (канон) в код:
токены, шрифты, app shell, тема, `/kit`-витрина — слой, на котором строятся все фичевые фазы.
Статус: **завершена**.

## Сделано

### Токены §3 → `globals.css` + `@theme inline`
- Поверхности §3.1: лестница `--surface-0/1/2`; `--bg=--surface-0`, `--bg-card=--surface-2`.
- База §3.2: `--fg`, `--fg-muted`, `--muted`, `--border`, **`--border-strong`** (новый), `--primary`/`--primary-fg`, `--secondary`, `--accent` (fg-overlay через `color-mix` — читается на любой поверхности), `--ring=var(--brand)`.
- Семантика §3.3: success / warning / **info** (новые; у shadcn был только destructive); `*-bg` через `color-mix` от токена.
- Акцент §3.4: `--brand` (мята) + `--brand-fg`/`--brand-bg`/`--brand-strong` — всё на одной переменной (задел под picker).
- Бридж вендорных shadcn-токенов → токены кита (background/card/foreground/muted-foreground/primary-foreground/ring + 8 sidebar-токенов) — 11 вендорных компонентов наследуют систему без переписи.
- Light + dark: `.dark` = тёплый графит §8 (фон 0.18, карточки +0.04/ярус, `--secondary` светлее карточки). brand/brand-fg/brand-strong наследуются из `:root`, `--brand-bg` плотнее в dark.
- Радиусы/тени §6: `--radius-sm/-md/-lg/-xl`, `--shadow-sm/-lg/-card-float/-float`.

### Шрифты §5 (замена Geist)
- `next/font/google`: Inter (`--font-inter` → текст/заголовки `--font-sans`/`--font-heading`), Inter Tight (`--font-inter-tight` → данные/таблицы `--font-data`), JetBrains Mono (`--font-jetbrains-mono` → числа `--font-mono`, `tabular-nums`).
- subsets `latin` + `cyrillic` (Inter/Inter Tight) — RU-интерфейс.

### App Shell §2 (rewrite)
- Утопленный chrome: сайдбар + оба этажа хедера без фона (`--surface-0`); парящие карточки — `--surface-2` + `--shadow-card-float`.
- floor-1 (`layout.tsx`) — минимум: `SidebarTrigger` + `ThemeToggle`. Workspace/поиск/уведомления/user-chip отложены до своих фаз.
- floor-2 — компонент `PageHeader` (`title` + `subtitle` + `actions`).
- Навигация — в сайдбаре (без pill-nav); active-пункт = `--brand`/`--brand-fg`. Лого `Ratio`, `collapsible="icon"`, nav-айтемы Dashboard/Trainings/Players/Import/Calendar.

### Тема
- `next-themes` (`^0.4.6`): `ThemeProvider` (attribute=class, defaultTheme=system, enableSystem, disableTransitionOnChange), `suppressHydrationWarning` на `<html>` — анти-FOUC.
- `ThemeToggle`: иконки солнце↔луна переключаются через CSS (`dark:scale-*`) — нет hydration-mismatch, mounted-флаг не нужен.

### `/kit` витрина (dev-only)
- `app/kit/page.tsx`, гейт `notFound()` вне `development`.
- Свотчи всех токенов в двух колонках (light + обёртка `.dark`) — якорь проверки контраста §8.
- Установленные компоненты/варианты: Button (6 вариантов × 3 размера), Input (focus-ring `--brand`), Skeleton, типографика §5. Растёт по мере добавления §7-компонентов.

## Принятые решения (не выводимы из кода)
- **UI-кит — канон**: shadcn-имена токенов алиасим на токены кита, не наоборот. Бридж в `:root`/`.dark` + `@theme inline`.
- **Один `--brand`** для всего акцента (fg/bg/strong через `color-mix`) — будущий смена-цвета picker меняет одну переменную.
- **`--accent` как fg-overlay** (`color-mix fg 8% transparent`), не сплошной цвет — нейтральный hover на любой поверхности, общий для light/dark.
- **Тема через CSS, не JS-mounted**: иконки тоглятся `.dark`-классом → SSR-безопасно.
- floor-1 урезан до триггера+темы; остальное (workspace/search/notif/user) сознательно отложено до фаз, где появляется смысл.

## Грабли (на будущее)
- Inter/Inter Tight тянут общий `--font-sans`-семантический слот только через `@theme` — `--font-data` это отдельная переменная (Inter Tight), не путать с `--font-sans`.
- `/kit` в prod-build пререндерится как route, но `notFound()` отдаёт 404 в рантайме вне dev — это by design, не утечка.
- Base UI (не Radix): проброс через `render={<Link/>}`, не `asChild` (как в Фазе 0).

## Проверка (зелёное)
`tsc --noEmit` чисто · `biome check` чисто · 7 vitest тестов · `next build` ок (9 роутов статикой).
