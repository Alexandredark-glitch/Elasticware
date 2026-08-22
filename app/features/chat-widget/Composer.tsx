import { useState, type FormEvent } from "react";

interface COmposerProps {
  onSend: (text:string) => void,
  
  isSending?: boolean
}

export function Composer({
  onSend,
  isSending
}:COmposerProps) {


  const [value, setValue] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || isSending) return;
    onSend(trimmed);
    setValue("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-charcoal-700 p-3 flex items-center gap-2"
    >
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Type a message..."
        disabled={isSending}
        className="flex-1 bg-charcoal-900 text-cream-100 text-sm px-4 py-2.5 rounded-lg border border-charcoal-600 placeholder:text-charcoal-400 focus:outline-none focus:border-teal-500/50 transition-colors"
      />
      <button
        type="submit"
        disabled={isSending || !value.trim()}
        className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-accent-500 text-white rounded-lg hover:bg-accent-600 disabled:bg-charcoal-700 disabled:text-charcoal-500 disabled:cursor-not-allowed transition-colors focus-ring"
        aria-label="Send message"
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
    </form>
  );
}
