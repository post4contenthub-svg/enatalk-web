// app/admin/messages/page.tsx
import { createSupabaseServerClient } from "@/lib/supabase/server";

const S = {
  h1: { fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 26, letterSpacing: "-0.5px", color: "#fff", marginBottom: 6 },
  sub: { fontSize: 14, color: "rgba(255,255,255,0.45)", marginBottom: 28 },
  card: { background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, overflow: "hidden" },
  th: { padding: "12px 16px", fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.35)", textTransform: "uppercase" as const, letterSpacing: "0.08em", borderBottom: "1px solid rgba(255,255,255,0.06)", textAlign: "left" as const },
  td: { padding: "13px 16px", borderBottom: "1px solid rgba(255,255,255,0.04)", fontSize: 13, verticalAlign: "middle" as const },
};

const statusStyle: Record<string, { bg: string; color: string }> = {
  sent: { bg: "rgba(34,197,94,0.12)", color: "#22C55E" },
  delivered: { bg: "rgba(59,139,235,0.12)", color: "#3B8BEB" },
  read: { bg: "rgba(167,139,250,0.12)", color: "#A78BFA" },
  failed: { bg: "rgba(239,68,68,0.12)", color: "#f87171" },
  pending: { bg: "rgba(245,184,0,0.12)", color: "#F5B800" },
};

export default async function MessagesPage({ searchParams }: { searchParams: { status?: string; page?: string } }) {
  const supabase = await createSupabaseServerClient();
  const page = parseInt(searchParams.page ?? "1");
  const limit = 25;
  const offset = (page - 1) * limit;

  let query = supabase
    .from("messages")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (searchParams.status) query = query.eq("status", searchParams.status);

  const { data: messages, count } = await query;
  const totalPages = Math.ceil((count ?? 0) / limit);

  // Status summary counts
  const { data: statusCounts } = await supabase
    .from("messages")
    .select("status")
    .then(r => ({ data: r.data }));

  const counts = (statusCounts ?? []).reduce((acc: any, m: any) => {
    acc[m.status] = (acc[m.status] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div>
      <h1 style={S.h1}>Message Logs</h1>
      <p style={S.sub}>{count ?? 0} messages {searchParams.status ? `with status "${searchParams.status}"` : "total"}</p>

      {/* Status summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 12, marginBottom: 24 }}>
        {["sent","delivered","read","failed","pending"].map(s => {
          const sc = statusStyle[s] ?? statusStyle.pending;
          return (
            <a key={s} href={`/admin/messages?status=${s}`} style={{ textDecoration: "none", background: (searchParams.status === s) ? sc.bg : "rgba(255,255,255,0.025)", border: `1px solid ${searchParams.status === s ? sc.color + "44" : "rgba(255,255,255,0.07)"}`, borderRadius: 12, padding: "14px 16px", display: "block", transition: "all .2s" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>{s}</div>
              <div style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 28, color: sc.color, letterSpacing: "-1px" }}>{(counts[s] ?? 0).toLocaleString()}</div>
            </a>
          );
        })}
      </div>

      {/* Filter row */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <a href="/admin/messages" style={{ padding: "7px 16px", borderRadius: 100, fontSize: 13, fontWeight: 600, textDecoration: "none", background: !searchParams.status ? "linear-gradient(135deg,#22C55E,#16A34A)" : "rgba(255,255,255,0.05)", color: !searchParams.status ? "#fff" : "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.08)" }}>All</a>
        {["sent","delivered","read","failed","pending"].map(s => (
          <a key={s} href={`/admin/messages?status=${s}`} style={{ padding: "7px 16px", borderRadius: 100, fontSize: 13, fontWeight: 600, textDecoration: "none", background: searchParams.status === s ? "linear-gradient(135deg,#22C55E,#16A34A)" : "rgba(255,255,255,0.05)", color: searchParams.status === s ? "#fff" : "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.08)" }}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </a>
        ))}
      </div>

      {/* Table */}
      <div style={S.card}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>{["Tenant","To","Type","Status","Template","Sent At"].map(h => <th key={h} style={S.th}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {(messages ?? []).map((m: any) => {
              const sc = statusStyle[m.status] ?? statusStyle.pending;
              return (
                <tr key={m.id}>
                  <td style={S.td}><code style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.05)", padding: "2px 8px", borderRadius: 6 }}>{m.tenant_id?.slice(0,12)}…</code></td>
                  <td style={{ ...S.td, color: "#fff", fontWeight: 500 }}>{m.to ?? "—"}</td>
                  <td style={S.td}><span style={{ fontSize: 11, background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)", padding: "2px 8px", borderRadius: 6 }}>{m.type ?? "text"}</span></td>
                  <td style={S.td}>
                    <span style={{ fontSize: 11, background: sc.bg, color: sc.color, padding: "3px 10px", borderRadius: 100, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 4 }}>
                      <span style={{ width: 5, height: 5, borderRadius: "50%", background: sc.color }}/>
                      {m.status ?? "—"}
                    </span>
                  </td>
                  <td style={{ ...S.td, color: "rgba(255,255,255,0.45)", fontSize: 12 }}>{m.template_name ?? "—"}</td>
                  <td style={{ ...S.td, color: "rgba(255,255,255,0.4)", fontSize: 12 }}>{m.created_at ? new Date(m.created_at).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "—"}</td>
                </tr>
              );
            })}
            {!messages?.length && (
              <tr><td colSpan={6} style={{ ...S.td, textAlign: "center", color: "rgba(255,255,255,0.25)", padding: 40 }}>No messages found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 20 }}>
          {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => i + 1).map(p => (
            <a key={p} href={`/admin/messages?page=${p}${searchParams.status ? `&status=${searchParams.status}` : ""}`} style={{ width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: "none", background: p === page ? "linear-gradient(135deg,#22C55E,#16A34A)" : "rgba(255,255,255,0.05)", color: p === page ? "#fff" : "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.08)" }}>
              {p}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
