import { supabaseAdmin } from "@/lib/supabaseAdmin";
import AddFieldModal from "./AddFieldModal";
import FieldRowActions from "./FieldRowActions";

const TENANT_ID = "5ddd6091-ba29-4b65-8684-f9da79f28af7";

type FieldRow = {
  id: string;
  key: string;
  label: string;
  type: string;
  show_in_table: boolean;
  sort_order: number;
};

export default async function FieldsPage() {
  const { data, error } = await supabaseAdmin
    .from("contact_field_definitions")
    .select("*")
    .eq("tenant_id", TENANT_ID)
    .order("sort_order", { ascending: true });

  const fields: FieldRow[] = (data ?? []) as any;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">Contact Fields</h1>
          <p className="text-xs text-slate-500">
            Customize what information you store for each contact.
          </p>
        </div>

        <AddFieldModal tenantId={TENANT_ID} />
      </div>

      {error && (
        <div className="rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-700">
          Failed to load custom fields.
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        <table className="min-w-full text-left text-xs">
          <thead className="bg-slate-100 text-[11px] uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-3 py-2">Label</th>
              <th className="px-3 py-2">Key</th>
              <th className="px-3 py-2">Type</th>
              <th className="px-3 py-2">Show in table</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200 bg-white">
            {fields.map((field) => (
              <tr key={field.id}>
                <td className="px-3 py-2">{field.label}</td>
                <td className="px-3 py-2 text-slate-600">{field.key}</td>
                <td className="px-3 py-2 text-slate-600">{field.type}</td>
                <td className="px-3 py-2">
                  {field.show_in_table ? "Yes" : "No"}
                </td>
                <td className="px-3 py-2">
                  <FieldRowActions
                    fieldId={field.id}
                    tenantId={TENANT_ID}
                  />
                </td>
              </tr>
            ))}

            {!fields.length && !error && (
              <tr>
                <td
                  colSpan={5}
                  className="px-3 py-6 text-center text-xs text-slate-400"
                >
                  No custom fields added yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
