"use client";

import { useState, useEffect } from "react";
import { ExtractionModelId } from "@/lib/extract";
import {
  getApiKey,
  saveApiKey,
  getModel,
  saveModel,
} from "@/lib/mural-storage";
import MuralApp from "@/components/mural/MuralApp";
import BrowseView from "@/components/BrowseView";
import SettingsDialog from "@/components/mural/SettingsDialog";

type Tab = "mural" | "browse";

const TABS: [Tab, string][] = [
  ["mural", "Mural"],
  ["browse", "Browse events"],
];

export default function Home() {
  const [tab, setTab] = useState<Tab>("mural");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState<ExtractionModelId>("claude-opus-4-8");

  // Read the key and model on the client (localStorage is unavailable on render).
  useEffect(() => {
    setApiKey(getApiKey());
    setModel(getModel());
  }, []);

  function handleSaveSettings(key: string, nextModel: ExtractionModelId) {
    setApiKey(key);
    saveApiKey(key);
    setModel(nextModel);
    saveModel(nextModel);
  }

  return (
    <main className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-3 py-4">
            <div className="flex items-center gap-3">
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cmu-red text-sm font-bold text-white"
                aria-hidden="true"
              >
                EC
              </span>
              <div>
                <h1 className="text-xl font-semibold text-gray-900 md:text-2xl">
                  CMU Event Compass
                </h1>
                <p className="text-xs text-gray-600 md:text-sm">
                  Photograph a poster wall. Claude reads each flyer into a card
                  you can swipe.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSettingsOpen(true)}
              className="shrink-0 rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-cmu-red focus:ring-offset-2"
            >
              Settings
            </button>
          </div>

          <nav
            className="flex gap-1 pb-px"
            role="tablist"
            aria-label="Main views"
          >
            {TABS.map(([key, label]) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={tab === key}
                onClick={() => setTab(key)}
                className={`-mb-px border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
                  tab === key
                    ? "border-cmu-red text-cmu-red"
                    : "border-transparent text-gray-500 hover:text-gray-800"
                }`}
              >
                {label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Both views stay mounted so an in-progress swipe deck survives a tab switch. */}
        <div className={tab === "mural" ? "" : "hidden"}>
          <MuralApp
            apiKey={apiKey}
            model={model}
            onOpenSettings={() => setSettingsOpen(true)}
          />
        </div>
        <div className={tab === "browse" ? "" : "hidden"}>
          <BrowseView />
        </div>
      </div>

      <SettingsDialog
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        apiKey={apiKey}
        model={model}
        onSave={handleSaveSettings}
      />
    </main>
  );
}
