import { createSupabaseServerClient } from "@/lib/supabase/server";
import NewTemplateButton from "./NewTemplateButton";
import TemplateActions from "./TemplateActions";

export default async function TemplatesPage() {
  const supabase = createSupabaseServerClient();

  // 🔹 Get tenantId (adjust only if your app uses a different source)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const tenantId = user?.user_metadata?.tenant_id;

  // 🔹 Fetch templates
  const { data: templates, error } = await supabase
    .from("templates")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="p-6 text-red-400">
        {error.message}
      </div>
    );
  }

  return (
    <div className="px-8 py-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-white">
            Templates
          </h1>

          {/* ✅ YOUR EXISTING MODAL BUTTON */}
          {tenantId && <NewTemplateButton tenantId={tenantId} />}
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-700 bg-slate-900">
          <table className="w-full text-sm">
            <thead className="bg-slate-800 text-slate-300">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Category</th>
                <th className="px-4 py-3 text-left">Message Body</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800">
              {templates?.map((t) => (
                <tr
                  key={t.id}
                  className="hover:bg-slate-800 align-top"
                >
                  <td className="px-4 py-3 font-medium text-white">
                    {t.name}
                  </td>

                  <td className="px-4 py-3 text-slate-300">
                    {t.category}
                  </td>

                  <td className="px-4 py-3 text-slate-400 whitespace-pre-wrap max-w-xl">
  {t.body_text}
</td>

                  <td className="px-4 py-3 text-slate-300">
                    {t.status}
                  </td>

                  {/* ✅ INLINE EDIT — NO ROUTING */}
                  <td className="px-4 py-3">
                    <TemplateActions
                      templateId={t.id}
                      initialBody={t.body}
                    />
                  </td>
                </tr>
              ))}

              {templates?.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-6 text-center text-slate-400"
                  >
                    No templates found
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