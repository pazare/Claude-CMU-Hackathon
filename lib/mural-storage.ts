import { Posting, MuralScan, isPosting } from "@/types/postings";
import { ExtractionModelId, DEFAULT_MODEL } from "@/lib/extract";

/**
 * localStorage persistence for the mural feature.
 *
 * The Anthropic API key is stored here and nowhere else: it stays in the
 * student's own browser, is never sent anywhere except the Anthropic API, and is
 * never committed. Reads are defensive so corrupt or legacy data falls back to
 * safe defaults instead of flowing in untyped.
 */

const KEYS = {
  API_KEY: "compass-api-key",
  MODEL: "compass-model",
  POSTINGS: "compass-postings",
  SAVED: "compass-saved",
  SKIPPED: "compass-skipped",
  SCANS: "compass-scans",
} as const;

function readJson(key: string): unknown {
  if (typeof window === "undefined") return undefined;
  const stored = localStorage.getItem(key);
  if (stored === null) return undefined;
  try {
    return JSON.parse(stored);
  } catch {
    return undefined;
  }
}

function writeJson(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

function readStringArray(key: string): string[] {
  const parsed = readJson(key);
  return Array.isArray(parsed)
    ? parsed.filter((v): v is string => typeof v === "string")
    : [];
}

// API key (stored as a plain string, not JSON, so it is easy to inspect/clear).
export function getApiKey(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(KEYS.API_KEY) ?? "";
}
export function saveApiKey(key: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEYS.API_KEY, key);
}
export function clearApiKey(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEYS.API_KEY);
}

// Model choice.
export function getModel(): ExtractionModelId {
  const parsed = readJson(KEYS.MODEL);
  return parsed === "claude-opus-4-8" ||
    parsed === "claude-sonnet-4-6" ||
    parsed === "claude-haiku-4-5"
    ? parsed
    : DEFAULT_MODEL;
}
export function saveModel(model: ExtractionModelId): void {
  writeJson(KEYS.MODEL, model);
}

// Postings (newest first).
export function getPostings(): Posting[] {
  const parsed = readJson(KEYS.POSTINGS);
  return Array.isArray(parsed) ? parsed.filter(isPosting) : [];
}
export function savePostings(postings: Posting[]): void {
  try {
    writeJson(KEYS.POSTINGS, postings);
  } catch {
    // Image crops can exceed the localStorage quota. Drop them and keep the
    // text so the postings still persist; the live session keeps the images.
    try {
      writeJson(
        KEYS.POSTINGS,
        postings.map((p) => ({ ...p, image: undefined }))
      );
    } catch {
      // Out of room entirely; leave whatever was last stored.
    }
  }
}
/** Prepend newly extracted postings and return the combined list. */
export function addPostings(incoming: Posting[]): Posting[] {
  const next = [...incoming, ...getPostings()];
  savePostings(next);
  return next;
}

// Saved and skipped posting ids.
export function getSaved(): string[] {
  return readStringArray(KEYS.SAVED);
}
export function getSkipped(): string[] {
  return readStringArray(KEYS.SKIPPED);
}
export function setSaved(ids: string[]): void {
  writeJson(KEYS.SAVED, ids);
}
export function setSkipped(ids: string[]): void {
  writeJson(KEYS.SKIPPED, ids);
}

// Scans.
export function getScans(): MuralScan[] {
  const parsed = readJson(KEYS.SCANS);
  if (!Array.isArray(parsed)) return [];
  return parsed.filter(
    (s): s is MuralScan =>
      typeof s === "object" &&
      s !== null &&
      typeof (s as MuralScan).id === "string"
  );
}
export function addScan(scan: MuralScan): void {
  writeJson(KEYS.SCANS, [scan, ...getScans()]);
}
