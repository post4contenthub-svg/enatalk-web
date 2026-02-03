import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type CampaignRow = {
  id: string;
  name: string;
  created_at: string;
};

export default async function CampaignsPage() {
  // 🔥 IMPORTANT: server client is async → MUST await
  const supabase = await createSupabaseServerClient();

  // 🔐 Protect page
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  // 📊 Fetch campaigns
  const { data: campaigns, error } = await supabase
    .from("campaigns")
    .select("id, name, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Campaign fetch error:", error);
    throw new Error("Failed to load campaigns");
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">Campaigns</h1>

        <Link
          href="/customer/app/campaigns/new"
          className="rounded bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700"
        >
          New Campaign
        </Link>
      </div>

      {campaigns && campaigns.length > 0 ? (
        <ul className="space-y-3">
          {campaigns.map((campaign: CampaignRow) => (
            <li
              key={campaign.id}
              className="rounded border bg-white p-4 shadow-sm"
            >
              <div className="font-medium">{campaign.name}</div>
              <div className="text-xs text-gray-500">
                {new Date(campaign.created_at).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-sm text-gray-500">
          No campaigns found.
        </div>
      )}
    </div>
  );
}
