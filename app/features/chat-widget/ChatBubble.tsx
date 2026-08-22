import type { ChatMessage } from "./types";
import { cn } from "../../lib/utils";

export function ChatBubble({ message }: { message: ChatMessage }) {
  const isCustomer = message.sender === "customer";
  const isBot = message.sender === "bot";
  const isAgent = message.sender === "agent";

  return (
    <div
      className={cn(
        "flex animate-slide-up",
        isCustomer ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed",
          isCustomer &&
            "bg-accent-500 text-white rounded-br-md",
          isBot &&
            "bg-teal-500/15 text-teal-50 rounded-bl-md border border-teal-500/20",
          isAgent &&
            "bg-accent-500/15 text-accent-200 rounded-bl-md border border-accent-500/20"
        )}
      >
        {(isBot || isAgent) && (
          <div className="flex items-center gap-1.5 mb-1">
            <span
              className={cn(
                "w-4 h-4 rounded-full flex items-center justify-center",
                isBot ? "bg-teal-500/30" : "bg-accent-500/30"
              )}
            >
              <span
                className={cn(
                  "w-2 h-2 rounded-full",
                  isBot ? "bg-teal-400" : "bg-accent-400"
                )}
              />
            </span>
            <span
              className={cn(
                "text-xs font-semibold",
                isBot ? "text-teal-300" : "text-accent-300"
              )}
            >
              {isBot ? "ElasticBot" : "Agent"}
            </span>
          </div>
        )}
        <p>{message.text}</p>
      </div>
    </div>
  );
}