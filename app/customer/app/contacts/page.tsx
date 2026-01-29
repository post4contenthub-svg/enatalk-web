import { createSupabaseServerClient } from "@/lib/supabase/server";

import RowActions from "./RowActions";
import ImportCsvButton from "./ImportCsvButton";
import NewContactButton from "./NewContactButton";

export default async function ContactsPage() {
  const supabase = createSupabaseServerClient();

  // 🔹 Fetch contacts
  const { data: contacts, error } = await supabase
    .from("contacts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return <div className="p-6 text-red-400">{error.message}</div>;
  }

  // 🔹 Fetch tenant (adjust if you already have this elsewhere)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const tenantId = user?.id ?? "";

  // 🔹 Field definitions (custom fields used by edit/import)
  const fieldDefs = [
    { key: "city", label: "City" },
    { key: "order_id", label: "Order ID" },
    { key: "bike_number", label: "Bike Number" },
    { key: "bike_make", label: "Bike Make" },
    { key: "bike_model", label: "Bike Model" },
  ];

  return (
    <div className="px-8 py-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-white">Contacts</h1>

          <div className="flex gap-2">
            <ImportCsvButton tenantId={tenantId} fieldDefs={fieldDefs} />
            <NewContactButton tenantId={tenantId} fieldDefs={fieldDefs} />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-700 bg-slate-900">
          <table className="w-full text-sm">
            <thead className="bg-slate-800 text-slate-300">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Phone</th>
                <th className="px-4 py-3 text-left">City</th>
                <th className="px-4 py-3 text-left">Order ID</th>
                <th className="px-4 py-3 text-left">Bike Number</th>
                <th className="px-4 py-3 text-left">Bike Make</th>
                <th className="px-4 py-3 text-left">Bike Model</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800">
              {contacts?.map((c) => (
                <tr key={c.id} className="hover:bg-slate-800">
                  <td className="px-4 py-3 text-white">{c.name ?? "—"}</td>
                  <td className="px-4 py-3 text-slate-300">{c.phone}</td>
                  <td className="px-4 py-3 text-slate-300">{c.city ?? "—"}</td>
                  <td className="px-4 py-3 text-slate-300">{c.order_id ?? "—"}</td>
                  <td className="px-4 py-3 text-slate-300">
                    {c.bike_number ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-slate-300">
                    {c.bike_make ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-slate-300">
                    {c.bike_model ?? "—"}
                  </td>

                  <td className="px-4 py-3">
                    <RowActions
                      contact={c}
                      tenantId={tenantId}
                      fieldDefs={fieldDefs}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}