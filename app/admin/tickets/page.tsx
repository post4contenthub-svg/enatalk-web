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

const priorityStyle: Record<string, { color: string }> = {
  low:    { color: "rgba(255,255,255,0.3)" },
  normal: { color: "rgba(255,255,255,0.5)" },
  high:   { color: "#F5B800" },
  urgent: { color: "#f87171" },
};

export default async function AdminTicketsPage({
  searchParams,
}: {
  searchParams: { status?: string; priority?: string; page?: string };
}) {
  const supabase = await createSupabaseServerClient();
  const page = parseInt(searchParams.page ?? "1");
  const limit = 20;
  const offset = (page - 1) * limit;

  let query = supabase
    .from("support_tickets")
    .select("*, ticket_messages(count)", { count: "exact" })
    .order("updated_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (searchParams.status) query = query.eq("status", searchParams.status);
  if (searchParams.priority) query = query.eq("priority", searchParams.priority);

  const { data: tickets, count } = await query;

  // Status counts
  const { data: allTickets } = await supabase
    .from("support_tickets")
    .select("status, priority");

  const statusCounts = (allTickets ?? []).reduce((acc: any, t: any) => {
    acc[t.status] = (acc[t.status] ?? 0) + 1;
    return acc;
  }, {});

  const totalPages = Math.ceil((count ?? 0) / limit);

  return (
    <div>
      <h1 style={S.h1}>Support Tickets</h1>
      <p style={S.sub}>{count ?? 0} tickets {searchParams.status ? `· ${searchParams.status}` : ""}</p>

      {/* Status summary */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 24 }}>
        {Object.entries(statusStyle).map(([status, ss]) => (
          <a key={status} href={`/admin/tickets?status=${status}`} style={{ textDecoration: "none", background: searchParams.status === status ? ss.bg : "rgba(255,255,255,0.025)", border: `1px solid ${searchParams.status === status ? ss.color + "44" : "rgba(255,255,255,0.07)"}`, borderRadius: 12, padding: "16px 18px", display: "block" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>{ss.label}</div>
            <div style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 32, color: ss.color, letterSpacing: "-1px" }}>{statusCounts[status] ?? 0}</div>
          </a>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        <a href="/admin/tickets" style={{ padding: "7px 16px", borderRadius: 100, fontSize: 13, fontWeight: 600, textDecoration: "none", background: !searchParams.status && !searchParams.priority ? "linear-gradient(135deg,#22C55E,#16A34A)" : "rgba(255,255,255,0.05)", color: !searchParams.status && !searchParams.priority ? "#fff" : "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.08)" }}>All</a>
        {["open","in_progress","resolved","closed"].map(s => (
          <a key={s} href={`/admin/tickets?status=${s}`} style={{ padding: "7px 16px", borderRadius: 100, fontSize: 13, fontWeight: 600, textDecoration: "none", background: searchParams.status === s ? "linear-gradient(135deg,#22C55E,#16A34A)" : "rgba(255,255,255,0.05)", color: searchParams.status === s ? "#fff" : "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.08)" }}>{s.replace("_"," ")}</a>
        ))}
        <div style={{ width: 1, background: "rgba(255,255,255,0.08)", margin: "0 4px" }}/>
        {["urgent","high"].map(p => (
          <a key={p} href={`/admin/tickets?priority=${p}`} style={{ padding: "7px 16px", borderRadius: 100, fontSize: 13, fontWeight: 600, textDecoration: "none", background: searchParams.priority === p ? (p === "urgent" ? "rgba(239,68,68,0.2)" : "rgba(245,184,0,0.15)") : "rgba(255,255,255,0.05)", color: searchParams.priority === p ? (p === "urgent" ? "#f87171" : "#F5B800") : "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.08)" }}>⚡ {p}</a>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>{["#","Subject","Category","Priority","Status","Updated","Actions"].map(h => <th key={h} style={S.th}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {(tickets ?? []).map((t: any) => {
              const ss = statusStyle[t.status] ?? statusStyle.open;
              const ps = priorityStyle[t.priority] ?? priorityStyle.normal;
              const msgCount = t.ticket_messages?.[0]?.count ?? 0;
              return (
                <tr key={t.id}>
                  <td style={{ ...S.td, color: "rgba(255,255,255,0.3)", fontSize: 12 }}>#{t.ticket_number}</td>
                  <td style={S.td}>
                    <div style={{ fontWeight: 600, color: "#fff", marginBottom: 3 }}>{t.subject}</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>{msgCount} message{msgCount !== 1 ? "s" : ""}</div>
                  </td>
                  <td style={S.td}><span style={{ fontSize: 11, background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.5)", padding: "3px 10px", borderRadius: 100 }}>{t.category.replace("_"," ")}</span></td>
                  <td style={{ ...S.td, color: ps.color, fontWeight: 700, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>{t.priority}</td>
                  <td style={S.td}>
                    <span style={{ fontSize: 11, background: ss.bg, color: ss.color, padding: "4px 12px", borderRadius: 100, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 5, border: `1px solid ${ss.color}33` }}>
                      <span style={{ width: 5, height: 5, borderRadius: "50%", background: ss.color }}/>
                      {ss.label}
                    </span>
                  </td>
                  <td style={{ ...S.td, fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{new Date(t.updated_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</td>
                  <td style={S.td}>
                    <a href={`/admin/tickets/${t.id}`} style={{ fontSize: 12, color: "#22C55E", fontWeight: 600, textDecoration: "none", padding: "5px 12px", background: "rgba(34,197,94,0.1)", borderRadius: 8, border: "1px solid rgba(34,197,94,0.2)", whiteSpace: "nowrap" }}>
                      View & Reply →
                    </a>
                  </td>
                </tr>
              );
            })}
            {!tickets?.length && (
              <tr><td colSpan={7} style={{ ...S.td, textAlign: "center", color: "rgba(255,255,255,0.25)", padding: 48 }}>No tickets found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 20 }}>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <a key={p} href={`/admin/tickets?page=${p}${searchParams.status ? `&status=${searchParams.status}` : ""}`} style={{ width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: "none", background: p === page ? "linear-gradient(135deg,#22C55E,#16A34A)" : "rgba(255,255,255,0.05)", color: p === page ? "#fff" : "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.08)" }}>{p}</a>
          ))}
        </div>
      )}
    </div>
  );
}
