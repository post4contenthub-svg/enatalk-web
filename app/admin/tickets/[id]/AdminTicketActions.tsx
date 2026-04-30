// app/admin/tickets/[id]/AdminTicketActions.tsx
"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const inp: React.CSSProperties = { width: "100%", padding: "11px 14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.10)", borderRadius: 10, color: "#fff", fontSize: 14, fontFamily: "'DM Sans',sans-serif", outline: "none" };

export default function AdminTicketActions({ ticketId, currentStatus }: { ticketId: string; currentStatus: string }) {
  const supabase = createClient();
  const router = useRouter();
  const [reply, setReply] = useState("");
  const [isNote, setIsNote] = useState(false);
  const [status, setStatus] = useState(currentStatus);
  const [sending, setSending] = useState(false);

  async function sendReply(e: React.FormEvent) {
    e.preventDefault();
    if (!reply.trim()) return;
    setSending(true);

    const { data: { user } } = await supabase.auth.getUser();

    await supabase.from("ticket_messages").insert({
      ticket_id: ticketId,
      sender_type: "admin",
      sender_id: user?.id,
      sender_name: "EnaTalk Support",
      message: reply,
      is_internal_note: isNote,
    });

    await supabase.from("support_tickets").update({ status, updated_at: new Date().toISOString() }).eq("id", ticketId);

    setReply("");
    setSending(false);
    router.refresh();
  }

  return (
    <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "20px" }}>
      <h3 style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 16 }}>Reply to Customer</h3>
      <form onSubmit={sendReply} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <textarea value={reply} onChange={e => setReply(e.target.value)} placeholder="Type your reply…" rows={5} required style={{ ...inp, resize: "vertical", lineHeight: 1.6 }}/>

        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          {/* Internal note toggle */}
          <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, color: isNote ? "#F5B800" : "rgba(255,255,255,0.4)", fontWeight: isNote ? 700 : 400 }}>
            <input type="checkbox" checked={isNote} onChange={e => setIsNote(e.target.checked)} style={{ width: 16, height: 16 }}/>
            🔒 Internal note
          </label>

          {/* Status change */}
          <select value={status} onChange={e => setStatus(e.target.value)} style={{ ...inp, width: "auto", padding: "8px 14px", fontSize: 13 }}>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>

          <button type="submit" disabled={sending} style={{ padding: "10px 22px", background: "linear-gradient(135deg,#22C55E,#16A34A)", border: "none", color: "#fff", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", marginLeft: "auto" }}>
            {sending ? "Sending…" : isNote ? "Save Note" : "Send Reply"}
          </button>
        </div>
      </form>
    </div>
  );
}
