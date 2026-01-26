"use client";

import { useEffect, useState } from "react";
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

const TENANT_ID = "5ddd6091-ba29-4b65-8684-f9da79f28af7";

export default function SettingsPage() {
  const [fields, setFields] = useState<FieldDef[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddField, setShowAddField] = useState(false);

  useEffect(() => {
    loadFields();
  }, []);

  async function loadFields() {
    setLoading(true);

    const res = await fetch(
      `/api/customer/fields/list?tenantId=${TENANT_ID}`
    );

    const json = await res.json();

    if (res.ok) {
      setFields(json.fields);
    } else {
      alert(json.error || "Failed to load fields");
    }

    setLoading(false);
  }

  async function toggleShow(id: string, show: boolean) {
    await fetch("/api/customer/fields/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, show_in_table: show }),
    });

    loadFields();
  }

  async function toggleRequired(id: string, required: boolean) {
    await fetch("/api/customer/fields/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, required }),
    });

    loadFields();
  }

  async function deleteField(id: string) {
    if (!confirm("Delete this field?")) return;

    await fetch("/api/customer/fields/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    loadFields();
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="mb-2 text-xl font-semibold">Settings</h1>

      {/* --------------------------- HEADER --------------------------- */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Lead fields</h2>

        <button
          onClick={() => setShowAddField(true)}
          className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-medium text-white hover:bg-emerald-700"
        >
          + Add field
        </button>
      </div>

      {/* --------------------------- FIELDS TABLE --------------------------- */}
      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <table className="min-w-full text-xs">
          <thead className="bg-slate-100 text-slate-600 uppercase">
            <tr>
              <th className="px-3 py-2 text-left">LABEL</th>
              <th className="px-3 py-2 text-left">KEY</th>
              <th className="px-3 py-2 text-left">REQUIRED</th>
              <th className="px-3 py-2 text-left">SHOW IN TABLE</th>
              <th className="px-3 py-2 text-left">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {!loading &&
              fields.map((f) => (
                <tr key={f.id}>
                  <td className="px-3 py-2">{f.label}</td>
                  <td className="px-3 py-2 text-slate-500">{f.key}</td>

                  {/* Required */}
                  <td className="px-3 py-2">
                    <input
                      type="checkbox"
                      checked={f.required}
                      onChange={(e) =>
                        toggleRequired(f.id, e.target.checked)
                      }
                    />
                  </td>

                  {/* Show In Table */}
                  <td className="px-3 py-2">
                    <input
                      type="checkbox"
                      checked={f.show_in_table}
                      onChange={(e) =>
                        toggleShow(f.id, e.target.checked)
                      }
                    />
                  </td>

                  {/* Actions */}
                  <td className="px-3 py-2">
                    {f.key !== "name" && f.key !== "phone" ? (
                      <button
                        onClick={() => deleteField(f.id)}
                        className="rounded border px-2 py-1 text-xs hover:bg-red-50"
                      >
                        Remove
                      </button>
                    ) : (
                      <span className="text-[10px] text-slate-400">
                        system
                      </span>
                    )}
                  </td>
                </tr>
              ))}

            {loading && (
              <tr>
                <td
                  colSpan={5}
                  className="px-3 py-4 text-center text-slate-400"
                >
                  Loading...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --------------------------- HELP BOX --------------------------- */}
      <div className="rounded-xl border bg-white p-4 text-xs text-slate-600">
        <h3 className="mb-2 text-sm font-semibold">How lead fields work</h3>
        <p>1. You can add extra fields like City, Car Model, Policy No, etc.</p>
        <p>2. These fields appear on the Contacts page.</p>
        <p>3. Later, they can be used in templates and campaigns.</p>
      </div>

      {/* --------------------------- MODAL --------------------------- */}
      {showAddField && (
        <AddFieldModal
          tenantId={TENANT_ID}
          onClose={() => setShowAddField(false)}
        />
      )}
    </div>
  );
}
