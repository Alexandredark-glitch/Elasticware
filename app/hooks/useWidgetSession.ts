import { useState, useEffect, useCallback } from "react";

const SESSION_KEY = "ew_session_demo";
const TICKET_KEY = "ew_ticket_demo";

export function useWidgetSession() {
  const [sessionId, setSessionId] = useState<string>("");
  const [ticketId, setTicketId] = useState<string | null>(null);

  useEffect(() => {
    let sid = localStorage.getItem(SESSION_KEY);
    if (!sid) {
      sid = crypto.randomUUID();
      localStorage.setItem(SESSION_KEY, sid);
    }
    setSessionId(sid);

    const tid = localStorage.getItem(TICKET_KEY); //null on first render.
    if (tid) setTicketId(tid);
  }, []);

  // useCallback for preventing the infinite loop.
  const saveTicketId = useCallback((id: string) => {
    localStorage.setItem(TICKET_KEY, id);
    setTicketId(id);
  }, []); // This runs when 

  const clearSession = useCallback(() => {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(TICKET_KEY);
  setSessionId(crypto.randomUUID());
  setTicketId(null);
}, []);

  return { sessionId, ticketId, saveTicketId, clearSession };
}