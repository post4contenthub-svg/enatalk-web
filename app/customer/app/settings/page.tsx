"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import AddFieldModal from "./AddFieldModal";

type FieldDef = {
  id: string;
  key: string;
  label: string;
  required: boolean;
  show_in_table: boolean;
  sort_order: number;
  type?: string;
};

export default function SettingsPage() {
  const supabase = createClient();

  const [fields, setFields] = useState<FieldDef[]>([]);
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddField, setShowAddField] = useState(false);

  // Load current user → tenantId
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setTenantId(user.id);
      } else {
        // Redirect or handle unauth (optional)
        window.location.href = "/login";
      }
    };
    getUser();
  }, [supabase]);

  // Load fields when tenantId is available
  useEffect(() => {
    if (tenantId) {
      loadFields();
    }
  }, [tenantId]);

  async function loadFields() {
    if (!tenantId) return;

    setLoading(true);

    const { data, error } = await supabase
      .from("tenant_contact_fields")
      .select("*")
      .eq("tenant_id", tenantId)
      .order("sort_order", { ascending: true });

    if (error) {
      alert(error.message || "Failed to load fields");
      console.error(error);
    } else {
      setFields(data || []);
    }

    setLoading(false);
  }

  async function toggleShow(id: string, show: boolean) {
    const { error } = await supabase
      .from("tenant_contact_fields")
      .update({ show_in_table: show })
      .eq("id", id);

    if (!error) {
      loadFields();
    }
  }

  async function toggleRequired(id: string, required: boolean) {
    const { error } = await supabase
      .from("tenant_contact_fields")
      .update({ required })
      .eq("id", id);

    if (!error) {
      loadFields();
    }
  }

  async function deleteField(id: string) {
    if (!confirm("Are you sure you want to delete this field? This cannot be undone.")) return;

    const { error } = await supabase
      .from("tenant_contact_fields")
      .delete()
      .eq("id", id);

    if (!error) {
      loadFields();
    } else {
      alert("Failed to delete field");
    }
  }

  // Callback after successful add → refresh list
  const handleFieldAdded = () => {
    loadFields();
    setShowAddField(false);
  };

  if (!tenantId) {
    return <div className="p-8 text-white">Loading...</div>;
  }

  return (
    <div className="px-8 py-6">
      <div className="mx-auto max-w-5xl space-y-8">
        <h1 className="text-2xl font-semibold text-white">Settings</h1>

        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-medium text-white">Contact / Lead Fields</h2>
          <button
            onClick={() => setShowAddField(true)}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
          >
            + Add Field
          </button>
        </div>

        {/* Fields Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-700 bg-slate-900">
          <table className="w-full text-sm">
            <thead className="bg-slate-800 text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3 text-left">Label</th>
                <th className="px-4 py-3 text-left">Key</th>
                <th className="px-4 py-3 text-left">Required</th>
                <th className="px-4 py-3 text-left">Show in Table</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {loading && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                    Loading fields...
                  </td>
                </tr>
              )}

              {!loading && fields.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                    No custom fields yet. Add your first field to get started.
                  </td>
                </tr>
              )}

              {!loading &&
                fields.map((f) => (
                  <tr key={f.id} className="hover:bg-slate-800 transition-colors">
                    <td className="px-4 py-3 text-white font-medium">{f.label}</td>
                    <td className="px-4 py-3 text-slate-400">{f.key}</td>

                    {/* Required */}
                    <td className="px-4 py-3 text-center">
                      <input
                        type="checkbox"
                        checked={f.required}
                        onChange={(e) => toggleRequired(f.id, e.target.checked)}
                        className="h-4 w-4 rounded border-slate-600 bg-slate-700 text-emerald-600 focus:ring-emerald-600"
                      />
                    </td>

                    {/* Show in Table */}
                    <td className="px-4 py-3 text-center">
                      <input
                        type="checkbox"
                        checked={f.show_in_table}
                        onChange={(e) => toggleShow(f.id, e.target.checked)}
                        className="h-4 w-4 rounded border-slate-600 bg-slate-700 text-emerald-600 focus:ring-emerald-600"
                      />
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      {f.key !== "name" && f.key !== "phone" ? (
                        <button
                          onClick={() => deleteField(f.id)}
                          className="text-xs text-red-400 hover:text-red-300 transition-colors"
                        >
                          Remove
                        </button>
                      ) : (
                        <span className="text-xs text-slate-500">system</span>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Help Box */}
        <div className="rounded-xl border border-slate-700 bg-slate-900 p-6 text-sm text-slate-300">
          <h3 className="mb-3 text-base font-medium text-white">How contact fields work</h3>
          <ul className="list-disc space-y-2 pl-5">
            <li>You can add extra fields like City, Bike Model, Policy Number, etc.</li>
            <li>Toggle "Show in Table" to display the field as a column on the Contacts page.</li>
            <li>Mark fields as "Required" to enforce them when adding/editing contacts.</li>
            <li>These fields will also be available in message templates and campaigns later.</li>
          </ul>
        </div>

        {/* Add Field Modal */}
        {showAddField && tenantId && (
          <AddFieldModal
            tenantId={tenantId}
            onClose={() => setShowAddField(false)}
            onSuccess={handleFieldAdded}
          />
        )}
      </div>
    </div>
  );
}