// app/customer/app/contacts/EditContactModal.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type FieldDef = {
  key: string;
  label: string;
};

type Contact = {
  id: string;
  name: string | null;
  phone: string;
  tags: string[] | null;
  custom_fields: Record<string, any> | null;
};

export default function EditContactModal({
  contact,
  tenantId,
  fieldDefs,
  onClose,
}: {
  contact: Contact;
  tenantId: string;
  fieldDefs: FieldDef[];
  onClose: () => void;
}) {
  const supabase = createClient();
  const router = useRouter();

  const [phone, setPhone] = useState(contact.phone);
  const [name, setName] = useState(contact.name ?? "");
  const [tagsStr, setTagsStr] = useState((contact.tags || []).join(", "));
  const [customFields, setCustomFields] = useState<Record<string, any>>(
    contact.custom_fields || {}
  );
  const [saving, setSaving] = useState(false);

  function handleCustomChange(key: string, value: string) {
    setCustomFields((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  async function handleSave() {
    if (!phone.trim()) {
      alert("Phone is required");
      return;
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      alert("Error: You must be logged in to save contacts.");
      return;
    }

    const currentTenantId = user.id;

    const tags = tagsStr
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    setSaving(true);

    try {
      const payload = {
        phone: phone.trim(),
        name: name.trim() || null,
        tags,
        custom_fields: customFields,
      };

      const { error } = await supabase
        .from("contacts")
        .update(payload)
        .eq("id", contact.id)
        .eq("tenant_id", currentTenantId);

      if (error) {
        alert("Failed to update contact: " + error.message);
        console.error(error);
        return;
      }

      alert("Contact updated ✅");
      router.refresh();
      onClose();
    } catch (err: any) {
      alert(err?.message || "Unexpected error");
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="w-full max-w-md rounded-2xl bg-white p-4 text-xs shadow-lg">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-semibold">Edit contact</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            ✕
          </button>
        </div>

        <div className="space-y-3">
          {/* Phone */}
          <div>
            <label className="text-[11px] text-slate-700">Phone *</label>
            <input
              className="mt-1 w-full rounded border px-2 py-1"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          {/* Name */}
          <div>
            <label className="text-[11px] text-slate-700">Name</label>
            <input
              className="mt-1 w-full rounded border px-2 py-1"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Tags */}
          <div>
            <label className="text-[11px] text-slate-700">
              Tags (comma separated)
            </label>
            <input
              className="mt-1 w-full rounded border px-2 py-1"
              value={tagsStr}
              onChange={(e) => setTagsStr(e.target.value)}
            />
          </div>

          {/* Dynamic custom fields */}
          {fieldDefs.map((f) => (
            <div key={f.key}>
              <label className="text-[11px] text-slate-700">
                {f.label}
              </label>
              <input
                className="mt-1 w-full rounded border px-2 py-1"
                value={
                  customFields[f.key] != null
                    ? String(customFields[f.key])
                    : ""
                }
                onChange={(e) =>
                  handleCustomChange(f.key, e.target.value)
                }
              />
            </div>
          ))}

          <div className="mt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded border px-3 py-1 text-[11px] hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="rounded bg-emerald-600 px-3 py-1 text-[11px] font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}