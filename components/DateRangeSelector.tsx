import { DateRangeFilter } from "@/types/events";

interface DateRangeSelectorProps {
  value: DateRangeFilter;
  onChange: (range: DateRangeFilter) => void;
}

const OPTIONS: DateRangeFilter[] = ["Today", "This Week", "This Month", "All"];

export default function DateRangeSelector({
  value,
  onChange,
}: DateRangeSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {OPTIONS.map((option) => (
        <button
          key={option}
          onClick={() => onChange(option)}
          className={`
            px-4 py-2 rounded-lg text-sm font-medium
            transition-all duration-150
            focus:outline-none focus:ring-2 focus:ring-cmu-red focus:ring-offset-2
            ${
              value === option
                ? "bg-cmu-red text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }
          `}
          aria-pressed={value === option}
          aria-label={`Filter events by ${option}`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

