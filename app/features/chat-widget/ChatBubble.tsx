import type { ChatMessage } from "./types";
import { cn } from "../../lib/utils";

export function ChatBubble({ message }: { message: ChatMessage }) {
  const isBot = message.sender === "bot";

  return (
    <div
      className={cn(
        "flex animate-slide-up",
        isBot ? "justify-start" : "justify-end"
      )}
    >
      <div
        className={cn(
          "max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed",
          isBot
            ? "bg-teal-500/15 text-teal-50 rounded-bl-md border border-teal-500/20"
            : "bg-accent-500 text-white rounded-br-md"
        )}
      >
        {isBot && (
          <div className="flex items-center gap-1.5 mb-1">
            <span className="w-4 h-4 rounded-full bg-teal-500/30 flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-teal-400" />
            </span>
            <span className="text-xs font-semibold text-teal-300">ClownBot</span>
          </div>
        )}
        <p>{message.text}</p>
      </div>
    </div>
  );
}
