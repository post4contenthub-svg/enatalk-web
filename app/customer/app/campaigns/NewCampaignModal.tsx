"use client";

import { useEffect, useState } from "react";

type Template = {
  id: string;
  name: string;
  body_text: string;
};

export default function NewCampaignModal({ tenantId }: { tenantId: string }) {
  const [open, setOpen] = useState(false);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const [name, setName] = useState("");
  const [templateId, setTemplateId] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // Load templates when modal opens
  useEffect(() => {
    if (!open) return;

    async function loadTemplates() {
      try {
        setLoadingTemplates(true);
        const res = await fetch(
          `/api/customer/templates/list?tenantId=${encodeURIComponent(
            tenantId
          )}`
        );

        const text = await res.text();
        let json: any = null;
        try {
          json = JSON.parse(text);
        } catch {
          // ignore parse error
        }

        if (!res.ok) {
          const msg =
            (json && (json.error || json.message)) ||
            text ||
            `Failed with HTTP ${res.status}`;
          alert(`Failed to load templates: ${msg}`);
          return;
        }

        const tpls: Template[] = json?.templates ?? [];
        setTemplates(tpls);
        if (tpls.length && !templateId) {
          setTemplateId(tpls[0].id);
        }
      } catch (err: any) {
        alert(err?.message || "Unexpected error loading templates");
      } finally {
        setLoadingTemplates(false);
      }
    }

    loadTemplates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, tenantId]);

  async function handleSave() {
    if (!name.trim()) {
      alert("Campaign name is required");
      return;
    }
    if (!templateId) {
      alert("Please choose a template");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/customer/campaigns/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenantId,
          name: name.trim(),
          templateId,
          scheduledFor: null, // later we'll support scheduling
        }),
      });

      const text = await res.text();
      let json: any = null;
      try {
        json = JSON.parse(text);
      } catch {
        // ignore
      }

      if (!res.ok) {
        const msg =
          (json && (json.error || json.message)) ||
          text ||
          `Failed with HTTP ${res.status}`;
        alert(`Failed to create campaign: ${msg}`);
        return;
      }

      alert(
        `Campaign created ✅ (contacts queued: ${
          json?.contactsCount ?? "unknown"
        })`
      );
      setOpen(false);
      window.location.reload();
    } catch (err: any) {
      alert(err?.message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-medium text-white hover:bg-emerald-700"
      >
        + New campaign
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="w-full max-w-md rounded-xl bg-white p-4 shadow-lg">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold">New Campaign</h2>
              <button
                onClick={() => setOpen(false)}
                className="text-xs text-slate-500"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <input
                className="w-full rounded border px-2 py-1"
                placeholder="Campaign name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <div className="space-y-1">
                <div className="text-[11px] text-slate-600">
                  Template (required)
                </div>
                <select
                  className="w-full rounded border px-2 py-1"
                  value={templateId}
                  onChange={(e) => setTemplateId(e.target.value)}
                  disabled={loadingTemplates || !templates.length}
                >
                  {templates.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                  {!templates.length && (
                    <option value="">No templates found</option>
                  )}
                </select>
              </div>

              <div className="text-[11px] text-slate-500">
                Audience: currently all subscribed contacts in this workspace.
              </div>

              <button
                onClick={handleSave}
                disabled={loading || loadingTemplates || !templates.length}
                className="mt-2 w-full rounded bg-emerald-600 py-2 text-white disabled:opacity-60"
              >
                {loading ? "Creating..." : "Create Campaign"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
