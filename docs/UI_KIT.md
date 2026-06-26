# UI Kit — дизайн-система Team Dashboard

> Канон и источник истины (утверждённый дизайн, итерация v4). Документ самодостаточен.
> HTML-прототип жил в research-папке `.ideas/ui/` (вне git, не нужен для интеграции). Хроника решений: [`docs/summary/phase-ui.md`](summary/phase-ui.md).
> Шрифты: Inter + Inter Tight + JetBrains Mono. Стиль: base-nova (shadcn/ui v4 + @base-ui/react).

---

## 1. Философия

Дашборд мониторинга и планирования нагрузки футбольной команды. Desktop-first.

- **Спокойный серый** — нейтральная база, цвет только смысловой.
- **Данные на первом плане** — компактные метрики, таблицы, моно/конденсированные числа (`tabular-nums`).
- **2 яруса глубины** — утопленный фон/chrome (`--surface-0`) → парящие карточки (`--surface-2`). Глубина тенью и отступом, а не жёсткими границами. (`--surface-1` — промежуточный резерв, см. §3.1.)
- **Монохром-база + точечный акцент** — primary-асфальт (chroma≈0); яркий акцент `--brand` дозированно (~3–5 пятен на экран).
- **Тёмная тема — тёплый графит** (не чёрный, не холодный). Единственная тёмная тема.

---

## 2. Layout / App Shell

Утопленный chrome + плавающие карточки. Сайдбар и оба этажа хэдера — **без фона** (сливаются с `--surface-0`); карточки **парят** (`--surface-2` + `--shadow-card-float`).

```
.appshell  (grid: [sidebar][main], фон = --surface-0)
  ├─ aside.sidebar              БЕЗ фона, на всю высоту
  │     .logo (верх) · .nav-item × N · .spacer · .nav-item Настройки (низ)
  └─ .shell-main
       ├─ header.topbar-global  floor-1 (глобальный, БЕЗ фона)
       │     .workspace · .pill-nav · уведомления/поиск · #themeToggle · .user-chip
       ├─ header.topbar-page    floor-2 (страница, БЕЗ фона)
       │     .titles (.crumb + h1 + .sub)  ·  .page-actions (фильтр · date-chip · Экспорт · Импорт)
       └─ main.canvas           прозрачный
             .dash-grid → .dash-row-4 / .dash-row-2 / .panel  (всё --surface-2)
```

- **floor-1** — общий для всех страниц: workspace-свитчер, навигация-пилюли, поиск/уведомления, тумблер темы (☀️↔🌙), юзер-чип (аватар+имя+роль).
- **floor-2** — контекст страницы: breadcrumb + `<h1>` + подзаголовок; справа действия страницы.
- Активная пилюля навигации — нейтральная (`--surface-2`); «ты здесь» несёт активный пункт сайдбара (акцент).

---

## 3. Токены (OKLCH; HEX — аппроксимация)

### 3.1 Поверхности

| Token | Light | Dark (Graphite) | Роль |
|-------|-------|-----------------|------|
| `--surface-0` | `oklch(0.945 0.004 265)` | `oklch(0.18 0.006 270)` | Фон + утопленный chrome (ярус 1) |
| `--surface-1` | `oklch(0.985 0.004 265)` | `oklch(0.225 0.006 270)` | Промежуточный резерв (вложенные/всплывающие поверхности) |
| `--surface-2` | `oklch(1 0 0)` | `oklch(0.265 0.006 270)` | Парящие карточки (ярус 2) |

Визуально активны **2 яруса**: `--surface-0` и `--surface-2`. `--surface-1` зарезервирован под вложенные поверхности (например, popover/меню поверх карточки) — на основном экране не используется.
`--bg` = `--surface-0`, `--bg-card` = `--surface-2`.

### 3.2 База

| Token | Light | Dark |
|-------|-------|------|
| `--fg` | `oklch(0.15 0.008 265)` | `oklch(0.92 0.005 270)` |
| `--fg-muted` | `oklch(0.52 0.01 265)` | `oklch(0.66 0.008 270)` |
| `--muted` | `oklch(0.96 0.004 265)` | `oklch(0.30 0.006 270)` |
| `--border` | `oklch(0.90 0.005 265)` | `oklch(0.36 0.006 270)` |
| `--border-strong` | `oklch(0.84 0.005 265)` | `oklch(0.44 0.006 270)` |
| `--primary` (асфальт) | `oklch(0.42 0.006 265)` | `oklch(0.78 0.006 270)` |
| `--primary-fg` | `oklch(0.98 0 0)` | `oklch(0.18 0.005 270)` |
| `--secondary` | `oklch(0.95 0.004 265)` | `oklch(0.34 0.006 270)` |
| `--accent` (нейтр. hover-фон) | `oklch(0.94 0.005 265)` | `oklch(0.36 0.006 270)` |
| `--ring` | `var(--brand)` | `var(--brand)` |

> `--secondary` в dark **светлее карточки** — иначе secondary-кнопки сливаются (см. §8).

### 3.3 Семантика

| Роль | Light | Dark |
|------|-------|------|
| Success | `oklch(0.58 0.10 155)` | `oklch(0.68 0.10 155)` |
| Warning | `oklch(0.68 0.12 85)` | `oklch(0.74 0.10 85)` |
| **Destructive** | `oklch(0.58 0.21 25)` (чистый красный) | `oklch(0.62 0.20 25)` |
| Info | `oklch(0.58 0.08 240)` | `oklch(0.66 0.08 240)` |

