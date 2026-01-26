import { supabaseAdmin } from "@/lib/supabaseAdmin";
import NewTemplateModal from "./NewTemplateModal";
import TemplateActions from "./TemplateActions";
import TemplatesClient from "./TemplatesClient";

const TENANT_ID = "5ddd6091-ba29-4b65-8684-f9da79f28af7";

export default async function TemplatesPage() {
  const { data } = await supabaseAdmin
    .from("templates")
    .select("id, name, category, language, body_text, is_active, created_at")
    .eq("tenant_id", TENANT_ID)
    .order("created_at", { ascending: false });

  const rows = data ?? [];

  return (
    <div className="space-y-4" style={{ padding: "24px" }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Templates</h1>
          <p className="text-sm text-slate-500">
            View and manage your WhatsApp message templates.
          </p>
        </div>
        <TemplatesClient tenantId={TENANT_ID} />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
            <tr>
              <th className="px-4 py-3">NAME</th>
              <th className="px-4 py-3">CATEGORY</th>
              <th className="px-4 py-3">MESSAGE BODY</th>
              <th className="px-4 py-3 text-center">STATUS</th>
              <th className="px-4 py-3 text-right">ACTIONS</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {rows.map((tpl) => (
              <tr
                key={tpl.id}
                className="hover:bg-slate-50/50 transition-colors"
              >
                {/* Name */}
                <td className="px-4 py-4 font-medium text-slate-900">
                  {tpl.name}
                </td>

                {/* Category */}
                <td className="px-4 py-4 text-slate-600 capitalize">
                  {tpl.category}
                </td>

                {/* Message Body */}
                <td className="px-4 py-4 text-slate-500">
                  <div
                    className="max-w-xs truncate"
                    title={tpl.body_text}
                  >
                    {tpl.body_text}
                  </div>
                </td>

                {/* Status */}
                <td className="px-4 py-4 text-center">
                  <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-700 uppercase tracking-wider border border-emerald-100">
                    Active
                  </span>
                </td>

                {/* Actions */}
                <td className="px-4 py-4 text-right">
                  <TemplateActions
                    templateId={tpl.id}
                    initialBody={tpl.body_text}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {rows.length === 0 && (
          <div className="py-12 text-center text-slate-400">
            No templates found. Create your first one above!
          </div>
        )}
      </div>
    </div>
  );
}