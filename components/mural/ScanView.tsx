"use client";

import { useState } from "react";
import { Posting, MuralScan } from "@/types/postings";
import { ExtractionModelId, extractPostings } from "@/lib/extract";
import { fileToImage } from "@/lib/image";

interface ScanViewProps {
  apiKey: string;
  model: ExtractionModelId;
  onExtracted: (postings: Posting[], scan: MuralScan) => void;
  onUseSample: () => void;
  onOpenSettings: () => void;
}

export default function ScanView({
  apiKey,
  model,
  onExtracted,
  onUseSample,
  onOpenSettings,
}: ScanViewProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [location, setLocation] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [status, setStatus] = useState<"idle" | "working" | "error">("idle");
  const [error, setError] = useState("");

  function chooseFile(f: File | null) {
    setFile(f);
    setError("");
    setStatus("idle");
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(f ? URL.createObjectURL(f) : null);
  }

  async function runExtraction() {
    if (!file || !apiKey) return;
    setStatus("working");
    setError("");
    try {
      const image = await fileToImage(file);
      const muralId = crypto.randomUUID();
      const postings = await extractPostings({
        apiKey,
        model,
        image,
        muralId,
        location: location.trim(),
      });
      if (postings.length === 0) {
        setStatus("error");
        setError(
          "No readable flyers were found in that photo. Try a clearer shot."
        );
        return;
      }
      const scan: MuralScan = {
        id: muralId,
        capturedAt: new Date().toISOString(),
        location: location.trim(),
        date,
        postingCount: postings.length,
      };
      onExtracted(postings, scan);
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Extraction failed.");
    }
  }

  const working = status === "working";

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold text-gray-900">Scan a mural</h2>
        <p className="text-sm text-gray-600">
          Photograph a poster wall. Claude reads each flyer and turns it into a
          swipeable card. No key yet? Try the sample board below.
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Board photo</span>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={(e) => chooseFile(e.target.files?.[0] ?? null)}
            className="mt-1 block w-full text-sm text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-cmu-red file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-red-800"
          />
        </label>

        {previewUrl && (
          // A local object URL preview of the chosen photo.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={previewUrl}
            alt="Selected board"
            className="mt-3 max-h-64 w-full rounded-lg object-contain"
          />
        )}

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">
              Location (optional)
            </span>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Gates Hillman, 4th floor"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-cmu-red focus:outline-none focus:ring-1 focus:ring-cmu-red"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Date</span>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-cmu-red focus:outline-none focus:ring-1 focus:ring-cmu-red"
            />
          </label>
        </div>

        {!apiKey && (
          <p className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900">
            Add your Anthropic API key in{" "}
            <button
              type="button"
              onClick={onOpenSettings}
              className="font-semibold underline"
            >
              Settings
            </button>{" "}
            to scan your own photos.
          </p>
        )}

        {error && (
          <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={runExtraction}
          disabled={!file || !apiKey || working}
          className="mt-4 w-full rounded-lg bg-cmu-red px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-cmu-red focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {working ? "Reading the board with Claude..." : "Extract with Claude"}
        </button>
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-500">No API key handy?</p>
        <button
          type="button"
          onClick={onUseSample}
          disabled={working}
          className="mt-1 rounded-lg border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-cmu-red focus:ring-offset-2 disabled:opacity-50"
        >
          Try a sample mural
        </button>
      </div>
    </div>
  );
}
