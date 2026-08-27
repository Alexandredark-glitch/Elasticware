import { useRef, useState } from "react";

export function SplitView({ orgSlug }: { orgSlug: string }) {
  const shopRef = useRef<HTMLIFrameElement>(null);
  const dashRef = useRef<HTMLIFrameElement>(null);
  const [reloadKey, setReloadKey] = useState(0);

  function reloadBoth() {
    setReloadKey((k) => k + 1);
  }

  return (
    <div className="h-screen flex flex-col bg-charcoal-950">
      <header className="flex-shrink-0 border-b border-charcoal-700 bg-charcoal-900">
        <div className="flex items-center justify-between px-4 sm:px-6 py-3">
          <button
            onClick={reloadBoth}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-cream-100 bg-charcoal-700 hover:bg-charcoal-600 border border-charcoal-600 rounded-lg transition-colors focus-ring"
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
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
              <path d="M21 3v5h-5" />
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
              <path d="M8 16H3v5" />
            </svg>
            Reload both
          </button>
        </div>
        
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 min-h-0">
        <div className="flex flex-col min-h-0 border-b lg:border-b-0 lg:border-r border-charcoal-700">
          <div className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-charcoal-800 border-b border-charcoal-700">
            <span className="w-2 h-2 rounded-full bg-accent-500" />
            <span className="text-xs font-semibold text-charcoal-200 uppercase tracking-wider">
              Storefront — Customer View
            </span>
          </div>
          <div className="flex-1 min-h-0 bg-cream-50">
            <iframe
              key={`shop-${reloadKey}`}
              ref={shopRef}
               src={`/mock-shop?org=${encodeURIComponent(orgSlug)}`}
              title="Mock Shop"
              className="w-full h-full"
            />
          </div>
        </div>

        <div className="flex flex-col min-h-0">
          <div className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-charcoal-800 border-b border-charcoal-700">
            <span className="w-2 h-2 rounded-full bg-teal-500" />
            <span className="text-xs font-semibold text-charcoal-200 uppercase tracking-wider">
              Agent Console — Dashboard
            </span>
          </div>
          <div className="flex-1 min-h-0 bg-charcoal-900">
            <iframe
              key={`dash-${reloadKey}`}
              ref={dashRef}
              src="/dashboard"
              title="Agent Dashboard"
              className="w-full h-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
