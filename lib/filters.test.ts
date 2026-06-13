import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  filterByDateRange,
  filterBySource,
  filterByInterests,
  filterBySearch,
  sortEvents,
  applyFilters,
} from "@/lib/filters";
import type { Event } from "@/types/events";

// Local (timezone-naive) datetime string, parsed by `new Date()` as local time.
// Keeping both the pinned clock and the event times in local space makes these
// tests independent of the runner's timezone.
function local(year: number, month: number, day: number, hour = 12): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${year}-${p(month)}-${p(day)}T${p(hour)}:00:00`;
}

function makeEvent(overrides: Partial<Event>): Event {
  return {
    id: "x",
    title: "Event",
    description: "desc",
    startTime: local(2026, 6, 15, 12),
    endTime: local(2026, 6, 15, 14),
    location: "Somewhere",
    source: "SCS",
    format: "Talk",
    interestTags: ["AI / ML"],
    hostOrgName: "Host",
    ...overrides,
  };
}

// Monday, June 15 2026, noon (local).
const NOW = new Date(2026, 5, 15, 12, 0, 0);

const today = makeEvent({
  id: "today",
  startTime: local(2026, 6, 15, 13),
  endTime: local(2026, 6, 15, 15),
});
const inProgress = makeEvent({
  id: "inprogress",
  startTime: local(2026, 6, 13, 10),
  endTime: local(2026, 6, 15, 18),
});
const plus3 = makeEvent({
  id: "plus3",
  startTime: local(2026, 6, 18, 12),
  endTime: local(2026, 6, 18, 14),
});
const plus10 = makeEvent({
  id: "plus10",
  startTime: local(2026, 6, 25, 12),
  endTime: local(2026, 6, 25, 14),
});
const plus40 = makeEvent({
  id: "plus40",
  startTime: local(2026, 7, 25, 12),
  endTime: local(2026, 7, 25, 14),
});
const pastEnded = makeEvent({
  id: "past",
  startTime: local(2026, 6, 13, 10),
  endTime: local(2026, 6, 13, 12),
});

const all = [today, inProgress, plus3, plus10, plus40, pastEnded];
const ids = (events: Event[]) => events.map((e) => e.id).sort();

describe("filterByDateRange", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
  });
  afterEach(() => vi.useRealTimers());

  it("'All' returns everything", () => {
    expect(filterByDateRange(all, "All")).toHaveLength(all.length);
  });

  it("'Today' includes today's and in-progress events, excludes future/past", () => {
    expect(ids(filterByDateRange(all, "Today"))).toEqual(
      ["inprogress", "today"].sort()
    );
  });

  it("'This Week' runs through the end of the calendar week (Sat Jun 20)", () => {
    const got = ids(filterByDateRange(all, "This Week"));
    expect(got).toContain("today");
    expect(got).toContain("plus3"); // Thu Jun 18
    expect(got).not.toContain("plus10"); // Jun 25, next week
  });

  it("'This Month' uses first-of-next-month boundary (no overflow)", () => {
    const got = ids(filterByDateRange(all, "This Month"));
    expect(got).toContain("plus10"); // Jun 25
    expect(got).not.toContain("plus40"); // Jul 25
  });
});

describe("filterBySource", () => {
  it("empty selection returns all", () => {
    expect(filterBySource(all, [])).toHaveLength(all.length);
  });
  it("filters to the selected source", () => {
    const tepper = makeEvent({ id: "t", source: "Tepper" });
    expect(filterBySource([today, tepper], ["Tepper"])).toEqual([tepper]);
  });
});

describe("filterByInterests", () => {
  it("returns all when disabled", () => {
    expect(filterByInterests(all, ["Robotics"], false)).toHaveLength(
      all.length
    );
  });
  it("returns all when user has no interests", () => {
    expect(filterByInterests(all, [], true)).toHaveLength(all.length);
  });
  it("keeps only events sharing a tag when enabled", () => {
    const robotics = makeEvent({ id: "r", interestTags: ["Robotics"] });
    expect(filterByInterests([today, robotics], ["Robotics"], true)).toEqual([
      robotics,
    ]);
  });
});

describe("filterBySearch", () => {
  it("matches title case-insensitively", () => {
    const e = makeEvent({ title: "AI Talk" });
    expect(filterBySearch([e], "ai talk")).toHaveLength(1);
  });
  it("matches host name and description", () => {
    const e = makeEvent({
      hostOrgName: "Robotics Institute",
      description: "z",
    });
    expect(filterBySearch([e], "robotics")).toHaveLength(1);
  });
  it("blank query returns all", () => {
    expect(filterBySearch(all, "   ")).toHaveLength(all.length);
  });
});

describe("sortEvents", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
  });
  afterEach(() => vi.useRealTimers());

  it("orders upcoming ascending then past last", () => {
    const sorted = sortEvents([pastEnded, plus10, today]);
    expect(sorted.map((e) => e.id)).toEqual(["today", "plus10", "past"]);
  });

  it("treats an in-progress event as upcoming, not past", () => {
    const sorted = sortEvents([pastEnded, inProgress]);
    expect(sorted[0].id).toBe("inprogress");
    expect(sorted[1].id).toBe("past");
  });
});

describe("applyFilters", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
  });
  afterEach(() => vi.useRealTimers());

  it("composes filters and sorting", () => {
    const result = applyFilters(all, {
      dateRange: "This Month",
      sources: [],
      interests: [],
      onlyShowInterests: false,
      searchQuery: "",
    });
    // Upcoming events sort ascending by start time; the in-progress event
    // started earliest (Jun 13), so it leads.
    expect(result.map((e) => e.id)).toEqual([
      "inprogress",
      "today",
      "plus3",
      "plus10",
    ]);
  });
});
