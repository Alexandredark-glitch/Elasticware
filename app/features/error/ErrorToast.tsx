import { useGlobalError } from "~/hooks/useGlobalError";

export function ErrorToast() {
  const { error, clearError } = useGlobalError();

  if (!error) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] max-w-md w-[calc(100%-2rem)]">
      <div className="flex items-start gap-3 rounded-xl border border-accent-500/30 bg-accent-500/10 px-4 py-3 shadow-lg backdrop-blur-sm">
        <span className="mt-0.5 text-accent-400">⚠</span>
        <p className="flex-1 text-sm text-accent-300">{error}</p>
        <button
          onClick={clearError}
          className="text-accent-400 hover:text-accent-200 transition-colors"
          aria-label="Dismiss error"
        >
          ✕
        </button>
      </div>
    </div>
  );
}