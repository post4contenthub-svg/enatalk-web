// middleware.ts
import { NextRequest, NextResponse } from "next/server";

/**
 * IMPORTANT:
 * WhatsApp webhook MUST bypass all auth/middleware checks
 */
export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // ✅ Allow WhatsApp webhook without any checks
  if (pathname === "/api/webhooks/whatsapp") {
    return NextResponse.next();
  }

  // ---- everything else continues normally ----
  return NextResponse.next();
}

/**
 * Apply middleware to everything EXCEPT:
 * - api/webhooks/whatsapp
 */
export const config = {
  matcher: ["/((?!api/webhooks/whatsapp).*)"],
};