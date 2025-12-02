// app/admin/test-whatsapp/page.tsx
'use client';

import { useState } from 'react';

// TODO: replace these with real IDs from Supabase
// - TENANT_ID:  from table "tenants" -> id
// - CONNECTION_ID: from table "connections" -> id (for that tenant)
const TENANT_ID = '92e013de-1cd6-48eb-bcc3-92f4afc107ce';
const CONNECTION_ID = '12c3d375-897b-4d1d-811b-664d295c3fa1';

export default function TestWhatsappPage() {
  const [to, setTo] = useState('919674338804'); // your number by default
  const [body, setBody] = useState('Test from Enatalk admin UI');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  async function sendMessage() {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/resend-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenant_id: TENANT_ID || null,
          connection_id: CONNECTION_ID || null,
          to,
          type: 'text',
          text: { body },
        }),
      });

      const json = await res.json();
      setResult(JSON.stringify(json, null, 2));
    } catch (err: any) {
      setResult('Error: ' + (err?.message ?? 'unknown error'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: '2rem', maxWidth: 600 }}>
      <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
        Test WhatsApp Send
      </h1>

      <p style={{ marginBottom: '1rem', fontSize: '0.9rem', color: '#555' }}>
        Sending with tenant_id: <code>{TENANT_ID || 'NOT SET'}</code>
        <br />
        connection_id: <code>{CONNECTION_ID || 'NOT SET'}</code>
      </p>

      <label style={{ display: 'block', marginBottom: '0.5rem' }}>
        To (E.164, no +)
      </label>
      <input
        value={to}
        onChange={(e) => setTo(e.target.value)}
        style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
      />

      <label style={{ display: 'block', marginBottom: '0.5rem' }}>
        Message text
      </label>
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={3}
        style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
      />

      <button
        onClick={sendMessage}
        disabled={loading}
        style={{
          padding: '0.5rem 1rem',
          cursor: loading ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? 'Sending...' : 'Send WhatsApp'}
      </button>

      {result && (
        <pre
          style={{
            marginTop: '1.5rem',
            background: '#111',
            color: '#0f0',
            padding: '1rem',
            fontSize: '0.8rem',
            overflowX: 'auto',
          }}
        >
          {result}
        </pre>
      )}
    </div>
  );
}
