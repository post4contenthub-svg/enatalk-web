import { supabaseAdmin } from "@/lib/supabaseAdmin";

export default async function RecipientsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: campaignId } = await params;

  if (!campaignId) {
    return <div className="p-6 text-red-600">Campaign ID missing</div>;
  }

  const { data, error } = await supabaseAdmin
    .from("campaign_recipients")
    .select("name, phone, status")
    .eq("campaign_id", campaignId)
    .order("created_at");

  if (error) {
    return <pre>{error.message}</pre>;
  }

  if (!data || data.length === 0) {
    return <div className="p-6">No recipients</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Recipients</h1>
      <table className="w-full border">
        <thead>
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Phone</th>
            <th className="border p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((r, i) => (
            <tr key={i}>
              <td className="border p-2">{r.name}</td>
              <td className="border p-2">{r.phone}</td>
              <td className="border p-2">{r.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
