# Формат GPS-отчёта (.xlsx)

Файл: **GPS/tracking training session** от GPS-провайдера. Один файл = одна сессия.
Колонки в текущем выгрузе фиксированы, **но парсим по заголовку, а не по индексу** (см. ниже).

Парсер живёт в `lib/import/xlsx-adapter.ts` и отдаёт нейтральный `SessionImport[]`
(`src/types/import.ts`) — не пишет в БД напрямую. Запись — `lib/import/persist.ts`. Граница
parse ↔ persist описана в `docs/ARCHITECTURE.md`.

## Парсинг по заголовкам (не по индексу)

`mapHeaders(headerRow)` строит `{ "distance (m)": idx, "RPE": idx, … }`; значения читаются по
имени колонки, не `row[6]`. Провайдер переставил/добавил колонку — не ломается молча.
**Неизвестный/отсутствующий ожидаемый заголовок → явная ошибка в превью**, не тихий `null`.
Таблица ниже — маппинг **заголовок → поле** (номер колонки справочный, не используется для чтения).

## Сессия (мета)

`start date/time`, `category`, `type`, `notes` **повторяются в каждой строке** игрока — берутся
из первой строки данных.

| Поле | Пример | Маппинг |
|------|--------|---------|
| start date/time | `2026-06-25 09:57:10` | trainings.date |
| category | `MD-2` | trainings.category |
| type | `S` | trainings.type |
| notes | `Full session` | trainings.notes |
| duration (mm:ss) | `59:16` | trainings.duration |

> **`trainings.duration` — из агрегатной строки `Team`.** Колонка `duration (mm:ss)` в данных —
> **на игрока**; длительность сессии берётся из строки-агрегата `athlete = "Team"` (она есть в
> выгрузе, внизу перед легендой), fallback — `max` по игрокам. НЕ «первая строка».
> `kind` при импорте всегда `field` (матч/зал — ручной ввод, фаза 3).

## Строки данных

Один лист (`Sheet`). Строка-заголовок = **31 колонка**: 10 мета (повторяются построчно — `start
date/time`, `category`, `tags`, `notes`, `match cycle`, `last/next match label`, `last/next match`,
`type`) + **21 метрика игрока** (размечены ниже, читаются по заголовку). Строки данных: игроки,
затем агрегаты по позициям и `Team`, пустая строка, блок `Zones legend`.

Каждая строка данных = один игрок. 21 метрика игрока:

| # | Колонка | Тип | Пример | Маппинг |
|---|---------|-----|--------|---------|
| 1 | `athlete` | string | PLAYER 1 | players.name |
| 2 | `starter` | boolean | false | playerTraining.starter |
| 3 | `role` | string | attacking midfielder | players.position |
| 4 | `duration (mm:ss)` | string | 59:16 | playerTraining.duration |
| 5 | `total time (mm:ss)` | string | 59:16 | playerTraining.totalTime |
| 6 | `distance (m)` | numeric | 3697.9 | playerTraining.distance |
| 7 | `RPE` | integer | 4 | playerTraining.rpe |
| 8 | `max speed (km/h)` | numeric | 21.48 | playerTraining.maxSpeed |
| 9 | `max speed% (%)` | numeric | 64 | playerTraining.maxSpeedPct |
| 10 | `max acc (m/s²)` | numeric | 4 | playerTraining.maxAcc |
| 11 | `max dec (m/s²)` | numeric | -4.15 | playerTraining.maxDec |
| 12 | `distance/speed Z2 (m)` | numeric | 15.2 | playerTraining.distanceSpeedZ2 |
| 13 | `distance/speed Z3 (m)` | numeric | 0 | playerTraining.distanceSpeedZ3 |
| 14 | `acc events` | integer | 10 | playerTraining.accEvents |
| 15 | `dec events` | integer | 19 | playerTraining.decEvents |
| 16 | `avg HR (b/min)` | integer | 163 | playerTraining.avgHR |
| 17 | `max HR (b/min)` | integer | 185 | playerTraining.maxHR |
| 18 | `avg HR% (%)` | numeric | 81 | playerTraining.avgHRPct |
| 19 | `max HR% (%)` | numeric | 92 | playerTraining.maxHRPct |
| 20 | `time/HR Z3+ (mm:ss)` | string | 13:00 | playerTraining.timeHRZ3plus |
| 21 | `distance/acc Z2+ (m)` | numeric | 357.2 | playerTraining.distanceAccZ2plus |

