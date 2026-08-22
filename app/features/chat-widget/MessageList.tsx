import { useEffect, useRef } from "react";
import type { ChatMessage } from "./types.ts";
import { ChatBubble } from "./ChatBubble";

interface MessageListProp {
  messages: ChatMessage[]
}

export function MessageList({ messages } : MessageListProp) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]); //UX

  return (
    <div className="scroll-chat flex-1 overflow-y-auto px-4 py-4 space-y-3">
      {messages.map((msg) => (
        <ChatBubble key={msg.id} message={msg} />
      ))}
      <div ref={endRef} />
    </div>
  );
}
 