import { Event } from "@/types/events";
import {
  formatEventTimeRange,
  getFormatBadgeClasses,
  isHappeningSoon,
  isPastEvent,
} from "@/lib/formatters";

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  const isPast = isPastEvent(event.endTime);
  const happeningSoon = isHappeningSoon(event.startTime);

  return (
    <div
      className={`
        rounded-xl shadow-sm p-4 md:p-5 bg-white border border-gray-200
        transition-all duration-200
        hover:shadow-md hover:-translate-y-0.5
        ${isPast ? "opacity-60" : ""}
      `}
    >
      <div className="flex flex-col gap-3">
        {/* Header: Title and Format Badge */}
        <div className="flex items-start justify-between gap-3">
          <h3
            className={`
              text-base md:text-lg font-semibold text-gray-900
              ${!isPast ? "hover:text-cmu-red transition-colors cursor-pointer" : "text-gray-400"}
              flex-1
            `}
          >
            {event.title}
          </h3>
          <span className={getFormatBadgeClasses(event.format)}>
            {event.format}
          </span>
        </div>

        {/* Source and Host */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
            {event.source}
          </span>
          {event.hostOrgName && (
            <>
              <span className="text-xs text-gray-400">•</span>
              <span className="text-xs text-gray-500">{event.hostOrgName}</span>
            </>
          )}
        </div>

        {/* Time and Location */}
        <div className="flex flex-col gap-1 text-sm text-gray-700">
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className={isPast ? "text-gray-400" : ""}>
              {formatEventTimeRange(event.startTime, event.endTime)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className={isPast ? "text-gray-400" : ""}>{event.location}</span>
          </div>
        </div>

        {/* Description */}
        <p className={`text-sm md:text-base ${isPast ? "text-gray-400" : "text-gray-700"}`}>
          {event.description}
        </p>

        {/* Interest Tags */}
        {event.interestTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {event.interestTags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-700"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer: Status and RSVP */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div>
            {happeningSoon && !isPast && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                Starting soon
              </span>
            )}
            {isPast && (
              <span className="text-xs text-gray-400">Past event</span>
            )}
          </div>
          {event.rsvpUrl && !isPast && (
            <a
              href={event.rsvpUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="
                inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium
                bg-cmu-red text-white
                hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-cmu-red focus:ring-offset-2
                transition-colors
              "
              onClick={(e) => e.stopPropagation()}
            >
              RSVP
              <svg
                className="ml-2 w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

