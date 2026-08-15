import { useState, useCallback } from "react";
import { MessageList } from "./MessageList";
import { Composer } from "./Composer";
import { BOT_GREETING, type ChatMessage } from "./types";

let idCounter = 0;
function nextId() {
  return `msg-${Date.now()}-${idCounter++}`;
}

const BOT_REPLIES = [
  "Great question! Let me look that up for you...",
  "Thanks for reaching out! I can help with that.",
  "I understand — let me check our knowledge base.",
  "Hmm, that's a good one. I'm searching for the best answer.",
];

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([BOT_GREETING]);

  const handleSend = useCallback((text: string) => {
    const customerMsg: ChatMessage = {
      id: nextId(),
      sender: "customer",
      text,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, customerMsg]);

    setTimeout(() => {
      const botMsg: ChatMessage = {
        id: nextId(),
        sender: "bot",
        text: BOT_REPLIES[Math.floor(Math.random() * BOT_REPLIES.length)],
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 800);
  }, []);

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3.5 bg-accent-500 text-white font-semibold rounded-full shadow-lg shadow-accent-500/30 hover:bg-accent-600 animate-pulse-ring transition-colors focus-ring"
          aria-label="Open chat"
        >
          <span className="w-5 h-5 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </span>
          <span className="text-sm">Chat with us</span>
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[calc(100vw-3rem)] sm:w-96 h-[32rem] max-h-[80vh] bg-charcoal-800 border border-charcoal-600 rounded-2xl shadow-2xl shadow-charcoal-950/50 flex flex-col overflow-hidden animate-bounce-in">
          <div className="flex items-center justify-between px-4 py-3 bg-charcoal-900 border-b border-charcoal-700">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-teal-500/20 border border-teal-500/30 flex items-center justify-center">
                  <span className="w-3 h-3 rounded-full bg-teal-400 animate-pulse" />
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-cream-100">
                  ClownBot
                </p>
                <p className="text-xs text-teal-400">Online now</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 flex items-center justify-center text-charcoal-300 hover:text-cream-100 hover:bg-charcoal-700 rounded-lg transition-colors focus-ring"
              aria-label="Close chat"
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
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>

          <MessageList messages={messages} />
          <Composer onSend={handleSend} />
        </div>
      )}
    </>
  );
}
