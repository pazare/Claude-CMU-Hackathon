import { EventFormat } from "@/types/events";

/**
 * Format date and time range for event display
 * @param startTime ISO datetime string
 * @param endTime ISO datetime string
 * @returns Formatted string like "Thu, Nov 20 • 5:30–7:00 PM"
 */
export function formatEventTimeRange(
  startTime: string,
  endTime: string
): string {
  const start = new Date(startTime);
  const end = new Date(endTime);

  const dayName = start.toLocaleDateString("en-US", { weekday: "short" });
  const month = start.toLocaleDateString("en-US", { month: "short" });
  const day = start.getDate();

  const startTimeStr = start.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  const endTimeStr = end.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return `${dayName}, ${month} ${day} • ${startTimeStr}–${endTimeStr}`;
}

/**
 * Format date only for grouping headers
 * @param date ISO datetime string
 * @returns Formatted string like "Nov 20, 2025"
 */
export function formatDate(date: string): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Get relative date label (Today, Tomorrow, or formatted date)
 * @param date ISO datetime string
 * @returns "Today", "Tomorrow", or formatted date
 */
export function getRelativeDateLabel(date: string): string {
  const eventDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const eventDateOnly = new Date(eventDate);
  eventDateOnly.setHours(0, 0, 0, 0);

  const diffDays = Math.round(
    (eventDateOnly.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays > 1 && diffDays <= 7) {
    return eventDate.toLocaleDateString("en-US", { weekday: "long" });
  }
  return formatDate(date);
}

/**
 * Check if event is happening soon (within next 24 hours)
 */
export function isHappeningSoon(startTime: string): boolean {
  const eventTime = new Date(startTime);
  const now = new Date();
  const hoursUntil = (eventTime.getTime() - now.getTime()) / (1000 * 60 * 60);
  return hoursUntil > 0 && hoursUntil <= 24;
}

/**
 * Check if event is in the past
 */
export function isPastEvent(endTime: string): boolean {
  return new Date(endTime) < new Date();
}

/**
 * Get color classes for event format badge
 * Design system: Each format has distinct color for easy visual scanning
 * To adjust colors, modify the return values below
 */
export function getFormatBadgeClasses(format: EventFormat): string {
  const baseClasses =
    "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium";
  
  switch (format) {
    case "Hackathon":
      return `${baseClasses} bg-purple-100 text-purple-800`;
    case "Case Competition":
      return `${baseClasses} bg-blue-100 text-blue-800`;
    case "Talk":
      return `${baseClasses} bg-gray-100 text-gray-800`;
    case "Workshop":
      return `${baseClasses} bg-green-100 text-green-800`;
    case "Career/Networking":
      return `${baseClasses} bg-teal-100 text-teal-800`;
    case "Social":
      return `${baseClasses} bg-orange-100 text-orange-800`;
    default:
      return `${baseClasses} bg-gray-100 text-gray-800`;
  }
}

