interface EmptyStateProps {
  message?: string;
}

export default function EmptyState({
  message = "No events match your filters. Try adjusting your search or filters.",
}: EmptyStateProps) {
  return (
    <div className="text-center py-12 px-4">
      <svg
        className="mx-auto h-12 w-12 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        />
      </svg>
      <h3 className="mt-4 text-lg font-medium text-gray-900">No events found</h3>
      <p className="mt-2 text-sm text-gray-500">{message}</p>
    </div>
  );
}

