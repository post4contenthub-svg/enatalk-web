// app/admin/messages/page.tsx
import React from "react";
import { createClient } from "@supabase/supabase-js";
import MessagesClient, { Message } from "./MessagesClient";

export const dynamic = "force-dynamic"; // always fresh

async function loadMessages(): Promise<Message[]> {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabase
    .from("messages")
    .select(
      "id, tenant_id, direction, to_number, from_number, body_text, status, created_at"
    )
    .order("created_at", { ascending: false })
    .limit(500);

  if (error) {
    console.error("Failed to load messages from Supabase:", error);
    return [];
  }

  return (data ?? []) as Message[];
}

export default async function AdminMessagesPage() {
  const messages = await loadMessages();

  return <MessagesClient initialMessages={messages} />;
}
