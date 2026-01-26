import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { SendNowButton } from "../SendNowButton";
import { DeleteCampaignButton } from "./DeleteCampaignButton";

const DEMO_TENANT_ID = "5ddd6091-ba29-4b65-8684-f9da79f28af7";

type Campaign = {
  id: string;
  name: string;
  status: string;
  scheduled_for: string | null;
  created_at: string;
  total_recipients: number | null;
  sent_count: number | null;
};

export default async function CampaignDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // ✅ Next.js 16 requires awaiting params
  const { id: campaignId } = await params;

  if (!campaignId) {
    return (
      <div className="p-6 text-red-600">
        Campaign ID missing
      </div>
    );
  }

  const { data: campaign } = await supabaseAdmin
    .from("campaigns")
    .select(`
      id,
      name,
      status,
      scheduled_for,
      created_at,
      total_recipients,
      sent_count
    `)
    .eq("id", campaignId)
    .eq("tenant_id", DEMO_TENANT_ID)
    .single();

  if (!campaign) {
    return (
      <div className="p-6">
        <Link
          href="/customer/app/campaigns"
          className="text-emerald-600"
        >
          ← Back to campaigns
        </Link>

        <div className="mt-4 rounded-md bg-red-50 p-3 text-red-700">
          Campaign not found.
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <Link
        href="/customer/app/campaigns"
        className="text-emerald-600"
      >
        ← Back to campaigns
      </Link>

      <h1 className="text-xl font-semibold">
        {campaign.name}
      </h1>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          Status: <b>{campaign.status}</b>
        </div>
        <div>
          Created:{" "}
          {new Date(campaign.created_at).toLocaleString()}
        </div>
        <div>
          Scheduled for:{" "}
          {campaign.scheduled_for
            ? new Date(campaign.scheduled_for).toLocaleString()
            : "—"}
        </div>
        <div>
          Recipients: {campaign.total_recipients ?? 0}
        </div>
        <div>
          Sent: {campaign.sent_count ?? 0}
        </div>
      </div>

      <div className="flex gap-3">
        {/* IMPORTANT: use route param ID, NOT campaign.id */}
        <SendNowButton campaignId={campaignId} />
        <DeleteCampaignButton campaignId={campaignId} />
      </div>
    </div>
  );
}