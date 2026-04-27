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

type Contact = {
  id: string;
  name: string;
  phone: string;
  custom_data: Record<string, any> | null;
};

function mapInputType(type: string) {
  switch (type) {
    case "number":
      return "number";
    case "date":
      return "date";
    case "email":
      return "email";
    case "phone":
      return "tel";
    default:
      return "text";
  }
}

export default function EditContactModal({
  tenantId,
  contact,
  onClose,
  onSuccess,
}: {
  tenantId: string;
  contact: Contact;
  onClose: () => void;
  onSuccess?: () => void;
}) {
  const supabase = createClient();

  const [fields, setFields] = useState<FieldDef[]>([]);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadFields() {
      const { data } = await supabase
        .from("tenant_contact_fields")
        .select("*")
        .eq("tenant_id", tenantId)
        .order("sort_order", { ascending: true });

      setFields(data || []);

      const initial: Record<string, string> = {
        name: contact.name || "",
        phone: contact.phone || "",
      };

      data?.forEach((f) => {
        if (f.key !== "name" && f.key !== "phone") {
          initial[f.key] = contact.custom_data?.[f.key] ?? "";
        }
      });

      setFormData(initial);
    }

    loadFields();
  }, [tenantId, contact, supabase]);

  function handleChange(key: string, value: string) {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    for (const f of fields) {
      if (f.required && !formData[f.key]?.trim()) {
        alert(`${f.label} is required`);
        return;
      }
    }

    setLoading(true);

    const customData: Record<string, any> = {};
    Object.keys(formData).forEach((key) => {
      if (key !== "name" && key !== "phone") {
        customData[key] = formData[key];
      }
    });

    const { error } = await supabase
      .from("tenant_contacts")
      .update({
        name: formData.name,
        phone: formData.phone,
        custom_data: customData,
      })
      .eq("id", contact.id)
      .eq("tenant_id", tenantId);

    if (error) {
      alert(error.message);
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
          <h2 className="text-lg font-semibold text-white">Edit Contact</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            ✕
          </button>
        </div>

        <div className="space-y-4">
          {fields.map((f) => (
            <div key={f.id}>
              <label className="block text-sm text-slate-300 mb-1">
                {f.label} {f.required && "*"}
              </label>
              <input
                type={mapInputType(f.type)}
                value={formData[f.key] || ""}
                onChange={(e) => handleChange(f.key, e.target.value)}
                disabled={loading}
                className="w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-2 text-white"
              />
            </div>
          ))}
        </div>

        <div className="flex gap-3 pt-6">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 rounded-lg border border-slate-600 px-4 py-2 text-slate-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex-1 rounded-lg bg-emerald-600 px-4 py-2 text-white"
          >
            {loading ? "Updating..." : "Update Contact"}
          </button>
        </div>
      </div>
    </div>
  );
}