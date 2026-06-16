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
  hasSavedPreferences,
  saveOnboarded,
} from "@/lib/storage";
import EventCard from "@/components/EventCard";
import FiltersPanel from "@/components/FiltersPanel";
import InterestSelector from "@/components/InterestSelector";
import OnboardingCard from "@/components/OnboardingCard";
import EmptyState from "@/components/EmptyState";

// TODO: Replace getMockEvents() with real API calls.
// Architecture: easy to swap data source. Replace getMockEvents with a function
// that fetches from APIs or parses ICS feeds and returns Event[].

export default function Home() {
  // Hydration gate: preferences and event dates are resolved on the client in
  // the mount effect below, so we hold the resolved UI until then to avoid a
  // flash of default (pre-localStorage) state.
  const [hydrated, setHydrated] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);

  // State for preferences
  const [userInterests, setUserInterests] = useState<InterestTag[]>([]);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // State for filters
  const [dateRange, setDateRange] = useState<DateRangeFilter>("All");
  const [selectedSources, setSelectedSources] = useState<EventSource[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [onlyShowInterests, setOnlyShowInterests] = useState(false);

  // Resolve events and load persisted preferences on mount (client only).
  useEffect(() => {
    setEvents(getMockEvents());
    setUserInterests(getInterests());
    setSelectedSources(getSources());
    setDateRange(getDateRange());
    setOnlyShowInterests(getOnlyInterests());
    // Show onboarding only to genuinely new visitors (no onboarding flag and no
    // saved preference). The persisted "only show interests" choice is honored
    // as-loaded above and never silently overridden on return visits.
    setShowOnboarding(!hasSavedPreferences());
    setHydrated(true);
  }, []);

  // Handle onboarding save
  const handleOnboardingSave = () => {
    if (userInterests.length === 0) return;
    saveInterests(userInterests);
    saveOnboarded(true);
    setOnlyShowInterests(true);
    saveOnlyInterests(true);
    setShowOnboarding(false);
    // Scroll to events (smooth scroll)
    setTimeout(() => {
      document
        .getElementById("events-section")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  // Dismiss onboarding without picking interests.
  const handleOnboardingSkip = () => {
    saveOnboarded(true);
    setShowOnboarding(false);
  };

  // Toggle interest selection
  const handleToggleInterest = (interest: InterestTag) => {
    const newInterests = userInterests.includes(interest)
      ? userInterests.filter((i) => i !== interest)
      : [...userInterests, interest];
    setUserInterests(newInterests);
    saveInterests(newInterests);
  };

  // Handle filter changes
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

  // Apply filters
  const filteredEvents = useMemo(() => {
    return applyFilters(events, {
      dateRange,
      sources: selectedSources,
      interests: userInterests,
      onlyShowInterests,
      searchQuery,
    });
  }, [
    events,
    dateRange,
    selectedSources,
    userInterests,
    onlyShowInterests,
    searchQuery,
  ]);

  // Group events by day for display (upcoming earliest-first, past last; an
  // in-progress event surfaces under "Today"). See lib/grouping.
  const groupedEvents = useMemo(
    () => groupEventsByDay(filteredEvents),
    [filteredEvents]
  );

  return (
    <main className="min-h-screen">
      <a
        href="#events-section"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-20 focus:rounded-lg focus:bg-cmu-red focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to events
      </a>

      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center gap-3">
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cmu-red text-sm font-bold text-white"
              aria-hidden="true"
            >
              EC
            </span>
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
                CMU Event Compass
              </h1>
              <p className="text-sm md:text-base text-gray-600">
                See hackathons, talks, and competitions across CMU in one place.
              </p>
            </div>
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Data is currently mocked; ready to connect to real feeds later.
          </p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!hydrated ? (
          <p className="text-sm text-gray-500" role="status">
            Loading events…
          </p>
        ) : (
          <>
            {/* Onboarding */}
            {showOnboarding && (
              <div className="mb-8">
                <OnboardingCard
                  selectedInterests={userInterests}
                  onToggleInterest={handleToggleInterest}
                  onSave={handleOnboardingSave}
                  onSkip={handleOnboardingSkip}
                />
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Filters & Preferences */}
              <aside className="lg:col-span-1 space-y-6">
                {!showOnboarding && (
                  <InterestSelector
                    selectedInterests={userInterests}
                    onToggle={handleToggleInterest}
                  />
                )}

                {!showOnboarding && (
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
                )}
              </aside>

              {/* Right Column: Event List */}
              <section id="events-section" className="lg:col-span-2">
                {filteredEvents.length === 0 ? (
                  <EmptyState />
                ) : (
                  <div className="space-y-8">
                    {groupedEvents.map(({ label, events: dayEvents }) => {
                      const upcomingEvents = dayEvents.filter(
                        (e) => !isPastEvent(e.endTime)
                      );
                      const pastEvents = dayEvents.filter((e) =>
                        isPastEvent(e.endTime)
                      );

                      return (
                        <div key={label} className="space-y-4">
                          {/* Date Header */}
                          <h2 className="text-lg md:text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
                            {label}
                          </h2>

                          {/* Upcoming Events */}
                          {upcomingEvents.length > 0 && (
                            <div className="space-y-4">
                              {upcomingEvents.map((event) => (
                                <EventCard key={event.id} event={event} />
                              ))}
                            </div>
                          )}

                          {/* Past Events */}
                          {pastEvents.length > 0 && (
                            <div className="space-y-4 pt-4 border-t border-gray-100">
                              {pastEvents.map((event) => (
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
          </>
        )}
      </div>
    </main>
  );
}
