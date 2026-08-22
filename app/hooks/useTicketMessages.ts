import { useQuery } from "@tanstack/react-query";
import { supabase } from "~/lib/supabase/supabase.client";
import type { Database } from "~/lib/db/database.types";
import { useSupabaseRealtime } from "./useSupabaseRealtime";

type MessageRow = Database["public"]["Tables"]["messages"]["Row"];

export function useTicketMessages(ticketId: string | null) {
  const query = useQuery({
    queryKey: ["messages", ticketId],
    queryFn: async (): Promise<MessageRow[]> => {
      if (!ticketId) return []; // just in case of the enabled check

      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("ticket_id", ticketId)
        .order("created_at", { ascending: true }); 

      if (error) throw error;
      console.log("DATA from useTicketMessages", data);
      return data ?? [];
    },
    enabled: Boolean(ticketId), // If only ticketID is not null that this query will run.
    staleTime: 30_000,
    refetchOnWindowFocus: true,
  });


    useSupabaseRealtime({
    baseChannelName: `messages:ticket:${ticketId}`,
    table: "messages",
    event: "INSERT",
    filter: ticketId ? `ticket_id=eq.${ticketId}` : undefined, //Only listen to messages for this ticket
    queryKey: ["messages", ticketId],
    enabled: Boolean(ticketId), // !!ticketId,
    debug: true,
  }); // This makes our 

  return query;
}