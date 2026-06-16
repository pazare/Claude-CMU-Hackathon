import { describe, it, expect } from "vitest";
import { parsePostings } from "@/lib/extract";

describe("parsePostings", () => {
  it("maps a well-formed posting and attaches the mural id", () => {
    const text = JSON.stringify({
      postings: [
        {
          title: "Paid memory study",
          category: "Research",
          summary: "Volunteers needed for a 1-hour memory study.",
          compensation: "$20 gift card",
          contact: "memlab@andrew.cmu.edu",
          tags: ["Psychology", "psychology", "  PAID "],
        },
      ],
    });
    const [p] = parsePostings(text, "mural-1");
    expect(p.title).toBe("Paid memory study");
    expect(p.category).toBe("Research");
    expect(p.compensation).toBe("$20 gift card");
    expect(p.muralId).toBe("mural-1");
    expect(p.id).toBeTruthy();
    // tags are lowercased, trimmed, and de-duplicated
    expect(p.tags).toEqual(["psychology", "paid"]);
  });

  it("falls back to the Other category for an unknown value", () => {
    const text = JSON.stringify({
      postings: [{ title: "X", category: "Nonsense", summary: "y", tags: [] }],
    });
    expect(parsePostings(text, "m")[0].category).toBe("Other");
  });

  it("drops entries missing a title or summary", () => {
    const text = JSON.stringify({
      postings: [
        { category: "Event", summary: "no title", tags: [] },
        { title: "no summary", category: "Event", tags: [] },
        { title: "ok", category: "Event", summary: "good", tags: [] },
      ],
    });
    const out = parsePostings(text, "m");
    expect(out).toHaveLength(1);
    expect(out[0].title).toBe("ok");
  });

  it("returns an empty array when postings is absent", () => {
    expect(parsePostings(JSON.stringify({}), "m")).toEqual([]);
  });

  it("throws on unparseable text", () => {
    expect(() => parsePostings("not json", "m")).toThrow();
  });
});
