"use client";

import { useState } from "react";
import { Posting } from "@/types/postings";
import PosterTile from "./PosterTile";

interface SavedViewProps {
  postings: Posting[];
  onRemove: (id: string) => void;
  onScan: () => void;
  canRecreate: boolean;
  onRecreate: (posting: Posting) => Promise<void>;
}

// A small, deterministic tilt per posting so the board looks pinned-by-hand
// without shifting between renders (no Math.random, so no hydration drift).
function tiltFromId(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++)
    hash = (hash * 31 + id.charCodeAt(i)) % 1000;
  return (hash % 7) - 3; // -3 to 3 degrees
}

const CORK_STYLE = {
  backgroundColor: "#caa46e",
  backgroundImage: "radial-gradient(rgba(0,0,0,0.08) 1px, transparent 1px)",
  backgroundSize: "10px 10px",
};

/** Recreate makes sense only for a real photo crop, not a generated sample SVG. */
function isPhotoCrop(image?: string): boolean {
  return Boolean(image && !image.startsWith("data:image/svg"));
}

export default function SavedView({
  postings,
  onRemove,
  onScan,
  canRecreate,
  onRecreate,
}: SavedViewProps) {
  const [busy, setBusy] = useState<Set<string>>(new Set());
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function recreate(posting: Posting) {
    setBusy((b) => new Set(b).add(posting.id));
    setErrors((e) => ({ ...e, [posting.id]: "" }));
    try {
      await onRecreate(posting);
    } catch (err) {
      setErrors((e) => ({
        ...e,
        [posting.id]: err instanceof Error ? err.message : "Recreate failed.",
      }));
    } finally {
      setBusy((b) => {
        const next = new Set(b);
        next.delete(posting.id);
        return next;
      });
    }
  }

  if (postings.length === 0) {
    return (
      <div className="mx-auto max-w-xl rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900">
          Your mural is empty
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Scan a board and swipe right on what you want to keep. The flyers you
          save become your own mural.
        </p>
        <button
          type="button"
          onClick={onScan}
          className="mt-6 rounded-lg bg-cmu-red px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-cmu-red focus:ring-offset-2"
        >
          Scan a mural
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Your mural</h2>
          <p className="text-sm text-gray-500">
            Built from what you saved: {postings.length}{" "}
            {postings.length === 1 ? "flyer" : "flyers"}, just for you.
          </p>
        </div>
        <button
          type="button"
          onClick={onScan}
          className="shrink-0 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-cmu-red focus:ring-offset-2"
        >
          Scan a mural
        </button>
      </div>

      <div className="rounded-2xl p-5 shadow-inner" style={CORK_STYLE}>
        <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
          {postings.map((posting) => {
            const recreating = busy.has(posting.id);
            const error = errors[posting.id];
            const showRecreate = canRecreate && isPhotoCrop(posting.image);
            return (
              <div key={posting.id} className="mb-6 break-inside-avoid">
                <PosterTile
                  posting={posting}
                  tilt={tiltFromId(posting.id)}
                  showPin
                />
                <div className="mt-1 flex items-center justify-center gap-3">
                  {showRecreate && (
                    <button
                      type="button"
                      onClick={() => recreate(posting)}
                      disabled={recreating}
                      className="rounded px-2 py-0.5 text-xs font-medium text-white/90 underline-offset-2 hover:underline focus:outline-none focus:ring-2 focus:ring-white disabled:opacity-60"
                    >
                      {recreating ? "Recreating..." : "Recreate"}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => onRemove(posting.id)}
                    className="rounded px-2 py-0.5 text-xs font-medium text-white/90 underline-offset-2 hover:underline focus:outline-none focus:ring-2 focus:ring-white"
                  >
                    Remove
                  </button>
                </div>
                {error && (
                  <p className="mt-1 text-center text-xs text-red-100">
                    {error}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
