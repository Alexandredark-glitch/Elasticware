import { cn } from "../../lib/utils";
import { StatusBadge } from "~/components/StatusBadge";
import type { DemoTicket } from "./demo-tickets";

export function TicketQueue({
  tickets,
  selectedId,
  onSelect,
}: {
  tickets: DemoTicket[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-charcoal-700 flex items-center justify-between flex-shrink-0">
        <h2 className="font-heading text-sm font-semibold text-cream-100 uppercase tracking-wider">
          Queue
        </h2>
        <span className="px-2 py-0.5 text-xs font-mono text-charcoal-300 bg-charcoal-700 rounded-full">
          {tickets.length}
        </span>
      </div>
      <div className="flex-1 overflow-y-auto scroll-chat p-3 space-y-2">
        {tickets.map((ticket) => (
          <button
            key={ticket.id}
            onClick={() => onSelect(ticket.id)}
            className={cn(
              "ticket-stub w-full text-left pl-5 pr-4 py-3 rounded-lg border transition-all focus-ring",
              selectedId === ticket.id
                ? "bg-charcoal-700 border-accent-500/50"
                : "bg-charcoal-800 border-charcoal-700 hover:border-charcoal-600 hover:bg-charcoal-750"
            )}
          >
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="font-mono text-xs text-charcoal-400">
                {ticket.id}
              </span>
              <StatusBadge status={ticket.status} />
            </div>
            <p className="text-sm font-medium text-cream-100 leading-snug mb-1 truncate">
              {ticket.subject}
            </p>
            <p className="text-xs text-charcoal-400 truncate">
              {ticket.preview}
            </p>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-charcoal-700/50">
              <span className="text-xs text-charcoal-300">{ticket.customer}</span>
              <span className="text-xs text-charcoal-500">{ticket.updatedAt}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
