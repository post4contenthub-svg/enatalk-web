"use client";

import { useState } from "react";

export function DeleteCampaignButton({
  campaignId,
}: {
  campaignId: string;
}) {
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm("Delete this campaign permanently?")) return;

    setLoading(true);

    const res = await fetch(
      `/api/customer/campaigns/${campaignId}/delete`,
      { method: "POST" }
    );

    // 🔥 only parse JSON for POST response
    const data = await res.json();

    setLoading(false);

    if (!res.ok) {
      alert(data.error || "Delete failed");
      return;
    }

    window.location.href = "/customer/app/campaigns";
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="rounded-md border border-red-300 bg-red-50 px-3 py-1 text-xs text-red-700 disabled:opacity-60"
    >
      {loading ? "Deleting..." : "Delete"}
    </button>
  );
}