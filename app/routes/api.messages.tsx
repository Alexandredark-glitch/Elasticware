import type { Route } from "./+types/api.messages";
import { supabaseApi } from "~/lib/supabase/api";
import { supabaseService } from "~/lib/supabase/service.server";
import { CreateMessageSchema } from "~/lib/db/schema";
import { requireAuth } from "~/lib/supabase/auth.server";
import { handleBotReply } from "~/lib/bot/engine.server";
import { corsResponse, corsPreflight } from "~/lib/cors";

export async function action({ request }: Route.ActionArgs) {
  if (request.method === "OPTIONS") return corsPreflight();
  if (request.method !== "POST") {
    return corsResponse({ error: "Method not allowed" }, 405);
  }

  const form = await request.formData();

  const raw = {
    ticket_id: form.get("ticket_id"),
    sender: form.get("sender"),
    content: form.get("content"),
  };

  const parsed = CreateMessageSchema.safeParse(raw);
  if (!parsed.success) {
    return corsResponse({ error: "Invalid input", issues: parsed.error.issues }, 400);
  }

  const { ticket_id, sender: clientSender, content } = parsed.data;

  let sender = clientSender;
  let writeClient = supabaseApi;

  if (clientSender === "agent") {
    try {
      const auth = await requireAuth(request);
      sender = "agent";
      writeClient = auth.supabase;
    } catch {
      return corsResponse({ error: "Unauthorized" }, 401);
    }
  }


  const { data: ticket, error: ticketError } = await supabaseService
    .from("tickets")
    .select("id, status, org_id")
    .eq("id", ticket_id)
    .single();

  if (ticketError || !ticket) {
    return corsResponse({ error: "Ticket not found" }, 404);
  }

  if (!ticket.org_id) {
    return corsResponse({ error: "Ticket has no organization" }, 500);
  }

  const { error: msgError } = await writeClient.from("messages").insert({
    ticket_id,
    sender,
    content,
  });

  if (msgError) {
    return corsResponse({ error: "Failed to save message" }, 500);
  }

  if (sender === "customer" && ticket.status === "bot_handling") {
    try {
      await handleBotReply({
        supabase: supabaseService,
        ticketId: ticket_id,
        orgId: ticket.org_id,
        customerMessage: content,
      });
    } catch (err) {
      console.error("Bot reply failed:", err);
    }
  }

  if (sender === "agent") {
    const { error: updateError } = await writeClient
      .from("tickets")
      .update({ status: "open", updated_at: new Date().toISOString() })
      .eq("id", ticket_id);

    if (updateError) {
      return corsResponse(
        { error: "Message saved, but failed to update ticket status" },
        500
      );
    }
  }

  return corsResponse({ ok: true });
}