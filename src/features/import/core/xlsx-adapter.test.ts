import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { parseSessionXlsx } from "./xlsx-adapter";

// Реальный GPS-выгруз (фикстура). Сессия MD-2, 21 игрок + агрегаты (позиции/Team) + легенда.
const fixture = readFileSync(
  fileURLToPath(
    new URL("./__fixtures__/session_md-2_20260625-0957.xlsx", import.meta.url)
  )
);

function parse() {
  // Buffer → ArrayBuffer-срез под XLSX.read({type:"array"}).
  const ab = fixture.buffer.slice(
    fixture.byteOffset,
    fixture.byteOffset + fixture.byteLength
  );
  return parseSessionXlsx(ab as ArrayBuffer);
}

describe("parseSessionXlsx", () => {
  it("читает мету сессии", () => {
    const s = parse();
    expect(s.category).toBe("MD-2");
    expect(s.type).toBe("S");
    expect(s.notes).toBe("Full session");
    // 59:16 = 3556 c (из строки-агрегата Team)
    expect(s.duration).toBe(3556);
    // 2026-06-25 09:57:10 как UTC
    expect(s.date.toISOString()).toBe("2026-06-25T09:57:10.000Z");
  });

  it("сохраняет ровно 21 игрока, отсекает агрегаты и легенду", () => {
    const s = parse();
    expect(s.players).toHaveLength(21);
    const names = s.players.map((p) => p.name.toLowerCase());
    expect(names).not.toContain("team");
    expect(names).not.toContain("centre-back");
    expect(names).not.toContain("wing forward");
  });

  it("маппит метрики первого игрока, длительности в секундах", () => {
    const p = parse().players[0];
    expect(p?.name).toBe("PLAYER 1");
    expect(p?.position).toBe("attacking midfielder");
    expect(p?.rpe).toBe(4);
    expect(p?.distance).toBeCloseTo(3697.9, 1);
    expect(p?.maxDec).toBeCloseTo(-4.15, 2); // отрицательная — как есть
    expect(p?.duration).toBe(3556); // 59:16
  });

  it("RPE присутствует у всех игроков фикстуры (1–10)", () => {
    for (const p of parse().players) {
      expect(p.rpe).not.toBeNull();
      expect(p.rpe).toBeGreaterThanOrEqual(1);
      expect(p.rpe).toBeLessThanOrEqual(10);
    }
  });
});
