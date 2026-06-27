import { describe, expect, it } from "vitest";
import { clockToSeconds, secondsToClock, teamDayKey } from "@/lib/time";

describe("clockToSeconds", () => {
  it("parses mm:ss", () => {
    expect(clockToSeconds("05:30")).toBe(330);
    expect(clockToSeconds("00:00")).toBe(0);
  });

  it("parses hh:mm:ss", () => {
    expect(clockToSeconds("1:30:00")).toBe(5400);
  });

  it("parses mm:ss with minutes over 59", () => {
    expect(clockToSeconds("93:45")).toBe(5625);
  });

  it("rejects malformed input", () => {
    expect(() => clockToSeconds("90")).toThrow();
    expect(() => clockToSeconds("aa:bb")).toThrow();
  });
});

describe("secondsToClock", () => {
  it("formats under an hour as mm:ss", () => {
    expect(secondsToClock(330)).toBe("05:30");
    expect(secondsToClock(0)).toBe("00:00");
  });

  it("formats hours as h:mm:ss", () => {
    expect(secondsToClock(5400)).toBe("1:30:00");
  });

  it("round-trips with clockToSeconds", () => {
    expect(secondsToClock(clockToSeconds("12:34"))).toBe("12:34");
  });
});

describe("teamDayKey", () => {
  it("returns yyyy-MM-dd in the team timezone", () => {
    // 2026-06-26T21:30Z → в Europe/Moscow (+3) уже 2026-06-27 00:30.
    expect(teamDayKey(new Date("2026-06-26T21:30:00Z"))).toBe("2026-06-27");
  });
});
