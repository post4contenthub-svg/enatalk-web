// app/customer/app/support/[id]/page.tsx
"use client";
import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { useParams } from "next/navigation";

type Message = { id: string; sender_type: string; sender_name: string; message: string; created_at: string; is_internal_note: boolean; };
type Ticket = { id: string; ticket_number: number; subject: string; status: string; priority: string; category: string; created_at: string; };

const inp: React.CSSProperties = { width: "100%", padding: "11px 14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.10)", borderRadius: 10, color: "#fff", fontSize: 14, fontFamily: "'DM Sans',sans-serif", outline: "none" };

const statusStyle: Record<string, { bg: string; color: string }> = {
  open: { bg: "rgba(59,139,235,0.12)", color: "#3B8BEB" },
  in_progress: { bg: "rgba(245,184,0,0.12)", color: "#F5B800" },
  resolved: { bg: "rgba(34,197,94,0.12)", color: "#22C55E" },
  closed: { bg: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)" },
};

export default function TicketDetailPage() {
  const supabase = createClient();
  const { id } = useParams<{ id: string }>();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { fetchData(); }, [id]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  async function fetchData() {
    const { data: t } = await supabase.from("support_tickets").select("*").eq("id", id).single();
    const { data: m } = await supabase.from("ticket_messages").select("*").eq("ticket_id", id).eq("is_internal_note", false).order("created_at", { ascending: true });
    setTicket(t); setMessages(m ?? []);
  }

  async function sendReply(e: React.FormEvent) {
    e.preventDefault(); if (!reply.trim()) return;
    setSending(true);
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from("ticket_messages").insert({ ticket_id: id, sender_type: "customer", sender_id: user?.id, sender_name: "You", message: reply });
    await supabase.from("support_tickets").update({ updated_at: new Date().toISOString() }).eq("id", id);
    setReply("");
    await fetchData();
    setSending(false);
  }

  if (!ticket) return <div style={{ padding: 32, color: "rgba(255,255,255,0.4)" }}>Loading…</div>;

  const ss = statusStyle[ticket.status] ?? statusStyle.open;
  const isClosed = ticket.status === "resolved" || ticket.status === "closed";

  return (
    <div style={{ fontFamily: "'DM Sans',sans-serif", color: "#fff", maxWidth: 760, padding: 32 }}>
      <a href="/customer/app/support" style={{ fontSize: 13, color: "#22C55E", textDecoration: "none", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 20 }}>← Back to tickets</a>

      {/* Ticket header */}
      <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "22px 24px", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginBottom: 6 }}>Ticket #{ticket.ticket_number} · {ticket.category.replace("_"," ")}</div>
            <h1 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 700, fontSize: 20, letterSpacing: "-0.3px", marginBottom: 8 }}>{ticket.subject}</h1>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>Opened {new Date(ticket.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</div>
          </div>
          <span style={{ fontSize: 12, background: ss.bg, color: ss.color, padding: "5px 14px", borderRadius: 100, fontWeight: 700, border: `1px solid ${ss.color}33`, flexShrink: 0 }}>
            {ticket.status.replace("_"," ")}
          </span>
        </div>
      </div>

      {/* Messages */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
        {messages.map(m => {
          const isAdmin = m.sender_type === "admin";
          return (
            <div key={m.id} style={{ display: "flex", flexDirection: "column", alignItems: isAdmin ? "flex-start" : "flex-end" }}>
              <div style={{ maxWidth: "80%", background: isAdmin ? "rgba(59,139,235,0.08)" : "rgba(34,197,94,0.08)", border: `1px solid ${isAdmin ? "rgba(59,139,235,0.2)" : "rgba(34,197,94,0.2)"}`, borderRadius: isAdmin ? "4px 16px 16px 16px" : "16px 4px 16px 16px", padding: "14px 16px" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: isAdmin ? "#3B8BEB" : "#22C55E", marginBottom: 6 }}>
                  {isAdmin ? "EnaTalk Support" : "You"}
                </div>
                <div style={{ fontSize: 14, lineHeight: 1.7, color: "rgba(255,255,255,0.85)", whiteSpace: "pre-wrap" }}>{m.message}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 6 }}>
                  {new Date(m.created_at).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef}/>
      </div>

      {/* Reply form */}
      {isClosed ? (
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "16px 20px", textAlign: "center", color: "rgba(255,255,255,0.4)", fontSize: 14 }}>
          This ticket is {ticket.status}. <a href="/customer/app/support" style={{ color: "#22C55E", textDecoration: "none", fontWeight: 600 }}>Open a new ticket →</a>
        </div>
      ) : (
        <form onSubmit={sendReply} style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "20px" }}>
          <label style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.08em" }}>Add a Reply</label>
          <textarea value={reply} onChange={e => setReply(e.target.value)} placeholder="Type your message…" rows={4} required style={{ ...inp, resize: "vertical", lineHeight: 1.6, marginBottom: 12 }}/>
          <button type="submit" disabled={sending} style={{ padding: "10px 22px", background: "linear-gradient(135deg,#22C55E,#16A34A)", border: "none", color: "#fff", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
            {sending ? "Sending…" : "Send Reply"}
          </button>
        </form>
      )}
    </div>
  );
}
