export function AgentComposer() {
  return (
    <div className="border-t border-charcoal-700 p-4 flex items-center gap-3">
      <input
        type="text"
        disabled
        placeholder="Agent composer — available in Phase 3"
        className="flex-1 bg-charcoal-900 text-charcoal-500 text-sm px-4 py-2.5 rounded-lg border border-charcoal-700 cursor-not-allowed"
      />
      <button
        disabled
        className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-charcoal-700 text-charcoal-500 rounded-lg cursor-not-allowed border border-charcoal-600"
        aria-label="Send (disabled)"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4"
        >
          <path d="m22 2-7 20-4-9-9-4Z" />
          <path d="M22 2 11 13" />
        </svg>
      </button>
    </div>
  );
}
