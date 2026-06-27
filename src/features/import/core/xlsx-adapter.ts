import { read, utils } from "xlsx";
import { clockToSeconds } from "@/lib/time";
import type { PlayerRow, SessionImport } from "@/types/import";

// Топ-левел: не пересоздавать regex на каждый вызов парсера даты.
const DATE_RE = /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2}):(\d{2})/;

// Адаптер xlsx → нейтральный SessionImport (один файл = одна сессия). Чистая логика, под Vitest.
// Парсинг ПО ЗАГОЛОВКАМ, не по индексу: провайдер переставит/добавит колонку — не ломается молча.
// Неизвестный/отсутствующий ожидаемый заголовок → явная ошибка. См. docs/XLSX_FORMAT.md.

// field → точный заголовок в выгрузе. Поиск регистронезависимый по trim.
const HEADERS = {
  date: "start date/time",
  category: "category",
  type: "type",
  notes: "notes",
  athlete: "athlete",
  starter: "starter",
  role: "role",
  duration: "duration (mm:ss)",
  totalTime: "total time (mm:ss)",
  distance: "distance (m)",
  rpe: "RPE",
  maxSpeed: "max speed (km/h)",
  maxSpeedPct: "max speed% (%)",
  maxAcc: "max acc (m/s²)",
  maxDec: "max dec (m/s²)",
  distanceSpeedZ2: "distance/speed Z2 (m)",
  distanceSpeedZ3: "distance/speed Z3 (m)",
  accEvents: "acc events",
  decEvents: "dec events",
  avgHR: "avg HR (b/min)",
  maxHR: "max HR (b/min)",
  avgHRPct: "avg HR% (%)",
  maxHRPct: "max HR% (%)",
  timeHRZ3plus: "time/HR Z3+ (mm:ss)",
  distanceAccZ2plus: "distance/acc Z2+ (m)",
} as const;

type Field = keyof typeof HEADERS;
type HeaderIndex = Record<Field, number>;
type Row = unknown[];

// { нормализованный заголовок → idx }. Чтение по имени, не row[6].
function mapHeaders(headerRow: Row): Map<string, number> {
  const map = new Map<string, number>();
  headerRow.forEach((cell, idx) => {
    if (typeof cell === "string") {
      map.set(cell.trim().toLowerCase(), idx);
    }
  });
  return map;
}

// Резолв всех ожидаемых заголовков; отсутствующие → явная ошибка (не тихий null).
function resolveHeaderIndex(headerRow: Row): HeaderIndex {
  const headers = mapHeaders(headerRow);
  const index = {} as HeaderIndex;
  const missing: string[] = [];
  for (const field of Object.keys(HEADERS) as Field[]) {
    const idx = headers.get(HEADERS[field].toLowerCase());
    if (idx === undefined) {
      missing.push(HEADERS[field]);
    } else {
      index[field] = idx;
    }
  }
  if (missing.length > 0) {
    throw new Error(`Отсутствуют колонки в .xlsx: ${missing.join(", ")}`);
  }
  return index;
}

function cellStr(row: Row, idx: number): string | null {
  const v = row[idx];
  if (v === null || v === undefined || v === "") {
    return null;
  }
  return String(v).trim();
}

function cellNum(row: Row, idx: number, field: string): number {
  const v = row[idx];
  const n = typeof v === "number" ? v : Number(v);
  if (!Number.isFinite(n)) {
    throw new Error(
      `Ожидалось число в колонке ${field}, получено: ${String(v)}`
    );
  }
  return n;
}

function cellBool(row: Row, idx: number): boolean {
  const v = row[idx];
  if (typeof v === "boolean") {
    return v;
  }
  return String(v).trim().toLowerCase() === "true";
}

// Наивная строка "YYYY-MM-DD HH:MM:SS" → UTC (wall-clock как UTC). День команды — через lib/time.
function parseUtcDate(raw: string): Date {
  const m = raw.trim().match(DATE_RE);
  if (!m) {
    throw new Error(`Неверный формат даты: ${raw}`);
  }
  const [, y, mo, d, h, mi, s] = m;
  return new Date(
    Date.UTC(
      Number(y),
      Number(mo) - 1,
      Number(d),
      Number(h),
      Number(mi),
      Number(s)
    )
  );
}

