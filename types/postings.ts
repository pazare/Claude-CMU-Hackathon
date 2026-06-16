// Domain model for the mural: a poster wall is photographed, and each distinct
// flyer becomes a Posting. Postings are broader than events. They cover research
// recruitment, jobs, tutoring, items for sale, club sign-ups, and announcements.

export const POSTING_CATEGORIES = [
  "Event",
  "Research",
  "Job",
  "Tutoring",
  "For sale",
  "Club",
  "Announcement",
  "Other",
] as const;
export type PostingCategory = (typeof POSTING_CATEGORIES)[number];

export function isPostingCategory(value: unknown): value is PostingCategory {
  return (
    typeof value === "string" &&
    (POSTING_CATEGORIES as readonly string[]).includes(value)
  );
}

/**
 * One flyer read off a board. Most fields are optional because posters vary:
 * a "for sale" note has a price, a research flyer has compensation, a talk has a
 * time and place. Dates are kept as free text because posters print them in every
 * format imaginable; the app does not try to parse them.
 */
export interface Posting {
  id: string;
  title: string;
  category: PostingCategory;
  summary: string;
  date?: string;
  location?: string;
  org?: string;
  contact?: string;
  price?: string;
  compensation?: string;
  /** Free-form topical tags from extraction, matched against user interests. */
  tags: string[];
  /** The scan this posting was read from. */
  muralId: string;
  /**
   * The poster image: a JPEG data URL cropped from the photographed board (the
   * real flyer), or a generated SVG poster for the sample board. Absent when the
   * flyer could not be located in the photo, in which case the text tile shows.
   */
  image?: string;
}

/** A single photographed board: where it is, when it was shot, what came off it. */
export interface MuralScan {
  id: string;
  capturedAt: string; // ISO timestamp
  location: string; // where the board is, entered by the student
  date: string; // the day the photo represents, entered by the student
  postingCount: number;
}

/** A field-by-field type guard for a posting parsed from an untrusted source. */
export function isPosting(value: unknown): value is Posting {
  if (typeof value !== "object" || value === null) return false;
  const p = value as Record<string, unknown>;
  return (
    typeof p.id === "string" &&
    typeof p.title === "string" &&
    isPostingCategory(p.category) &&
    typeof p.summary === "string" &&
    Array.isArray(p.tags) &&
    p.tags.every((t) => typeof t === "string") &&
    typeof p.muralId === "string"
  );
}
