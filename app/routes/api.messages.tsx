import type { Route } from "./+types/api.messages";
import { supabaseApi } from "~/lib/supabase/api";
import { CreateMessageSchema } from "~/lib/db/schema";

export async function action({ request }: Route.ActionArgs) {
 // The response.json allow us to return status codes. 

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

  const { ticket_id, sender, content } = parsed.data;

  const { data: ticket, error: ticketError } = await supabaseApi //Just in case the ticket doesn't exist
    .from("tickets")
    .select("id, status")
    .eq("id", ticket_id)
    .single();

  console.log("ticket in api messages", ticket);  

  if (ticketError || !ticket) {
    return Response.json({ error: "Ticket not found" }, { status: 404 });
  }

  const { error: msgError } = await supabaseApi.from("messages").insert({
    ticket_id,
    sender,
    content,
  }); // important

  if (msgError) {
    return Response.json(
      { error: "Failed to save message" },
      { status: 500 }
    );
  }


  //This only runs if the sender is the agent (When I reply to a customer message)
  if (sender === "agent") {
    const { error: updateError } = await supabaseApi
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