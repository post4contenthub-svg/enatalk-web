"use client";

import { useState } from "react";

export default function TestSendPage() {
  const [phone, setPhone] = useState("919800000000"); // put your test number
  const [body, setBody] = useState("Hello from Enatalk test page!");
  const [tenantId, setTenantId] = useState(
    "5ddd6091-ba29-4b65-8684-f9da79f28af7" // ✅ your tenant_id
  );
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const res = await fetch("/api/customer/messages/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, body, tenantId }),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error || "Failed to send message");
      } else {
        setResult("Message sent successfully ✅");
      }
    } catch (err: any) {
      setError(err?.message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 480, margin: "40px auto", fontFamily: "system-ui" }}>
      <h1 style={{ fontSize: 24, marginBottom: 16 }}>Test WhatsApp Send</h1>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
        <label>
          <div style={{ fontSize: 14, marginBottom: 4 }}>Phone (E.164)</div>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={{
              width: "100%",
              padding: "8px 10px",
              borderRadius: 4,
              border: "1px solid #ccc",
            }}
            placeholder="e.g. 919800000000"
          />
        </label>

        <label>
          <div style={{ fontSize: 14, marginBottom: 4 }}>Message text</div>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={4}
            style={{
              width: "100%",
              padding: "8px 10px",
              borderRadius: 4,
              border: "1px solid #ccc",
            }}
          />
        </label>

        <label>
          <div style={{ fontSize: 14, marginBottom: 4 }}>Tenant ID</div>
          <input
            type="text"
            value={tenantId}
            onChange={(e) => setTenantId(e.target.value)}
            style={{
              width: "100%",
              padding: "8px 10px",
              borderRadius: 4,
              border: "1px solid #ccc",
            }}
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "10px 14px",
            borderRadius: 4,
            border: "none",
            background: loading ? "#888" : "#2563eb",
            color: "white",
            cursor: loading ? "default" : "pointer",
            fontWeight: 500,
          }}
        >
          {loading ? "Sending..." : "Send WhatsApp"}
        </button>
      </form>

      {result && (
        <div style={{ marginTop: 16, color: "green", fontSize: 14 }}>{result}</div>
      )}
      {error && (
        <div style={{ marginTop: 16, color: "red", fontSize: 14 }}>Error: {error}</div>
      )}
    </div>
  );
}
