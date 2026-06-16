"use client";

import { useEffect, useRef, useState } from "react";
import { Posting } from "@/types/postings";
import PosterTile from "./PosterTile";

interface SwipeDeckProps {
  postings: Posting[];
  onDecide: (posting: Posting, decision: "save" | "skip") => void;
  onViewSaved: () => void;
  onScanAnother: () => void;
  savedCount: number;
}

const THRESHOLD = 110; // px past which a release commits the swipe

interface Leaving {
  posting: Posting;
  dir: 1 | -1;
  from: number;
}

/**
 * A swipeable stack of postings. Drag right (or press Save / right arrow) to keep
 * a posting; drag left (Skip / left arrow) to drop it. The decision is recorded
 * and the deck advances immediately, while the outgoing card animates out as a
 * separate overlay, so a fast click or swipe is never dropped. Buttons and arrow
 * keys make every action reachable without a pointer.
 */
export default function SwipeDeck({
  postings,
  onDecide,
  onViewSaved,
  onScanAnother,
  savedCount,
}: SwipeDeckProps) {
  const [index, setIndex] = useState(0);
  const [drag, setDrag] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [leaving, setLeaving] = useState<Leaving | null>(null);
  const startX = useRef(0);

  const top = postings[index];
  const next = postings[index + 1];

  function commit(decision: "save" | "skip") {
    const card = postings[index];
    if (!card) return;
    onDecide(card, decision);
    setLeaving({
      posting: card,
      dir: decision === "save" ? 1 : -1,
      from: drag,
    });
    setIndex((i) => i + 1);
    setDrag(0);
    setDragging(false);
    const id = card.id;
    window.setTimeout(
      () => setLeaving((l) => (l && l.posting.id === id ? null : l)),
      260
    );
  }

  // Arrow keys mirror the buttons while a card is showing.
  useEffect(() => {
    if (!top) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") commit("save");
      else if (e.key === "ArrowLeft") commit("skip");
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, postings]);

  function onPointerDown(e: React.PointerEvent) {
    setDragging(true);
    startX.current = e.clientX;
    e.currentTarget.setPointerCapture(e.pointerId);
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!dragging) return;
    setDrag(e.clientX - startX.current);
  }
  function onPointerUp() {
    if (!dragging) return;
    if (drag > THRESHOLD) commit("save");
    else if (drag < -THRESHOLD) commit("skip");
    else {
      setDrag(0);
      setDragging(false);
    }
  }

  if (!top && !leaving) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900">
          You are all caught up
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          {savedCount === 0
            ? "You did not save anything from this batch."
            : `Saved ${savedCount} ${savedCount === 1 ? "flyer" : "flyers"} to your mural.`}
        </p>
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onViewSaved}
            className="rounded-lg bg-cmu-red px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-cmu-red focus:ring-offset-2"
          >
            View my mural
          </button>
          <button
            type="button"
            onClick={onScanAnother}
            className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-cmu-red focus:ring-offset-2"
          >
            Scan another board
          </button>
        </div>
      </div>
    );
  }

  const rotation = drag / 22;
  const transition = dragging ? "none" : "transform 0.2s ease";
  const hint = drag > 40 ? "save" : drag < -40 ? "skip" : null;

  return (
    <div className="flex flex-col items-center gap-5">
      <p className="h-5 text-sm text-gray-600" aria-live="polite">
        {top ? `${index + 1} of ${postings.length}` : ""}
      </p>

      <div className="relative h-[24rem] w-full max-w-md select-none">
        {next && (
          <div className="absolute inset-0 scale-[0.96] rounded-lg border border-gray-200 bg-white opacity-60 shadow-sm" />
        )}

        {top && (
          <div
            className="absolute inset-0 cursor-grab touch-none active:cursor-grabbing"
            style={{
              transform: `translateX(${drag}px) rotate(${rotation}deg)`,
              transition,
            }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          >
            {hint && (
              <span
                className={`absolute right-4 top-4 z-20 rounded-md border-2 bg-white/80 px-2 py-0.5 text-sm font-bold uppercase ${
                  hint === "save"
                    ? "border-green-600 text-green-600"
                    : "border-gray-500 text-gray-500"
                }`}
                aria-hidden="true"
              >
                {hint}
              </span>
            )}
            <PosterTile posting={top} fill />
          </div>
        )}

        {leaving && (
          <div
            className={`pointer-events-none absolute inset-0 z-30 ${
              leaving.dir === 1 ? "swipe-out-right" : "swipe-out-left"
            }`}
            style={{
              transform: `translateX(${leaving.from}px) rotate(${leaving.from / 22}deg)`,
            }}
            aria-hidden="true"
          >
            <PosterTile posting={leaving.posting} fill />
          </div>
        )}
      </div>

      <div className="flex items-center gap-4" aria-hidden={!top}>
        <button
          type="button"
          onClick={() => commit("skip")}
          disabled={!top}
          className="rounded-full border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-cmu-red focus:ring-offset-2 disabled:opacity-40"
        >
          Skip
        </button>
        <button
          type="button"
          onClick={() => commit("save")}
          disabled={!top}
          className="rounded-full bg-cmu-red px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-cmu-red focus:ring-offset-2 disabled:opacity-40"
        >
          Save
        </button>
      </div>
      <p className="text-xs text-gray-400">
        Drag the card, use the buttons, or press the left and right arrow keys.
      </p>
    </div>
  );
}
