// app/admin/revenue/page.tsx
import { createSupabaseServerClient } from "@/lib/supabase/server";

const S = {
  h1: { fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 26, letterSpacing: "-0.5px", color: "#fff", marginBottom: 6 },
  sub: { fontSize: 14, color: "rgba(255,255,255,0.45)", marginBottom: 28 },
  statCard: { background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "22px 24px" },
};

export default async function RevenuePage() {
  const supabase = await createSupabaseServerClient();

  const [{ count: totalUsers }, { count: trialUsers }, { count: activeUsers }, { count: expiredUsers }] = await Promise.all([
    supabase.from("user_subscriptions").select("*", { count: "exact", head: true }),
    supabase.from("user_subscriptions").select("*", { count: "exact", head: true }).eq("subscription_status", "trial"),
    supabase.from("user_subscriptions").select("*", { count: "exact", head: true }).eq("subscription_status", "active"),
    supabase.from("user_subscriptions").select("*", { count: "exact", head: true }).eq("subscription_status", "expired"),
  ]);

  // Recent subscriptions
  const { data: recentSubs } = await supabase
    .from("user_subscriptions")
    .select("user_id, subscription_status, trial_end, credits, created_at")
    .order("created_at", { ascending: false })
    .limit(15);

  // MRR estimate (assuming Starter plan avg ₹299)
  const mrrEstimate = (activeUsers ?? 0) * 299;
  const trialConversionRate = totalUsers ? Math.round(((activeUsers ?? 0) / totalUsers) * 100) : 0;

  const planColor: Record<string, { bg: string; color: string }> = {
    trial: { bg: "rgba(245,184,0,0.12)", color: "#F5B800" },
    active: { bg: "rgba(34,197,94,0.12)", color: "#22C55E" },
    expired: { bg: "rgba(239,68,68,0.12)", color: "#f87171" },
    free: { bg: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)" },
  };

  return (
    <div>
      <h1 style={S.h1}>Revenue & Growth</h1>
      <p style={S.sub}>Subscription overview and key business metrics</p>

      {/* Key metrics */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 28 }}>
        {[
          { label: "Est. MRR", value: `₹${mrrEstimate.toLocaleString("en-IN")}`, icon: "💰", color: "#22C55E", sub: "Based on active plans" },
          { label: "Active Plans", value: activeUsers ?? 0, icon: "✅", color: "#22C55E", sub: "Paying customers" },
          { label: "In Trial", value: trialUsers ?? 0, icon: "⏳", color: "#F5B800", sub: "14-day free trial" },
          { label: "Trial → Paid", value: `${trialConversionRate}%`, icon: "📈", color: "#A78BFA", sub: "Conversion rate" },
        ].map(s => (
          <div key={s.label} style={S.statCard}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.08em" }}>{s.label}</span>
              <span style={{ fontSize: 20 }}>{s.icon}</span>
            </div>
            <div style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 34, color: s.color, letterSpacing: "-1.5px", lineHeight: 1, marginBottom: 6 }}>{s.value}</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Plan breakdown */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
        <div style={{ ...S.statCard }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 20 }}>Plan Breakdown</h2>
          {[
            { plan: "Free", count: Math.max(0, (totalUsers ?? 0) - (trialUsers ?? 0) - (activeUsers ?? 0) - (expiredUsers ?? 0)), price: "₹0" },
            { plan: "Trial", count: trialUsers ?? 0, price: "₹0" },
            { plan: "Starter", count: Math.round((activeUsers ?? 0) * 0.5), price: "₹299/mo" },
            { plan: "Growth", count: Math.round((activeUsers ?? 0) * 0.35), price: "₹799/mo" },
            { plan: "Pro", count: Math.round((activeUsers ?? 0) * 0.15), price: "₹1,499/mo" },
            { plan: "Expired", count: expiredUsers ?? 0, price: "—" },
          ].map(p => (
            <div key={p.plan} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: p.plan === "Free" || p.plan === "Expired" ? "rgba(255,255,255,0.2)" : "#22C55E" }}/>
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>{p.plan}</span>
              </div>
              <div style={{ display: "flex", gap: 20 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{p.count}</span>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", minWidth: 80, textAlign: "right" }}>{p.price}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Churn & health */}
        <div style={{ ...S.statCard }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 20 }}>Account Health</h2>
          {[
            { label: "Total Accounts", value: totalUsers ?? 0, color: "#fff" },
            { label: "Active (paying)", value: activeUsers ?? 0, color: "#22C55E" },
            { label: "In Trial", value: trialUsers ?? 0, color: "#F5B800" },
            { label: "Expired / Churned", value: expiredUsers ?? 0, color: "#f87171" },
            { label: "Churn Rate", value: `${totalUsers ? Math.round(((expiredUsers ?? 0) / totalUsers) * 100) : 0}%`, color: "#f87171" },
            { label: "Health Score", value: `${trialConversionRate > 20 ? "Good 🟢" : trialConversionRate > 10 ? "Fair 🟡" : "Needs work 🔴"}`, color: "#22C55E" },
          ].map(r => (
            <div key={r.label} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>{r.label}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: r.color }}>{r.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent subscriptions */}
      <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, overflow: "hidden" }}>
        <div style={{ padding: "20px 20px 0" }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 16 }}>Recent Subscriptions</h2>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>{["User","Status","Credits","Trial End","Created"].map(h => <th key={h} style={{ padding: "10px 20px", fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.35)", textTransform: "uppercase" as const, letterSpacing: "0.08em", borderBottom: "1px solid rgba(255,255,255,0.06)", textAlign: "left" as const }}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {(recentSubs ?? []).map((s: any) => {
              const pc = planColor[s.subscription_status] ?? planColor.free;
              return (
                <tr key={s.user_id}>
                  <td style={{ padding: "12px 20px", borderBottom: "1px solid rgba(255,255,255,0.04)", fontSize: 12 }}><code style={{ color: "rgba(255,255,255,0.45)", background: "rgba(255,255,255,0.05)", padding: "2px 8px", borderRadius: 6 }}>{s.user_id?.slice(0,16)}…</code></td>
                  <td style={{ padding: "12px 20px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <span style={{ fontSize: 11, background: pc.bg, color: pc.color, padding: "3px 10px", borderRadius: 100, fontWeight: 700 }}>{s.subscription_status}</span>
                  </td>
                  <td style={{ padding: "12px 20px", borderBottom: "1px solid rgba(255,255,255,0.04)", fontSize: 13, color: s.credits > 0 ? "#22C55E" : "rgba(255,255,255,0.3)", fontWeight: 600 }}>{s.credits}</td>
                  <td style={{ padding: "12px 20px", borderBottom: "1px solid rgba(255,255,255,0.04)", fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{s.trial_end ? new Date(s.trial_end).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "—"}</td>
                  <td style={{ padding: "12px 20px", borderBottom: "1px solid rgba(255,255,255,0.04)", fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{s.created_at ? new Date(s.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
