/**
 * Shared date helpers.
 *
 * Day-boundary math lives here so filtering and grouping agree on what "the
 * start of a day" means, in local time, from a single definition.
 */

/** Midnight at the start of the given date, in local time. */
export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}
