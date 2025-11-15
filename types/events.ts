export type EventSource =
  | "Tepper"
  | "Heinz"
  | "HCII"
  | "SCS"
  | "Dietrich"
  | "University-wide";

export type EventFormat =
  | "Talk"
  | "Workshop"
  | "Hackathon"
  | "Case Competition"
  | "Career/Networking"
  | "Social";

export type InterestTag =
  | "AI / ML"
  | "HCI / Design"
  | "Entrepreneurship"
  | "Healthcare"
  | "Policy & Society"
  | "Data Science"
  | "Product Management"
  | "Robotics"
  | "General";

export interface Event {
  id: string;
  title: string;
  description: string;
  startTime: string; // ISO datetime string
  endTime: string; // ISO datetime string
  location: string;
  source: EventSource;
  format: EventFormat;
  interestTags: InterestTag[];
  rsvpUrl?: string;
  hostOrgName: string;
}

export type DateRangeFilter = "Today" | "This Week" | "This Month" | "All";

