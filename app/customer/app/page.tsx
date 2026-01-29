import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

/** TEMP — replace later with real tenant lookup */
const TENANT_ID = "5ddd6091-ba29-4b65-8684-f9da79f28af7";

export default async function OverviewPage() {
  // 📊 Total contacts
  const { count: totalContacts } = await supabaseAdmin
    .from("contacts")
    .select("*", { count: "exact", head: true })
    .eq("tenant_id", TENANT_ID);

  // 📈 Messages sent today
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const { count: messagesToday } = await supabaseAdmin
    .from("messages")
    .select("*", { count: "exact", head: true })
    .eq("tenant_id", TENANT_ID)
    .eq("direction", "outbound")
    .gte("created_at", start.toISOString());

  // ⚠️ Tenant / trial info
  const { data: tenant } = await supabaseAdmin
    .from("tenants")
    .select("name, plan_code, billing_status, trial_end_at")
    .eq("id", TENANT_ID)
    .single();

  const isTrial = tenant?.billing_status === "trialing";

  // 🔍 Recent contacts (search preview)
  const { data: contacts } = await supabaseAdmin
    .from("contacts")
    .select("id, name, phone")
    .eq("tenant_id", TENANT_ID)
    .order("created_at", { ascending: false })
    .limit(5);

  // 💬 Recent messages
  const { data: recentMessages } = await supabaseAdmin
    .from("messages")
    .select("id, to_number, body_text, status, created_at")
    .eq("tenant_id", TENANT_ID)
    .eq("direction", "outbound")
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <div className="space-y-6">
      {/* Trial banner */}
      {isTrial && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-300">
          ⏳ Trial active — ends on{" "}
          <b>
            {new Date(tenant?.trial_end_at!).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </b>
        </div>
      )}

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-slate-700 bg-slate-900 p-4">
          <p className="text-xs text-slate-400">Total contacts</p>
          <p className="mt-1 text-2xl font-semibold text-white">
            {totalContacts ?? 0}
          </p>
          <Link
            href="/customer/app/contacts"
            className="mt-2 inline-block text-xs text-emerald-400 hover:underline"
          >
            View contacts →
          </Link>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-900 p-4">
          <p className="text-xs text-slate-400">Messages sent today</p>
          <p className="mt-1 text-2xl font-semibold text-white">
            {messagesToday ?? 0}
          </p>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-900 p-4">
          <p className="text-xs text-slate-400">Current plan</p>
          <p className="mt-1 text-lg font-semibold text-white capitalize">
            {tenant?.plan_code ?? "free"}
          </p>
          <p className="text-xs text-slate-500">
            Workspace: {tenant?.name}
          </p>

          {tenant?.trial_end_at && (
            <p className="mt-1 text-xs text-amber-400">
              Expires on{" "}
              {new Date(tenant.trial_end_at).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </p>
          )}
        </div>
      </div>

      {/* Recent messages */}
      <div className="rounded-xl border border-slate-700 bg-slate-900 p-4">
        <h2 className="mb-3 text-sm font-semibold text-white">
          Recent messages
        </h2>

        <div className="overflow-hidden rounded-lg border border-slate-700">
          <table className="w-full text-sm">
            <thead className="bg-slate-800 text-slate-400">
              <tr>
                <th className="px-3 py-2 text-left">To</th>
                <th className="px-3 py-2 text-left">Message</th>
                <th className="px-3 py-2 text-left">Date & time</th>
                <th className="px-3 py-2 text-left">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800">
              {recentMessages?.map((m) => (
                <tr key={m.id} className="hover:bg-slate-800">
                  <td className="px-3 py-2 text-slate-200">
                    {m.to_number}
                  </td>

                  <td className="px-3 py-2 text-slate-300 max-w-xs truncate">
                    {m.body_text}
                  </td>

                  <td className="px-3 py-2 text-xs text-slate-400">
                    {new Date(m.created_at).toLocaleString("en-IN")}
                  </td>

                  <td className="px-3 py-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        m.status === "sent"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-amber-500/20 text-amber-400"
                      }`}
                    >
                      {m.status}
                    </span>
                  </td>
                </tr>
              ))}

              {!recentMessages?.length && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-3 py-6 text-center text-slate-500"
                  >
                    No messages sent yet
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