import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith("/api/webhooks/whatsapp")) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/:path*",
};
