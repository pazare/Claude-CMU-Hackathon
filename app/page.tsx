"use client";

import { useState, useEffect, useMemo } from "react";
import { Event, EventSource, InterestTag, DateRangeFilter } from "@/types/events";
import { mockEvents } from "@/data/events";
import { applyFilters } from "@/lib/filters";
import { getRelativeDateLabel, isPastEvent } from "@/lib/formatters";
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
} from "@/lib/storage";
import EventCard from "@/components/EventCard";
import FiltersPanel from "@/components/FiltersPanel";
import InterestSelector from "@/components/InterestSelector";
import OnboardingCard from "@/components/OnboardingCard";
import EmptyState from "@/components/EmptyState";

// TODO: Replace mockEvents with real API calls
// Architecture: Easy to swap data source - just replace mockEvents import
// with a function that fetches from APIs or parses ICS feeds

export default function Home() {
  // State for preferences
  const [userInterests, setUserInterests] = useState<InterestTag[]>([]);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // State for filters
  const [dateRange, setDateRange] = useState<DateRangeFilter>("All");
  const [selectedSources, setSelectedSources] = useState<EventSource[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [onlyShowInterests, setOnlyShowInterests] = useState(false);

  // Load preferences from localStorage on mount
  useEffect(() => {
    const interests = getInterests();
    const sources = getSources();
    const dateRangePref = getDateRange();
    const onlyInterests = getOnlyInterests();

    setUserInterests(interests);
    setSelectedSources(sources);
    setDateRange(dateRangePref);
    setOnlyShowInterests(onlyInterests);

    // Show onboarding if no preferences saved
    if (!hasSavedPreferences()) {
      setShowOnboarding(true);
    } else if (interests.length > 0) {
      // Auto-enable interest filtering if user has interests saved
      setOnlyShowInterests(true);
    }
  }, []);

  // Handle onboarding save
  const handleOnboardingSave = () => {
    if (userInterests.length > 0) {
      saveInterests(userInterests);
      setOnlyShowInterests(true);
      setShowOnboarding(false);
      // Scroll to events (smooth scroll)
      setTimeout(() => {
        const eventsSection = document.getElementById("events-section");
        if (eventsSection) {
          eventsSection.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
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
    return applyFilters(mockEvents, {
      dateRange,
      sources: selectedSources,
      interests: userInterests,
      onlyShowInterests,
      searchQuery,
    });
  }, [dateRange, selectedSources, userInterests, onlyShowInterests, searchQuery]);

  // Group events by date
  const groupedEvents = useMemo(() => {
    const groups: Record<string, Event[]> = {};
    filteredEvents.forEach((event) => {
      const label = getRelativeDateLabel(event.startTime);
      if (!groups[label]) {
        groups[label] = [];
      }
      groups[label].push(event);
    });
    return groups;
  }, [filteredEvents]);

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
            CMU Event Compass
          </h1>
          <p className="text-sm md:text-base text-gray-600 mt-1">
            See hackathons, talks, and competitions across CMU in one place.
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Data is currently mocked; ready to connect to real feeds later.
          </p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Onboarding */}
        {showOnboarding && (
          <div className="mb-8">
            <OnboardingCard
              selectedInterests={userInterests}
              onToggleInterest={handleToggleInterest}
              onSave={handleOnboardingSave}
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Filters & Preferences */}
          <aside className="lg:col-span-1 space-y-6">
            {/* Interest Selector (if preferences exist) */}
            {!showOnboarding && (
              <InterestSelector
                selectedInterests={userInterests}
                onToggle={handleToggleInterest}
              />
            )}

            {/* Filters Panel */}
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
          <section
            id="events-section"
            className="lg:col-span-2"
          >
            {filteredEvents.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="space-y-8">
                {Object.entries(groupedEvents).map(([dateLabel, events]) => {
                  const hasPastEvents = events.some((e) =>
                    isPastEvent(e.endTime)
                  );
                  const upcomingEvents = events.filter(
                    (e) => !isPastEvent(e.endTime)
                  );
                  const pastEvents = events.filter((e) =>
                    isPastEvent(e.endTime)
                  );

                  return (
                    <div key={dateLabel} className="space-y-4">
                      {/* Date Header */}
                      <h2 className="text-lg md:text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
                        {dateLabel}
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
      </div>
    </main>
  );
}

