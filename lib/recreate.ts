import { Posting } from "@/types/postings";

// Optional: recreate a poster with OpenAI's image model when the photo crop is
// poor (blurry, skewed, partly covered). The student supplies their own OpenAI
// key, stored only in their browser. This is a faithful redraw, not a pixel copy,
// so it is offered per poster rather than run on everything.

const API_URL = "https://api.openai.com/v1/images/edits";

const PROMPT =
  "Recreate this flyer as one clean, sharp, front-facing poster. Faithfully preserve its exact wording, layout, colors, logos, and imagery. Do not add, remove, or invent any text or graphics. Output only the poster, filling the frame.";

/**
 * Send the current poster image to OpenAI and return a recreated version as a
 * data URL. Runs in the browser against the student's own OpenAI key.
 */
export async function recreatePoster(
  imageDataUrl: string,
  posting: Posting,
  openaiKey: string
): Promise<string> {
  const blob = await (await fetch(imageDataUrl)).blob();
  const form = new FormData();
  form.append("model", "gpt-image-1");
  form.append(
    "image",
    new File([blob], "poster.jpg", { type: blob.type || "image/jpeg" })
  );
  form.append("prompt", `${PROMPT} The poster is titled "${posting.title}".`);
  form.append("size", "1024x1536");
  form.append("quality", "medium");

  let res: Response;
  try {
    res = await fetch(API_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${openaiKey}` },
      body: form,
    });
  } catch {
    throw new Error(
      "Could not reach the OpenAI API. Check your connection and try again."
    );
  }

  if (!res.ok) {
    let detail = "";
    try {
      const body = (await res.json()) as { error?: { message?: string } };
      detail = body.error?.message ?? "";
    } catch {
      // Non-JSON error body.
    }
    throw new Error(openaiError(res.status, detail));
  }

  const data = (await res.json()) as { data?: Array<{ b64_json?: string }> };
  const b64 = data.data?.[0]?.b64_json;
  if (!b64) throw new Error("OpenAI returned no image.");
  return `data:image/png;base64,${b64}`;
}

function openaiError(status: number, detail: string): string {
  if (status === 401)
    return "That OpenAI key was rejected. Check it in Settings.";
  if (status === 403)
    return "This OpenAI key cannot use image generation. The organization may need verification.";
  if (status === 429) return "OpenAI rate limit or quota reached.";
  if (status >= 500) return "OpenAI had a problem. Try again shortly.";
  return detail
    ? `Recreate failed: ${detail}`
    : `Recreate failed (HTTP ${status}).`;
}
