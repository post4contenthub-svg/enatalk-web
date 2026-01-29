import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import DarkPage from "@/app/customer/app/components/DarkPage";
type CampaignRow = {
  id: string;
  name: string;
  status: string;
  scheduled_for: string | null;
  total_recipients: number | null;
  sent_count: number | null;
  template_id: string | null;
};

type TemplateRow = {
  id: string;
  name: string;
};

export default async function CampaignsPage() {
  const supabase = createSupabaseServerClient();

  const { data: campaigns, error: campaignsError } = await supabase
    .from("campaigns")
    .select(`
      id,
      name,
      status,
      scheduled_for,
      total_recipients,
      sent_count,
      template_id
    `)
    .order("created_at", { ascending: false });

  if (campaignsError) {
    return (
      <div className="p-6 text-red-400">
        <pre>{JSON.stringify(campaignsError, null, 2)}</pre>
      </div>
    );
  }

  const { data: templates } = await supabase
    .from("templates")
    .select("id, name");

  const templateMap = new Map<string, string>();
  templates?.forEach((t: TemplateRow) => {
    templateMap.set(t.id, t.name);
  });

  return (
    <div className="px-8 py-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-white">
            Campaigns
          </h1>

          <Link
            href="/customer/app/campaigns/new"
            className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
          >
            + New campaign
          </Link>
        </div>

        {/* Dark Table Card */}
        <div className="overflow-hidden rounded-xl border border-slate-700 bg-slate-900">
          <table className="w-full text-sm">
            <thead className="bg-slate-800 text-slate-300">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Name</th>
                <th className="px-4 py-3 text-left font-medium">Template</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-left font-medium">Scheduled</th>
                <th className="px-4 py-3 text-left font-medium">Recipients</th>
                <th className="px-4 py-3 text-left font-medium">Sent</th>
                <th className="px-4 py-3 text-left font-medium">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800">
              {campaigns?.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-6 text-center text-slate-400"
                  >
                    No campaigns yet
                  </td>
                </tr>
              )}

              {campaigns?.map((c: CampaignRow) => (
                <tr
                  key={c.id}
                  className="hover:bg-slate-800 transition"
                >
                  <td className="px-4 py-3 font-medium text-white">
                    {c.name}
                  </td>

                  <td className="px-4 py-3 text-slate-300">
                    {c.template_id
                      ? templateMap.get(c.template_id) ?? "—"
                      : "—"}
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium
                        ${
                          c.status === "completed"
                            ? "bg-green-900/40 text-green-400"
                            : c.status === "draft"
                            ? "bg-yellow-900/40 text-yellow-400"
                            : "bg-slate-700 text-slate-300"
                        }`}
                    >
                      {c.status}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-slate-400">
                    {c.scheduled_for
                      ? new Date(c.scheduled_for).toLocaleString("en-IN")
                      : "—"}
                  </td>

                  <td className="px-4 py-3 text-slate-200">
                    {c.total_recipients ?? 0}
                  </td>

                  <td className="px-4 py-3 text-slate-200">
                    {c.sent_count ?? 0}
                  </td>

                  <td className="px-4 py-3">
                    <Link
                      href={`/customer/app/campaigns/${c.id}`}
                      className="inline-flex rounded-md border border-slate-600 px-3 py-1 text-xs font-medium text-slate-200 hover:bg-slate-700"
                    >
                      View
                    </Link>
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