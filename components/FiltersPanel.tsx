import { EventSource, DateRangeFilter } from "@/types/events";
import DateRangeSelector from "./DateRangeSelector";
import SourceFilter from "./SourceFilter";
import SearchBar from "./SearchBar";

interface FiltersPanelProps {
  dateRange: DateRangeFilter;
  onDateRangeChange: (range: DateRangeFilter) => void;
  selectedSources: EventSource[];
  onSourcesChange: (sources: EventSource[]) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onlyShowInterests: boolean;
  onOnlyInterestsChange: (only: boolean) => void;
  onReset: () => void;
}

export default function FiltersPanel({
  dateRange,
  onDateRangeChange,
  selectedSources,
  onSourcesChange,
  searchQuery,
  onSearchChange,
  onlyShowInterests,
  onOnlyInterestsChange,
  onReset,
}: FiltersPanelProps) {
  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <SearchBar value={searchQuery} onChange={onSearchChange} />

      {/* Filters Card */}
      <div className="rounded-xl shadow-sm p-4 md:p-5 bg-white border border-gray-200">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg md:text-xl font-semibold text-gray-900">
              Filters
            </h3>
            <button
              onClick={onReset}
              className="text-sm text-gray-600 hover:text-cmu-red transition-colors focus:outline-none focus:ring-2 focus:ring-cmu-red focus:ring-offset-2 rounded px-2 py-1"
            >
              Reset
            </button>
          </div>

          {/* Date Range */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Date range:
            </label>
            <DateRangeSelector value={dateRange} onChange={onDateRangeChange} />
          </div>

          {/* Source Filter */}
          <SourceFilter
            selectedSources={selectedSources}
            onChange={onSourcesChange}
          />

          {/* Only Show Interests Toggle */}
          <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
            <input
              type="checkbox"
              id="only-interests"
              checked={onlyShowInterests}
              onChange={(e) => onOnlyInterestsChange(e.target.checked)}
              className="
                w-4 h-4 text-cmu-red border-gray-300 rounded
                focus:ring-cmu-red focus:ring-2
              "
            />
            <label
              htmlFor="only-interests"
              className="text-sm font-medium text-gray-700 cursor-pointer"
            >
              Only show my interests
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

