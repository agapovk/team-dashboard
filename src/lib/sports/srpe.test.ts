import { describe, expect, it } from "vitest";
import { sessionLoad } from "./srpe";

describe("sessionLoad", () => {
  it("computes RPE × minutes", () => {
    // 60 мин × RPE 5 = 300 AU
    expect(sessionLoad(5, 3600)).toBe(300);
  });

  it("handles partial minutes", () => {
    // 59:16 = 3556 c → 59.2667 мин × 4
    expect(sessionLoad(4, 3556)).toBeCloseTo(237.07, 2);
  });

  it("returns null when RPE missing (пробел ≠ 0)", () => {
    expect(sessionLoad(null, 3600)).toBeNull();
  });

  it("returns 0 only when RPE genuinely 0 is impossible — but 0 duration gives 0", () => {
    expect(sessionLoad(5, 0)).toBe(0);
  });
});
