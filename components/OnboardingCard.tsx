import { InterestTag } from "@/types/events";
import InterestSelector from "./InterestSelector";

interface OnboardingCardProps {
  selectedInterests: InterestTag[];
  onToggleInterest: (interest: InterestTag) => void;
  onSave: () => void;
}

export default function OnboardingCard({
  selectedInterests,
  onToggleInterest,
  onSave,
}: OnboardingCardProps) {
  return (
    <div className="rounded-xl shadow-lg p-6 md:p-8 bg-white border-2 border-cmu-red max-w-2xl mx-auto">
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-2">
            Tell us what you're into
          </h2>
          <p className="text-sm md:text-base text-gray-600">
            Pick some interests so CMU Event Compass can highlight the most
            relevant events for you.
          </p>
        </div>

        <InterestSelector
          selectedInterests={selectedInterests}
          onToggle={onToggleInterest}
          compact={true}
        />

        <div className="flex justify-center pt-4">
          <button
            onClick={onSave}
            disabled={selectedInterests.length === 0}
            className="
              px-8 py-3 rounded-lg text-base font-semibold
              bg-cmu-red text-white
              hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-cmu-red focus:ring-offset-2
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors
            "
          >
            Save & See Events
          </button>
        </div>
      </div>
    </div>
  );
}

