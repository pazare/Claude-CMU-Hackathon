import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import EventCard from "@/components/EventCard";
import type { Event } from "@/types/events";

function makeEvent(overrides: Partial<Event> = {}): Event {
  return {
    id: "1",
    title: "AI & Machine Learning Research Talk",
    description: "A talk on deep learning.",
    startTime: "2999-01-01T17:00:00",
    endTime: "2999-01-01T19:00:00",
    location: "Gates Hillman Center",
    source: "SCS",
    format: "Talk",
    interestTags: ["AI / ML", "Data Science"],
    rsvpUrl: "https://example.com/rsvp",
    hostOrgName: "SCS AI Lab",
    ...overrides,
  };
}

describe("EventCard", () => {
  it("renders the title and an RSVP link for an upcoming event", () => {
    render(<EventCard event={makeEvent()} />);
    expect(
      screen.getByText("AI & Machine Learning Research Talk")
    ).toBeInTheDocument();
    const rsvp = screen.getByRole("link", { name: /rsvp/i });
    expect(rsvp).toHaveAttribute("href", "https://example.com/rsvp");
  });

  it("marks a past event and hides its RSVP", () => {
    render(
      <EventCard
        event={makeEvent({
          startTime: "2000-01-01T17:00:00",
          endTime: "2000-01-01T19:00:00",
        })}
      />
    );
    expect(screen.getByText("Past event")).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /rsvp/i })).toBeNull();
  });

  it("de-duplicates interest tags", () => {
    render(
      <EventCard event={makeEvent({ interestTags: ["AI / ML", "AI / ML"] })} />
    );
    expect(screen.getAllByText("AI / ML")).toHaveLength(1);
  });
});
