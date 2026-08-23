import type { Route } from "./+types/api.messages";
import { supabaseApi } from "~/lib/supabase/api";
import { CreateMessageSchema } from "~/lib/db/schema";
import { requireAuth } from "~/lib/supabase/auth.server";

export async function action({ request }: Route.ActionArgs) {
  if (request.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  const form = await request.formData();

  const raw = {
    ticket_id: form.get("ticket_id"),
    sender: form.get("sender"),
    content: form.get("content"),
  };

  const parsed = CreateMessageSchema.safeParse(raw);
  if (!parsed.success) {
    return Response.json(
      { error: "Invalid input", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const { ticket_id, sender: clientSender, content } = parsed.data;

  // Determine which Supabase client to use
  let sender = clientSender;
  let supabase = supabaseApi; // public client for customers

  if (clientSender === "agent") {
    const auth = await requireAuth(request); // throws if not logged in
    sender = "agent";
    supabase = auth.supabase; // authenticated client for RLS
  }

  const { data: ticket, error: ticketError } = await supabase
    .from("tickets")
    .select("id, status")
    .eq("id", ticket_id)
    .single();

  if (ticketError || !ticket) {
    return Response.json({ error: "Ticket not found" }, { status: 404 });
  }

  const { error: msgError } = await supabase.from("messages").insert({
    ticket_id,
    sender,
    content,
  });

  if (msgError) {
    return Response.json({ error: "Failed to save message" }, { status: 500 });
  }

  if (sender === "agent") {
    const { error: updateError } = await supabase
      .from("tickets")
      .update({
        status: "open",
        updated_at: new Date().toISOString(),
      })
      .eq("id", ticket_id);

    if (updateError) {
      return Response.json(
        { error: "Message saved, but failed to update ticket status" },
        { status: 500 }
      );
    }
  }

  return Response.json({ ok: true });
}