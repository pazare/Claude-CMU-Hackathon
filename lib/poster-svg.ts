import { PostingCategory } from "@/types/postings";

// Generates a flyer-style SVG poster from a posting's fields. Used for the sample
// board (which has no real photo) so the mural still shows real-looking posters.
// Real scans use a crop of the actual photo instead; this is the stand-in.

const ACCENT: Record<PostingCategory, string> = {
  Event: "#2563eb",
  Research: "#7c3aed",
  Job: "#0d9488",
  Tutoring: "#16a34a",
  "For sale": "#d97706",
  Club: "#db2777",
  Announcement: "#78716c",
  Other: "#6b7280",
};

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Greedy word-wrap into at most maxLines lines of roughly maxChars each. */
function wrap(text: string, maxChars: number, maxLines: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    if (!current) current = word;
    else if ((current + " " + word).length <= maxChars) current += " " + word;
    else {
      lines.push(current);
      current = word;
      if (lines.length === maxLines) break;
    }
  }
  if (current && lines.length < maxLines) lines.push(current);
  return lines;
}

export interface PosterFields {
  title: string;
  category: PostingCategory;
  org?: string;
  date?: string;
  price?: string;
  compensation?: string;
}

export function posterSvg(p: PosterFields): string {
  const accent = ACCENT[p.category];
  const titleTspans = wrap(p.title, 16, 4)
    .map(
      (line, i) => `<tspan x="24" dy="${i === 0 ? 0 : 30}">${esc(line)}</tspan>`
    )
    .join("");

  const footer = [p.date, p.org].filter(Boolean).join("  ·  ");
  const headline = p.price ?? p.compensation ?? "";

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400">
  <rect width="300" height="400" fill="#ffffff"/>
  <rect width="300" height="96" fill="${accent}"/>
  <circle cx="272" cy="18" r="46" fill="#ffffff" opacity="0.12"/>
  <text x="24" y="42" fill="#ffffff" font-family="system-ui,sans-serif" font-size="13" font-weight="700" letter-spacing="2">${esc(p.category.toUpperCase())}</text>
  <text x="24" y="66" fill="#ffffff" font-family="system-ui,sans-serif" font-size="12" opacity="0.85">CMU bulletin board</text>
  <text x="24" y="150" fill="#111827" font-family="Georgia,serif" font-size="24" font-weight="700">${titleTspans}</text>
  ${headline ? `<text x="24" y="320" fill="${accent}" font-family="system-ui,sans-serif" font-size="22" font-weight="700">${esc(headline)}</text>` : ""}
  <line x1="24" y1="344" x2="112" y2="344" stroke="${accent}" stroke-width="3"/>
  <text x="24" y="372" fill="#6b7280" font-family="system-ui,sans-serif" font-size="12">${esc(footer)}</text>
</svg>`;

  return "data:image/svg+xml," + encodeURIComponent(svg);
}
