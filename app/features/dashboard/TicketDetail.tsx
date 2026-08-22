import { cn } from "../../lib/utils";
import { useTicketMessages } from "~/hooks/useTicketMessages";
import type { QueueTicket } from "./DashboardShell";
import { useFetcher } from "react-router";

interface DetailMessage {
  id: string;
  sender: "customer" | "bot" | "agent";
  text: string;
  time: string;
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

function MessageRow({ message }: { message: DetailMessage }) {
  
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
          {isCustomer ? "Customer" : isBot ? "ElasticBot" : "Agent"}
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

function MessageRowSkeleton({ align }: { align: "start" | "end" }) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1.5",
        align === "start" ? "items-start" : "items-end"
      )}
    >
      <div className="h-3 w-14 rounded bg-charcoal-700 animate-pulse" />
      <div
        className={cn(
          "h-10 rounded-2xl bg-charcoal-700 animate-pulse",
          align === "start" ? "w-44 rounded-bl-md" : "w-52 rounded-br-md"
        )}
      />
    </div>
  );
}

export function TicketDetail({ ticket} : { ticket: QueueTicket | undefined }) {
  
  const {data: rawMessages = [], isLoading, isError } = useTicketMessages(ticket?.id ?? null);

  const sendFetcher = useFetcher({ key: `reply-${ticket?.id}` });
  const messages: DetailMessage[] = rawMessages.map((msg) => ({
  id: msg.id,
  sender: msg.sender as "customer" | "bot" | "agent",
  text: msg.content,
  time: formatRelativeTime(msg.created_at),
}));

 const pendingText = sendFetcher.formData?.get("content") as string | undefined;
 const isSubmitting = sendFetcher.state !== "idle";

// Race-condition guard: realtime can deliver the DB row before the fetcher
// transitions back to idle. If the last confirmed message matches our pending
// text, the optimistic bubble is redundant — hide it. AI CODE
const lastMessage = messages.at(-1);
const alreadyArrived =
  isSubmitting && pendingText
    ? lastMessage?.sender === "agent" && lastMessage?.text === pendingText
    : false;

const showOptimistic = isSubmitting && pendingText && !alreadyArrived;
const sendError = sendFetcher.data?.error as string | undefined;


const resolveFetcher = useFetcher();
const isResolving = resolveFetcher.state !== "idle";

 if(!ticket) {
  return (
    <div className="flex-1 flex items-center justify-center text-charcoal-500">
      <p className="text-sm">Select a ticket to view the conversation</p>
    </div>
  )
 }
  
  return (
    <div className="flex flex-col h-full">
      
            <div className="px-5 py-4 border-b border-charcoal-700 flex-shrink-0">
        {ticket.status === "resolved" && (
          <div className="mb-2 px-3 py-1.5 bg-teal-500/10 border border-teal-500/20 rounded">
            <span className="text-xs text-teal-400 font-medium">Resolved</span>
          </div>
        )}

        {sendError && (
          <div className="mb-2 px-3 py-1.5 bg-accent-500/10 border border-accent-500/20 rounded">
            <p className="text-xs text-accent-400">Failed to send: {sendError}</p>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 mb-1">
            <span className="font-mono text-xs text-charcoal-400">
              {ticket.id.slice(0, 8)}…
            </span>
            <span className="text-xs text-charcoal-500">·</span>
            <span className="text-xs text-charcoal-300">{ticket.customer}</span>
          </div>

          {ticket.status !== "resolved" && (
            <button
              onClick={() =>
                resolveFetcher.submit(
                  { intent: "resolve", ticket_id: ticket.id },
                  { method: "post", action: "/api/tickets" }
                )
              }
              disabled={isResolving}
              className="text-xs text-charcoal-400 hover:text-teal-400 px-2 py-1 rounded border border-charcoal-700 hover:border-teal-500/30 hover:bg-teal-500/10 transition-colors disabled:opacity-50"
            >
              {isResolving ? "Resolving…" : "Resolve"}
            </button>
          )}
        </div>

        <h2 className="font-heading text-lg font-semibold text-cream-100">
          {ticket.subject}
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto scroll-chat px-5 py-4 space-y-4">
        {isLoading ? (
          <>
            <MessageRowSkeleton align="start" />
            <MessageRowSkeleton align="end" />
            <MessageRowSkeleton align="start" />
          </>
        ) : isError ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-sm text-accent-400">Failed to load messages.</p>
            </div>
        ) : messages.length === 0 ? (
          <p className="text-sm text-charcoal-500 text-center py-8">
            No messages yet
          </p>
        ) : (
          messages.map((msg) => <MessageRow key={msg.id} message={msg} />)
        )}

                    {showOptimistic && (
            <MessageRow
              message={{
                id: "pending",
                sender: "agent",
                text: pendingText,
                time: "Sending…",
              }}
            />
          )}

      </div>
    </div>
  );
}