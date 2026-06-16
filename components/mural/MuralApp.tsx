"use client";

import { useEffect, useMemo, useState } from "react";
import { Posting, MuralScan } from "@/types/postings";
import { InterestTag } from "@/types/events";
import { ExtractionModelId } from "@/lib/extract";
import { rankPostings } from "@/lib/ranker";
import { SAMPLE_POSTINGS } from "@/data/sample-mural";
import { getInterests, saveInterests } from "@/lib/storage";
import {
  getPostings,
  savePostings,
  getSaved,
  setSaved,
  getSkipped,
  setSkipped,
  addScan,
} from "@/lib/mural-storage";
import InterestSelector from "@/components/InterestSelector";
import ScanView from "./ScanView";
import SwipeDeck from "./SwipeDeck";
import SavedView from "./SavedView";

type SubView = "scan" | "swipe" | "saved";

interface MuralAppProps {
  apiKey: string;
  model: ExtractionModelId;
  onOpenSettings: () => void;
}

export default function MuralApp({
  apiKey,
  model,
  onOpenSettings,
}: MuralAppProps) {
  const [hydrated, setHydrated] = useState(false);
  const [interests, setInterests] = useState<InterestTag[]>([]);
  const [postings, setPostings] = useState<Posting[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [skippedIds, setSkippedIds] = useState<string[]>([]);
  const [deck, setDeck] = useState<Posting[]>([]);
  const [view, setView] = useState<SubView>("scan");

  // Load persisted state on the client.
  useEffect(() => {
    setInterests(getInterests());
    setPostings(getPostings());
    setSavedIds(getSaved());
    setSkippedIds(getSkipped());
    setHydrated(true);
  }, []);

  // Persist saved/skipped ids whenever they change. Decisions use functional
  // state updates, so rapid swipes can never clobber one another, and writing
  // here keeps localStorage in sync without threading the new value by hand.
  useEffect(() => {
    if (hydrated) setSaved(savedIds);
  }, [savedIds, hydrated]);

  useEffect(() => {
    if (hydrated) setSkipped(skippedIds);
  }, [skippedIds, hydrated]);

  const savedPostings = useMemo(
    () =>
      savedIds
        .map((id) => postings.find((p) => p.id === id))
        .filter((p): p is Posting => Boolean(p)),
    [savedIds, postings]
  );

  const deckSavedCount = useMemo(
    () => deck.filter((p) => savedIds.includes(p.id)).length,
    [deck, savedIds]
  );

  function handleToggleInterest(interest: InterestTag) {
    const next = interests.includes(interest)
      ? interests.filter((i) => i !== interest)
      : [...interests, interest];
    setInterests(next);
    saveInterests(next);
  }

  /** Merge new postings (deduped by id) into the store, then open the deck. */
  function startDeck(incoming: Posting[]) {
    const known = new Set(postings.map((p) => p.id));
    const fresh = incoming.filter((p) => !known.has(p.id));
    if (fresh.length > 0) {
      const merged = [...fresh, ...postings];
      setPostings(merged);
      savePostings(merged);
    }
    setDeck(rankPostings(incoming, { interests }));
    setView("swipe");
  }

  function handleExtracted(incoming: Posting[], scan: MuralScan) {
    addScan(scan);
    startDeck(incoming);
  }

  function handleUseSample() {
    startDeck(SAMPLE_POSTINGS);
  }

  function handleDecide(posting: Posting, decision: "save" | "skip") {
    const update = (prev: string[]) =>
      prev.includes(posting.id) ? prev : [posting.id, ...prev];
    if (decision === "save") setSavedIds(update);
    else setSkippedIds(update);
  }

  function handleRemoveSaved(id: string) {
    setSavedIds((prev) => prev.filter((s) => s !== id));
  }

  if (!hydrated) {
    return (
      <p className="text-sm text-gray-500" role="status">
        Loading...
      </p>
    );
  }

  const tabs: [SubView, string][] = [
    ["scan", "Scan"],
    ["swipe", "Swipe"],
    [
      "saved",
      `My mural${savedPostings.length ? ` (${savedPostings.length})` : ""}`,
    ],
  ];

  return (
    <div className="space-y-6">
      <div
        className="flex gap-2 text-sm"
        role="tablist"
        aria-label="Mural views"
      >
        {tabs.map(([key, label]) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={view === key}
            onClick={() => setView(key)}
            disabled={key === "swipe" && deck.length === 0}
            className={`rounded-full px-4 py-1.5 font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
              view === key
                ? "bg-cmu-red text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {view === "scan" && (
        <div className="space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <InterestSelector
              selectedInterests={interests}
              onToggle={handleToggleInterest}
              compact
            />
            <p className="mt-2 text-xs text-gray-500">
              Interests order your swipe deck. They never leave your browser.
            </p>
          </div>
          <ScanView
            apiKey={apiKey}
            model={model}
            onExtracted={handleExtracted}
            onUseSample={handleUseSample}
            onOpenSettings={onOpenSettings}
          />
        </div>
      )}

      {view === "swipe" && (
        <SwipeDeck
          postings={deck}
          onDecide={handleDecide}
          onViewSaved={() => setView("saved")}
          onScanAnother={() => setView("scan")}
          savedCount={deckSavedCount}
        />
      )}

      {view === "saved" && (
        <SavedView
          postings={savedPostings}
          onRemove={handleRemoveSaved}
          onScan={() => setView("scan")}
        />
      )}
    </div>
  );
}
