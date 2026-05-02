// app/admin/users/page.tsx
import { createSupabaseServerClient } from "@/lib/supabase/server";

const S = {
  h1: { fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 26, letterSpacing: "-0.5px", color: "#fff", marginBottom: 6 },
  sub: { fontSize: 14, color: "rgba(255,255,255,0.45)", marginBottom: 28 },
  card: { background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, overflow: "hidden" },
  th: { padding: "12px 16px", fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.35)", textTransform: "uppercase" as const, letterSpacing: "0.08em", borderBottom: "1px solid rgba(255,255,255,0.06)", textAlign: "left" as const },
  td: { padding: "14px 16px", borderBottom: "1px solid rgba(255,255,255,0.04)", fontSize: 13, verticalAlign: "middle" as const },
};

export default async function UsersPage({ searchParams }: { searchParams: { plan?: string; page?: string } }) {
  const supabase = await createSupabaseServerClient();
  const page = parseInt(searchParams.page ?? "1");
  const limit = 20;
  const offset = (page - 1) * limit;

  // Get all users from auth.users via admin API
  const { data: { users: authUsers } } = await supabase.auth.admin.listUsers({ page, perPage: limit });

  // Get profiles and subscriptions separately
  const userIds = (authUsers ?? []).map(u => u.id);

  const [{ data: profiles }, { data: subscriptions }, { count }] = await Promise.all([
    supabase.from("user_profiles").select("*").in("user_id", userIds),
    supabase.from("user_subscriptions").select("*").in("user_id", userIds),
    supabase.from("user_profiles").select("*", { count: "exact", head: true }),
  ]);

  const totalPages = Math.ceil((authUsers?.length ?? 0) / limit);

  const planColor: Record<string, { bg: string; color: string }> = {
    trial:    { bg: "rgba(245,184,0,0.12)",  color: "#F5B800" },
    active:   { bg: "rgba(34,197,94,0.12)",  color: "#22C55E" },
    expired:  { bg: "rgba(239,68,68,0.12)",  color: "#f87171" },
    free:     { bg: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)" },
    trialing: { bg: "rgba(245,184,0,0.12)",  color: "#F5B800" },
  };

  const displayUsers = authUsers ?? [];

  return (
    <div>
      <h1 style={S.h1}>Users</h1>
      <p style={S.sub}>{displayUsers.length} users shown · Page {page}</p>

      {/* Filters */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        {["all","trial","active","expired","free"].map(f => (
          <a key={f} href={f === "all" ? "/admin/users" : `/admin/users?plan=${f}`} style={{ padding: "7px 16px", borderRadius: 100, fontSize: 13, fontWeight: 600, textDecoration: "none", background: (searchParams.plan ?? "all") === f ? "linear-gradient(135deg,#22C55E,#16A34A)" : "rgba(255,255,255,0.05)", color: (searchParams.plan ?? "all") === f ? "#fff" : "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.08)" }}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </a>
        ))}
      </div>

      <div style={S.card}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>{["Email","Business Type","Plan","Trial Ends","Joined","Actions"].map(h => <th key={h} style={S.th}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {displayUsers.map((u: any) => {
              const profile = profiles?.find(p => p.user_id === u.id);
              const sub = subscriptions?.find(s => s.user_id === u.id);
              const plan = sub?.subscription_status ?? "free";
              const pc = planColor[plan] ?? planColor.free;
              const trialEnd = sub?.trial_end ? new Date(sub.trial_end) : null;
              const expired = trialEnd && trialEnd < new Date();
              return (
                <tr key={u.id}>
                  <td style={S.td}>
                    <div style={{ fontWeight: 600, color: "#fff", marginBottom: 2 }}>{u.email}</div>
                    <code style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>{u.id?.slice(0,16)}…</code>
                  </td>
                  <td style={S.td}>
                    <span style={{ fontSize: 12, background: "rgba(59,139,235,0.12)", color: "#3B8BEB", padding: "3px 10px", borderRadius: 100, fontWeight: 600 }}>
                      {profile?.business_type ?? "—"}
                    </span>
                  </td>
                  <td style={S.td}>
                    <span style={{ fontSize: 11, background: pc.bg, color: pc.color, padding: "3px 10px", borderRadius: 100, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 5 }}>
                      <span style={{ width: 5, height: 5, borderRadius: "50%", background: pc.color }}/>
                      {plan}
                    </span>
                  </td>
                  <td style={{ ...S.td, color: expired ? "#f87171" : "rgba(255,255,255,0.45)", fontSize: 12 }}>
                    {trialEnd ? trialEnd.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                    {expired && <span style={{ marginLeft: 6, fontSize: 10, color: "#f87171" }}>expired</span>}
                  </td>
                  <td style={{ ...S.td, color: "rgba(255,255,255,0.45)", fontSize: 12 }}>
                    {new Date(u.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td style={S.td}>
                    <a href={`/admin/users/${u.id}`} style={{ fontSize: 12, color: "#22C55E", fontWeight: 600, textDecoration: "none", padding: "5px 12px", background: "rgba(34,197,94,0.1)", borderRadius: 8, border: "1px solid rgba(34,197,94,0.2)" }}>
                      View →
                    </a>
                  </td>
                </tr>
              );
            })}
            {!displayUsers.length && (
              <tr><td colSpan={6} style={{ ...S.td, textAlign: "center", color: "rgba(255,255,255,0.25)", padding: 40 }}>No users found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
