"use client";

import { useState } from "react";

export default function AddFieldModal({ tenantId }: { tenantId: string }) {
  const [open, setOpen] = useState(false);
  const [label, setLabel] = useState("");
  const [type, setType] = useState("text");
  const [showInTable, setShowInTable] = useState(true);
  const [loading, setLoading] = useState(false);

  function generateKey(label: string) {
    return label.trim().toLowerCase().replace(/\s+/g, "_");
  }

  async function handleSave() {
    if (!label.trim()) {
      alert("Label is required");
      return;
    }

    const key = generateKey(label);

    try {
      setLoading(true);

      const res = await fetch("/api/customer/fields/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenantId,
          label,
          key,
          type,
          show_in_table: showInTable,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        alert(json.error || "Failed to create field");
        return;
      }

      alert("Field created successfully!");
      setOpen(false);
      window.location.reload();
    } catch (err: any) {
      alert(err?.message || "Unknown error");
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
        + Add Field
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="w-full max-w-md rounded-xl bg-white p-4 shadow-lg">
            <div className="flex justify-between mb-2">
              <h2 className="text-sm font-semibold">Add Custom Field</h2>
              <button onClick={() => setOpen(false)}>✕</button>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <label className="text-xs text-slate-700">Label</label>
                <input
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  className="w-full rounded border px-2 py-1"
                  placeholder="Example: Car number"
                />
              </div>

              <div>
                <label className="text-xs text-slate-700">Field type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full rounded border px-2 py-1"
                >
                  <option value="text">Text</option>
                  <option value="number">Number</option>
                  <option value="date">Date</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showInTable}
                  onChange={(e) => setShowInTable(e.target.checked)}
                />
                <label>Show in table</label>
              </div>

              <button
                onClick={handleSave}
                disabled={loading}
                className="w-full rounded bg-emerald-600 py-2 text-white mt-2 disabled:opacity-60"
              >
                {loading ? "Saving…" : "Save Field"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
