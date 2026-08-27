import { useState, useEffect, useCallback, useMemo } from "react";

export function useWidgetSession(orgKey: string) {
  const keys = useMemo(
    () => ({
      session: `ew_session_${orgKey}`,
      ticket: `ew_ticket_${orgKey}`,
    }),
    [orgKey]
  );

  const [sessionId, setSessionId] = useState<string>("");
  const [ticketId, setTicketId] = useState<string | null>(null);

  useEffect(() => {
    let sid = localStorage.getItem(keys.session);
    if (!sid) {
      sid = crypto.randomUUID();
      localStorage.setItem(keys.session, sid);
    }
    setSessionId(sid);

    const tid = localStorage.getItem(keys.ticket);
    if (tid) setTicketId(tid);
  }, [keys]);

  const saveTicketId = useCallback((id: string) => {
    localStorage.setItem(keys.ticket, id);
    setTicketId(id);
  }, [keys]);

  const clearSession = useCallback(() => {
    localStorage.removeItem(keys.session);
    localStorage.removeItem(keys.ticket);
    setSessionId(crypto.randomUUID());
    setTicketId(null);
  }, [keys]);

  return { sessionId, ticketId, saveTicketId, clearSession };
}