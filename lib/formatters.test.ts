import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  formatDate,
  formatEventTimeRange,
  getRelativeDateLabel,
  isHappeningSoon,
  isPastEvent,
  getFormatBadgeClasses,
} from "@/lib/formatters";

function local(year: number, month: number, day: number, hour = 12): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${year}-${p(month)}-${p(day)}T${p(hour)}:00:00`;
}

describe("isPastEvent", () => {
  it("is true for a clearly past end time", () => {
    expect(isPastEvent("2000-01-01T00:00:00")).toBe(true);
  });
  it("is false for a far-future end time", () => {
    expect(isPastEvent("2999-01-01T00:00:00")).toBe(false);
  });
});

describe("getFormatBadgeClasses", () => {
  it("maps each format to a distinct color family", () => {
    expect(getFormatBadgeClasses("Hackathon")).toContain("purple");
    expect(getFormatBadgeClasses("Workshop")).toContain("green");
    expect(getFormatBadgeClasses("Social")).toContain("orange");
  });
});

describe("formatDate", () => {
  it("includes the year", () => {
    expect(formatDate("2026-06-15T12:00:00")).toContain("2026");
  });
});

describe("formatEventTimeRange", () => {
  it("renders a separator and a time range", () => {
    const out = formatEventTimeRange(
      "2026-06-15T17:30:00",
      "2026-06-15T19:00:00"
    );
    expect(out).toContain("•");
    expect(out).toContain(" to ");
  });

  it("includes the end date for a multi-day event", () => {
    // ~42h event spanning Jun 15 -> Jun 17; the end date must appear so the
    // range does not read as ending before it starts.
    const out = formatEventTimeRange(
      "2026-06-15T18:00:00",
      "2026-06-17T12:00:00"
    );
    expect(out).toContain("Jun 15");
    expect(out).toContain("Jun 17");
    expect(out).not.toContain("•"); // multi-day uses the dated range form
  });
});

describe("getRelativeDateLabel", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 5, 15, 12, 0, 0)); // Mon Jun 15 2026
  });
  afterEach(() => vi.useRealTimers());

  it("labels same-day as Today", () => {
    expect(getRelativeDateLabel(local(2026, 6, 15, 9))).toBe("Today");
  });
  it("labels next day as Tomorrow", () => {
    expect(getRelativeDateLabel(local(2026, 6, 16, 9))).toBe("Tomorrow");
  });
  it("labels a near day with weekday and date (unambiguous)", () => {
    const label = getRelativeDateLabel(local(2026, 6, 18, 9)); // Thursday
    expect(label).toContain("Thursday");
    expect(label).toContain("18");
  });
  it("labels a far date with the year", () => {
    expect(getRelativeDateLabel(local(2026, 8, 1, 9))).toContain("2026");
  });
});

describe("isHappeningSoon", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 5, 15, 12, 0, 0));
  });
  afterEach(() => vi.useRealTimers());

  it("is true within the next 24 hours", () => {
    expect(isHappeningSoon(local(2026, 6, 15, 20))).toBe(true);
  });
  it("is false for events more than a day out", () => {
    expect(isHappeningSoon(local(2026, 6, 18, 12))).toBe(false);
  });
  it("is false for events already started", () => {
    expect(isHappeningSoon(local(2026, 6, 15, 9))).toBe(false);
  });
});
