import {
  Event,
  EventSource,
  InterestTag,
  DateRangeFilter,
} from "@/types/events";
import { isPastEvent } from "@/lib/formatters";
import { startOfDay } from "@/lib/date";

/**
 * Pure filtering pipeline for events.
 *
 * All "is this happening in the window" decisions are based on the event's full
 * [startTime, endTime] interval, and "past" is defined in exactly one place
 * (isPastEvent, keyed off endTime) so an event that has started but not ended is
 * consistently treated as current everywhere, in sorting, grouping, and badges.
 * Architecture: easy to swap with API-level filtering later.
 */

/**
 * Filter events by date range.
 *
 * Windows are anchored to calendar boundaries (not rolling offsets) and matched
 * by interval overlap, so a multi-day event that is currently in progress still
 * appears under "Today"/"This Week"/"This Month".
 */
export function filterByDateRange(
  events: Event[],
  dateRange: DateRangeFilter
): Event[] {
  if (dateRange === "All") return events;

  const now = new Date();
  const windowStart = startOfDay(now);
  let windowEnd: Date;

  switch (dateRange) {
    case "Today":
      windowEnd = new Date(windowStart);
      windowEnd.setDate(windowEnd.getDate() + 1);
      break;
    case "This Week": {
      // Through the end of the current calendar week (Saturday). getDay(): 0=Sun..6=Sat.
      const daysUntilEndOfWeek = 6 - windowStart.getDay();
      windowEnd = new Date(windowStart);
      windowEnd.setDate(windowEnd.getDate() + daysUntilEndOfWeek + 1);
      break;
    }
    case "This Month":
      // First day of next month avoids the setMonth(+1) day-overflow bug.
      windowEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      break;
    default:
      return events;
  }

  return events.filter((event) => {
    const start = new Date(event.startTime);
    const end = new Date(event.endTime);
    // [start, end] overlaps [windowStart, windowEnd)
    return start < windowEnd && end >= windowStart;
  });
}

/**
 * Filter events by source (host unit).
 * If no sources selected, show all (treat as "all selected").
 */
export function filterBySource(
  events: Event[],
  selectedSources: EventSource[]
): Event[] {
  if (selectedSources.length === 0) return events;
  return events.filter((event) => selectedSources.includes(event.source));
}

/**
 * Filter events by interest tags.
 * Returns events where at least one interest tag matches user interests.
 */
export function filterByInterests(
  events: Event[],
  userInterests: InterestTag[],
  onlyShowInterests: boolean
): Event[] {
  if (!onlyShowInterests || userInterests.length === 0) return events;

  return events.filter((event) => {
    return event.interestTags.some((tag) => userInterests.includes(tag));
  });
}

/**
 * Search filter - case-insensitive search on title, description, hostOrgName.
 */
export function filterBySearch(events: Event[], searchQuery: string): Event[] {
  if (!searchQuery.trim()) return events;

  const query = searchQuery.toLowerCase();
  return events.filter(
    (event) =>
      event.title.toLowerCase().includes(query) ||
      event.description.toLowerCase().includes(query) ||
      event.hostOrgName.toLowerCase().includes(query)
  );
}

/**
 * Sort events: current/upcoming first (ascending by startTime), then past events
 * (descending, most recently ended first). "Past" is endTime < now, matching
 * isPastEvent, so an in-progress event keeps its place among the upcoming.
 */
export function sortEvents(events: Event[]): Event[] {
  const upcoming = events.filter((event) => !isPastEvent(event.endTime));
  const past = events.filter((event) => isPastEvent(event.endTime));

  upcoming.sort(
    (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  );
  past.sort(
    (a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
  );

  return [...upcoming, ...past];
}

/**
 * Apply all filters and sorting in sequence.
 * This is the main filtering pipeline entry point.
 */
export function applyFilters(
  events: Event[],
  filters: {
    dateRange: DateRangeFilter;
    sources: EventSource[];
    interests: InterestTag[];
    onlyShowInterests: boolean;
    searchQuery: string;
  }
): Event[] {
  let filtered = [...events];

  filtered = filterByDateRange(filtered, filters.dateRange);
  filtered = filterBySource(filtered, filters.sources);
  filtered = filterByInterests(
    filtered,
    filters.interests,
    filters.onlyShowInterests
  );
  filtered = filterBySearch(filtered, filters.searchQuery);
  filtered = sortEvents(filtered);

  return filtered;
}
