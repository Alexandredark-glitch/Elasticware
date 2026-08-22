import { cn } from "../../lib/utils";
import { StatusBadge } from "~/components/StatusBadge";
import type { QueueTicket } from "./DashboardShell";
import { useFetcher } from "react-router";



export function TicketQueue({
  tickets,
  selectedId,
  onSelect,
  tab
}: {
  tickets: QueueTicket[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  tab?: "open" | "resolved";
}) {

    const deleteFetcher = useFetcher();

  return (
    <div className="flex flex-col">
      <div className="px-4 py-3 border-b border-charcoal-700 flex items-center justify-between flex-shrink-0">
        <h2 className="font-heading text-sm font-semibold text-cream-100 uppercase tracking-wider">
          Queue
        </h2>
        <span className="px-2 py-0.5 text-xs font-mono text-charcoal-300 bg-charcoal-700 rounded-full">
          {tickets.length}
        </span>
      </div>
      <div className="flex-1 overflow-y-auto scroll-chat p-3 space-y-2">
                {tickets.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-charcoal-500">
            <p className="text-sm">No active tickets</p>
          </div>
        )}
                {tickets.map((ticket) => {
          const isDeleting = deleteFetcher.state !== "idle" && deleteFetcher.formData?.get("ticket_id") === ticket.id;
          const isDeleted = deleteFetcher.data?.ok && deleteFetcher.data.ticket_id === ticket.id;
          if (isDeleted) return null; //lil tweak, we will refactor this later
                  return (
          <div
            key={ticket.id}
            role="button"
            tabIndex={0}
            onClick={() => onSelect(ticket.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelect(ticket.id);
              }
            }}
            className={cn(
              "ticket-stub w-full text-left pl-5 pr-4 py-3 rounded-lg border transition-all focus-ring cursor-pointer",
              selectedId === ticket.id
                ? "bg-charcoal-700 border-accent-500/50"
                : "bg-charcoal-800 border-charcoal-700 hover:border-charcoal-600 hover:bg-charcoal-750"
            )}
          >
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="font-mono text-xs text-charcoal-400">
                {ticket.id.slice(0, 8)}…
              </span>
             <StatusBadge status={ticket.status as "bot_handling" | "open" | "resolved"} />
            </div>
            <p className="text-sm font-medium text-cream-100 leading-snug mb-1 truncate">
              {ticket.subject}
            </p>
            <p className="text-xs text-charcoal-400 truncate">
              {ticket.preview}
            </p>

                       <div className="flex items-center justify-between mt-2 pt-2 border-t border-charcoal-700/50">
              <span className="text-xs text-charcoal-300">{ticket.customer}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-charcoal-500">{ticket.updatedAt}</span>
                {tab === "resolved" && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (
                            window.confirm(
                              "Delete this ticket and all its related messages permanently?"
                            )
                          ) {
                            deleteFetcher.submit(
                              { intent: "delete", ticket_id: ticket.id },
                              { method: "post", action: "/api/tickets" }
                            );
                          }
                        }}
                        disabled={isDeleting}
                        className={cn(
                          "text-xs transition-colors",
                          isDeleting
                            ? "text-charcoal-500 cursor-wait"
                            : "text-accent-400 hover:text-accent-300 px-1.5 py-0.5 rounded hover:bg-accent-500/10"
                        )}
                      >
                        {isDeleting ? "Deleting…" : "Delete"}
                       </button>
                    )}
              </div>
            </div>
          </div>
        )})}
      </div>
    </div>
  );
}