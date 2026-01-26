"use client";

import { useState } from "react";

export default function AddFieldModal({
  tenantId,
  onClose,
}: {
  tenantId: string;
  onClose: () => void;
}) {
  const [label, setLabel] = useState("");
  const [required, setRequired] = useState(false);
  const [showInTable, setShowInTable] = useState(true);
  const [loading, setLoading] = useState(false);

  function makeKey(label: string) {
    return label.trim().toLowerCase().replace(/\s+/g, "_");
  }

  async function handleSave() {
    if (!label.trim()) {
      alert("Label is required");
      return;
    }

    const key = makeKey(label);

    try {
      setLoading(true);

      const res = await fetch("/api/customer/fields/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenantId,
          label,
          key,
          required,
          show_in_table: showInTable,
          type: "text", // simple for now
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        alert(json.error || "Failed to create field");
        return;
      }

      alert("Field created ✅");
      onClose();
      window.location.reload();
    } catch (err: any) {
      alert(err?.message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="w-full max-w-sm rounded-xl bg-white p-4 shadow-lg text-xs">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-semibold">Add new field</h2>
          <button onClick={onClose} className="text-slate-500">
            ✕
          </button>
        </div>

        <div className="space-y-2">
          <div>
            <label className="text-[11px] text-slate-700">Label</label>
            <input
              className="mt-1 w-full rounded border px-2 py-1"
              placeholder="e.g. Car number"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={required}
              onChange={(e) => setRequired(e.target.checked)}
            />
            <span>Required</span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showInTable}
              onChange={(e) => setShowInTable(e.target.checked)}
            />
            <span>Show in table</span>
          </div>

          <button
            onClick={handleSave}
            disabled={loading}
            className="mt-2 w-full rounded bg-emerald-600 py-2 text-white disabled:opacity-60"
          >
            {loading ? "Saving…" : "Save field"}
          </button>
        </div>
      </div>
    </div>
  );
}
