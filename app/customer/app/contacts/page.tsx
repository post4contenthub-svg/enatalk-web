import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

import RowActions from "./RowActions";
import ImportCsvButton from "./ImportCsvButton";
import NewContactButton from "./NewContactButton";

export default async function ContactsPage() {
  // 🔥 MUST await (server client is async)
  const supabase = await createSupabaseServerClient();

  // 🔐 Protect page
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  // 🔹 Tenant ID (using logged-in user)
  const tenantId = session.user.id;

  // 🔹 EXTRA FIELD DEFINITIONS – these will vary per user/tenant in the future
  // TODO: Replace this hardcoded array with a DB fetch, e.g.:
  // const { data: settings } = await supabase.from('tenant_settings').select('contact_fields').eq('tenant_id', tenantId).single();
  // const extraFieldDefs = settings?.contact_fields ?? defaultExtraFieldDefs;
  const extraFieldDefs = [
    { key: "city", label: "City" },
    { key: "order_id", label: "Order ID" },
    { key: "bike_number", label: "Bike Number" },
    { key: "bike_make", label: "Bike Make" },
    { key: "bike_model", label: "Bike Model" },
    // Add more fields here (e.g. { key: "tags", label: "Tags" }) when needed
  ];

  // 🔹 Fetch contacts
  const { data: contacts, error } = await supabase
    .from("contacts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  // Calculate colspan for empty state
  const totalColumns = 2 + extraFieldDefs.length + 1; // Name + Phone + dynamic fields + Actions

  return (
    <div className="px-8 py-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-white">
            Contacts
          </h1>

          <div className="flex gap-2">
            <ImportCsvButton
              tenantId={tenantId}
              fieldDefs={extraFieldDefs}
            />
            <NewContactButton
              tenantId={tenantId}
              fieldDefs={extraFieldDefs}
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-700 bg-slate-900">
          <table className="w-full text-sm">
            <thead className="bg-slate-800 text-slate-300">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Phone</th>
                {extraFieldDefs.map((field) => (
                  <th key={field.key} className="px-4 py-3 text-left">
                    {field.label}
                  </th>
                ))}
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800">
              {contacts?.map((c) => (
                <tr key={c.id} className="hover:bg-slate-800">
                  <td className="px-4 py-3 text-white">
                    {c.name ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-slate-300">
                    {c.phone}
                  </td>
                  {extraFieldDefs.map((field) => (
                    <td key={field.key} className="px-4 py-3 text-slate-300">
                      {c[field.key] ?? "—"}
                    </td>
                  ))}
                  <td className="px-4 py-3">
                    <RowActions
                      contact={c}
                      tenantId={tenantId}
                      fieldDefs={extraFieldDefs}
                    />
                  </td>
                </tr>
              ))}

              {contacts?.length === 0 && (
                <tr>
                  <td
                    colSpan={totalColumns}
                    className="px-4 py-6 text-center text-slate-400"
                  >
                    No contacts found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}