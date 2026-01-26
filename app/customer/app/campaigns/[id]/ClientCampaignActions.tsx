"use client";

export function ClientCampaignActions({
  campaignId,
  tenantId,
}: {
  campaignId: string;
  tenantId: string;
}) {
  async function handleDelete() {
    if (!window.confirm("Delete this campaign? This cannot be undone.")) {
      return;
    }

    try {
      const res = await fetch(
        `/api/customer/campaigns/${campaignId}/delete`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tenantId }),
        }
      );

      const json = await res.json();

      if (!res.ok) {
        alert(json.error || "Failed to delete campaign");
        return;
      }

      alert("Campaign deleted ✅");
      window.location.href = "/customer/app/campaigns";
    } catch (err: any) {
      alert(err?.message || "Unexpected error");
    }
  }

  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={handleDelete}
        className="rounded-md border px-3 py-1 text-xs text-rose-700 hover:bg-rose-50"
      >
        Delete
      </button>
    </div>
  );
}