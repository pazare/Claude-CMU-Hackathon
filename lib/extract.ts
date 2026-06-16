import {
  Posting,
  POSTING_CATEGORIES,
  isPostingCategory,
} from "@/types/postings";
import { PreparedImage, Box, cropToDataUrl } from "@/lib/image";

// Vision-capable models the student can choose from. Opus 4.8 is the default and
// most capable; the others trade some accuracy for lower cost and latency, which
// matters because the student pays for their own key.
export const EXTRACTION_MODELS = [
  { id: "claude-opus-4-8", label: "Opus 4.8 (most capable)" },
  { id: "claude-sonnet-4-6", label: "Sonnet 4.6 (faster, cheaper)" },
  { id: "claude-haiku-4-5", label: "Haiku 4.5 (cheapest)" },
] as const;
export type ExtractionModelId = (typeof EXTRACTION_MODELS)[number]["id"];
export const DEFAULT_MODEL: ExtractionModelId = "claude-opus-4-8";

// Structured-output schema. title, category, summary, and tags are required; the
// rest depend on the flyer. "box" is the flyer's pixel rectangle in the image, so
// the real poster can be cropped out. additionalProperties is false everywhere.
const POSTINGS_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    postings: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          title: { type: "string" },
          category: { type: "string", enum: [...POSTING_CATEGORIES] },
          summary: { type: "string" },
          date: { type: "string" },
          location: { type: "string" },
          org: { type: "string" },
          contact: { type: "string" },
          price: { type: "string" },
          compensation: { type: "string" },
          tags: { type: "array", items: { type: "string" } },
          box: {
            type: "object",
            additionalProperties: false,
            properties: {
              x: { type: "number" },
              y: { type: "number" },
              w: { type: "number" },
              h: { type: "number" },
            },
            required: ["x", "y", "w", "h"],
          },
        },
        required: ["title", "category", "summary", "tags"],
      },
    },
  },
  required: ["postings"],
} as const;

const SYSTEM =
  "You read photographs of physical bulletin boards on a university campus and turn each flyer into a structured listing. Report only what is printed; never invent details. If a field is not on the flyer, omit it.";

function instruction(location: string, width: number, height: number): string {
  const where = location.trim() ? ` in ${location.trim()}` : "";
  return [
    `This photo shows a bulletin board at Carnegie Mellon${where}. The image is ${width} by ${height} pixels.`,
    "Identify every distinct flyer, poster, or notice you can read, and return one entry per flyer.",
    "For each, give a short title, the best-fitting category, and a one or two sentence plain-language summary.",
    "Include whichever of these are printed: date or time, location, hosting organization, contact (email, phone, link, or social handle), price (for items for sale), compensation (for research studies or jobs).",
    "Add 2 to 5 lowercase topical tags.",
    "Also give box: the flyer's bounding rectangle in pixels, where x and y are the top-left corner and w and h the width and height, with the origin at the top-left of the image. Make each box tight around a single flyer, and do not let boxes overlap or merge neighbouring flyers.",
    "Skip anything you cannot read.",
  ].join(" ");
}

export interface ExtractOptions {
  apiKey: string;
  model: ExtractionModelId;
  image: PreparedImage;
  muralId: string;
  /** Where the board is, if the student named it; added to the prompt as context. */
  location?: string;
}

const API_URL = "https://api.anthropic.com/v1/messages";

/**
 * Send one board photo to Claude and return the postings read off it, each with a
 * crop of its real flyer when Claude located it.
 *
 * This calls the Messages API directly from the browser with the student's own
 * key, so the key never leaves their machine and the app needs no backend. The
 * "dangerous-direct-browser-access" header is what lets the API accept a request
 * straight from a page. (The official SDK pulls in Node built-ins that do not
 * bundle for a static site, so a plain fetch is the right fit here.)
 */
