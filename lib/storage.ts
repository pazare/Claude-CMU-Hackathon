import { InterestTag, EventSource, DateRangeFilter } from "@/types/events";

const STORAGE_KEYS = {
  INTERESTS: "cmu-compass-interests",
  SOURCES: "cmu-compass-sources",
  DATE_RANGE: "cmu-compass-date-range",
  ONLY_INTERESTS: "cmu-compass-only-interests",
} as const;

/**
 * localStorage persistence utilities
 * To extend: Add new storage keys and getter/setter functions as needed
 */

export function saveInterests(interests: InterestTag[]): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.INTERESTS, JSON.stringify(interests));
  }
}

export function getInterests(): InterestTag[] {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(STORAGE_KEYS.INTERESTS);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return [];
      }
    }
  }
  return [];
}

export function saveSources(sources: EventSource[]): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.SOURCES, JSON.stringify(sources));
  }
}

export function getSources(): EventSource[] {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(STORAGE_KEYS.SOURCES);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return [];
      }
    }
  }
  return [];
}

export function saveDateRange(dateRange: DateRangeFilter): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.DATE_RANGE, dateRange);
  }
}

export function getDateRange(): DateRangeFilter {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(STORAGE_KEYS.DATE_RANGE);
    if (stored && ["Today", "This Week", "This Month", "All"].includes(stored)) {
      return stored as DateRangeFilter;
    }
  }
  return "All";
}

export function saveOnlyInterests(only: boolean): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.ONLY_INTERESTS, JSON.stringify(only));
  }
}

export function getOnlyInterests(): boolean {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(STORAGE_KEYS.ONLY_INTERESTS);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return false;
      }
    }
  }
  return false;
}

export function hasSavedPreferences(): boolean {
  return getInterests().length > 0;
}

