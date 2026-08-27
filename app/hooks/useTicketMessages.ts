import { useQuery } from "@tanstack/react-query";
import { supabase } from "~/lib/supabase/supabase.client";
import type { Database } from "~/lib/db/database.types";
import { useSupabaseRealtime } from "./useSupabaseRealtime";
import type { SupabaseClient } from "@supabase/supabase-js";

type MessageRow = Database["public"]["Tables"]["messages"]["Row"];

export function useTicketMessages(
  ticketId: string | null,
  client?: SupabaseClient<Database>
) {
  const sb = client ?? supabase;          
  const clientType = client ? "scoped" : "global";  

  const query = useQuery({
    queryKey: ["messages", ticketId, clientType], 
    queryFn: async (): Promise<MessageRow[]> => {
      if (!ticketId) return [];
      const { data, error } = await sb
        .from("messages")
        .select("*")
        .eq("ticket_id", ticketId)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
    enabled: Boolean(ticketId),  
    staleTime: 30_000,
    refetchOnWindowFocus: true,
  });

  useSupabaseRealtime({
    baseChannelName: `messages:ticket:${ticketId}`,
    table: "messages",
    event: "INSERT",
    filter: ticketId ? `ticket_id=eq.${ticketId}` : undefined,
    queryKey: ["messages", ticketId, clientType],
    enabled: Boolean(ticketId),
   
    client: sb, 
  });

  return query;
}