import { useState, useRef, useEffect, type FormEvent, type KeyboardEvent } from "react";

interface ComposerProps {
  onSend: (text: string) => void;
  isSending?: boolean;
}

export function Composer({ onSend, isSending }: ComposerProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);

  function submit() {
    const trimmed = value.trim();
    if (!trimmed || isSending) return;
    onSend(trimmed);
    setValue("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    submit();
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-charcoal-700 p-3 flex items-end gap-2"
    >
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        disabled={isSending}
        maxLength={2000}
        rows={1}
        className="flex-1 bg-charcoal-900 text-cream-100 text-sm px-4 py-2.5 rounded-lg border border-charcoal-600 placeholder:text-charcoal-400 focus:outline-none focus:border-teal-500/50 transition-colors resize-none overflow-hidden min-h-[40px] max-h-[120px]"
      />
      <button
        type="submit"
        disabled={isSending || !value.trim()}
        className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-accent-500 text-white rounded-lg hover:bg-accent-600 disabled:bg-charcoal-700 disabled:text-charcoal-500 disabled:cursor-not-allowed transition-colors"
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