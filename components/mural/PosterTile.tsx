import { Posting, PostingCategory } from "@/types/postings";

// Each category gets a poster palette: a soft fill, a bold accent bar, and a
// matching label color. Mixed together on a board, they read like a real wall of
// flyers rather than a uniform list.
const THEME: Record<
  PostingCategory,
  { bg: string; accent: string; label: string }
> = {
  Event: { bg: "bg-blue-50", accent: "bg-blue-500", label: "text-blue-700" },
  Research: {
    bg: "bg-purple-50",
    accent: "bg-purple-500",
    label: "text-purple-700",
  },
  Job: { bg: "bg-teal-50", accent: "bg-teal-500", label: "text-teal-700" },
  Tutoring: {
    bg: "bg-green-50",
    accent: "bg-green-500",
    label: "text-green-700",
  },
  "For sale": {
    bg: "bg-amber-50",
    accent: "bg-amber-500",
    label: "text-amber-800",
  },
  Club: { bg: "bg-pink-50", accent: "bg-pink-500", label: "text-pink-700" },
  Announcement: {
    bg: "bg-stone-50",
    accent: "bg-stone-400",
    label: "text-stone-700",
  },
  Other: { bg: "bg-gray-50", accent: "bg-gray-400", label: "text-gray-700" },
};

function Detail({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="flex gap-1.5 text-sm text-gray-700">
      <span className="shrink-0 font-medium text-gray-500">{label}</span>
      <span>{value}</span>
    </div>
  );
}

function CategoryLabel({ posting }: { posting: Posting }) {
  return (
    <span
      className={`text-[11px] font-semibold uppercase tracking-wide ${THEME[posting.category].label}`}
    >
      {posting.category}
    </span>
  );
}

interface PosterTileProps {
  posting: Posting;
  /** Small rotation in degrees, for the pinned-to-a-board look. */
  tilt?: number;
  /** Show a push-pin at the top, for the board view. */
  showPin?: boolean;
  /** Stretch to fill a fixed-height container (used by the swipe deck). */
  fill?: boolean;
}

/**
 * A flyer rendered as a poster. When the posting has an image (a crop of the real
 * flyer, or a generated sample poster) that image is the poster; otherwise a
 * typeset card stands in.
 */
export default function PosterTile({
  posting,
  tilt = 0,
  showPin = false,
  fill = false,
}: PosterTileProps) {
  const theme = THEME[posting.category];

  const pin = showPin ? (
    <span
      aria-hidden="true"
      className="absolute left-1/2 top-1 z-10 h-3.5 w-3.5 -translate-x-1/2 rounded-full bg-cmu-red shadow ring-2 ring-white"
    />
  ) : null;

  // Real poster image (the centerpiece of the mural).
  if (posting.image) {
    if (fill) {
      return (
        <div className="h-full">
          <div className="flex h-full flex-col overflow-hidden rounded-lg border border-black/5 bg-white shadow-md">
            <div className="flex h-44 shrink-0 items-center justify-center bg-gray-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={posting.image}
                alt={posting.title}
                className="max-h-44 w-full object-contain"
              />
            </div>
            <div className={`h-1 ${theme.accent}`} />
            <div className="flex-1 space-y-2 overflow-y-auto p-4">
              <CategoryLabel posting={posting} />
              <h3 className="text-lg font-bold leading-tight text-gray-900">
                {posting.title}
              </h3>
              <p className="text-sm text-gray-700">{posting.summary}</p>
              <div className="flex flex-col gap-1 pt-1">
                <Detail label="When" value={posting.date} />
                <Detail label="Where" value={posting.location} />
                <Detail label="From" value={posting.org} />
                <Detail label="Price" value={posting.price} />
                <Detail label="Pays" value={posting.compensation} />
                <Detail label="Contact" value={posting.contact} />
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Board tile: the poster image with a short caption.
    return (
      <div
        className="relative"
        style={tilt ? { transform: `rotate(${tilt}deg)` } : undefined}
      >
        {pin}
        <figure className="overflow-hidden rounded-lg border border-black/5 bg-white shadow-md">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={posting.image}
            alt={posting.title}
            loading="lazy"
            className="block w-full"
          />
          <div className={`h-1 ${theme.accent}`} />
          <figcaption className="space-y-0.5 p-3">
            <CategoryLabel posting={posting} />
            <p className="line-clamp-2 text-sm font-semibold leading-tight text-gray-900">
              {posting.title}
            </p>
            {posting.date && (
              <p className="text-xs text-gray-500">{posting.date}</p>
            )}
          </figcaption>
        </figure>
      </div>
    );
  }

  // Typeset fallback (no image located): a colored poster-style card.
  return (
    <div
      className={`relative ${fill ? "h-full" : ""}`}
      style={tilt ? { transform: `rotate(${tilt}deg)` } : undefined}
    >
      {pin}
      <div
        className={`flex flex-col overflow-hidden rounded-lg border border-black/5 shadow-md ${theme.bg} ${fill ? "h-full" : ""}`}
      >
        <div className={`h-1.5 ${theme.accent}`} />
        <div
          className={`space-y-2 p-4 ${fill ? "flex-1 overflow-y-auto" : ""}`}
        >
          <CategoryLabel posting={posting} />
          <h3 className="text-lg font-bold leading-tight text-gray-900">
            {posting.title}
          </h3>
          <p className="text-sm text-gray-700">{posting.summary}</p>
          <div className="flex flex-col gap-1 pt-1">
            <Detail label="When" value={posting.date} />
            <Detail label="Where" value={posting.location} />
            <Detail label="From" value={posting.org} />
            <Detail label="Price" value={posting.price} />
            <Detail label="Pays" value={posting.compensation} />
            <Detail label="Contact" value={posting.contact} />
          </div>
          {posting.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {posting.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-white/70 px-2 py-0.5 text-xs text-gray-600"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
