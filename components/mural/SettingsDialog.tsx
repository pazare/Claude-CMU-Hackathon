"use client";

import { useEffect, useState } from "react";
import { EXTRACTION_MODELS, ExtractionModelId } from "@/lib/extract";

interface SettingsDialogProps {
  open: boolean;
  onClose: () => void;
  apiKey: string;
  model: ExtractionModelId;
  onSave: (apiKey: string, model: ExtractionModelId) => void;
}

export default function SettingsDialog({
  open,
  onClose,
  apiKey,
  model,
  onSave,
}: SettingsDialogProps) {
  const [keyDraft, setKeyDraft] = useState(apiKey);
  const [modelDraft, setModelDraft] = useState<ExtractionModelId>(model);

  // Reset the drafts to current values whenever the dialog opens.
  useEffect(() => {
    if (open) {
      setKeyDraft(apiKey);
      setModelDraft(model);
    }
  }, [open, apiKey, model]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="settings-title" className="text-lg font-semibold text-gray-900">
          Settings
        </h2>

        <div className="mt-4 space-y-4">
          <div>
            <label
              htmlFor="api-key"
              className="block text-sm font-medium text-gray-700"
            >
              Anthropic API key
            </label>
            <input
              id="api-key"
              type="password"
              value={keyDraft}
              onChange={(e) => setKeyDraft(e.target.value)}
              placeholder="sk-ant-..."
              autoComplete="off"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-cmu-red focus:outline-none focus:ring-1 focus:ring-cmu-red"
            />
            <p className="mt-1 text-xs text-gray-500">
              Stored only in this browser and sent only to the Anthropic API to
              read your photos. Get a key at console.anthropic.com.
            </p>
          </div>

          <div>
            <label
              htmlFor="model"
              className="block text-sm font-medium text-gray-700"
            >
              Model
            </label>
            <select
              id="model"
              value={modelDraft}
              onChange={(e) =>
                setModelDraft(e.target.value as ExtractionModelId)
              }
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-cmu-red focus:outline-none focus:ring-1 focus:ring-cmu-red"
            >
              {EXTRACTION_MODELS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              setKeyDraft("");
              onSave("", modelDraft);
              onClose();
            }}
            className="text-sm font-medium text-gray-500 hover:text-cmu-red"
          >
            Clear key
          </button>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                onSave(keyDraft.trim(), modelDraft);
                onClose();
              }}
              className="rounded-lg bg-cmu-red px-4 py-2 text-sm font-semibold text-white hover:bg-red-800"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
