// app/admin/tickets/[id]/page.tsx  — Admin: view + reply + manage ticket
import { createSupabaseServerClient } from "@/lib/supabase/server";
import AdminTicketActions from "./AdminTicketActions";

export default async function AdminTicketDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createSupabaseServerClient();

  const { data: ticket } = await supabase
    .from("support_tickets")
    .select("*")
    .eq("id", params.id)
    .single();

  const { data: messages } = await supabase
    .from("ticket_messages")
    .select("*")
    .eq("ticket_id", params.id)
    .order("created_at", { ascending: true });

  if (!ticket) return <div style={{ padding: 32, color: "rgba(255,255,255,0.4)" }}>Ticket not found</div>;

  const statusStyle: Record<string, { bg: string; color: string }> = {
    open:        { bg: "rgba(59,139,235,0.12)",  color: "#3B8BEB" },
    in_progress: { bg: "rgba(245,184,0,0.12)",   color: "#F5B800" },
    resolved:    { bg: "rgba(34,197,94,0.12)",   color: "#22C55E" },
    closed:      { bg: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)" },
  };

  const ss = statusStyle[ticket.status] ?? statusStyle.open;

  return (
    <div>
      <a href="/admin/tickets" style={{ fontSize: 13, color: "#22C55E", textDecoration: "none", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 20 }}>← Back to tickets</a>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 20 }}>
        {/* Left: messages */}
        <div>
          {/* Ticket header */}
          <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "22px 24px", marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
              <div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginBottom: 6 }}>
                  Ticket #{ticket.ticket_number} · {ticket.category.replace("_"," ")} · User: <code style={{ fontSize: 11, color: "#22C55E" }}>{ticket.user_id?.slice(0,16)}…</code>
                </div>
                <h1 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 700, fontSize: 20, color: "#fff" }}>{ticket.subject}</h1>
              </div>
              <span style={{ fontSize: 12, background: ss.bg, color: ss.color, padding: "5px 14px", borderRadius: 100, fontWeight: 700, border: `1px solid ${ss.color}33`, flexShrink: 0 }}>
                {ticket.status.replace("_"," ")}
              </span>
            </div>
          </div>

          {/* Messages thread */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 }}>
            {(messages ?? []).map((m: any) => {
              const isAdmin = m.sender_type === "admin";
              const isNote = m.is_internal_note;
              return (
                <div key={m.id} style={{ background: isNote ? "rgba(245,184,0,0.05)" : isAdmin ? "rgba(59,139,235,0.06)" : "rgba(255,255,255,0.03)", border: `1px solid ${isNote ? "rgba(245,184,0,0.2)" : isAdmin ? "rgba(59,139,235,0.15)" : "rgba(255,255,255,0.07)"}`, borderRadius: 14, padding: "16px 18px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: isNote ? "#F5B800" : isAdmin ? "#3B8BEB" : "#22C55E" }}>
                      {isNote ? "🔒 Internal Note" : isAdmin ? "EnaTalk Support" : "Customer"}
                    </span>
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>
                      {new Date(m.created_at).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <p style={{ fontSize: 14, lineHeight: 1.75, color: "rgba(255,255,255,0.8)", whiteSpace: "pre-wrap" }}>{m.message}</p>
                </div>
              );
            })}
          </div>

          {/* Admin reply form — client component */}
          <AdminTicketActions ticketId={ticket.id} currentStatus={ticket.status} />
        </div>

        {/* Right: ticket info */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "20px" }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>Ticket Info</h3>
            {[
              ["Status", ticket.status.replace("_"," ")],
              ["Priority", ticket.priority],
              ["Category", ticket.category.replace("_"," ")],
              ["Opened", new Date(ticket.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })],
              ["Last update", new Date(ticket.updated_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })],
            ].map(([l, v]) => (
              <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{l}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#fff", textTransform: "capitalize" }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
