import { useState, useEffect, useMemo } from "react";
import { TicketQueue } from "./TicketQueue";
import { TicketDetail } from "./TicketDetail";
import { AgentComposer } from "./AgentComposer";
import { useTickets } from "~/hooks/useTickets";
import { DashboardSkeleton, TicketQueueSkeleton } from "./DashboardSkeleton";
import { type Database } from "~/lib/db/database.types";
import { cn } from "~/lib/utils";

export interface QueueTicket {
  id: string;
  status: string;
  subject: string;
  preview: string;
  customer: string;
  updatedAt: string;
}

function formatRelativeTime(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diffSec < 60) return "Just now";
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
  return date.toLocaleDateString();
}

type mapRealToQueueParam = Database["public"]["Tables"]["tickets"]["Row"];

function mapRealToQueue(t: mapRealToQueueParam): QueueTicket {
  return {
    id: t.id,
    status: t.status,
    subject: t.subject || "No subject",
    preview: t.preview || "No preview",
    customer: `User ♯${(t.customer_session_id ?? "unknown").slice(0, 4)}`,
    updatedAt: formatRelativeTime(t.updated_at),
  };
}

export function DashboardShell({
  orgId,
  user,
  name,
}: {
  orgId: string;
  user: { email?: string; id: string };
  name: string | null;
}) {
  const { data: realTickets = [], isLoading, isError } = useTickets(orgId);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"open" | "resolved">("open");

  const tickets = useMemo(
    () => realTickets.map(mapRealToQueue),
    [realTickets]
  );

  const openTickets = useMemo(
    () => tickets.filter((t) => t.status !== "resolved"),
    [tickets]
  );
  const resolvedTickets = useMemo(
    () => tickets.filter((t) => t.status === "resolved"),
    [tickets]
  );
  const displayTickets = activeTab === "open" ? openTickets : resolvedTickets;


  const isSelectedVisible = displayTickets.some((t) => t.id === selectedId);
  const effectiveSelectedId = isSelectedVisible
    ? selectedId
    : displayTickets[0]?.id || null;
  const selectedTicket = displayTickets.find(
    (t) => t.id === effectiveSelectedId
  );

  useEffect(() => {
    setSelectedId(null);
  }, [activeTab]);

  if (isLoading && tickets.length === 0) return <DashboardSkeleton />;

  return (
    <div className="flex h-screen bg-charcoal-900">
      <aside className="w-full sm:w-80 lg:w-96 border-r border-charcoal-700 flex-shrink-0 flex flex-col">
        <div className="flex items-center justify-center gap-3 px-4 py-2">
          <a
            href="/kb"
            target="_top"
            className="text-xs text-charcoal-400 hover:text-cream-100 transition-colors"
          >
            Knowledge Base
          </a>
          <span className="text-xs text-charcoal-400 hidden sm:inline">
            {name || user.email}
          </span>
          <form method="post" action="/logout" target="_top">
            <button
              type="submit"
              className="text-xs text-charcoal-400 hover:text-accent-400 px-2 py-1 rounded hover:bg-charcoal-800 transition-colors"
            >
              Log out
            </button>
          </form>
        </div>
        <div
          role="tablist"
          aria-label="Ticket tabs"
          className="flex items-center gap-3"
        >
          <button
            role="tab"
            aria-selected={activeTab === "open"}
            onClick={() => setActiveTab("open")}
            className={cn(
              "flex-1 px-4 py-2.5 text-xs font-medium uppercase tracking-wider transition-colors",
              activeTab === "open"
                ? "text-cream-100 border-b-2 border-accent-500 bg-charcoal-800"
                : "text-charcoal-400 hover:text-cream-200 hover:bg-charcoal-800/50"
            )}
          >
            Open
          </button>
          <button
            role="tab"
            aria-selected={activeTab === "resolved"}
            onClick={() => setActiveTab("resolved")}
            className={cn(
              "flex-1 px-4 py-2.5 text-xs font-medium uppercase tracking-wider transition-colors",
              activeTab === "resolved"
                ? "text-cream-100 border-b-2 border-accent-500 bg-charcoal-800"
                : "text-charcoal-400 hover:text-cream-200 hover:bg-charcoal-800/50"
            )}
          >
            Resolved
          </button>
        </div>

        {isLoading ? (
          <TicketQueueSkeleton />
        ) : isError ? (
          <div className="flex-1 flex items-center justify-center px-4">
            <p className="text-sm text-accent-400">
              Failed to load tickets. Please reload your browser.
            </p>
          </div>
        ) : (
          <TicketQueue
            tickets={displayTickets}
            selectedId={effectiveSelectedId}
            onSelect={setSelectedId}
            tab={activeTab}
          />
        )}
      </aside>




<main className="flex-1 flex flex-col min-w-0">
        {effectiveSelectedId ? (
          <>
            <TicketDetail ticket={selectedTicket}  />
            <AgentComposer
              ticketId={effectiveSelectedId}
              disabled={selectedTicket?.status === "resolved"}
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-charcoal-400">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-xl mx-auto opacity-40 bg-charcoal-700" />
              <p className="text-sm">No tickets in queue</p>
            </div>
          </div>
        )}
      </main>
    </div>

      )}