// Canonical domain vocabulary.
//
// Each list below is the single runtime source of truth, and its union type is
// derived from it (`typeof LIST[number]`). Selectors render these arrays and the
// storage layer validates against them, so adding a value in one place keeps the
// type, the UI, and the persisted-data validators in sync automatically.

export const EVENT_SOURCES = [
  "Tepper",
  "Heinz",
  "HCII",
  "SCS",
  "Dietrich",
  "University-wide",
] as const;
export type EventSource = (typeof EVENT_SOURCES)[number];

export const EVENT_FORMATS = [
  "Talk",
  "Workshop",
  "Hackathon",
  "Case Competition",
  "Career/Networking",
  "Social",
] as const;
export type EventFormat = (typeof EVENT_FORMATS)[number];

export const INTEREST_TAGS = [
  "AI / ML",
  "HCI / Design",
  "Entrepreneurship",
  "Healthcare",
  "Policy & Society",
  "Data Science",
  "Product Management",
  "Robotics",
  "General",
] as const;
export type InterestTag = (typeof INTEREST_TAGS)[number];

export const DATE_RANGE_FILTERS = [
  "Today",
  "This Week",
  "This Month",
  "All",
] as const;
export type DateRangeFilter = (typeof DATE_RANGE_FILTERS)[number];

export interface Event {
  id: string;
  title: string;
  description: string;
  startTime: string; // ISO datetime string
  endTime: string; // ISO datetime string
  location: string;
  source: EventSource;
  format: EventFormat;
  interestTags: InterestTag[];
  rsvpUrl?: string;
  hostOrgName: string;
}

// Runtime type guards, derived from the canonical lists above. Used to validate
// untrusted input (e.g. values parsed back out of localStorage) before it flows
// into typed state.
export function isEventSource(value: unknown): value is EventSource {
  return (
    typeof value === "string" &&
    (EVENT_SOURCES as readonly string[]).includes(value)
  );
}

export function isInterestTag(value: unknown): value is InterestTag {
  return (
    typeof value === "string" &&
    (INTEREST_TAGS as readonly string[]).includes(value)
  );
}

export function isDateRangeFilter(value: unknown): value is DateRangeFilter {
  return (
    typeof value === "string" &&
    (DATE_RANGE_FILTERS as readonly string[]).includes(value)
  );
}
