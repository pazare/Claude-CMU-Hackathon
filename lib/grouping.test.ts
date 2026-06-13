import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { groupEventsByDay } from "@/lib/grouping";
import { getRelativeDateLabel } from "@/lib/formatters";
import type { Event } from "@/types/events";

function local(year: number, month: number, day: number, hour = 12): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${year}-${p(month)}-${p(day)}T${p(hour)}:00:00`;
}

function makeEvent(id: string, startTime: string, endTime: string): Event {
  return {
    id,
    title: id,
    description: "d",
    startTime,
    endTime,
    location: "L",
    source: "SCS",
    format: "Talk",
    interestTags: ["AI / ML"],
    hostOrgName: "H",
  };
}

const NOW = new Date(2026, 5, 15, 12, 0, 0); // Mon Jun 15 2026 noon

describe("groupEventsByDay", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
  });
  afterEach(() => vi.useRealTimers());

  const today = makeEvent(
    "today",
    local(2026, 6, 15, 13),
    local(2026, 6, 15, 15)
  );
  const tomorrow = makeEvent(
    "tomorrow",
    local(2026, 6, 16, 9),
    local(2026, 6, 16, 10)
  );
  const future = makeEvent(
    "future",
    local(2026, 6, 20, 9),
    local(2026, 6, 20, 10)
  );
  const past = makeEvent("past", local(2026, 6, 10, 9), local(2026, 6, 10, 10));
  const inProgress = makeEvent(
    "inprogress",
    local(2026, 6, 13, 18),
    local(2026, 6, 15, 18)
  );

  it("orders upcoming groups earliest-first with past groups last", () => {
    const groups = groupEventsByDay([past, future, tomorrow, today]);
    expect(groups.map((g) => g.label)).toEqual([
      "Today",
      "Tomorrow",
      getRelativeDateLabel(future.startTime),
      getRelativeDateLabel(past.startTime),
    ]);
  });

  it("places a still-running multi-day event in the Today group, not under its start date", () => {
    const groups = groupEventsByDay([past, inProgress, today]);
    const todayGroup = groups.find((g) => g.label === "Today");
    expect(todayGroup).toBeDefined();
    expect(todayGroup!.events.map((e) => e.id).sort()).toEqual([
      "inprogress",
      "today",
    ]);
    // The past group is still last and does not absorb the in-progress event.
    expect(groups[groups.length - 1].events.map((e) => e.id)).toEqual(["past"]);
  });
});
