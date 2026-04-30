// app/customer/app/support/page.tsx — Customer ticket submission + list
"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

type Ticket = {
  id: string; ticket_number: number; subject: string;
  status: string; priority: string; category: string; created_at: string; updated_at: string;
};

const statusStyle: Record<string, { bg: string; color: string; label: string }> = {
  open: { bg: "rgba(59,139,235,0.12)", color: "#3B8BEB", label: "Open" },
  in_progress: { bg: "rgba(245,184,0,0.12)", color: "#F5B800", label: "In Progress" },
  resolved: { bg: "rgba(34,197,94,0.12)", color: "#22C55E", label: "Resolved" },
  closed: { bg: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)", label: "Closed" },
};

const inp: React.CSSProperties = {
  width: "100%", padding: "11px 14px",
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.10)",
  borderRadius: 10, color: "#fff", fontSize: 14,
  fontFamily: "'DM Sans',sans-serif", outline: "none",
};

export default function SupportPage() {
  const supabase = createClient();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ subject: "", category: "general", priority: "normal", message: "" });
  const [success, setSuccess] = useState(false);

  useEffect(() => { fetchTickets(); }, []);

  async function fetchTickets() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase.from("support_tickets").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
    setTickets(data ?? []);
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setSubmitting(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: ticket } = await supabase
      .from("support_tickets")
      .insert({ user_id: user.id, subject: form.subject, category: form.category, priority: form.priority })
      .select().single();

    if (ticket) {
      await supabase.from("ticket_messages").insert({
        ticket_id: ticket.id, sender_type: "customer",
        sender_id: user.id, message: form.message,
      });
      setSuccess(true);
      setForm({ subject: "", category: "general", priority: "normal", message: "" });
      setShowForm(false);
      await fetchTickets();
      setTimeout(() => setSuccess(false), 4000);
    }
    setSubmitting(false);
  }

  return (
    <div style={{ fontFamily: "'DM Sans',sans-serif", color: "#fff", padding: "32px", maxWidth: 860 }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Bricolage+Grotesque:wght@700;800&display=swap" rel="stylesheet"/>

      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 26, letterSpacing: "-0.5px", marginBottom: 6 }}>Support</h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)" }}>Get help with your EnaTalk account</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{ padding: "10px 20px", background: "linear-gradient(135deg,#22C55E,#16A34A)", border: "none", color: "#fff", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", boxShadow: "0 4px 14px rgba(34,197,94,0.3)" }}>
          + New Ticket
        </button>
      </div>

      {success && (
        <div style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.25)", borderRadius: 12, padding: "14px 18px", marginBottom: 20, display: "flex", gap: 10, alignItems: "center" }}>
          <span>✅</span>
          <p style={{ fontSize: 14, color: "#22C55E", fontWeight: 600 }}>Ticket submitted! We'll reply within 24 hours.</p>
        </div>
      )}

      {/* New ticket form */}
      {showForm && (
        <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 16, padding: "24px", marginBottom: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Open a Support Ticket</h2>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.45)", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>Category</label>
                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} style={{ ...inp }}>
                  {[["general","General"],["billing","Billing & Payments"],["technical","Technical Issue"],["whatsapp","WhatsApp / API"],["feature_request","Feature Request"],["bug","Bug Report"]].map(([v,l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.45)", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>Priority</label>
                <select value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))} style={{ ...inp }}>
                  {[["low","Low"],["normal","Normal"],["high","High"],["urgent","Urgent"]].map(([v,l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.45)", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>Subject</label>
              <input type="text" placeholder="Brief description of your issue" value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} required style={inp}/>
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.45)", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>Message</label>
              <textarea placeholder="Describe your issue in detail. Include any error messages or steps to reproduce." value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} required rows={5} style={{ ...inp, resize: "vertical", lineHeight: 1.6 }}/>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button type="submit" disabled={submitting} style={{ padding: "11px 24px", background: "linear-gradient(135deg,#22C55E,#16A34A)", border: "none", color: "#fff", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
                {submitting ? "Submitting…" : "Submit Ticket"}
              </button>
              <button type="button" onClick={() => setShowForm(false)} style={{ padding: "11px 20px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tickets list */}
      {loading ? (
        <div style={{ color: "rgba(255,255,255,0.3)", textAlign: "center", padding: 40 }}>Loading tickets…</div>
      ) : tickets.length === 0 ? (
        <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "48px", textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🎫</div>
          <div style={{ fontSize: 16, fontWeight: 600, color: "#fff", marginBottom: 8 }}>No tickets yet</div>
          <div style={{ fontSize: 14, color: "rgba(255,255,255,0.4)" }}>Open a ticket if you need help — we respond within 24 hours.</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {tickets.map(t => {
            const ss = statusStyle[t.status] ?? statusStyle.open;
            return (
              <a key={t.id} href={`/customer/app/support/${t.id}`} style={{ textDecoration: "none", display: "block", background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "18px 20px", transition: "border-color .2s, transform .2s" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", fontWeight: 600, minWidth: 60 }}>#{t.ticket_number}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: "#fff", marginBottom: 4 }}>{t.subject}</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
                      {t.category.replace("_", " ")} · {new Date(t.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span style={{ fontSize: 11, background: ss.bg, color: ss.color, padding: "4px 12px", borderRadius: 100, fontWeight: 700, border: `1px solid ${ss.color}33` }}>{ss.label}</span>
                    <span style={{ fontSize: 13, color: "rgba(255,255,255,0.3)" }}>→</span>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
