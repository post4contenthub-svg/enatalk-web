"use client";

import { SendNowButton } from "./SendNowButton";

export function ClientCampaignActions({
  campaignId,
}: {
  campaignId: string;
}) {
  async function deleteCampaign() {
    if (!confirm("Delete this campaign permanently?")) return;

    const res = await fetch(
      `/api/customer/campaigns/${campaignId}/delete`,
      { method: "POST" }
    );

    const json = await res.json();

    if (!res.ok) {
      alert(json.error || "Delete failed");
      return;
    }

    alert("Campaign deleted ✅");
    window.location.href = "/customer/app/campaigns";
  }

  return (
    <div className="flex gap-2">
      <SendNowButton campaignId={campaignId} />

      <button
        onClick={deleteCampaign}
        className="rounded-md border border-red-300 bg-red-50 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-100"
      >
        Delete
      </button>
    </div>
  );
}
