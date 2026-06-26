import {
  boolean,
  date,
  index,
  integer,
  numeric,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";

// Схема БД. Источник истины — docs/DATA_MODEL.md.
// Инварианты: длительности — integer СЕКУНДЫ; trainings.date — UTC; numeric Drizzle
// отдаёт строкой (парсинг в number на границе — lib/mappers.ts).

// users — управляется Better Auth (стадия 2). На MVP не заполняется; нужен для FK teams.userId.
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
});

export const teams = pgTable("teams", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  // На MVP — null (auth нет). Со стадии 2 — владелец команды.
  userId: text("user_id").references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const players = pgTable(
  "players",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    number: integer("number"),
    position: text("position"),
    dateOfBirth: date("date_of_birth"),
    status: text("status").notNull().default("squad"), // "squad" | "individual"
    teamId: uuid("team_id")
      .notNull()
      .references(() => teams.id),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [index("players_team_id_idx").on(t.teamId)]
);

export const trainings = pgTable(
  "trainings",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    date: timestamp("date").notNull(), // UTC; «день команды» — lib/time.ts
    category: text("category").notNull(), // MD-4…MD-1, GAME, MD+1
    type: text("type"),
    notes: text("notes"),
    duration: integer("duration").notNull(), // СЕКУНДЫ
    source: text("source").notNull().default("import"), // "import" | "manual" | (api)
    kind: text("kind").notNull().default("field"), // "field" | "gym" | "match"
    teamId: uuid("team_id")
      .notNull()
      .references(() => teams.id),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [
    index("trainings_team_id_idx").on(t.teamId),
    index("trainings_date_idx").on(t.date),
    // Дедуп импорта.
    unique("trainings_team_date_category_uq").on(t.teamId, t.date, t.category),
  ]
);

export const playerTrainings = pgTable(
  "player_trainings",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    playerId: uuid("player_id")
      .notNull()
      .references(() => players.id),
    trainingId: uuid("training_id")
      .notNull()
      .references(() => trainings.id),
    starter: boolean("starter").notNull().default(false),
    duration: integer("duration").notNull(), // время на поле, СЕКУНДЫ
    totalTime: integer("total_time").notNull(), // общее время сессии, СЕКУНДЫ
    sessionLoad: numeric("session_load"), // sRPE (AU); null, если RPE нет
    distance: numeric("distance").notNull(),
    rpe: integer("rpe"), // 1–10; null = пробел (НЕ 0)
    maxSpeed: numeric("max_speed").notNull(),
    maxSpeedPct: numeric("max_speed_pct").notNull(),
    maxAcc: numeric("max_acc").notNull(),
    maxDec: numeric("max_dec").notNull(),
    distanceSpeedZ2: numeric("distance_speed_z2").notNull(),
    distanceSpeedZ3: numeric("distance_speed_z3").notNull(),
    accEvents: integer("acc_events").notNull(),
    decEvents: integer("dec_events").notNull(),
    avgHR: integer("avg_hr").notNull(),
    maxHR: integer("max_hr").notNull(),
    avgHRPct: numeric("avg_hr_pct").notNull(),
    maxHRPct: numeric("max_hr_pct").notNull(),
    timeHRZ3plus: integer("time_hr_z3plus").notNull(), // СЕКУНДЫ
    distanceAccZ2plus: numeric("distance_acc_z2plus").notNull(),
    imported: boolean("imported").notNull().default(true),
  },
  (t) => [
    index("player_trainings_training_id_idx").on(t.trainingId),
    index("player_trainings_player_id_idx").on(t.playerId),
    unique("player_trainings_player_training_uq").on(t.playerId, t.trainingId),
  ]
);

export const calendarEvents = pgTable(
  "calendar_events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    date: timestamp("date").notNull(),
    type: text("type").notNull(), // "game" | "training" | "other"
    description: text("description"),
    teamId: uuid("team_id")
      .notNull()
      .references(() => teams.id),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [
    index("calendar_events_date_idx").on(t.date),
    index("calendar_events_team_id_idx").on(t.teamId),
  ]
);
