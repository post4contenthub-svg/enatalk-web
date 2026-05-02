// app/admin/tickets/page.tsx
import { createSupabaseServerClient } from "@/lib/supabase/server";

const S = {
  h1: { fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 26, letterSpacing: "-0.5px", color: "#fff", marginBottom: 6 },
  sub: { fontSize: 14, color: "rgba(255,255,255,0.45)", marginBottom: 28 },
  th: { padding: "12px 16px", fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.35)", textTransform: "uppercase" as const, letterSpacing: "0.08em", borderBottom: "1px solid rgba(255,255,255,0.06)", textAlign: "left" as const },
  td: { padding: "14px 16px", borderBottom: "1px solid rgba(255,255,255,0.04)", fontSize: 13, verticalAlign: "middle" as const },
};

const statusStyle: Record<string, { bg: string; color: string; label: string }> = {
  open:        { bg: "rgba(59,139,235,0.12)",  color: "#3B8BEB", label: "Open" },
  in_progress: { bg: "rgba(245,184,0,0.12)",   color: "#F5B800", label: "In Progress" },
  resolved:    { bg: "rgba(34,197,94,0.12)",   color: "#22C55E", label: "Resolved" },
  closed:      { bg: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)", label: "Closed" },
};

export default async function AdminTicketsPage({ searchParams }: { searchParams: { status?: string } }) {
  const supabase = await createSupabaseServerClient();

  // Check if table exists first
  const { data: tickets, error } = await supabase
    .from("support_tickets")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div>
        <h1 style={S.h1}>Support Tickets</h1>
        <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 16, padding: "24px", marginTop: 20 }}>
          <div style={{ color: "#f87171", fontWeight: 700, marginBottom: 8 }}>⚠️ Table not found</div>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, lineHeight: 1.7 }}>
            The support_tickets table doesn't exist yet. Run the SQL from create-tickets-tables.sql in Supabase SQL Editor.
          </p>
          <code style={{ display: "block", marginTop: 12, fontSize: 12, color: "#22C55E", background: "rgba(0,0,0,0.3)", padding: "12px", borderRadius: 8 }}>
            {error.message}
          </code>
        </div>
      </div>
    );
  }

  const filtered = searchParams.status ? tickets?.filter(t => t.status === searchParams.status) : tickets;

  // Status counts
  const statusCounts = (tickets ?? []).reduce((acc: any, t: any) => {
    acc[t.status] = (acc[t.status] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div>
      <h1 style={S.h1}>Support Tickets</h1>
      <p style={S.sub}>{tickets?.length ?? 0} total tickets</p>

      {/* Status summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 24 }}>
        {Object.entries(statusStyle).map(([status, ss]) => (
          <a key={status} href={`/admin/tickets?status=${status}`} style={{ textDecoration: "none", background: searchParams.status === status ? ss.bg : "rgba(255,255,255,0.025)", border: `1px solid ${searchParams.status === status ? ss.color + "44" : "rgba(255,255,255,0.07)"}`, borderRadius: 12, padding: "16px 18px", display: "block" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>{ss.label}</div>
            <div style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 32, color: ss.color, letterSpacing: "-1px" }}>{statusCounts[status] ?? 0}</div>
          </a>
        ))}
      </div>

      {/* Filter pills */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        <a href="/admin/tickets" style={{ padding: "7px 16px", borderRadius: 100, fontSize: 13, fontWeight: 600, textDecoration: "none", background: !searchParams.status ? "linear-gradient(135deg,#22C55E,#16A34A)" : "rgba(255,255,255,0.05)", color: !searchParams.status ? "#fff" : "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.08)" }}>All</a>
        {["open","in_progress","resolved","closed"].map(s => (
          <a key={s} href={`/admin/tickets?status=${s}`} style={{ padding: "7px 16px", borderRadius: 100, fontSize: 13, fontWeight: 600, textDecoration: "none", background: searchParams.status === s ? "linear-gradient(135deg,#22C55E,#16A34A)" : "rgba(255,255,255,0.05)", color: searchParams.status === s ? "#fff" : "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.08)" }}>
            {s.replace("_"," ")}
          </a>
        ))}
      </div>

      {/* Tickets table */}
      <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>{["#","Subject","Category","Priority","Status","Created","Actions"].map(h => <th key={h} style={S.th}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {(filtered ?? []).map((t: any) => {
              const ss = statusStyle[t.status] ?? statusStyle.open;
              return (
                <tr key={t.id}>
                  <td style={{ ...S.td, color: "rgba(255,255,255,0.35)", fontSize: 12 }}>#{t.ticket_number}</td>
                  <td style={S.td}><div style={{ fontWeight: 600, color: "#fff" }}>{t.subject}</div></td>
                  <td style={S.td}><span style={{ fontSize: 11, background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.5)", padding: "3px 10px", borderRadius: 100 }}>{t.category}</span></td>
                  <td style={{ ...S.td, fontWeight: 700, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.05em", color: t.priority === "urgent" ? "#f87171" : t.priority === "high" ? "#F5B800" : "rgba(255,255,255,0.4)" }}>{t.priority}</td>
                  <td style={S.td}>
                    <span style={{ fontSize: 11, background: ss.bg, color: ss.color, padding: "4px 12px", borderRadius: 100, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 5 }}>
                      <span style={{ width: 5, height: 5, borderRadius: "50%", background: ss.color }}/>
                      {ss.label}
                    </span>
                  </td>
                  <td style={{ ...S.td, fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
                    {new Date(t.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                  </td>
                  <td style={S.td}>
                    <a href={`/admin/tickets/${t.id}`} style={{ fontSize: 12, color: "#22C55E", fontWeight: 600, textDecoration: "none", padding: "5px 12px", background: "rgba(34,197,94,0.1)", borderRadius: 8, border: "1px solid rgba(34,197,94,0.2)", whiteSpace: "nowrap" }}>
                      View & Reply →
                    </a>
                  </td>
                </tr>
              );
            })}
            {!filtered?.length && (
              <tr><td colSpan={7} style={{ ...S.td, textAlign: "center", color: "rgba(255,255,255,0.25)", padding: 48 }}>
                {tickets?.length === 0 ? "No tickets yet — customers haven't raised any issues" : "No tickets match this filter"}
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
