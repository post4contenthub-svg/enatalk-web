// app/customer/app/contacts/ContactsClient.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ContactsSearchBar } from "./ContactsSearchBar";

type ContactRow = {
  id: string;
  name: string | null;
  phone: string;
  last_message_at: string | null;
  custom_fields: Record<string, any> | null;
};

type FieldDef = {
  key: string;
  label: string;
};

type Props = {
  tenantId: string;
  initialRows: ContactRow[];
  fieldDefs: FieldDef[];
  contactsError: boolean;
  fieldDefsError: boolean;
};

export default function ContactsClient({
  tenantId,
  initialRows,
  fieldDefs,
  contactsError,
  fieldDefsError,
}: Props) {
  const supabase = createClient();
  const router = useRouter();

  const [rows, setRows] = useState<ContactRow[]>(initialRows);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<ContactRow | null>(null);
  const [sendingId, setSendingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false); // Added loading state

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [customFields, setCustomFields] = useState<Record<string, any>>({});

  const panelOpen = editing !== null;

  if (contactsError || fieldDefsError) {
    return <div className="p-4 text-red-600">Failed to load contacts.</div>;
  }

  const filteredRows = rows.filter((c) =>
    `${c.name ?? ""} ${c.phone}`.toLowerCase().includes(search.toLowerCase())
  );

  /* ---------- CRUD ---------- */

  function openAdd() {
    setEditing({ id: "", name: "", phone: "", last_message_at: null, custom_fields: {} });
    setName("");
    setPhone("");
    setCustomFields({});
  }

  function openEdit(c: ContactRow) {
    setEditing(c);
    setName(c.name ?? "");
    setPhone(c.phone);
    setCustomFields(c.custom_fields ?? {});
  }

  function closePanel() {
    setEditing(null);
  }

  function updateCustomField(key: string, value: string) {
    setCustomFields((prev) => ({ ...prev, [key]: value }));
  }

  async function saveContact() {
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
      name,
      phone,
      custom_fields: customFields,
      tenant_id: currentTenantId,  // ← Fixes TENANT_REQUIRED
    };

    console.log('Saving contact with payload:', payload); // Debug log

    let data = null;
    let error = null;

    if (editing?.id) {
      // Update
      ({ data, error } = await supabase
        .from("contacts")
        .update(payload)
        .eq("id", editing.id)
        .eq("tenant_id", currentTenantId)
        .select()
        .single());
    } else {
      // Insert
      ({ data, error } = await supabase
        .from("contacts")
        .insert(payload)
        .select()
        .single());
    }

    if (error) {
      console.error('Supabase error:', error); // Debug log
      alert("Save failed: " + error.message);
    } else {
      setRows((prev) =>
        editing?.id
          ? prev.map((r) => (r.id === data.id ? data : r))
          : [data, ...prev]
      );
      closePanel();
    }

    setSaving(false);
  }

  /* ---------- WHATSAPP ---------- */

  async function sendWhatsApp(contactId: string) {
    setSendingId(contactId);
    try {
      const res = await fetch("/api/customer/whatsapp/send-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contact_id: contactId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      alert("WhatsApp message sent ✅");
    } catch {
      alert("Failed to send WhatsApp message");
    } finally {
      setSendingId(null);
    }
  }

  async function sendTestTemplate(contactId: string) {
    try {
      const res = await fetch("/api/customer/whatsapp/send-test-template", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contact_id: contactId }),
      });

      if (!res.ok) throw new Error();
      alert("Template sent. Ask user to reply ✅");
    } catch {
      alert("Failed to send test template");
    }
  }

  /* ---------- UI ---------- */

  return (
    <div className="relative">
      {/* Top bar */}
      <div className="flex justify-between items-center mb-4">
        <ContactsSearchBar onSearchChange={setSearch} />
        <button
          onClick={openAdd}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          + Add Contact
        </button>
      </div>

      {/* Contacts table */}
      <div className="border rounded bg-white overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-3 py-2 text-left">Name</th>
              <th className="px-3 py-2 text-left">Phone</th>
              {fieldDefs.map((f) => (
                <th key={f.key} className="px-3 py-2 text-left">
                  {f.label}
                </th>
              ))}
              <th className="px-3 py-2 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredRows.map((c) => {
              const conversationOpen =
                c.last_message_at &&
                Date.now() - new Date(c.last_message_at).getTime() <
                  24 * 60 * 60 * 1000;

              return (
                <tr key={c.id} className="border-b">
                  <td className="px-3 py-2">{c.name ?? "-"}</td>
                  <td className="px-3 py-2">{c.phone}</td>

                  {fieldDefs.map((f) => (
                    <td key={f.key} className="px-3 py-2">
                      {c.custom_fields?.[f.key] ?? "-"}
                    </td>
                  ))}

                  <td className="px-3 py-2 text-right space-x-2">
                    <button
                      onClick={() => openEdit(c)}
                      className="px-3 py-1 text-xs border rounded"
                    >
                      Edit
                    </button>

                    {conversationOpen ? (
                      <button
                        onClick={() => sendWhatsApp(c.id)}
                        disabled={sendingId === c.id}
                        className="px-3 py-1 text-xs font-semibold text-green-700 bg-green-50 border border-green-200 rounded disabled:opacity-50"
                      >
                        {sendingId === c.id ? "Sending…" : "Send WhatsApp"}
                      </button>
                    ) : (
                      <button
                        onClick={() => sendTestTemplate(c.id)}
                        className="px-3 py-1 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded"
                      >
                        Open Chat (Template)
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}

            {filteredRows.length === 0 && (
              <tr>
                <td
                  colSpan={3 + fieldDefs.length}
                  className="px-3 py-6 text-center text-gray-400"
                >
                  No contacts found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Slide-over panel */}
      {panelOpen && (
        <div className="fixed inset-0 bg-black/30 flex justify-end z-50">
          <div className="w-[420px] h-full bg-white p-4 space-y-4 shadow-lg">
            <div className="flex justify-between items-center font-semibold">
              {editing?.id ? "Edit Contact" : "New Contact"}
              <button onClick={closePanel} className="text-lg">
                ✕
              </button>
            </div>

            <input
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border px-3 py-2 rounded"
            />

            <input
              placeholder="Phone *"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border px-3 py-2 rounded"
            />

            {fieldDefs.map((f) => (
              <input
                key={f.key}
                placeholder={f.label}
                value={customFields[f.key] ?? ""}
                onChange={(e) =>
                  updateCustomField(f.key, e.target.value)
                }
                className="w-full border px-3 py-2 rounded"
              />
            ))}

            <button
              onClick={saveContact}
              disabled={saving}
              className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Contact"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}