import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

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
  const supabase = await createSupabaseServerClient();

  // 1️⃣ Fetch campaigns
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
      <div className="p-6 text-red-600">
        <pre>{JSON.stringify(campaignsError, null, 2)}</pre>
      </div>
    );
  }

  // 2️⃣ Fetch templates
  const { data: templates } = await supabase
    .from("templates")
    .select("id, name");

  // 3️⃣ Build lookup map
  const templateMap = new Map<string, string>();
  templates?.forEach((t: TemplateRow) => {
    templateMap.set(t.id, t.name);
  });

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Campaigns</h1>

        <Link
          href="/customer/app/campaigns/new"
          className="px-3 py-2 rounded bg-green-600 text-white text-sm"
        >
          + New campaign
        </Link>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Template</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Scheduled</th>
              <th className="p-2 text-left">Recipients</th>
              <th className="p-2 text-left">Sent</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {campaigns?.length === 0 && (
              <tr>
                <td colSpan={7} className="p-4 text-center text-gray-500">
                  No campaigns yet
                </td>
              </tr>
            )}

            {campaigns?.map((c: CampaignRow) => (
              <tr key={c.id} className="border-t">
                <td className="p-2 font-medium">{c.name}</td>

                <td className="p-2 text-gray-700">
                  {c.template_id
                    ? templateMap.get(c.template_id) ?? "—"
                    : "—"}
                </td>

                <td className="p-2">{c.status}</td>

                <td className="p-2">
                  {c.scheduled_for
                    ? new Date(c.scheduled_for).toLocaleString("en-IN")
                    : "—"}
                </td>

                <td className="p-2">{c.total_recipients ?? 0}</td>
                <td className="p-2">{c.sent_count ?? 0}</td>

                <td className="p-2">
                  <Link
                    href={`/customer/app/campaigns/${c.id}`}
                    className="px-2 py-1 border rounded text-xs"
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
  );
}
