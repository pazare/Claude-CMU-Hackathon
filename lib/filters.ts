import { Event, EventSource, InterestTag, DateRangeFilter } from "@/types/events";

/**
 * Pure filtering pipeline for events
 * Architecture: Easy to swap with API-level filtering later
 */

/**
 * Filter events by date range
 */
export function filterByDateRange(
  events: Event[],
  dateRange: DateRangeFilter
): Event[] {
  if (dateRange === "All") return events;

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);
  const nextMonth = new Date(today);
  nextMonth.setMonth(nextMonth.getMonth() + 1);

  return events.filter((event) => {
    const eventStart = new Date(event.startTime);

    switch (dateRange) {
      case "Today":
        return (
          eventStart >= today &&
          eventStart < tomorrow
        );
      case "This Week":
        return eventStart >= today && eventStart < nextWeek;
      case "This Month":
        return eventStart >= today && eventStart < nextMonth;
      default:
        return true;
    }
  });
}

/**
 * Filter events by source (host unit)
 * If no sources selected, show all (treat as "all selected")
 */
export function filterBySource(
  events: Event[],
  selectedSources: EventSource[]
): Event[] {
  if (selectedSources.length === 0) return events;
  return events.filter((event) => selectedSources.includes(event.source));
}

/**
 * Filter events by interest tags
 * Returns events where at least one interest tag matches user interests
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
 * Search filter - case-insensitive search on title, description, hostOrgName
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
 * Sort events: upcoming first (ascending by startTime), then past events
 */
export function sortEvents(events: Event[]): Event[] {
  const now = new Date();

  const upcoming = events.filter(
    (event) => new Date(event.startTime) >= now
  );
  const past = events.filter((event) => new Date(event.startTime) < now);

  upcoming.sort(
    (a, b) =>
      new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  );
  past.sort(
    (a, b) =>
      new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
  );

  return [...upcoming, ...past];
}

/**
 * Apply all filters and sorting in sequence
 * This is the main filtering pipeline entry point
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