export async function extractPostings(
  opts: ExtractOptions
): Promise<Posting[]> {
  let res: Response;
  try {
    res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": opts.apiKey,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify({
        model: opts.model,
        max_tokens: 8000,
        system: SYSTEM,
        output_config: {
          format: { type: "json_schema", schema: POSTINGS_SCHEMA },
        },
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image",
                source: {
                  type: "base64",
                  media_type: opts.image.mediaType,
                  data: opts.image.base64,
                },
              },
              {
                type: "text",
                text: instruction(
                  opts.location ?? "",
                  opts.image.width,
                  opts.image.height
                ),
              },
            ],
          },
        ],
      }),
    });
  } catch {
    throw new Error(
      "Could not reach the Anthropic API. Check your connection and try again."
    );
  }

  if (!res.ok) {
    let detail = "";
    try {
      const body = (await res.json()) as { error?: { message?: string } };
      detail = body.error?.message ?? "";
    } catch {
      // Non-JSON error body; fall back to the status code.
    }
    throw new Error(errorForStatus(res.status, detail));
  }

  const data = (await res.json()) as {
    content?: Array<{ type: string; text?: string }>;
  };
  const text = (data.content ?? [])
    .map((block) => (block.type === "text" ? (block.text ?? "") : ""))
    .join("");

  const items = parseExtraction(text, opts.muralId);

  // Crop each located flyer out of the high-resolution copy. Boxes are in the
  // sent image's pixel space, so scale them up to the full image first. If a box
  // is missing or the crop fails, the posting keeps no image and the text tile
  // shows instead.
  const sentW = opts.image.width;
  const sentH = opts.image.height;
  const scale = opts.image.full.width / sentW;
  return Promise.all(
    items.map(async ({ posting, box }) => {
      if (!box) return posting;
      try {
        const sent = denormalizeBox(box, sentW, sentH);
        posting.image = await cropToDataUrl(opts.image.full, {
          x: sent.x * scale,
          y: sent.y * scale,
          w: sent.w * scale,
          h: sent.h * scale,
        });
      } catch {
        // Leave image undefined.
      }
      return posting;
    })
  );
}

/**
 * Some models return box coordinates normalized to 0..1 rather than pixels.
 * If every value is within the unit square, scale it up to the image size.
 */
function denormalizeBox(box: Box, width: number, height: number): Box {
  const unit = [box.x, box.y, box.w, box.h].every((v) => v >= 0 && v <= 1);
  if (!unit) return box;
  return {
    x: box.x * width,
    y: box.y * height,
    w: box.w * width,
    h: box.h * height,
  };
}

interface ParsedItem {
  posting: Posting;
  box?: Box;
}

/** Parse the model's JSON into postings plus any bounding boxes (internal). */
export function parseExtraction(text: string, muralId: string): ParsedItem[] {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error("Claude returned a response that could not be read.");
  }
  const raw = (parsed as { postings?: unknown }).postings;
  if (!Array.isArray(raw)) return [];

  return raw.flatMap((item): ParsedItem[] => {
    if (typeof item !== "object" || item === null) return [];
    const r = item as Record<string, unknown>;
    if (typeof r.title !== "string" || typeof r.summary !== "string") return [];
    const category = isPostingCategory(r.category) ? r.category : "Other";
    const tags = Array.isArray(r.tags)
      ? Array.from(
          new Set(
            r.tags
              .filter((t): t is string => typeof t === "string")
              .map((t) => t.toLowerCase().trim())
              .filter(Boolean)
          )
        ).slice(0, 6)
      : [];

    const str = (v: unknown) =>
      typeof v === "string" && v.trim() ? v.trim() : undefined;

    return [
      {
        posting: {
          id: crypto.randomUUID(),
          title: r.title.trim(),
          category,
          summary: r.summary.trim(),
          date: str(r.date),
          location: str(r.location),
          org: str(r.org),
          contact: str(r.contact),
          price: str(r.price),
          compensation: str(r.compensation),
          tags,
          muralId,
        },
        box: parseBox(r.box),
      },
    ];
  });
}

/** Back-compat wrapper returning just the postings (used by tests). */
export function parsePostings(text: string, muralId: string): Posting[] {
  return parseExtraction(text, muralId).map((item) => item.posting);
}

function parseBox(value: unknown): Box | undefined {
  if (typeof value !== "object" || value === null) return undefined;
  const b = value as Record<string, unknown>;
  const nums = [b.x, b.y, b.w, b.h];
  if (!nums.every((n) => typeof n === "number" && Number.isFinite(n))) {
    return undefined;
  }
  const box = {
    x: b.x as number,
    y: b.y as number,
    w: b.w as number,
    h: b.h as number,
  };
  return box.w > 0 && box.h > 0 ? box : undefined;
}

function errorForStatus(status: number, detail: string): string {
  if (status === 401) return "That API key was rejected. Check it in Settings.";
  if (status === 400 && /credit|balance|billing/i.test(detail))
    return "Your account needs API credits to run extraction.";
  if (status === 403) return "This key does not have access to that model.";
  if (status === 429)
    return "Rate limited by the API. Wait a moment and retry.";
  if (status === 413) return "The image is too large. Try a smaller photo.";
  if (status >= 500) return "The API had a problem. Try again shortly.";
  return detail
    ? `Extraction failed: ${detail}`
    : `Extraction failed (HTTP ${status}).`;
}
