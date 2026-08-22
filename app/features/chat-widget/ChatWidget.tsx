import { useState, useEffect, useRef } from "react";
import { useTicketMessages } from "~/hooks/useTicketMessages";
import { useFetcher } from "react-router";
import { MessageList } from "./MessageList";
import { Composer } from "./Composer";
import { BOT_GREETING, type ChatMessage } from "./types";
import { useWidgetSession } from "../../hooks/useWidgetSession";
import { supabase } from "~/lib/supabase/supabase.client";

export function ChatWidget() {
  // Two fetchers so resolve never aborts a message send
  const messageFetcher = useFetcher();
  const resolveFetcher = useFetcher();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([BOT_GREETING]);
  console.log("This is the arr of messages", messages);
  const { sessionId, ticketId, saveTicketId, clearSession } = useWidgetSession();

  const { data: history = [], isLoading: isLoadingHistory } =
    useTicketMessages(ticketId); //null on first render (ticketID) so is not enabled
    console.log("This is the history", history);

  const [sendError, setSendError] = useState<string | null>(null);
  const [pendingText, setPendingText] = useState<string | null>(null);
  const pendingTextRef = useRef<string | null>(null);

  const isSending = messageFetcher.state !== "idle";

  // Skeleton ONLY when restoring an old conversation from localStorage
  const isHydrating =
    Boolean(ticketId) && isLoadingHistory && messages.length === 1 && !pendingText;

     // Keep ref in sync with state (doesn't trigger effects)
  useEffect(() => {
    pendingTextRef.current = pendingText;
  }, [pendingText]);

  // -------------------------------------------------------------------------
  // Sync DB history into local state.
  // Runs on initial load AND whenever Supabase realtime pushes a new message.
  // -------------------------------------------------------------------------
  useEffect(() => {
    if (!ticketId || isLoadingHistory) return;

    const dbMessages = history.map((m) => ({
      id: m.id,
      sender: m.sender as "customer" | "bot" | "agent",
      text: m.content,
      timestamp: new Date(m.created_at).getTime(),
    }));

    // If our optimistic message has arrived in the database, clear it
    const hasArrived =
      pendingTextRef.current &&
      dbMessages.some(
        (m) => m.text === pendingTextRef.current && m.sender === "customer"
      );

    if (hasArrived) {
      setPendingText(null);
    }

    // Only show optimistic bubble if the real message hasn't landed yet
    const optimistic: ChatMessage[] =
      !hasArrived && pendingTextRef.current
        ? [
            {
              id: "pending",
              sender: "customer",
              text: pendingTextRef.current,
              timestamp: Date.now(),
            },
          ]
        : [];

    setMessages([BOT_GREETING, ...dbMessages, ...optimistic]);
    console.log("This is the messages in the second useEffect", messages);
  }, [ticketId, isLoadingHistory, history]);

  
  // Handle message fetcher response (create ticket or insert message)
  useEffect(() => {
    if (messageFetcher.state !== "idle" || !messageFetcher.data) return;

    if (messageFetcher.data.error) {
      setSendError(
        typeof messageFetcher.data.error === "string"
          ? messageFetcher.data.error
          : "Failed to send"
      );
    } else {
      setSendError(null);
      if (messageFetcher.data.ticket_id && !ticketId) {
        saveTicketId(messageFetcher.data.ticket_id); // It is only after this that the ticketId is available
      }
    }
  }, [messageFetcher.state, messageFetcher.data, ticketId, saveTicketId]);

    useEffect(() => {
    if (!ticketId) return;

    const channel = supabase
      .channel(`ticket-status:${ticketId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "tickets",
          filter: `id=eq.${ticketId}`,
        },
        (payload) => {
          if (payload.new.status === "resolved") {
            clearSession();
            setMessages([BOT_GREETING]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [ticketId, clearSession]); // This only listen when there is a ticket. Since that's our only update, it's dead code until there is a ticket.

  // -------------------------------------------------------------------------
  // Actions
  // -------------------------------------------------------------------------
  const handleSend = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isSending) return;

    setSendError(null);
    setPendingText(trimmed); //Optimistic update

    if (!ticketId) {
      messageFetcher.submit(
        { org_key: "demo", session_id: sessionId, content: trimmed },
        { method: "post", action: "/api/tickets" }
      );
    } else {
      messageFetcher.submit(
        { ticket_id: ticketId, sender: "customer", content: trimmed },
        { method: "post", action: "/api/messages" }
      );
    }
  };

  const handleEndChat = () => {
    if (ticketId) {
       clearSession();
    setMessages([BOT_GREETING]);
    setPendingText(null);
    pendingTextRef.current = null; // .current is mutable thanks to react
    setSendError(null);
      resolveFetcher.submit(
        { intent: "resolve", ticket_id: ticketId },
        { method: "post", action: "/api/tickets" }
      );
    }
   
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3.5 bg-accent-500 text-white font-semibold rounded-full shadow-lg shadow-accent-500/30 hover:bg-accent-600 animate-pulse-ring transition-colors focus-ring"
          aria-label="Open chat"
        >
          <span className="w-5 h-5 flex items-center justify-center">
            {/* svg goes here */}
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
         
          {sendError && (
            <div className="px-4 py-2 bg-accent-500/10 border-b border-accent-500/20 flex-shrink-0">
              <p className="text-xs text-accent-400">
                Failed to send: {sendError}
              </p>
            </div>
          )}

         
          <div className="flex items-center justify-between px-4 py-3 bg-charcoal-900 border-b border-charcoal-700">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-teal-500/20 border border-teal-500/30 flex items-center justify-center">
                <span className="w-3 h-3 rounded-full bg-teal-400 animate-pulse" />
              </div>
              <div>
                <p className="text-sm font-semibold text-cream-100">
                  ElasticBot
                </p>
                <p className="text-xs text-teal-400">Online now</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {ticketId && (
                <button
                  onClick={handleEndChat}
                  className="text-xs text-charcoal-400 hover:text-accent-400 px-2 py-1 rounded hover:bg-charcoal-800 transition-colors"
                >
                  End chat
                </button>
              )}
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
          </div>

         
          {isHydrating ? (
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              <div className="flex flex-col gap-1.5 items-start">
                <div className="h-3 w-16 rounded bg-charcoal-700 animate-pulse" />
                <div className="h-10 w-44 rounded-2xl rounded-bl-md bg-charcoal-700 animate-pulse" />
              </div>
              <div className="flex flex-col gap-1.5 items-end">
                <div className="h-3 w-20 rounded bg-charcoal-700 animate-pulse" />
                <div className="h-14 w-52 rounded-2xl rounded-br-md bg-charcoal-700 animate-pulse" />
              </div>
              <div className="flex flex-col gap-1.5 items-start">
                <div className="h-3 w-16 rounded bg-charcoal-700 animate-pulse" />
                <div className="h-10 w-40 rounded-2xl rounded-bl-md bg-charcoal-700 animate-pulse" />
              </div>
            </div>
          ) : (
            <>
              <MessageList messages={messages} />
              {isSending && (
                <div className="px-4 py-1 flex-shrink-0">
                  <span className="text-xs text-charcoal-500">Sending…</span>
                </div>
              )}
            </>
          )}

          <Composer isSending={isSending} onSend={handleSend} />
        </div>
      )}
    </>
  );
}