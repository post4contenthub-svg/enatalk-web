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

  const { data: tenants, count } = await supabase
    .from("tenants")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 style={S.h1}>Tenants</h1>
      <p style={S.sub}>{count ?? 0} WhatsApp accounts connected</p>

      <div style={S.card}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>{["Tenant ID","Phone Number","WA Account ID","Status","Connected","Actions"].map(h => <th key={h} style={S.th}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {(tenants ?? []).map((t: any) => {
              const isActive = t.is_active ?? true;
              return (
                <tr key={t.id}>
                  <td style={S.td}><code style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", background: "rgba(255,255,255,0.05)", padding: "3px 8px", borderRadius: 6 }}>{t.id?.slice(0,16)}…</code></td>
                  <td style={{ ...S.td, color: "#fff", fontWeight: 600 }}>{t.phone_number ?? "—"}</td>
                  <td style={S.td}><code style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{t.whatsapp_account_id ?? "—"}</code></td>
                  <td style={S.td}>
                    <span style={{ fontSize: 11, background: isActive ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)", color: isActive ? "#22C55E" : "#f87171", padding: "3px 10px", borderRadius: 100, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 4 }}>
                      <span style={{ width: 5, height: 5, borderRadius: "50%", background: isActive ? "#22C55E" : "#f87171" }}/>
                      {isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td style={{ ...S.td, color: "rgba(255,255,255,0.4)", fontSize: 12 }}>
                    {t.created_at ? new Date(t.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                  </td>
                  <td style={S.td}>
                    <a href={`/admin/tenants/${t.id}`} style={{ fontSize: 12, color: "#22C55E", fontWeight: 600, textDecoration: "none", padding: "5px 12px", background: "rgba(34,197,94,0.1)", borderRadius: 8, border: "1px solid rgba(34,197,94,0.2)" }}>View →</a>
                  </td>
                </tr>
              );
            })}
            {!tenants?.length && (
              <tr><td colSpan={6} style={{ ...S.td, textAlign: "center", color: "rgba(255,255,255,0.25)", padding: 40 }}>No tenants connected yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