`*-bg` (подложки badge/alert) — для destructive через `color-mix(in oklab, var(--destructive) 13%/26%, var(--surface-2))`, чтобы следовать за токеном.

### 3.4 Акцент `--brand` (picker-ready)

| Token | Значение |
|-------|----------|
| `--brand` | `oklch(0.88 0.2 150)` ≈ `#78FC90` (мята; одинаков в light/dark) |
| `--brand-fg` | `oklch(0.24 0.04 155)` (тёмный текст/иконка на мяте) |
| `--brand-bg` | `color-mix(in oklab, var(--brand) 16%/22%, var(--surface-2))` |
| `--brand-strong` | `color-mix(in oklab, var(--brand) 88%, black)` (hover) |

**Всё завязано на `--brand`.** Смена акцента (будущий выбор в настройках) = переопределение одной переменной; focus-ring, графики, индикаторы, активный nav, accent-кнопки — следуют. `*-bg`/`-strong` через `color-mix`, пересчёта не требуют.

---

## 4. Точечный акцент — где и сколько

| Место | Класс/правило |
|-------|---------------|
| Активный раздел | `.nav-item.active` (заливка `--brand`, иконка `--brand-fg`) |
| Пики графиков | `.bar-chart .bar.hi`, `.spark i.hi` |
| Focus | `--ring` → `.input:focus`, `.btn:focus-visible` |
| Статусы | `.dot`/`.dot-ring`, `.has-dot::after`, `.av.more`, `.badge-accent` |
| CTA (опц.) | `.btn-accent` / `.btn-accent-soft` |

**Анти-перебор:** success — приглушённый зелёный (hue 155), brand — яркая мята; не ставить рядом `badge-accent` и `badge-success`. Акцент — на заливках/обводке/индикаторах, **не мелким текстом на светлом** (мята светлая). Один «ты здесь» (активный сайдбар). ~3–5 акцентных пятен на экран.

> CTA по умолчанию — **асфальт** (`.btn-default`); `.btn-accent` доступен для выделения главного действия.

---

## 5. Типографика

| Назначение | Шрифт |
|-----------|-------|
| Текст, заголовки | Inter |
| Данные, таблицы, метрики | Inter Tight |
| Числа, raw-значения | JetBrains Mono (`tabular-nums`) |

Scale: `xs .75` · `sm .875` · `base 1` · `lg 1.125` · `h1 1.5` · stat-value `1.625`. Веса 400/500/600.

---

## 6. Радиусы и тени

`--radius-sm .375` · `--radius .5` (кнопки/инпуты) · `--radius-lg .875` (карточки/панели) · `--radius-xl 1.25` (крупное).
Тени: `--shadow-sm` (плоская карточка) · `--shadow-lg` (hover-elevation) · `--shadow-card-float` (парящая карточка) · `--shadow-float` (резерв/крупный холст).

---

## 7. Компоненты (классы)

- **Button** — `.btn` + `.btn-{default,secondary,outline,ghost,destructive,destructive-soft,accent,accent-soft}`, размеры `.btn-{sm,df,lg}`.
- **Form** — `.input` (input/select/textarea), `.checkbox`, `.switch`, `.form-label(-error)`, `.form-error`.
- **Card** — `.card(.hoverable)`, `.stat-card(.hoverable)`, `.player-card`, `.panel` (+`.panel-head`).
- **Data** — `table`/`td.num`, `.badge-{default,secondary,success,warning,destructive,outline,accent}`, `.rpe-badge .rpe-1…10`, `.progress-*`, `.bar-chart .bar(.hi)`, `.spark i(.hi)`.
- **Feedback** — `.alert-{info,success,warning,error}`, `.toast(.success/.error)`, `.tooltip-demo .tip`, `.skeleton`, `.empty`.
- **Chrome** — `.sidebar/.nav-item`, `.topbar-global/.topbar-page`, `.workspace`, `.user-chip`, `.pill-nav`, `.icon-btn(.ghost)`, `.date-chip`, `.avatar-stack .av(.more)`, `.dot(.dot-ring)`, `.has-dot`.

RPE-badge: 1–2 зелёный · 3–4 жёлтый · 5–6 янтарь · 7–8 микс destructive+оранж · 9–10 `var(--destructive)`.

---

## 8. Тёмная тема — правила (graphite-only)

1. Фон не чёрный (`--surface-0` ≥ 0.18), карточки светлее на ~0.04/ярус.
2. **Контраст кнопок (важно):** `--secondary` светлее карточки; `.btn-secondary`/`.btn-outline` всегда с `--border-strong`; `.btn-ghost:hover` → `--accent`. Проверять на `--surface-2`, не на голом фоне.
3. Primary в dark светлее (асфальт `~0.78`), `--primary-fg` тёмный.
4. Семантика и `--brand` читаются и на белом, и на графите; `--brand-fg` — контрастный текст на мяте.

---

## 9. Доступность

WCAG AA (4.5:1 текст, 3:1 крупный) · focus-visible ring (`--brand`) · 44×44 touch targets · значение всегда дублируется текстом/иконкой (цвет не единственный носитель).

---

## 10. Интеграция (дальше)

При сборке в код: токены §3 → `src/app/globals.css` + Tailwind v4 `@theme inline`; React-компоненты — на shadcn/ui по §7; layout §2 — App Shell в `app/(dashboard)/layout.tsx`. Выбор акцента в настройках = переопределение `--brand` (стадия позже). См. `docs/ARCHITECTURE.md`.
