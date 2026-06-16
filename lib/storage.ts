import {
  InterestTag,
  EventSource,
  DateRangeFilter,
  isInterestTag,
  isEventSource,
  isDateRangeFilter,
} from "@/types/events";

const STORAGE_KEYS = {
  INTERESTS: "cmu-compass-interests",
  SOURCES: "cmu-compass-sources",
  DATE_RANGE: "cmu-compass-date-range",
  ONLY_INTERESTS: "cmu-compass-only-interests",
  ONBOARDED: "cmu-compass-onboarded",
} as const;

/**
 * localStorage persistence utilities.
 *
 * Reads are defensive: values that are absent, unparseable, the wrong shape, or
 * no longer valid members of the domain vocabulary all fall back to safe
 * defaults rather than flowing untyped into the app. This matters because the
 * getters' declared return types would otherwise be satisfied by the `any` that
 * `JSON.parse` produces, hiding corrupt or legacy data from the type checker.
 */

function readJson(key: string): unknown {
  if (typeof window === "undefined") return undefined;
  const stored = localStorage.getItem(key);
  if (stored === null) return undefined;
  try {
    return JSON.parse(stored);
  } catch {
    return undefined;
  }
}

function writeJson(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function saveInterests(interests: InterestTag[]): void {
  writeJson(STORAGE_KEYS.INTERESTS, interests);
}

export function getInterests(): InterestTag[] {
  const parsed = readJson(STORAGE_KEYS.INTERESTS);
  if (!Array.isArray(parsed)) return [];
  return parsed.filter(isInterestTag);
}

export function saveSources(sources: EventSource[]): void {
  writeJson(STORAGE_KEYS.SOURCES, sources);
}

export function getSources(): EventSource[] {
  const parsed = readJson(STORAGE_KEYS.SOURCES);
  if (!Array.isArray(parsed)) return [];
  return parsed.filter(isEventSource);
}

export function saveDateRange(dateRange: DateRangeFilter): void {
  writeJson(STORAGE_KEYS.DATE_RANGE, dateRange);
}

export function getDateRange(): DateRangeFilter {
  const parsed = readJson(STORAGE_KEYS.DATE_RANGE);
  return isDateRangeFilter(parsed) ? parsed : "All";
}

export function saveOnlyInterests(only: boolean): void {
  writeJson(STORAGE_KEYS.ONLY_INTERESTS, only);
}

export function getOnlyInterests(): boolean {
  const parsed = readJson(STORAGE_KEYS.ONLY_INTERESTS);
  return typeof parsed === "boolean" ? parsed : false;
}

/**
 * Whether the user has completed (or skipped) onboarding. Tracked with an
 * explicit flag rather than inferred from whether interests exist, so a user who
 * dismisses onboarding without picking an interest is not re-prompted forever.
 */
export function saveOnboarded(onboarded: boolean): void {
  writeJson(STORAGE_KEYS.ONBOARDED, onboarded);
}

export function getOnboarded(): boolean {
  const parsed = readJson(STORAGE_KEYS.ONBOARDED);
  return typeof parsed === "boolean" ? parsed : false;
}

/**
 * True if the user has any persisted signal, an explicit onboarding flag or any
 * saved preference. Used as a fallback for users who set filters before the
 * onboarding flag existed.
 */
export function hasSavedPreferences(): boolean {
  return (
    getOnboarded() ||
    getInterests().length > 0 ||
    getSources().length > 0 ||
    getDateRange() !== "All" ||
    getOnlyInterests()
  );
}
