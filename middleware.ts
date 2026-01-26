import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ✅ IMPORTANT: Allow WhatsApp webhook (GET + POST)
  if (pathname.startsWith("/api/webhooks/whatsapp")) {
    return NextResponse.next();
  }

  // ✅ Allow all API routes
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // 🔐 Your existing admin auth logic below
  // (keep whatever you already had)

  return NextResponse.next();
}