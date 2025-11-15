interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <svg
          className="h-5 w-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search by title, host, or description…"
        className="
          w-full pl-12 pr-4 py-3 rounded-full border border-gray-300
          text-sm md:text-base text-gray-900 placeholder-gray-500
          focus:outline-none focus:ring-2 focus:ring-cmu-red focus:border-transparent
          transition-all
        "
        aria-label="Search events"
      />
    </div>
  );
}

