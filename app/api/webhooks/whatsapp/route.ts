import { NextRequest, NextResponse } from "next/server";

/**
 * WhatsApp Webhook
 * - GET  → Meta verification
 * - POST → Incoming messages
 */

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  // Must match Meta verify token
  if (mode === "subscribe" && token === "enatalk_verify_token") {
    return new NextResponse(challenge, { status: 200 });
  }

  return new NextResponse("Forbidden", { status: 403 });
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  console.log("📩 Incoming WhatsApp webhook:");
  console.log(JSON.stringify(body, null, 2));

  return NextResponse.json({ ok: true });
}