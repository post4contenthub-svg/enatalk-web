"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import AddContactModal from "./AddContactModal";
import Papa from "papaparse";

type FieldDef = {
  id: string;
  key: string;
  label: string;
  show_in_table: boolean;
  sort_order: number;
};

type Contact = {
  id: string;
  name: string;
  phone: string;
  custom_data: Record<string, any>;
  created_at: string;
};

export default function ContactsPage() {
  const supabase = createClient();

  const [fields, setFields] = useState<FieldDef[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showAddContact, setShowAddContact] = useState(false);

  // Load tenantId
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setTenantId(user.id);
      } else {
        window.location.href = "/auth/login";
      }
    };

    getUser();
  }, [supabase]);

  // Load fields and contacts
  useEffect(() => {
    if (tenantId) {
      loadFields();
      loadContacts();
    }
  }, [tenantId]);

  async function loadFields() {
    const { data, error } = await supabase
      .from("tenant_contact_fields")
      .select("*")
      .eq("tenant_id", tenantId)
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("Failed to load fields:", error);
      setErrorMessage("Failed to load contact fields.");
    } else {
      setFields((data || []).filter((f) => f.show_in_table));
    }
  }

  async function loadContacts() {
    setLoading(true);
    setErrorMessage(null);

    const { data, error } = await supabase
      .from("tenant_contacts")
      .select("*")
      .eq("tenant_id", tenantId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to load contacts:", error);
      setErrorMessage(
        "Failed to load contacts. Check if the table exists and RLS is set."
      );
    } else {
      setContacts(data || []);
    }

    setLoading(false);
  }

  const handleCSVImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0 && tenantId) {
      const file = e.target.files[0];

      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          const inserts = results.data
            .map((row: any) => {
              const customData = { ...row };
              delete customData.name;
              delete customData.phone;

              return {
                tenant_id: tenantId,
                name: row.name || "",
                phone: row.phone || "",
                custom_data: customData,
              };
            })
            .filter((row) => row.name && row.phone);

          if (inserts.length === 0) {
            alert("No valid contacts in CSV");
            return;
          }

          const { error } = await supabase
            .from("tenant_contacts")
            .insert(inserts);

          if (error) {
            alert("Import failed: " + error.message);
          } else {
            alert(`Imported ${inserts.length} contacts!`);
            loadContacts();
          }
        },
        error: (error) => {
          alert("CSV parse error: " + error.message);
        },
      });
    }
  };

  const handleContactAdded = () => {
    loadContacts();
    setShowAddContact(false);
  };

  // 🔥 DELETE CONTACT
  const handleDeleteContact = async (contactId: string) => {
    if (!tenantId) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this contact? This action cannot be undone."
    );

    if (!confirmDelete) return;

    const { error } = await supabase
      .from("tenant_contacts")
      .delete()
      .eq("id", contactId)
      .eq("tenant_id", tenantId);

    if (error) {
      alert("Failed to delete contact: " + error.message);
    } else {
      setContacts((prev) => prev.filter((c) => c.id !== contactId));
    }
  };

  if (!tenantId) {
    return <div className="p-8 text-white">Loading...</div>;
  }

  return (
    <div className="px-8 py-6">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-white">Contacts</h1>

          <div className="space-x-4">
            <input
              type="file"
              accept=".csv"
              onChange={handleCSVImport}
              id="csv-upload"
              className="hidden"
            />
            <label
              htmlFor="csv-upload"
              className="cursor-pointer rounded-lg bg-slate-700 px-4 py-2 text-sm text-white hover:bg-slate-600"
            >
              Import from CSV
            </label>

            <button
              onClick={() => setShowAddContact(true)}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm text-white hover:bg-emerald-700"
            >
              + New Contact
            </button>
          </div>
        </div>

        {errorMessage && <p className="text-red-500">{errorMessage}</p>}

        <div className="overflow-x-auto rounded-xl border border-slate-700 bg-slate-900">
          <table className="w-full text-sm">
            <thead className="bg-slate-800 text-slate-400 uppercase tracking-wider">
              <tr>
                {fields.map((f) => (
                  <th key={f.key} className="px-4 py-3 text-left">
                    {f.label}
                  </th>
                ))}
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800">
              {loading && (
                <tr>
                  <td
                    colSpan={fields.length + 1}
                    className="px-4 py-8 text-center text-slate-400"
                  >
                    Loading contacts...
                  </td>
                </tr>
              )}

              {!loading && contacts.length === 0 && (
                <tr>
                  <td
                    colSpan={fields.length + 1}
                    className="px-4 py-8 text-center text-slate-400"
                  >
                    No contacts yet. Add your first contact.
                  </td>
                </tr>
              )}

              {!loading &&
                contacts.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-800">
                    {fields.map((f) => (
                      <td key={f.key} className="px-4 py-3 text-white">
                        {f.key === "name"
                          ? c.name
                          : f.key === "phone"
                          ? c.phone
                          : c.custom_data[f.key] || "-"}
                      </td>
                    ))}
                    <td className="px-4 py-3 space-x-3">
                      <button className="text-xs text-blue-400 hover:text-blue-300">
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteContact(c.id)}
                        className="text-xs text-red-400 hover:text-red-300"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {showAddContact && tenantId && (
          <AddContactModal
            tenantId={tenantId}
            onClose={() => setShowAddContact(false)}
            onSuccess={handleContactAdded}
          />
        )}
      </div>
    </div>
  );
}
