"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type FieldDef = {
  id: string;
  key: string;
  label: string;
  required: boolean;
  type: string;
};

export default function AddContactModal({
  tenantId,
  onClose,
  onSuccess,
}: {
  tenantId: string;
  onClose: () => void;
  onSuccess?: () => void;
}) {
  const supabase = createClient();

  const [fields, setFields] = useState<FieldDef[]>([]);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // Load fields on mount
  useEffect(() => {
    async function loadFields() {
      const { data } = await supabase
        .from("tenant_contact_fields")
        .select("*")
        .eq("tenant_id", tenantId)
        .order("sort_order", { ascending: true });

      if (data) {
        setFields(data);
        // Initialize formData with empty values for all fields
        const initialData: Record<string, string> = {};
        data.forEach((f) => {
          initialData[f.key] = "";
        });
        setFormData(initialData);
      }
    }
    loadFields();
  }, [tenantId]);

  function handleChange(key: string, value: string) {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    // Validate required fields
    for (const f of fields) {
      if (f.required && !formData[f.key]?.trim()) {
        alert(`${f.label} is required`);
        return;
      }
    }

    setLoading(true);

    // Separate system fields (name, phone) from custom
    const customData: Record<string, string> = {};
    Object.keys(formData).forEach((key) => {
      if (key !== "name" && key !== "phone") {
        customData[key] = formData[key];
      }
    });

    const { error } = await supabase.from("tenant_contacts").insert({
      tenant_id: tenantId,
      name: formData.name || "",
      phone: formData.phone || "",
      custom_data: customData,
    });

    if (error) {
      alert(error.message || "Failed to add contact");
      console.error(error);
    } else {
      onSuccess?.();
      onClose();
    }

    setLoading(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">New Contact</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white" aria-label="Close">
            ✕
          </button>
        </div>

        <div className="space-y-4">
          {fields.map((f) => (
            <div key={f.key}>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                {f.label} {f.required ? "*" : ""}
              </label>
              <input
                type={f.type}  // Use field type (e.g., 'text', later add 'date' for DOB)
                placeholder={`Enter ${f.label.toLowerCase()}`}
                className="w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-2.5 text-white"
                value={formData[f.key] || ""}
                onChange={(e) => handleChange(f.key, e.target.value)}
                disabled={loading}
              />
            </div>
          ))}
        </div>

        <div className="flex gap-3 pt-6">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 rounded-lg border border-slate-600 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex-1 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm text-white hover:bg-emerald-700 disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save Contact"}
          </button>
        </div>
      </div>
    </div>
  );
}