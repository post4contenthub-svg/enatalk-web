"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Template = {
  id: string;
  name: string;
};

const TENANT_ID = "5ddd6091-ba29-4b65-8684-f9da79f28af7";

export default function NewCampaignPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [templateId, setTemplateId] = useState("");
  const [sendMode, setSendMode] = useState<"draft" | "schedule">("draft");
  const [scheduleAt, setScheduleAt] = useState("");

  const [templates, setTemplates] = useState<Template[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🔹 Load templates
  useEffect(() => {
    async function loadTemplates() {
      try {
        const res = await fetch(
          `/api/customer/templates/list?tenantId=${TENANT_ID}`,
          { cache: "no-store" }
        );

        const data = await res.json();
        setTemplates(Array.isArray(data.templates) ? data.templates : []);
      } catch (err) {
        console.error("LOAD TEMPLATE ERROR", err);
        setTemplates([]);
      } finally {
        setLoadingTemplates(false);
      }
    }

    loadTemplates();
  }, []);

  // 🔹 Create campaign
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !templateId) {
      setError("Missing required fields");
      return;
    }

    const payload = {
      tenant_id: TENANT_ID,
      name: name.trim(),
      template_id: templateId,
      scheduled_for: sendMode === "schedule" ? scheduleAt : null,
    };

    // 🔍 DEBUG — DO NOT REMOVE
    console.log("CREATE CAMPAIGN BODY", payload);

    try {
      setSaving(true);

      const res = await fetch("/api/customer/campaigns/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      console.log("CREATE CAMPAIGN STATUS", res.status);
      console.log("CREATE CAMPAIGN RESPONSE", data);

      if (!res.ok) {
        throw new Error(
          data?.error || `Create failed with status ${res.status}`
        );
      }

      // ✅ success
      router.push("/customer/app/campaigns");
    } catch (err: any) {
      console.error("CREATE CAMPAIGN FAILED", err);
      setError(err.message || "Failed to create campaign");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <button
        onClick={() => router.push("/customer/app/campaigns")}
        className="text-xs text-slate-500 hover:text-slate-700"
      >
        ← Back to campaigns
      </button>

      <h1 className="text-xl font-semibold">New Campaign</h1>

      {error && (
        <div className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded border bg-white p-4"
      >
        {/* Campaign Name */}
        <div>
          <label className="text-xs font-medium">Campaign name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded border px-3 py-2 text-sm"
          />
        </div>

        {/* Template */}
        <div>
          <label className="text-xs font-medium">Template</label>
          {loadingTemplates ? (
            <p className="text-xs text-slate-500">Loading…</p>
          ) : (
            <select
              value={templateId}
              onChange={(e) => setTemplateId(e.target.value)}
              className="w-full rounded border px-3 py-2 text-sm"
            >
              <option value="">Select template</option>
              {templates.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Send mode */}
        <div className="flex gap-4 text-sm">
          <label>
            <input
              type="radio"
              checked={sendMode === "draft"}
              onChange={() => setSendMode("draft")}
            />{" "}
            Save as draft
          </label>
          <label>
            <input
              type="radio"
              checked={sendMode === "schedule"}
              onChange={() => setSendMode("schedule")}
            />{" "}
            Schedule
          </label>
        </div>

        {/* Schedule time */}
        {sendMode === "schedule" && (
          <input
            type="datetime-local"
            value={scheduleAt}
            onChange={(e) => setScheduleAt(e.target.value)}
            className="w-full rounded border px-3 py-2 text-sm"
          />
        )}

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => router.push("/customer/app/campaigns")}
            className="rounded border px-4 py-2 text-sm"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="rounded bg-emerald-600 px-4 py-2 text-sm text-white"
          >
            {saving ? "Saving…" : "Save campaign"}
          </button>
        </div>
      </form>
    </div>
  );
}
