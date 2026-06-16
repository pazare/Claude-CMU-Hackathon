import { Event } from "@/types/events";
import { getRelativeDateLabel, isPastEvent } from "@/lib/formatters";
import { startOfDay } from "@/lib/date";

export interface EventGroup {
  label: string;
  events: Event[];
}

/**
 * Group events by day for display.
 *
 * Upcoming day-groups run earliest-first; any fully-past day-groups follow
 * (most recent first). An event that started before today but has not yet ended
 * is treated as happening "Today", so a currently-running multi-day event
 * surfaces at the top instead of under a stale past-dated header, consistent
 * with the single "past = ended" definition used everywhere else.
 *
 * Each group carries a representative day derived from the grouping decision (not
 * from an arbitrary member), so ordering is stable regardless of member order.
 */
export function groupEventsByDay(
  events: Event[],
  now: Date = new Date()
): EventGroup[] {
  const todayMs = startOfDay(now).getTime();
  const groups = new Map<string, { dayMs: number; events: Event[] }>();

  for (const event of events) {
    const startDayMs = startOfDay(new Date(event.startTime)).getTime();
    const inProgressFromEarlier =
      !isPastEvent(event.endTime) && startDayMs < todayMs;
    const label = inProgressFromEarlier
      ? "Today"
      : getRelativeDateLabel(event.startTime);
    const dayMs = inProgressFromEarlier ? todayMs : startDayMs;

    const existing = groups.get(label);
    if (existing) {
      existing.events.push(event);
    } else {
      groups.set(label, { dayMs, events: [event] });
    }
  }

  return Array.from(groups.entries())
    .sort((a, b) => {
      const aPast = a[1].dayMs < todayMs;
      const bPast = b[1].dayMs < todayMs;
      if (aPast !== bPast) return aPast ? 1 : -1; // past day-groups sort last
      return aPast ? b[1].dayMs - a[1].dayMs : a[1].dayMs - b[1].dayMs;
    })
    .map(([label, group]) => ({ label, events: group.events }));
}