## Edge cases

- **null значения**: `distance/speed Z3 (m)` часто 0, `tags` и `match cycle` могут быть null — игнорируем
- **внешние метрики (MVP)**: колонки метрик в `player_trainings` — `notNull` (см. DATA_MODEL). Импорт
  ожидает **полные** внешние метрики. Семантика «отказ датчиков → метрики `null`» (LOAD_MONITORING) —
  **post-MVP**: потребует ослабления `notNull` + миграции. Пустой RPE → `null` уже поддержан (он `notNull`-исключение)
- **Отрицательные значения**: `max dec` всегда отрицательная — сохраняем как есть
- **duration**: формат `mm:ss`, может отсутствовать — fallback на totalTime
- **Имена игроков**: маппим на существующих players по имени, если не найден — создаём
- **Starter**: булево, в данных приходит `false` для всех — в реальности будет `true` для игроков основы

## Мультизагрузка + дедуп

Сезонный первый выгруз = **пачка файлов** (каждый = одна сессия).

- drag-drop мультифайл, очередь; каждый файл парсится client-side в `SessionImport`
- превью = **список сессий** (date, category, #players), не одна
- **дедуп-ключ `(teamId, date, category)`**: в превью совпавшая сессия помечается «уже импортировано»;
  на запись — уникальный constraint в `trainings`, конфликт → skip/обновить (не дубль)
- **player auto-create** — через единый `resolvePlayer(name, teamId)` (`lib/players.ts`): матч по
  нормализованному имени, кэш в рамках батча (один `PLAYER 1` на 30 файлов создаётся раз). Тот же
  chokepoint позже переиспользует PWA-импорт RPE
- **partial fail** — per-session коммит; битый файл не валит батч, отчёт «N ok, M failed + причина»

## Timezone (решено)

`start date/time` — наивная строка без зоны. **Решение:** при парсинге дата приводится к UTC
и хранится в `trainings.date` как UTC; «день команды» (для группировки по MD-/неделе) считается
через хелпер в `lib/time.ts`, не инлайн. Иначе группировка дрейфит на границе суток и будущий
EWMA тихо кривой. См. `docs/DATA_MODEL.md`, `docs/LOAD_MONITORING.md`.

## Открытые вопросы (решить при реализации)

- **duration > 59 мин** — формат всегда `mm:ss` (90 мин = `90:00`)? или бывает `hh:mm:ss`?
  влияет на `clockToSeconds` в `lib/time.ts`
- **zone legend thresholds** — варьируются по провайдеру/конфигу, в БД не хранятся; при сравнении
  сессий сезона со сменёнными порогами — тихий перекос. Пока принять, отметить.

## Агрегаты

.xlsx содержит строки-агрегаты по позиции и команде (athlete = position name или "Team").
При парсинге агрегаты **не сохраняются** — они пересчитываются на лету в UI.

## Легенда зон

Последний лист / блок в файле содержит пороговые значения зон:

| Зона | Значение |
|------|----------|
| acc ev threshold | > 3 м/с² |
| dec ev threshold | < -3 м/с² |
| dist/sp Z2 | 19.8–25.2 км/ч |
| dist/sp Z3 | > 25.2 км/ч |
| t/HR Z3+ | > 87% от макс пульса |
| dist/acc Z2+ | > 1.12 м/с² |

Не сохраняются в БД — используются для виджетов и визуализации.
