// app/admin/users/page.tsx
import { createSupabaseServerClient } from "@/lib/supabase/server";

const S = {
  page: { background: "#040B1C", color: "#fff", fontFamily: "'DM Sans',sans-serif", minHeight: "100vh" },
  h1: { fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 26, letterSpacing: "-0.5px", color: "#fff", marginBottom: 6 },
  sub: { fontSize: 14, color: "rgba(255,255,255,0.45)", marginBottom: 28 },
  card: { background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, overflow: "hidden" },
  th: { padding: "12px 16px", fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.35)", textTransform: "uppercase" as const, letterSpacing: "0.08em", borderBottom: "1px solid rgba(255,255,255,0.06)", textAlign: "left" as const },
  td: { padding: "14px 16px", borderBottom: "1px solid rgba(255,255,255,0.04)", fontSize: 13, verticalAlign: "middle" as const },
};

export default async function UsersPage({ searchParams }: { searchParams: { q?: string; plan?: string; page?: string } }) {
  const supabase = await createSupabaseServerClient();
  const page = parseInt(searchParams.page ?? "1");
  const limit = 20;
  const offset = (page - 1) * limit;

  let query = supabase
    .from("user_profiles")
    .select(`user_id, business_type, created_at, user_subscriptions(subscription_status, trial_end, credits)`, { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (searchParams.plan) query = query.eq("user_subscriptions.subscription_status", searchParams.plan);

  const { data: users, count } = await query;
  const totalPages = Math.ceil((count ?? 0) / limit);

  const planColor: Record<string, { bg: string; color: string }> = {
    trial: { bg: "rgba(245,184,0,0.12)", color: "#F5B800" },
    active: { bg: "rgba(34,197,94,0.12)", color: "#22C55E" },
    expired: { bg: "rgba(239,68,68,0.12)", color: "#f87171" },
    free: { bg: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)" },
  };

  return (
    <div>
      <h1 style={S.h1}>Users</h1>
      <p style={S.sub}>{count ?? 0} total users registered on EnaTalk</p>

      {/* Filters */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        {["all","trial","active","expired","free"].map(f => (
          <a key={f} href={f === "all" ? "/admin/users" : `/admin/users?plan=${f}`} style={{ padding: "7px 16px", borderRadius: 100, fontSize: 13, fontWeight: 600, textDecoration: "none", background: (searchParams.plan ?? "all") === f ? "linear-gradient(135deg,#22C55E,#16A34A)" : "rgba(255,255,255,0.05)", color: (searchParams.plan ?? "all") === f ? "#fff" : "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.08)", transition: "all .2s" }}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </a>
        ))}
        <div style={{ marginLeft: "auto", fontSize: 13, color: "rgba(255,255,255,0.35)", display: "flex", alignItems: "center" }}>
          Page {page} of {totalPages}
        </div>
      </div>

      {/* Table */}
      <div style={S.card}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["User ID","Business Type","Plan","Credits","Trial Ends","Joined"].map(h => (
                <th key={h} style={S.th}>{h}</th>
              ))}
              <th style={{ ...S.th, textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {(users ?? []).map((u: any) => {
              const sub = Array.isArray(u.user_subscriptions) ? u.user_subscriptions[0] : u.user_subscriptions;
              const plan = sub?.subscription_status ?? "free";
              const pc = planColor[plan] ?? planColor.free;
              const trialEnd = sub?.trial_end ? new Date(sub.trial_end) : null;
              const expired = trialEnd && trialEnd < new Date();
              return (
                <tr key={u.user_id} style={{ transition: "background .15s" }} onMouseEnter={undefined} onMouseLeave={undefined}>
                  <td style={S.td}>
                    <code style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", background: "rgba(255,255,255,0.05)", padding: "3px 8px", borderRadius: 6 }}>
                      {u.user_id?.slice(0, 18)}…
                    </code>
                  </td>
                  <td style={S.td}>
                    <span style={{ fontSize: 12, background: "rgba(59,139,235,0.12)", color: "#3B8BEB", padding: "3px 10px", borderRadius: 100, fontWeight: 600 }}>
                      {u.business_type ?? "—"}
                    </span>
                  </td>
                  <td style={S.td}>
                    <span style={{ fontSize: 11, background: pc.bg, color: pc.color, padding: "3px 10px", borderRadius: 100, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 5 }}>
                      <span style={{ width: 5, height: 5, borderRadius: "50%", background: pc.color, flexShrink: 0 }}/>
                      {plan}
                    </span>
                  </td>
                  <td style={{ ...S.td, color: sub?.credits > 0 ? "#22C55E" : "rgba(255,255,255,0.3)", fontWeight: 600 }}>
                    {sub?.credits ?? 0}
                  </td>
                  <td style={{ ...S.td, color: expired ? "#f87171" : "rgba(255,255,255,0.45)", fontSize: 12 }}>
                    {trialEnd ? trialEnd.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                    {expired && <span style={{ marginLeft: 6, fontSize: 10, color: "#f87171" }}>expired</span>}
                  </td>
                  <td style={{ ...S.td, color: "rgba(255,255,255,0.45)", fontSize: 12 }}>
                    {u.created_at ? new Date(u.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                  </td>
                  <td style={{ ...S.td, textAlign: "right" }}>
                    <a href={`/admin/users/${u.user_id}`} style={{ fontSize: 12, color: "#22C55E", fontWeight: 600, textDecoration: "none", padding: "5px 12px", background: "rgba(34,197,94,0.1)", borderRadius: 8, border: "1px solid rgba(34,197,94,0.2)" }}>
                      View →
                    </a>
                  </td>
                </tr>
              );
            })}
            {!users?.length && (
              <tr><td colSpan={7} style={{ ...S.td, textAlign: "center", color: "rgba(255,255,255,0.25)", padding: 40 }}>No users found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 20 }}>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <a key={p} href={`/admin/users?page=${p}${searchParams.plan ? `&plan=${searchParams.plan}` : ""}`} style={{ width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: "none", background: p === page ? "linear-gradient(135deg,#22C55E,#16A34A)" : "rgba(255,255,255,0.05)", color: p === page ? "#fff" : "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.08)" }}>
              {p}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
