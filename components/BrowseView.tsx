"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Event,
  EventSource,
  InterestTag,
  DateRangeFilter,
} from "@/types/events";
import { getMockEvents } from "@/data/events";
import { applyFilters } from "@/lib/filters";
import { isPastEvent } from "@/lib/formatters";
import { groupEventsByDay } from "@/lib/grouping";
import {
  getInterests,
  saveInterests,
  getSources,
  saveSources,
  getDateRange,
  saveDateRange,
  getOnlyInterests,
  saveOnlyInterests,
} from "@/lib/storage";
import EventCard from "@/components/EventCard";
import FiltersPanel from "@/components/FiltersPanel";
import InterestSelector from "@/components/InterestSelector";
import EmptyState from "@/components/EmptyState";

// A curated, cross-CMU events feed. Secondary to the mural: it shows official
// event listings, while the mural captures everything else off the boards.
// TODO: Replace getMockEvents() with real feed parsing. The shape is easy to
// swap: return Event[] from a fetch or an ICS parse.

export default function BrowseView() {
  const [hydrated, setHydrated] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [userInterests, setUserInterests] = useState<InterestTag[]>([]);
  const [dateRange, setDateRange] = useState<DateRangeFilter>("All");
  const [selectedSources, setSelectedSources] = useState<EventSource[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [onlyShowInterests, setOnlyShowInterests] = useState(false);

  useEffect(() => {
    setEvents(getMockEvents());
    setUserInterests(getInterests());
    setSelectedSources(getSources());
    setDateRange(getDateRange());
    setOnlyShowInterests(getOnlyInterests());
    setHydrated(true);
  }, []);

  const handleToggleInterest = (interest: InterestTag) => {
    const next = userInterests.includes(interest)
      ? userInterests.filter((i) => i !== interest)
      : [...userInterests, interest];
    setUserInterests(next);
    saveInterests(next);
  };

  const handleDateRangeChange = (range: DateRangeFilter) => {
    setDateRange(range);
    saveDateRange(range);
  };

  const handleSourcesChange = (sources: EventSource[]) => {
    setSelectedSources(sources);
    saveSources(sources);
  };

  const handleOnlyInterestsChange = (only: boolean) => {
    setOnlyShowInterests(only);
    saveOnlyInterests(only);
  };

  const handleResetFilters = () => {
    setDateRange("All");
    setSelectedSources([]);
    setSearchQuery("");
    setOnlyShowInterests(false);
    saveDateRange("All");
    saveSources([]);
    saveOnlyInterests(false);
  };

  const filteredEvents = useMemo(
    () =>
      applyFilters(events, {
        dateRange,
        sources: selectedSources,
        interests: userInterests,
        onlyShowInterests,
        searchQuery,
      }),
    [
      events,
      dateRange,
      selectedSources,
      userInterests,
      onlyShowInterests,
      searchQuery,
    ]
  );

  const groupedEvents = useMemo(
    () => groupEventsByDay(filteredEvents),
    [filteredEvents]
  );

  if (!hydrated) {
    return (
      <p className="text-sm text-gray-500" role="status">
        Loading events...
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">
          Browse CMU events
        </h2>
        <p className="text-xs text-gray-500">
          Sample events for now; the feed is ready to connect to real CMU
          calendars.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <aside className="space-y-6 lg:col-span-1">
          <InterestSelector
            selectedInterests={userInterests}
            onToggle={handleToggleInterest}
          />
          <FiltersPanel
            dateRange={dateRange}
            onDateRangeChange={handleDateRangeChange}
            selectedSources={selectedSources}
            onSourcesChange={handleSourcesChange}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onlyShowInterests={onlyShowInterests}
            onOnlyInterestsChange={handleOnlyInterestsChange}
            onReset={handleResetFilters}
          />
        </aside>

        <section id="events-section" className="lg:col-span-2">
          {filteredEvents.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-8">
              {groupedEvents.map(({ label, events: dayEvents }) => {
                const upcoming = dayEvents.filter(
                  (e) => !isPastEvent(e.endTime)
                );
                const past = dayEvents.filter((e) => isPastEvent(e.endTime));
                return (
                  <div key={label} className="space-y-4">
                    <h3 className="border-b border-gray-200 pb-2 text-lg font-semibold text-gray-900 md:text-xl">
                      {label}
                    </h3>
                    {upcoming.length > 0 && (
                      <div className="space-y-4">
                        {upcoming.map((event) => (
                          <EventCard key={event.id} event={event} />
                        ))}
                      </div>
                    )}
                    {past.length > 0 && (
                      <div className="space-y-4 border-t border-gray-100 pt-4">
                        {past.map((event) => (
                          <EventCard key={event.id} event={event} />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
