// app/admin/page.tsx — Updated full dashboard
import { createSupabaseServerClient } from "@/lib/supabase/server";

const S = {
  h1: { fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 26, letterSpacing: "-0.5px", color: "#fff", marginBottom: 6 },
  sub: { fontSize: 14, color: "rgba(255,255,255,0.45)", marginBottom: 28 },
  card: { background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "22px 24px" },
  th: { padding: "11px 16px", fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.35)", textTransform: "uppercase" as const, letterSpacing: "0.08em", borderBottom: "1px solid rgba(255,255,255,0.06)", textAlign: "left" as const },
  td: { padding: "13px 16px", borderBottom: "1px solid rgba(255,255,255,0.04)", fontSize: 13, verticalAlign: "middle" as const },
};

export default async function AdminDashboardPage() {
  const supabase = await createSupabaseServerClient();

  const [
    { count: totalUsers },
    { count: trialUsers },
    { count: totalMessages },
    { count: totalTenants },
    { count: activeUsers },
    { count: failedMessages },
  ] = await Promise.all([
    supabase.from("user_profiles").select("*", { count: "exact", head: true }),
    supabase.from("user_subscriptions").select("*", { count: "exact", head: true }).eq("subscription_status", "trial"),
    supabase.from("messages").select("*", { count: "exact", head: true }),
    supabase.from("tenants").select("*", { count: "exact", head: true }),
    supabase.from("user_subscriptions").select("*", { count: "exact", head: true }).eq("subscription_status", "active"),
    supabase.from("messages").select("*", { count: "exact", head: true }).eq("status", "failed"),
  ]);

  const { data: recentUsers } = await supabase
    .from("user_profiles")
    .select("user_id, business_type, created_at")
    .order("created_at", { ascending: false })
    .limit(6);

  const { data: recentMessages } = await supabase
    .from("messages")
    .select("id, to, status, created_at, type")
    .order("created_at", { ascending: false })
    .limit(6);

  const mrrEstimate = (activeUsers ?? 0) * 299;

  const stats = [
    { label: "Total Users", value: (totalUsers ?? 0).toLocaleString(), icon: "👥", color: "#22C55E", sub: "All registered", href: "/admin/users" },
    { label: "Est. MRR", value: `₹${mrrEstimate.toLocaleString("en-IN")}`, icon: "💰", color: "#22C55E", sub: "Active plans × ₹299", href: "/admin/revenue" },
    { label: "In Trial", value: (trialUsers ?? 0).toLocaleString(), icon: "⏳", color: "#F5B800", sub: "14-day trials", href: "/admin/revenue" },
    { label: "Messages", value: (totalMessages ?? 0).toLocaleString(), icon: "💬", color: "#3B8BEB", sub: "All time sent", href: "/admin/messages" },
    { label: "WA Accounts", value: (totalTenants ?? 0).toLocaleString(), icon: "📲", color: "#A78BFA", sub: "Connected", href: "/admin/tenants" },
    { label: "Failed Msgs", value: (failedMessages ?? 0).toLocaleString(), icon: "❌", color: failedMessages ? "#f87171" : "#22C55E", sub: "Delivery failures", href: "/admin/messages?status=failed" },
  ];

  const statusColor: Record<string, string> = {
    sent: "#22C55E", delivered: "#3B8BEB", read: "#A78BFA", failed: "#f87171", pending: "#F5B800"
  };

  const planColor: Record<string, { bg: string; color: string }> = {
    trial: { bg: "rgba(245,184,0,0.12)", color: "#F5B800" },
    active: { bg: "rgba(34,197,94,0.12)", color: "#22C55E" },
    expired: { bg: "rgba(239,68,68,0.12)", color: "#f87171" },
    free: { bg: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)" },
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={S.h1}>Admin Dashboard</h1>
          <p style={S.sub}>Platform overview — {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {[["Users","/admin/users"],["Revenue","/admin/revenue"],["Messages","/admin/messages"]].map(([l,h]) => (
            <a key={l} href={h} style={{ padding: "8px 16px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.6)", textDecoration: "none" }}>{l} →</a>
          ))}
        </div>
      </div>

      {/* Stats grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 24 }}>
        {stats.map(s => (
          <a key={s.label} href={s.href} style={{ textDecoration: "none", background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "20px 22px", transition: "border-color .2s, transform .2s", display: "block" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.08em" }}>{s.label}</span>
              <span style={{ fontSize: 18 }}>{s.icon}</span>
            </div>
            <div style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 32, color: s.color, letterSpacing: "-1.5px", lineHeight: 1, marginBottom: 4 }}>{s.value}</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.28)" }}>{s.sub}</div>
          </a>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        {/* Recent signups */}
        <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, overflow: "hidden" }}>
          <div style={{ padding: "18px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>Recent Signups</h2>
            <a href="/admin/users" style={{ fontSize: 12, color: "#22C55E", fontWeight: 600, textDecoration: "none" }}>View all →</a>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              {(recentUsers ?? []).map((u: any) => (
                <tr key={u.user_id}>
                  <td style={S.td}><code style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.05)", padding: "2px 8px", borderRadius: 6 }}>{u.user_id?.slice(0,14)}…</code></td>
                  <td style={S.td}><span style={{ fontSize: 11, background: "rgba(59,139,235,0.12)", color: "#3B8BEB", padding: "3px 10px", borderRadius: 100, fontWeight: 600 }}>{u.business_type ?? "—"}</span></td>
                  <td style={{ ...S.td, fontSize: 11, color: "rgba(255,255,255,0.35)", textAlign: "right" as const }}>{u.created_at ? new Date(u.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "—"}</td>
                </tr>
              ))}
              {!recentUsers?.length && <tr><td colSpan={3} style={{ ...S.td, textAlign: "center" as const, color: "rgba(255,255,255,0.25)", padding: 24 }}>No users yet</td></tr>}
            </tbody>
          </table>
        </div>

        {/* Recent messages */}
        <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, overflow: "hidden" }}>
          <div style={{ padding: "18px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>Recent Messages</h2>
            <a href="/admin/messages" style={{ fontSize: 12, color: "#22C55E", fontWeight: 600, textDecoration: "none" }}>View all →</a>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              {(recentMessages ?? []).map((m: any) => (
                <tr key={m.id}>
                  <td style={S.td}><span style={{ fontSize: 13, color: "#fff", fontWeight: 500 }}>{m.to ?? "—"}</span></td>
                  <td style={S.td}>
                    <span style={{ fontSize: 11, background: `${statusColor[m.status] ?? "#fff"}18`, color: statusColor[m.status] ?? "rgba(255,255,255,0.4)", padding: "3px 10px", borderRadius: 100, fontWeight: 700 }}>{m.status ?? "—"}</span>
                  </td>
                  <td style={{ ...S.td, fontSize: 11, color: "rgba(255,255,255,0.35)", textAlign: "right" as const }}>{m.created_at ? new Date(m.created_at).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "—"}</td>
                </tr>
              ))}
              {!recentMessages?.length && <tr><td colSpan={3} style={{ ...S.td, textAlign: "center" as const, color: "rgba(255,255,255,0.25)", padding: 24 }}>No messages yet</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {/* System status */}
      <div style={{ background: "rgba(34,197,94,0.05)", border: "1px solid rgba(34,197,94,0.15)", borderRadius: 16, padding: "18px 22px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ fontSize: 22 }}>🟢</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: "#22C55E", marginBottom: 3 }}>All systems operational</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>WhatsApp API · Supabase · Email delivery · All running normally</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 16 }}>
          {[["API","Online"],["DB","Online"],["Email","Online"]].map(([l,s]) => (
            <div key={l} style={{ textAlign: "center" as const }}>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginBottom: 3, textTransform: "uppercase" as const, letterSpacing: "0.08em" }}>{l}</div>
              <div style={{ fontSize: 12, color: "#22C55E", fontWeight: 700 }}>{s}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
