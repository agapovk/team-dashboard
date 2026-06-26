# Схема данных

## Обзор

```
User (1) ─── Team (1) ─── Player (many)
                         ├── Training (many)
                         │    └── PlayerTraining (join — метрики)
                         └── CalendarEvent (many)
```

## Таблицы

### users
Better Auth управляет таблицей автоматически. Основные поля:

| Колонка | Тип | Описание |
|---------|-----|----------|
| `id` | text, pk | |
| `name` | text | |
| `email` | text, unique | |
| `emailVerified` | boolean | |

*Better Auth добавляет служебные поля (password hash, sessions, etc.)*

### teams

| Колонка | Тип | Описание |
|---------|-----|----------|
| `id` | uuid, pk, defaultRandom | |
| `name` | text | Название команды |
| `createdAt` | timestamp, defaultNow | |
| `userId` | text → users.id | Владелец команды |

На MVP — 1 команда на 1 пользователя. Связь заложена для расширения.

### players

| Колонка | Тип | Описание |
|---------|-----|----------|
| `id` | uuid, pk, defaultRandom | |
| `name` | text | ФИО игрока |
| `number` | integer | Игровой номер |
| `position` | text | Позиция (centre-back, wing forward и т.д.) |
| `dateOfBirth` | date, nullable | |
| `status` | text, default "squad" | "squad" \| "individual" |
| `teamId` | uuid → teams.id | |
| `createdAt` | timestamp, defaultNow | |

`status` делит игроков на **общий состав** и **индивидуальную работу**.

### trainings

| Колонка | Тип | Описание |
|---------|-----|----------|
| `id` | uuid, pk, defaultRandom | |
| `date` | timestamp | Дата и время тренировки. **Хранится в UTC**; «день команды» (группировка по дню/MD-) считается через хелпер в `lib/time.ts`, не инлайн |
| `category` | text | MD-4…MD-1, GAME, MD+1 — microcycle (matchday-относительно) |
| `type` | text | "S" (сессия) и т.д. |
| `notes` | text, nullable | |
| `duration` | integer | **Секунды** (было text "mm:ss"). Форматируется в UI |
| `source` | text, default "import" | "import" \| "manual" (зарезервировано "api" — GPS-интеграция post-MVP) |
| `kind` | text, default "field" | "field" \| "gym" \| "match". В gym RPE опционален |
| `teamId` | uuid → teams.id | |
| `createdAt` | timestamp, defaultNow | |

> **Длительности — в секундах (`integer`), не текстом.** Текст `"mm:ss"` нельзя агрегировать в SQL
> (недельный объём, средние, sRPE требует минут числом). Хелперы `clockToSeconds` / `secondsToClock`
> в `lib/time.ts`.

> **Дедуп импорта:** уникальный constraint `(teamId, date, category)` — повторная загрузка той же
> сессии не создаёт дубль (skip/обновление). См. [Формат GPS-отчёта](./XLSX_FORMAT.md).

### player_trainings

Соединительная таблица — метрики конкретного игрока на конкретной тренировке.

| Колонка | Тип | Описание |
|---------|-----|----------|
| `id` | uuid, pk, defaultRandom | |
| `playerId` | uuid → players.id | |
| `trainingId` | uuid → trainings.id | |
| `starter` | boolean | Участие в старте/основе |
| `duration` | integer | Время на поле (секунды) |
| `totalTime` | integer | Общее время сессии (секунды) |
| `sessionLoad` | numeric, nullable | sRPE = RPE × минуты (AU). `null`, если RPE нет |
| `distance` | numeric | Общая дистанция (м) |
| `rpe` | integer, nullable | RPE (1–10). `null` = пробел (НЕ 0) |
| `maxSpeed` | numeric | Макс. скорость (км/ч) |
| `maxSpeedPct` | numeric | % от макс. скорости игрока |
| `maxAcc` | numeric | Макс. ускорение (м/с²) |
| `maxDec` | numeric | Макс. замедление (м/с²) |
| `distanceSpeedZ2` | numeric | Дистанция в скоростной зоне 2 (м) |
| `distanceSpeedZ3` | numeric | Дистанция в скоростной зоне 3 (м) |
| `accEvents` | integer | Кол-во ускорений |
| `decEvents` | integer | Кол-во замедлений |
| `avgHR` | integer | Средний пульс (уд/мин) |
| `maxHR` | integer | Макс. пульс (уд/мин) |
| `avgHRPct` | numeric | Средний пульс % |
| `maxHRPct` | numeric | Макс. пульс % |
| `timeHRZ3plus` | integer | Время в пульсовой зоне 3+ (секунды) |
| `distanceAccZ2plus` | numeric | Дистанция в акселерационной зоне 2+ (м) |
| `imported` | boolean, default true | Импортирован из .xlsx или добавлен вручную |

Уникальность: `(playerId, trainingId)` — один набор метрик на игрока за тренировку.

> **Примечания:**
> - `sessionLoad` денормализован (быстрые недельные агрегаты) и пересчитывается при сохранении/правке
>   `rpe`. Семантика пропусков (`null` ≠ `0`) — см. [Мониторинг нагрузки](./LOAD_MONITORING.md).
> - Drizzle отдаёт `numeric` как **строку** по умолчанию — расчёты в `lib/sports/` принимают `number`,
>   парсинг через единый хелпер, чтобы не ловить «строку вместо числа».

### calendar_events

| Колонка | Тип | Описание |
|---------|-----|----------|
| `id` | uuid, pk, defaultRandom | |
| `title` | text | Название события |
| `date` | timestamp | |
| `type` | text | "game" \| "training" \| "other" |
| `description` | text, nullable | |
| `teamId` | uuid → teams.id | |
| `createdAt` | timestamp, defaultNow | |

## Индексы

- `players.teamId` — быстрый поиск игроков команды
- `trainings.teamId` — быстрый поиск тренировок
- `trainings.date` — сортировка по дате
- `trainings (teamId, date, category)` — **unique**, дедуп импорта
- `playerTrainings.trainingId` — все метрики тренировки
- `playerTrainings.playerId` — все тренировки игрока
- `calendarEvents.date` — сортировка событий
- `calendarEvents.teamId` — события команды

## Отложенные решения (известные риски)

- **Soft-delete** (`deletedAt` на `trainings`/`playerTrainings`) — отложен (YAGNI до audit/undo).
  Hard-delete сейчас; при появлении audit log / истории вернуться (см. ROADMAP «После MVP»).

## Миграции

Drizzle Kit: `drizzle-kit push` на ранних этапах, `drizzle-kit generate` + `migrate` на продакшене.
