// app/customer/app/contacts/NewContactButton.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type FieldDef = {
  key: string;
  label: string;
};

type Props = {
  tenantId: string;
  fieldDefs: FieldDef[];
};

export default function NewContactButton({ tenantId, fieldDefs }: Props) {
  const supabase = createClient();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [customFields, setCustomFields] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState(false);

  function openModal() {
    setIsOpen(true);
    setName("");
    setPhone("");
    setCustomFields({});
  }

  function closeModal() {
    setIsOpen(false);
  }

  function updateCustomField(key: string, value: string) {
    setCustomFields((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    if (!phone.trim()) {
      alert("Phone is required");
      return;
    }

    setSaving(true);

    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      alert("Error: You must be logged in to save contacts.");
      setSaving(false);
      return;
    }

    const currentTenantId = user.id;

    const payload = {
      name: name.trim() || null,
      phone: phone.trim(),
      custom_fields: customFields,
      tenant_id: currentTenantId,
    };

    const { data, error } = await supabase
      .from("contacts")
      .insert(payload)
      .select()
      .single();

    if (error) {
      alert("Failed to create contact: " + error.message);
    } else {
      alert("Contact created ✓");
      router.refresh();
      closeModal();
    }

    setSaving(false);
  }

  return (
    <>
      <button
        onClick={openModal}
        className="px-4 py-2 bg-green-600 text-white rounded font-medium"
      >
        + New Contact
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-black">New Contact</h2>
              <button 
                onClick={closeModal}
                className="text-xl font-bold text-gray-600 hover:text-black"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-black">Name</label>
              <input
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 px-4 py-3 rounded-lg text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-black">Phone *</label>
              <input
                placeholder="Enter phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border border-gray-300 px-4 py-3 rounded-lg text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {fieldDefs.map((f) => (
              <div key={f.key}>
                <label className="block text-sm font-medium mb-1 text-black">{f.label}</label>
                <input
                  placeholder={`Enter ${f.label.toLowerCase()}`}
                  value={customFields[f.key] ?? ""}
                  onChange={(e) => updateCustomField(f.key, e.target.value)}
                  className="w-full border border-gray-300 px-4 py-3 rounded-lg text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}

            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Contact"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}