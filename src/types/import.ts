// Нейтральный DTO импорта — граница parse ↔ persist (docs/ARCHITECTURE.md, docs/XLSX_FORMAT.md).
// Адаптеры (xlsx/api/ручной ввод) отдают ЭТО; persist пишет в БД из ЭТОГО.
// Адаптер не знает про Drizzle, persist не знает про источник.
// Длительности — уже number СЕКУНДЫ (адаптер прогнал через lib/time.clockToSeconds).

// Метрики одного игрока в сессии. 21 размеченное поле (см. docs/XLSX_FORMAT.md).
// rpe nullable: забытый RPE = null (НЕ 0). Внешние метрики в MVP — полные (notNull в схеме).
export interface PlayerRow {
  name: string;
  starter: boolean;
  position: string | null;
  duration: number; // секунды на поле
  totalTime: number; // секунды, общее время сессии
  distance: number;
  rpe: number | null; // 1–10; null = пробел (НЕ 0)
  maxSpeed: number;
  maxSpeedPct: number;
  maxAcc: number;
  maxDec: number;
  distanceSpeedZ2: number;
  distanceSpeedZ3: number;
  accEvents: number;
  decEvents: number;
  avgHR: number;
  maxHR: number;
  avgHRPct: number;
  maxHRPct: number;
  timeHRZ3plus: number; // секунды
  distanceAccZ2plus: number;
}

// Одна тренировочная сессия = один импортируемый файл.
// date — UTC (адаптер привёл наивную строку к UTC); duration — секунды (из строки-агрегата Team).
// Агрегатные строки (.xlsx: позиции / Team) в players НЕ попадают.
export interface SessionImport {
  date: Date;
  category: string; // MD-4…MD-1, GAME, MD+1
  type: string | null;
  notes: string | null;
  duration: number; // секунды, длительность сессии
  players: PlayerRow[];
}
