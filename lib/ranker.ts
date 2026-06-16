import { Posting, PostingCategory } from "@/types/postings";

/**
 * Local ranking for the swipe deck.
 *
 * Personalization runs entirely in the browser: no API call, no cost, and
 * deterministic so the same inputs always produce the same order. A posting
 * scores higher when it matches the student's chosen interests (checked against
 * its title, summary, and tags) and when its category is one the student favors.
 */

export interface RankPrefs {
  /** Interest labels the student selected, e.g. "AI / ML", "Healthcare". */
  interests: string[];
  /** Optional per-category boosts; absent categories get no boost. */
  categoryWeights?: Partial<Record<PostingCategory, number>>;
}

const INTEREST_MATCH_WEIGHT = 10;

/** Split a label into lowercase word tokens of length >= 2 ("AI / ML" -> [ai, ml]). */
function tokenize(label: string): string[] {
  return label
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length >= 2);
}

/**
 * Score one posting against the student's preferences. An interest counts as a
 * match when any of its tokens appears in the posting's searchable text, so
 * "AI / ML" matches a flyer tagged "ai" or "machine learning".
 */
export function scorePosting(posting: Posting, prefs: RankPrefs): number {
  const haystack = [posting.title, posting.summary, ...posting.tags]
    .join(" ")
    .toLowerCase();

  let score = 0;
  for (const interest of prefs.interests) {
    const tokens = tokenize(interest);
    if (tokens.length > 0 && tokens.some((t) => haystack.includes(t))) {
      score += INTEREST_MATCH_WEIGHT;
    }
  }

  score += prefs.categoryWeights?.[posting.category] ?? 0;
  return score;
}

/**
 * Order postings best-first. Ties keep their original order (stable), so an empty
 * preference set leaves the deck in the order the postings were extracted.
 */
export function rankPostings(postings: Posting[], prefs: RankPrefs): Posting[] {
  return postings
    .map((posting, index) => ({
      posting,
      index,
      score: scorePosting(posting, prefs),
    }))
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map((entry) => entry.posting);
}
