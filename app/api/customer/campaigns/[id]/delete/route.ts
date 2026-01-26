import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  // 🔥 Extract ID directly from URL
  // /api/customer/campaigns/{ID}/delete
  const url = new URL(req.url);
  const parts = url.pathname.split("/");
  const campaignId = parts[parts.length - 2]; // the {ID}

  console.log("API DELETE campaignId =", campaignId);

  if (!campaignId) {
    return Response.json(
      { error: "Campaign ID missing" },
      { status: 400 }
    );
  }

  const { error } = await supabaseAdmin
    .from("campaigns")
    .delete()
    .eq("id", campaignId);

  if (error) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return Response.json({ success: true });
}

// Optional: keep GET to avoid dev-mode noise
export async function GET() {
  return Response.json(
    { error: "Method not allowed" },
    { status: 405 }
  );
}