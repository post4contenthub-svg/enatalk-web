import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;

  const mode = sp.get("hub.mode");
  const token = sp.get("hub.verify_token");
  const challenge = sp.get("hub.challenge");

  console.log("DEBUG VERIFY:", {
    mode,
    token,
    ENV: process.env.WHATSAPP_VERIFY_TOKEN,
  });

  if (mode === "subscribe" && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return new NextResponse(challenge);
  }

  return new NextResponse("Forbidden", { status: 403 });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  console.log("📩 WhatsApp webhook:", JSON.stringify(body, null, 2));
  return NextResponse.json({ status: "ok" });
}