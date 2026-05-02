// app/admin/tenants/page.tsx
import { createSupabaseServerClient } from "@/lib/supabase/server";

const S = {
  h1: { fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 26, letterSpacing: "-0.5px", color: "#fff", marginBottom: 6 },
  sub: { fontSize: 14, color: "rgba(255,255,255,0.45)", marginBottom: 28 },
  card: { background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, overflow: "hidden" },
  th: { padding: "12px 16px", fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.35)", textTransform: "uppercase" as const, letterSpacing: "0.08em", borderBottom: "1px solid rgba(255,255,255,0.06)", textAlign: "left" as const },
  td: { padding: "14px 16px", borderBottom: "1px solid rgba(255,255,255,0.04)", fontSize: 13, verticalAlign: "middle" as const },
};

export default async function TenantsPage() {
  const supabase = await createSupabaseServerClient();

  // Try wa_connections first (your actual table)
  const { data: connections, error: connErr } = await supabase
    .from("wa_connections")
    .select("*")
    .order("created_at", { ascending: false });

  // Also try tenants table
  const { data: tenants } = await supabase
    .from("tenants")
    .select("*")
    .order("created_at", { ascending: false });

  const allConnections = connections ?? [];
  const allTenants = tenants ?? [];

  return (
    <div>
      <h1 style={S.h1}>WhatsApp Connections</h1>
      <p style={S.sub}>{allConnections.length} WhatsApp numbers connected · {allTenants.length} tenants</p>

      {/* WA Connections table */}
      <h2 style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 12 }}>wa_connections</h2>
      <div style={{ ...S.card, marginBottom: 28 }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>{["ID","Tenant ID","Phone Number ID","Phone","Status","Connected"].map(h => <th key={h} style={S.th}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {allConnections.map((c: any) => (
              <tr key={c.id}>
                <td style={S.td}><code style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.05)", padding: "3px 8px", borderRadius: 6 }}>{c.id?.slice(0,16)}…</code></td>
                <td style={S.td}><code style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>{c.tenant_id?.slice(0,16)}…</code></td>
                <td style={{ ...S.td, color: "#22C55E", fontWeight: 600, fontSize: 12 }}>{c.phone_number_id ?? "—"}</td>
                <td style={{ ...S.td, color: "#fff", fontWeight: 600 }}>{c.phone ?? "—"}</td>
                <td style={S.td}>
                  <span style={{ fontSize: 11, background: c.status === "active" ? "rgba(34,197,94,0.12)" : "rgba(255,255,255,0.06)", color: c.status === "active" ? "#22C55E" : "rgba(255,255,255,0.4)", padding: "3px 10px", borderRadius: 100, fontWeight: 700 }}>
                    {c.status ?? "active"}
                  </span>
                </td>
                <td style={{ ...S.td, color: "rgba(255,255,255,0.4)", fontSize: 12 }}>
                  {c.created_at ? new Date(c.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                </td>
              </tr>
            ))}
            {!allConnections.length && (
              <tr><td colSpan={6} style={{ ...S.td, textAlign: "center", color: "rgba(255,255,255,0.25)", padding: 40 }}>No WhatsApp connections yet</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Tenants table */}
      <h2 style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 12 }}>tenants</h2>
      <div style={S.card}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>{["ID","Name","Plan","Status","Paused","Created"].map(h => <th key={h} style={S.th}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {allTenants.map((t: any) => (
              <tr key={t.id}>
                <td style={S.td}><code style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.05)", padding: "3px 8px", borderRadius: 6 }}>{t.id?.slice(0,16)}…</code></td>
                <td style={{ ...S.td, color: "#fff", fontWeight: 600 }}>{t.name ?? "—"}</td>
                <td style={S.td}><span style={{ fontSize: 11, background: "rgba(34,197,94,0.12)", color: "#22C55E", padding: "3px 10px", borderRadius: 100, fontWeight: 700 }}>{t.plan_code ?? t.plan ?? "free"}</span></td>
                <td style={S.td}><span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>{t.billing_status ?? "—"}</span></td>
                <td style={S.td}>
                  <span style={{ fontSize: 11, background: t.is_paused ? "rgba(239,68,68,0.12)" : "rgba(34,197,94,0.12)", color: t.is_paused ? "#f87171" : "#22C55E", padding: "3px 10px", borderRadius: 100, fontWeight: 700 }}>
                    {t.is_paused ? "Paused" : "Active"}
                  </span>
                </td>
                <td style={{ ...S.td, color: "rgba(255,255,255,0.4)", fontSize: 12 }}>
                  {t.created_at ? new Date(t.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                </td>
              </tr>
            ))}
            {!allTenants.length && (
              <tr><td colSpan={6} style={{ ...S.td, textAlign: "center", color: "rgba(255,255,255,0.25)", padding: 40 }}>No tenants found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
