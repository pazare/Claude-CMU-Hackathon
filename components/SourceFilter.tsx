import { EventSource } from "@/types/events";

interface SourceFilterProps {
  selectedSources: EventSource[];
  onChange: (sources: EventSource[]) => void;
}

const ALL_SOURCES: EventSource[] = [
  "Tepper",
  "Heinz",
  "HCII",
  "SCS",
  "Dietrich",
  "University-wide",
];

export default function SourceFilter({
  selectedSources,
  onChange,
}: SourceFilterProps) {
  const toggleSource = (source: EventSource) => {
    if (selectedSources.includes(source)) {
      onChange(selectedSources.filter((s) => s !== source));
    } else {
      onChange([...selectedSources, source]);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">
        Filter by source:
      </label>
      <div className="flex flex-wrap gap-2">
        {ALL_SOURCES.map((source) => {
          const isSelected = selectedSources.includes(source);
          return (
            <button
              key={source}
              onClick={() => toggleSource(source)}
              className={`
                inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium
                transition-all duration-150
                focus:outline-none focus:ring-2 focus:ring-cmu-red focus:ring-offset-2
                ${
                  isSelected
                    ? "bg-cmu-red text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }
              `}
              aria-pressed={isSelected}
            >
              {source}
            </button>
          );
        })}
      </div>
    </div>
  );
}

