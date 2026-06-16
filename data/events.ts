import { Event } from "@/types/events";

// Mock event data for CMU Event Compass.
// TODO: Replace with real API calls or ICS feed parsing.
//
// Events are stored as offsets relative to "now" and resolved at call time by
// getMockEvents(), so the seeded "Today"/"This Week" events stay correct no
// matter when the page is loaded. Resolving on the client (rather than freezing
// the dates at module-evaluation time on the server) also avoids any
// server/client date drift. The shape is intentionally easy to swap for an API
// integration: replace getMockEvents() with a fetch + transform.

type EventSeed = Omit<Event, "startTime" | "endTime"> & {
  /** Day offset from today for the event start (negative = past). */
  startDay: number;
  /** Hour of day (0 to 23) for the event start. */
  startHour: number;
  /** Day offset for the end, for multi-day events. Defaults to startDay. */
  endDay?: number;
  /** Hour of day for the end, used with endDay. */
  endHour?: number;
  /** Duration in hours for same-day events (used when endDay is omitted). */
  durationHours?: number;
};

const EVENT_SEEDS: EventSeed[] = [
  // Today's events
  {
    id: "1",
    title: "AI & Machine Learning Research Talk",
    description:
      "A talk on recent developments in deep learning and neural networks, with guest speakers from industry.",
    startDay: 0,
    startHour: 14,
    durationHours: 2,
    location: "Gates Hillman Center, Room 4401",
    source: "SCS",
    format: "Talk",
    interestTags: ["AI / ML", "Data Science"],
    rsvpUrl: "https://cmu.edu/events/ai-talk",
    hostOrgName: "SCS AI Lab",
  },
  {
    id: "2",
    title: "HCI Design Workshop",
    description:
      "Hands-on workshop on user-centered design methodologies and prototyping techniques for interactive systems.",
    startDay: 0,
    startHour: 16,
    durationHours: 3,
    location: "Newell-Simon Hall, Room 1305",
    source: "HCII",
    format: "Workshop",
    interestTags: ["HCI / Design", "Product Management"],
    rsvpUrl: "https://cmu.edu/events/hci-workshop",
    hostOrgName: "HCII Design Lab",
  },
  // This week
  {
    id: "3",
    title: "CMU TartanHacks 2026",
    description:
      "Annual 36-hour hackathon where students from across CMU build projects together. Prizes, mentorship, and free food.",
    startDay: 2,
    startHour: 18,
    endDay: 4,
    endHour: 12,
    location: "Gates Hillman Center",
    source: "University-wide",
    format: "Hackathon",
    interestTags: ["AI / ML", "HCI / Design", "Entrepreneurship", "Robotics"],
    rsvpUrl: "https://tartanhacks.com",
    hostOrgName: "ScottyLabs",
  },
  {
    id: "4",
    title: "Healthcare Innovation Case Competition",
    description:
      "Teams compete to solve real-world healthcare challenges. Winners receive cash prizes and opportunities to present to industry leaders.",
    startDay: 3,
    startHour: 10,
    durationHours: 5,
    location: "Tepper Quad, Room 5501",
    source: "Tepper",
    format: "Case Competition",
    interestTags: ["Healthcare", "Entrepreneurship"],
    rsvpUrl: "https://tepper.cmu.edu/case-comp",
    hostOrgName: "Tepper Healthcare Club",
  },
  {
    id: "5",
    title: "Data Science Career Fair",
    description:
      "Meet recruiters from top tech companies looking for data scientists, analysts, and ML engineers. Bring your resume!",
    startDay: 4,
    startHour: 13,
    durationHours: 4,
    location: "University Center, Rangos Ballroom",
    source: "SCS",
    format: "Career/Networking",
    interestTags: ["Data Science", "AI / ML"],
    rsvpUrl: "https://cmu.edu/career-fair",
    hostOrgName: "SCS Career Services",
  },
  // This month
  {
    id: "6",
    title: "Policy & Technology Panel Discussion",
    description:
      "Experts discuss the intersection of technology policy, AI governance, and societal impact.",
    startDay: 7,
    startHour: 17,
    durationHours: 2,
    location: "Heinz College, Room 1102",
    source: "Heinz",
    format: "Talk",
    interestTags: ["Policy & Society", "AI / ML"],
    rsvpUrl: "https://heinz.cmu.edu/policy-panel",
    hostOrgName: "Heinz Policy Lab",
  },
  {
    id: "7",
    title: "Startup Pitch Night",
    description:
      "Watch CMU student entrepreneurs pitch their startup ideas to a panel of investors and mentors.",
    startDay: 10,
    startHour: 19,
    durationHours: 2,
    location: "Tepper Quad, Auditorium",
    source: "Tepper",
    format: "Talk",
    interestTags: ["Entrepreneurship"],
    rsvpUrl: "https://cmu.edu/startup-night",
    hostOrgName: "CMU Entrepreneurship Club",
  },
  {
    id: "8",
    title: "Robotics Lab Open House",
    description:
      "Tour the robotics lab, see robot demos, and talk with researchers about ongoing projects.",
    startDay: 12,
    startHour: 14,
    durationHours: 3,
    location: "Newell-Simon Hall, Robotics Lab",
    source: "SCS",
    format: "Workshop",
    interestTags: ["Robotics", "AI / ML"],
    hostOrgName: "Robotics Institute",
  },
  {
    id: "9",
    title: "Design Thinking Workshop",
    description:
      "Learn human-centered design methods through hands-on exercises and group activities.",
    startDay: 14,
    startHour: 13,
    durationHours: 4,
    location: "HCII, Room 3401",
    source: "HCII",
    format: "Workshop",
    interestTags: ["HCI / Design", "Product Management"],
    rsvpUrl: "https://hcii.cmu.edu/design-workshop",
    hostOrgName: "HCII Design Studio",
  },
  {
    id: "10",
    title: "CMU Spring Social Mixer",
    description:
      "Casual social event to meet students from different programs and network in a relaxed setting.",
    startDay: 15,
    startHour: 18,
    durationHours: 3,
    location: "University Center, Skibo Cafe",
    source: "University-wide",
    format: "Social",
    interestTags: ["General"],
    hostOrgName: "Student Activities Office",
  },
  {
    id: "11",
    title: "Product Management Bootcamp",
    description:
      "Intensive one-day bootcamp covering product strategy, roadmap planning, and stakeholder management.",
    startDay: 17,
    startHour: 9,
    durationHours: 8,
    location: "Tepper Quad, Room 4101",
    source: "Tepper",
    format: "Workshop",
    interestTags: ["Product Management", "Entrepreneurship"],
    rsvpUrl: "https://tepper.cmu.edu/pm-bootcamp",
    hostOrgName: "Tepper Product Club",
  },
  {
    id: "12",
    title: "Healthcare Tech Innovation Hackathon",
    description:
      "48-hour hackathon focused on building solutions for healthcare challenges. Partnered with local hospitals.",
    startDay: 20,
    startHour: 9,
    endDay: 22,
    endHour: 18,
    location: "Heinz College",
    source: "Heinz",
    format: "Hackathon",
    interestTags: ["Healthcare", "AI / ML", "HCI / Design"],
    rsvpUrl: "https://heinz.cmu.edu/healthcare-hack",
    hostOrgName: "Heinz Healthcare Innovation Lab",
  },
  // Past events
  {
    id: "13",
    title: "ML Research Symposium",
    description:
      "Annual symposium showcasing recent machine learning research from CMU faculty and students.",
    startDay: -5,
    startHour: 10,
    durationHours: 6,
    location: "Gates Hillman Center, Auditorium",
    source: "SCS",
    format: "Talk",
    interestTags: ["AI / ML", "Data Science"],
    hostOrgName: "ML Department",
  },
  {
    id: "14",
    title: "Dietrich College Research Showcase",
    description:
      "Celebrate research achievements from across Dietrich College with poster presentations and talks.",
    startDay: -10,
    startHour: 13,
    durationHours: 4,
    location: "Baker Hall",
    source: "Dietrich",
    format: "Social",
    interestTags: ["General"],
    hostOrgName: "Dietrich College",
  },
];

function resolveSeed(seed: EventSeed, now: Date): Event {
  const { startDay, startHour, endDay, endHour, durationHours, ...rest } = seed;

  const start = new Date(now);
  start.setDate(start.getDate() + startDay);
  start.setHours(startHour, 0, 0, 0);

  let end: Date;
  if (endDay !== undefined) {
    end = new Date(now);
    end.setDate(end.getDate() + endDay);
    end.setHours(endHour ?? 12, 0, 0, 0);
  } else {
    end = new Date(start);
    end.setHours(end.getHours() + (durationHours ?? 2));
  }

  return {
    ...rest,
    startTime: start.toISOString(),
    endTime: end.toISOString(),
  };
}

/**
 * Resolve the mock events relative to the supplied reference time (defaulting to
 * the current moment). Call this on the client so seeded dates track the user's
 * real "now".
 */
export function getMockEvents(now: Date = new Date()): Event[] {
  return EVENT_SEEDS.map((seed) => resolveSeed(seed, now));
}
