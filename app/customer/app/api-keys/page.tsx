// app/customer/app/api-keys/page.tsx
"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

type ApiKey = { id: string; name: string; key_prefix: string; is_active: boolean; last_used_at: string | null; created_at: string; expires_at: string | null; };

const inp: React.CSSProperties = { width: "100%", padding: "11px 14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.10)", borderRadius: 10, color: "#fff", fontSize: 14, fontFamily: "'DM Sans',sans-serif", outline: "none" };

export default function ApiKeysPage() {
  const supabase = createClient();
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [keyName, setKeyName] = useState("");
  const [creating, setCreating] = useState(false);
  const [newKey, setNewKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [planAllowed, setPlanAllowed] = useState(true);

  useEffect(() => { fetchKeys(); checkPlan(); }, []);

  async function checkPlan() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase.from("user_subscriptions").select("subscription_status").eq("user_id", user.id).single();
    setPlanAllowed(data?.subscription_status === "active" || data?.subscription_status === "trial");
  }

  async function fetchKeys() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase.from("api_keys").select("*").eq("user_id", user.id).eq("is_active", true).order("created_at", { ascending: false });
    setKeys(data ?? []);
    setLoading(false);
  }

  async function createKey(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Generate key: en_live_<random32>
    const rawKey = "en_live_" + Array.from(crypto.getRandomValues(new Uint8Array(24))).map(b => b.toString(16).padStart(2,"0")).join("");
    const prefix = rawKey.slice(0, 16);

    // Hash the key
    const encoder = new TextEncoder();
    const data = encoder.encode(rawKey);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hash = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2,"0")).join("");

    await supabase.from("api_keys").insert({ user_id: user.id, name: keyName, key_hash: hash, key_prefix: prefix });

    setNewKey(rawKey);
    setKeyName("");
    setShowForm(false);
    setCreating(false);
    await fetchKeys();
  }

  async function revokeKey(keyId: string) {
    if (!confirm("Revoke this API key? Any apps using it will stop working immediately.")) return;
    await supabase.from("api_keys").update({ is_active: false, revoked_at: new Date().toISOString() }).eq("id", keyId);
    await fetchKeys();
  }

  function copyKey() {
    if (!newKey) return;
    navigator.clipboard.writeText(newKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div style={{ fontFamily: "'DM Sans',sans-serif", color: "#fff", maxWidth: 860, padding: 32 }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Bricolage+Grotesque:wght@700;800&display=swap" rel="stylesheet"/>

      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 26, letterSpacing: "-0.5px", marginBottom: 6 }}>API Keys</h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)" }}>Manage API keys to integrate EnaTalk with your own apps</p>
        </div>
        {planAllowed && (
          <button onClick={() => setShowForm(!showForm)} style={{ padding: "10px 20px", background: "linear-gradient(135deg,#22C55E,#16A34A)", border: "none", color: "#fff", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", boxShadow: "0 4px 14px rgba(34,197,94,0.3)" }}>
            + Create API Key
          </button>
        )}
      </div>

      {/* Plan gate */}
      {!planAllowed && (
        <div style={{ background: "rgba(245,184,0,0.06)", border: "1px solid rgba(245,184,0,0.2)", borderRadius: 16, padding: "24px", marginBottom: 24, display: "flex", gap: 16, alignItems: "center" }}>
          <span style={{ fontSize: 28 }}>🔒</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: "#F5B800", marginBottom: 6 }}>API access requires Starter plan or above</div>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.7 }}>Upgrade your plan to create API keys and integrate EnaTalk with your systems.</p>
            <a href="/#pricing" style={{ display: "inline-block", marginTop: 12, padding: "9px 20px", background: "linear-gradient(135deg,#22C55E,#16A34A)", color: "#fff", borderRadius: 10, fontSize: 13, fontWeight: 700, textDecoration: "none" }}>View Plans →</a>
          </div>
        </div>
      )}

      {/* New key revealed */}
      {newKey && (
        <div style={{ background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.25)", borderRadius: 16, padding: "20px 24px", marginBottom: 24 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: "#22C55E", marginBottom: 8 }}>✅ API Key Created — Copy it now, it won't be shown again</div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <code style={{ flex: 1, fontSize: 13, background: "rgba(0,0,0,0.3)", padding: "12px 16px", borderRadius: 10, color: "#22C55E", wordBreak: "break-all", fontFamily: "monospace" }}>{newKey}</code>
            <button onClick={copyKey} style={{ padding: "10px 18px", background: copied ? "rgba(34,197,94,0.2)" : "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", flexShrink: 0 }}>
              {copied ? "✓ Copied!" : "Copy"}
            </button>
          </div>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginTop: 10 }}>Store this key securely. Use it as: <code style={{ color: "#22C55E" }}>Authorization: Bearer {newKey.slice(0,20)}…</code></p>
          <button onClick={() => setNewKey(null)} style={{ marginTop: 12, fontSize: 12, color: "rgba(255,255,255,0.4)", background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>Dismiss</button>
        </div>
      )}

      {/* Create form */}
      {showForm && (
        <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 16, padding: "22px 24px", marginBottom: 24 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Create New API Key</h2>
          <form onSubmit={createKey} style={{ display: "flex", gap: 12, alignItems: "flex-end" }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.45)", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>Key Name</label>
              <input type="text" placeholder="e.g. Production, My App, Shopify" value={keyName} onChange={e => setKeyName(e.target.value)} required style={inp}/>
            </div>
            <button type="submit" disabled={creating} style={{ padding: "11px 22px", background: "linear-gradient(135deg,#22C55E,#16A34A)", border: "none", color: "#fff", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", flexShrink: 0 }}>
              {creating ? "Creating…" : "Create Key"}
            </button>
            <button type="button" onClick={() => setShowForm(false)} style={{ padding: "11px 18px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", flexShrink: 0 }}>Cancel</button>
          </form>
        </div>
      )}

      {/* Keys list */}
      {loading ? (
        <div style={{ color: "rgba(255,255,255,0.3)", textAlign: "center", padding: 40 }}>Loading…</div>
      ) : keys.length === 0 ? (
        <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "48px", textAlign: "center" }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>🔑</div>
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>No API keys yet</div>
          <div style={{ fontSize: 14, color: "rgba(255,255,255,0.4)" }}>{planAllowed ? "Create your first API key to start integrating EnaTalk." : "Upgrade your plan to create API keys."}</div>
        </div>
      ) : (
        <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>{["Name","Key","Last Used","Created","Actions"].map(h => <th key={h} style={{ padding: "12px 16px", fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.35)", textTransform: "uppercase" as const, letterSpacing: "0.08em", borderBottom: "1px solid rgba(255,255,255,0.06)", textAlign: "left" as const }}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {keys.map(k => (
                <tr key={k.id}>
                  <td style={{ padding: "14px 16px", borderBottom: "1px solid rgba(255,255,255,0.04)", fontWeight: 600, color: "#fff" }}>{k.name}</td>
                  <td style={{ padding: "14px 16px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <code style={{ fontSize: 12, color: "#22C55E", background: "rgba(34,197,94,0.08)", padding: "4px 10px", borderRadius: 8 }}>{k.key_prefix}••••••••••••</code>
                  </td>
                  <td style={{ padding: "14px 16px", borderBottom: "1px solid rgba(255,255,255,0.04)", fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
                    {k.last_used_at ? new Date(k.last_used_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "Never"}
                  </td>
                  <td style={{ padding: "14px 16px", borderBottom: "1px solid rgba(255,255,255,0.04)", fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
                    {new Date(k.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td style={{ padding: "14px 16px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <button onClick={() => revokeKey(k.id)} style={{ fontSize: 12, color: "#f87171", fontWeight: 600, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8, padding: "5px 12px", cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>Revoke</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Docs snippet */}
      {planAllowed && keys.length > 0 && (
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "22px 24px", marginTop: 24 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 14 }}>Quick Start</h3>
          <pre style={{ fontSize: 12, color: "#22C55E", background: "rgba(0,0,0,0.3)", padding: "16px", borderRadius: 10, overflowX: "auto", lineHeight: 1.7, fontFamily: "monospace" }}>{`# Send a WhatsApp message
curl -X POST https://app.enatalk.com/api/v1/messages \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"to": "919876543210", "message": "Hello from EnaTalk API!"}'

# Get your usage
curl https://app.enatalk.com/api/v1/usage \\
  -H "Authorization: Bearer YOUR_API_KEY"`}</pre>
        </div>
      )}
    </div>
  );
}
