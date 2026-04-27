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
  const [fieldType, setFieldType] = useState("text");
  const [useFor, setUseFor] = useState<string | null>(null);
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
      alert("Invalid label – cannot create key");
      return;
    }

    try {
      setLoading(true);

      // Check duplicate key
      const { data: existing } = await supabase
        .from("tenant_contact_fields")
        .select("id")
        .eq("tenant_id", tenantId)
        .eq("key", key)
        .limit(1);

      if (existing && existing.length > 0) {
        alert(`Field "${key}" already exists`);
        return;
      }

      // Prevent multiple same automation triggers
      if (useFor) {
        const { data: exists } = await supabase
          .from("tenant_contact_fields")
          .select("id")
          .eq("tenant_id", tenantId)
          .eq("use_for", useFor)
          .limit(1);

        if (exists && exists.length > 0) {
          alert(`Only one "${useFor}" field is allowed.`);
          return;
        }
      }

      // Sort order
      const { data: maxData } = await supabase
        .from("tenant_contact_fields")
        .select("sort_order")
        .eq("tenant_id", tenantId)
        .order("sort_order", { ascending: false })
        .limit(1);

      const nextSortOrder =
        (maxData && maxData.length > 0 ? maxData[0].sort_order : 0) + 1;

      const { error } = await supabase.from("tenant_contact_fields").insert({
        tenant_id: tenantId,
        key,
        label: label.trim(),
        type: fieldType,
        use_for: fieldType === "date" ? useFor : null,
        required,
        show_in_table: showInTable,
        sort_order: nextSortOrder,
      });

      if (error) {
        alert(error.message || "Failed to create field");
        return;
      }

      onSuccess?.();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Unexpected error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Add New Field</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            ✕
          </button>
        </div>

        <div className="space-y-5">
          {/* Label */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Label
            </label>
            <input
              type="text"
              className="w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-2.5 text-white"
              placeholder="e.g. DOB, Last Service Date"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              disabled={loading}
            />
            {label && (
              <p className="mt-2 text-xs text-slate-400">
                Key:{" "}
                <code className="rounded bg-slate-800 px-1.5 py-0.5">
                  {makeKey(label)}
                </code>
              </p>
            )}
          </div>

          {/* Field Type */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Field Type
            </label>
            <select
              value={fieldType}
              onChange={(e) => {
                setFieldType(e.target.value);
                if (e.target.value !== "date") setUseFor(null);
              }}
              className="w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-2.5 text-white"
            >
              <option value="text">Text</option>
              <option value="number">Number</option>
              <option value="date">Date</option>
              <option value="phone">Phone</option>
              <option value="email">Email</option>
            </select>
          </div>

          {/* Automation Trigger */}
          {fieldType === "date" && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Use this field for
              </label>

              <select
                value={useFor ?? ""}
                onChange={(e) => setUseFor(e.target.value || null)}
                className="w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-2.5 text-white"
              >
                <option value="">None</option>

                <optgroup label="Free automations">
                  <option value="birthday">🎂 Birthday</option>
                  <option value="anniversary">🎉 Anniversary</option>
                  <option value="service">🔧 Last Service</option>
                  <option value="purchase">🛒 Purchase Date</option>
                  <option value="delivery">📦 Delivery Date</option>
                </optgroup>

                <optgroup label="Pro (Advanced)">
                  <option value="custom" disabled>
                    ⏰ Custom Reminder (Pro)
                  </option>
                </optgroup>
              </select>

              <p className="mt-2 text-xs text-slate-400">
                Used to trigger automatic messages and reminders.
              </p>
            </div>
          )}

          {/* Required */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={required}
              onChange={(e) => setRequired(e.target.checked)}
              className="h-4 w-4 text-emerald-600"
            />
            <label className="text-sm text-slate-300">Required field</label>
          </div>

          {/* Show in table */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={showInTable}
              onChange={(e) => setShowInTable(e.target.checked)}
              className="h-4 w-4 text-emerald-600"
            />
            <label className="text-sm text-slate-300">
              Show in Contacts table
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 rounded-lg border border-slate-600 px-4 py-2.5 text-sm text-slate-300"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading || !label.trim()}
              className="flex-1 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm text-white hover:bg-emerald-700 disabled:opacity-60"
            >
              {loading ? "Saving…" : "Save Field"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
