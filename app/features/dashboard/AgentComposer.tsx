import { useState, useEffect} from "react";
import { useFetcher } from "react-router";
import { useQueryClient } from "@tanstack/react-query";

export function AgentComposer({ ticketId, disabled}: { ticketId: string; disabled?: boolean }) {
  
  const queryClient = useQueryClient();
  const fetcher = useFetcher({ key: `reply-${ticketId}` });
  const [text, setText] = useState("");

  
 useEffect(() => {
  if (fetcher.state === "idle" && fetcher.data?.ok) {
    queryClient.invalidateQueries({ queryKey: ["messages", ticketId] });
    queryClient.invalidateQueries({ queryKey: ["tickets"] });
  }
}, [fetcher.state, fetcher.data, ticketId, queryClient]);

  const isSending = fetcher.state !== "idle";

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || isSending) return;

    fetcher.submit(
      {
        ticket_id: ticketId,
        sender: "agent",
        content: trimmed,
      },
      { method: "post", action: "/api/messages" }
    );

    setText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-charcoal-700 p-4 flex items-center gap-3">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isSending || disabled}
        placeholder="Type your reply…"
        className="flex-1 bg-charcoal-900 text-cream-100 text-sm px-4 py-2.5 rounded-lg border border-charcoal-700 focus:border-accent-500 focus:outline-none transition-colors disabled:opacity-50"
      />
      <button
        onClick={handleSend}
        disabled={isSending || !text.trim() || disabled}
        className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-accent-500 text-white rounded-lg hover:bg-accent-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        aria-label="Send"
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