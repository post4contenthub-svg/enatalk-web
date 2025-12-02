// app/api/admin/test/route.ts
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const serverSecret = process.env.ADMIN_SECRET;

  if (!serverSecret) {
    return new Response(
      JSON.stringify({ error: "Server misconfigured: ADMIN_SECRET missing" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const headerSecret =
    req.headers.get("x-admin-secret") ||
    (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");

  if (!headerSecret || headerSecret !== serverSecret) {
    return new Response(
      JSON.stringify({ error: "Unauthorized: bad or missing admin secret" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  return new Response(
    JSON.stringify({ ok: true, message: "Admin secret verified" }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}
