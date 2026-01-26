"use client";

import { useState } from "react";

export default function NewTemplateModal({ tenantId }: { tenantId: string }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("marketing");
  const [language, setLanguage] = useState("en");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSave() {
    if (!name.trim() || !body.trim()) {
      alert("Template name and body are required");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/customer/templates/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenantId,
          name: name.trim(),
          category: category.trim(),
          language: language.trim(),
          body_text: body.trim(),
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        alert(json.error || "Failed to create template");
        return;
      }

      alert("Template created ✅");
      setOpen(false);
      window.location.reload(); // refresh list
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
        + New template
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="w-full max-w-md rounded-xl bg-white p-4 shadow-lg">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold">New Template</h2>
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
                placeholder="Template name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <input
                className="w-full rounded border px-2 py-1"
                placeholder="Category (marketing, utility, etc)"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />

              <input
                className="w-full rounded border px-2 py-1"
                placeholder="Language (en)"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              />

              <textarea
                className="w-full rounded border px-2 py-1"
                rows={4}
                placeholder="Template body text"
                value={body}
                onChange={(e) => setBody(e.target.value)}
              />

              <button
                onClick={handleSave}
                disabled={loading}
                className="mt-2 w-full rounded bg-emerald-600 py-2 text-white disabled:opacity-60"
              >
                {loading ? "Saving..." : "Save Template"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
