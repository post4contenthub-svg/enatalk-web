"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AddFieldModal({
  tenantId,
  onClose,
  onSuccess,
}: {
  tenantId: string;
  onClose: () => void;
  onSuccess?: () => void;
}) {
  const supabase = createClient();

  const [label, setLabel] = useState("");
  const [required, setRequired] = useState(false);
  const [showInTable, setShowInTable] = useState(true);
  const [loading, setLoading] = useState(false);

  function makeKey(label: string) {
    return label
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "");
  }

  async function handleSave() {
    if (!label.trim()) {
      alert("Label is required");
      return;
    }

    const key = makeKey(label);
    if (!key) {
      alert("Invalid label – cannot create a valid key");
      return;
    }

    try {
      setLoading(true);

      // Get current max sort_order for proper ordering
      const { data: maxData } = await supabase
        .from("tenant_contact_fields")
        .select("sort_order")
        .eq("tenant_id", tenantId)
        .order("sort_order", { ascending: false })
        .limit(1);

      const nextSortOrder =
        (maxData && maxData.length > 0 ? maxData[0].sort_order : 0) + 1;

      // Insert the new field
      const { error } = await supabase.from("tenant_contact_fields").insert({
        tenant_id: tenantId,
        key,
        label: label.trim(),
        required,
        show_in_table: showInTable,
        sort_order: nextSortOrder,
        type: "text", // can be extended later
      });

      if (error) {
        if (error.code === "23505") {
          // Unique violation (duplicate key)
          alert(`A field with key "${key}" already exists. Try a different label.`);
        } else {
          alert(error.message || "Failed to create field");
        }
        return;
      }

      // Success
      onSuccess?.(); // Refresh parent list
      onClose();
    } catch (err: any) {
      console.error(err);
      alert("Unexpected error while creating field");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Add New Field</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Label
            </label>
            <input
              type="text"
              className="w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-2.5 text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              placeholder="e.g. Bike Model, City, Policy Number"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              disabled={loading}
            />
            {label && (
              <p className="mt-2 text-xs text-slate-400">
                Key: <code className="rounded bg-slate-800 px-1.5 py-0.5">{makeKey(label)}</code>
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="required"
              checked={required}
              onChange={(e) => setRequired(e.target.checked)}
              disabled={loading}
              className="h-4 w-4 rounded border-slate-600 bg-slate-800 text-emerald-600 focus:ring-emerald-600"
            />
            <label htmlFor="required" className="text-sm text-slate-300">
              Required field
            </label>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="showInTable"
              checked={showInTable}
              onChange={(e) => setShowInTable(e.target.checked)}
              disabled={loading}
              className="h-4 w-4 rounded border-slate-600 bg-slate-800 text-emerald-600 focus:ring-emerald-600"
            />
            <label htmlFor="showInTable" className="text-sm text-slate-300">
              Show as column in Contacts table
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 rounded-lg border border-slate-600 px-4 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading || !label.trim()}
              className="flex-1 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60 transition-colors"
            >
              {loading ? "Saving…" : "Save Field"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}