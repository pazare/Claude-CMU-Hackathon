import { describe, it, expect } from "vitest";
import { rankPostings, scorePosting, RankPrefs } from "@/lib/ranker";
import { Posting } from "@/types/postings";

function posting(over: Partial<Posting>): Posting {
  return {
    id: over.id ?? "x",
    title: over.title ?? "Untitled",
    category: over.category ?? "Other",
    summary: over.summary ?? "",
    tags: over.tags ?? [],
    muralId: "m1",
    ...over,
  };
}

describe("scorePosting", () => {
  it("scores an interest match found in the tags", () => {
    const p = posting({ tags: ["machine learning", "research"] });
    expect(scorePosting(p, { interests: ["AI / ML"] })).toBe(0); // "ai"/"ml" not present as tokens
    const p2 = posting({ tags: ["AI", "robotics"] });
    expect(scorePosting(p2, { interests: ["AI / ML"] })).toBe(10);
  });

  it("matches an interest token against the title or summary", () => {
    const p = posting({
      title: "Robotics Lab open house",
      summary: "Tour the lab",
    });
    expect(scorePosting(p, { interests: ["Robotics"] })).toBe(10);
  });

  it("adds category weight on top of interest matches", () => {
    const p = posting({ category: "Research", tags: ["healthcare"] });
    const prefs: RankPrefs = {
      interests: ["Healthcare"],
      categoryWeights: { Research: 5 },
    };
    expect(scorePosting(p, prefs)).toBe(15);
  });

  it("is zero with no interests and no category weight", () => {
    expect(scorePosting(posting({}), { interests: [] })).toBe(0);
  });
});

describe("rankPostings", () => {
  it("orders matching postings before non-matching ones", () => {
    const match = posting({ id: "a", tags: ["data science"] });
    const miss = posting({ id: "b", tags: ["pottery"] });
    const ranked = rankPostings([miss, match], { interests: ["Data Science"] });
    expect(ranked.map((p) => p.id)).toEqual(["a", "b"]);
  });

  it("keeps original order on ties (stable)", () => {
    const a = posting({ id: "a" });
    const b = posting({ id: "b" });
    const c = posting({ id: "c" });
    const ranked = rankPostings([a, b, c], { interests: [] });
    expect(ranked.map((p) => p.id)).toEqual(["a", "b", "c"]);
  });

  it("does not mutate the input array", () => {
    const input = [posting({ id: "a" }), posting({ id: "b", tags: ["ai"] })];
    const before = input.map((p) => p.id);
    rankPostings(input, { interests: ["AI"] });
    expect(input.map((p) => p.id)).toEqual(before);
  });
});
