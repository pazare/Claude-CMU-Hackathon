import { describe, it, expect } from "vitest";
import { getMockEvents } from "@/data/events";
import { isEventSource, isInterestTag, EVENT_FORMATS } from "@/types/events";

describe("getMockEvents", () => {
  const now = new Date(2026, 5, 15, 12, 0, 0);
  const events = getMockEvents(now);

  it("resolves a non-empty list with stable ids", () => {
    expect(events.length).toBeGreaterThan(0);
    expect(new Set(events.map((e) => e.id)).size).toBe(events.length);
  });

  it("produces valid ISO start/end times with end after start", () => {
    for (const e of events) {
      expect(Number.isNaN(Date.parse(e.startTime))).toBe(false);
      expect(Number.isNaN(Date.parse(e.endTime))).toBe(false);
      expect(new Date(e.endTime).getTime()).toBeGreaterThan(
        new Date(e.startTime).getTime()
      );
    }
  });

  it("only uses valid domain vocabulary", () => {
    for (const e of events) {
      expect(isEventSource(e.source)).toBe(true);
      expect((EVENT_FORMATS as readonly string[]).includes(e.format)).toBe(
        true
      );
      expect(e.interestTags.every(isInterestTag)).toBe(true);
    }
  });

  it("resolves dates relative to the supplied reference time", () => {
    const later = getMockEvents(new Date(2027, 0, 1, 12, 0, 0));
    expect(later[0].startTime).not.toBe(events[0].startTime);
  });
});
