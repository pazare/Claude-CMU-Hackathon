import { InterestTag } from "@/types/events";

interface InterestSelectorProps {
  selectedInterests: InterestTag[];
  onToggle: (interest: InterestTag) => void;
  compact?: boolean;
}

const ALL_INTERESTS: InterestTag[] = [
  "AI / ML",
  "HCI / Design",
  "Entrepreneurship",
  "Healthcare",
  "Policy & Society",
  "Data Science",
  "Product Management",
  "Robotics",
  "General",
];

export default function InterestSelector({
  selectedInterests,
  onToggle,
  compact = false,
}: InterestSelectorProps) {
  if (compact) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg md:text-xl font-semibold text-gray-900">
            Your Interests
          </h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {ALL_INTERESTS.map((interest) => {
            const isSelected = selectedInterests.includes(interest);
            return (
              <button
                key={interest}
                onClick={() => onToggle(interest)}
                className={`
                  inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium
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
                {interest}
              </button>
            );
          })}
        </div>
        <p className="text-xs text-gray-500">
          We'll prioritize events that match these interests.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl shadow-sm p-4 md:p-5 bg-white border border-gray-200">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg md:text-xl font-semibold text-gray-900">
            Your Interests
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            We'll prioritize events that match these interests.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {ALL_INTERESTS.map((interest) => {
            const isSelected = selectedInterests.includes(interest);
            return (
              <button
                key={interest}
                onClick={() => onToggle(interest)}
                className={`
                  inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium
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
                {interest}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

