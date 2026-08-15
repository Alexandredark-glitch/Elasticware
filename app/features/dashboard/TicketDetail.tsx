import { cn } from "../../lib/utils";
import type { DemoMessage, DemoTicket } from "./demo-tickets";

function MessageRow({ message }: { message: DemoMessage }) {
  const isCustomer = message.sender === "customer";
  const isBot = message.sender === "bot";
  const isAgent = message.sender === "agent";

  return (
    <div
      className={cn(
        "flex flex-col gap-1 animate-fade-in",
        isCustomer ? "items-start" : "items-end"
      )}
    >
      <div className="flex items-center gap-1.5">
        <span
          className={cn(
            "text-xs font-semibold",
            isCustomer && "text-charcoal-300",
            isBot && "text-teal-400",
            isAgent && "text-accent-400"
          )}
        >
          {isCustomer ? "Customer" : isBot ? "ClownBot" : "Agent"}
        </span>
        <span className="text-xs text-charcoal-500">{message.time}</span>
      </div>
      <div
        className={cn(
          "max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed",
          isCustomer &&
            "bg-charcoal-700 text-cream-100 rounded-bl-md border border-charcoal-600",
          isBot &&
            "bg-teal-500/15 text-teal-50 rounded-br-md border border-teal-500/20",
          isAgent &&
            "bg-accent-500/15 text-accent-200 rounded-br-md border border-accent-500/20"
        )}
      >
        {message.text}
      </div>
    </div>
  );
}

export function TicketDetail({ ticket }: { ticket: DemoTicket | null }) {
  if (!ticket) {
    return (
      <div className="flex-1 flex items-center justify-center text-charcoal-400">
        <div className="text-center space-y-3">
          <div className="tent-stripe w-12 h-12 rounded-xl mx-auto opacity-40" />
          <p className="text-sm">Select a ticket from the queue</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-5 py-4 border-b border-charcoal-700 flex-shrink-0">
        <div className="flex items-center gap-3 mb-1">
          <span className="font-mono text-xs text-charcoal-400">{ticket.id}</span>
          <span className="text-xs text-charcoal-500">·</span>
          <span className="text-xs text-charcoal-300">{ticket.customer}</span>
        </div>
        <h2 className="font-heading text-lg font-semibold text-cream-100">
          {ticket.subject}
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto scroll-chat px-5 py-4 space-y-4">
        {ticket.messages.map((msg) => (
          <MessageRow key={msg.id} message={msg} />
        ))}
      </div>
    </div>
  );
}