function toPlayerRow(row: Row, ix: HeaderIndex, name: string): PlayerRow {
  const rpeRaw = row[ix.rpe];
  const rpe =
    rpeRaw === null || rpeRaw === undefined || rpeRaw === ""
      ? null
      : cellNum(row, ix.rpe, "RPE"); // пустой RPE → null (НЕ 0)
  return {
    name,
    starter: cellBool(row, ix.starter),
    position: cellStr(row, ix.role),
    duration: clockToSeconds(cellStr(row, ix.duration) ?? ""),
    totalTime: clockToSeconds(cellStr(row, ix.totalTime) ?? ""),
    distance: cellNum(row, ix.distance, "distance"),
    rpe,
    maxSpeed: cellNum(row, ix.maxSpeed, "max speed"),
    maxSpeedPct: cellNum(row, ix.maxSpeedPct, "max speed%"),
    maxAcc: cellNum(row, ix.maxAcc, "max acc"),
    maxDec: cellNum(row, ix.maxDec, "max dec"),
    distanceSpeedZ2: cellNum(row, ix.distanceSpeedZ2, "distance/speed Z2"),
    distanceSpeedZ3: cellNum(row, ix.distanceSpeedZ3, "distance/speed Z3"),
    accEvents: cellNum(row, ix.accEvents, "acc events"),
    decEvents: cellNum(row, ix.decEvents, "dec events"),
    avgHR: cellNum(row, ix.avgHR, "avg HR"),
    maxHR: cellNum(row, ix.maxHR, "max HR"),
    avgHRPct: cellNum(row, ix.avgHRPct, "avg HR%"),
    maxHRPct: cellNum(row, ix.maxHRPct, "max HR%"),
    timeHRZ3plus: clockToSeconds(cellStr(row, ix.timeHRZ3plus) ?? ""),
    distanceAccZ2plus: cellNum(row, ix.distanceAccZ2plus, "distance/acc Z2+"),
  };
}

// Набор позиций (для отсева агрегатных строк athlete=позиция). Агрегаты также: athlete="Team".
function positionSet(dataRows: Row[], ix: HeaderIndex): Set<string> {
  const set = new Set<string>();
  for (const row of dataRows) {
    const role = cellStr(row, ix.role);
    if (role) {
      set.add(role.toLowerCase());
    }
  }
  return set;
}

// File/ArrayBuffer/Uint8Array → одна сессия. Агрегаты (позиции/Team) и легенда не сохраняются.
export function parseSessionXlsx(
  data: ArrayBuffer | Uint8Array
): SessionImport {
  const wb = read(data, { type: "array" });
  const sheetName = wb.SheetNames[0];
  const sheet = sheetName ? wb.Sheets[sheetName] : undefined;
  if (!sheet) {
    throw new Error("Пустой .xlsx: нет листов");
  }
  const rows = utils.sheet_to_json<Row>(sheet, {
    header: 1,
    raw: true,
    defval: null,
  });
  const headerRow = rows[0];
  if (!headerRow) {
    throw new Error("Пустой .xlsx: нет строки заголовков");
  }
  const ix = resolveHeaderIndex(headerRow);
  const dataRows = rows.slice(1);
  const positions = positionSet(dataRows, ix);

  const players: PlayerRow[] = [];
  let teamDuration: number | null = null;

  for (const row of dataRows) {
    const athlete = cellStr(row, ix.athlete);
    if (!athlete) {
      continue; // пустая строка / блок легенды (athlete = null)
    }
    const key = athlete.toLowerCase();
    if (key === "team") {
      teamDuration = clockToSeconds(cellStr(row, ix.duration) ?? "");
      continue;
    }
    if (positions.has(key)) {
      continue; // агрегат по позиции
    }
    players.push(toPlayerRow(row, ix, athlete));
  }

  if (players.length === 0) {
    throw new Error("В .xlsx не найдено строк игроков");
  }

  const first = dataRows.find((row) => cellStr(row, ix.athlete));
  if (!first) {
    throw new Error("Не удалось прочитать мета-данные сессии");
  }

  const duration = teamDuration ?? Math.max(...players.map((p) => p.duration));

  return {
    date: parseUtcDate(cellStr(first, ix.date) ?? ""),
    category: cellStr(first, ix.category) ?? "",
    type: cellStr(first, ix.type),
    notes: cellStr(first, ix.notes),
    duration,
    players,
  };
}
