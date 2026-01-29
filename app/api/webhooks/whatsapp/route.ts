// app/api/webhooks/whatsapp/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;

  const mode = sp.get("hub.mode");
  const token = sp.get("hub.verify_token");
  const challenge = sp.get("hub.challenge");

  console.log("VERIFY HIT", {
    mode,
    token,
    env: process.env.WHATSAPP_VERIFY_TOKEN,
  });

  if (
    mode === "subscribe" &&
    token === process.env.WHATSAPP_VERIFY_TOKEN &&
    challenge
  ) {
    return new NextResponse(challenge, {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  }

  return new NextResponse("Forbidden", { status: 403 });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  console.log("📩 WhatsApp webhook:", JSON.stringify(body, null, 2));
  return NextResponse.json({ ok: true });
}