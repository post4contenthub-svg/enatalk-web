// app/api/admin/messages/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("messages")
      .select(
        "id, tenant_id, direction, to_number, from_number, body_text, status, created_at"
      )
      .order("created_at", { ascending: false })
      .limit(500); // last 500 messages

    if (error) {
      console.error("Failed to load messages:", error);
      return NextResponse.json(
        { error: "Failed to load messages" },
        { status: 500 }
      );
    }

    return NextResponse.json({ messages: data ?? [] });
  } catch (err) {
    console.error("Unexpected error in /api/admin/messages:", err);
    return NextResponse.json(
      { error: "Failed to load messages" },
      { status: 500 }
    );
  }
}
