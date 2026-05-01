// app/admin/test-whatsapp/page.tsx
'use client';

import { useState } from 'react';

const TENANT_ID = '92e013de-1cd6-48eb-bcc3-92f4afc107ce';
const CONNECTION_ID = '12c3d375-897b-4d1d-811b-664d295c3fa1';

export default function TestWhatsappPage() {
  const [to, setTo] = useState('919674338804');
  const [body, setBody] = useState('Test from EnaTalk admin UI');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  async function sendMessage() {
    setLoading(true); setResult(null); setStatus('idle');
    try {
      const res = await fetch('/api/resend-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenant_id: TENANT_ID,
          connection_id: CONNECTION_ID,
          to,
          type: 'text',
          text: { body },
        }),
      });
      const json = await res.json();
      setResult(JSON.stringify(json, null, 2));
      setStatus(res.ok && json.ok ? 'success' : 'error');
    } catch (err: any) {
      setResult('Error: ' + (err?.message ?? 'unknown error'));
      setStatus('error');
    } finally {
      setLoading(false);
    }
  }

  const inp: React.CSSProperties = {
    width: '100%', padding: '11px 14px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.10)',
    borderRadius: 10, color: '#fff', fontSize: 14,
    fontFamily: "'DM Sans', sans-serif", outline: 'none',
  };

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 26, letterSpacing: '-0.5px', color: '#fff', marginBottom: 6 }}>
          Test WhatsApp
        </h1>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)' }}>Send a test WhatsApp message using your connected number.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Send form */}
        <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '24px' }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 20 }}>Send Message</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.45)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>To (E.164 format, no +)</label>
              <input value={to} onChange={e => setTo(e.target.value)} style={inp} placeholder="919674338804"/>
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.45)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Message</label>
              <textarea value={body} onChange={e => setBody(e.target.value)} rows={4} style={{ ...inp, resize: 'vertical', lineHeight: 1.6 }}/>
            </div>
            <button onClick={sendMessage} disabled={loading} style={{ padding: '12px', background: loading ? 'rgba(34,197,94,0.4)' : 'linear-gradient(135deg,#22C55E,#16A34A)', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: "'DM Sans',sans-serif", boxShadow: '0 4px 14px rgba(34,197,94,0.3)' }}>
              {loading ? '⏳ Sending…' : '📲 Send WhatsApp'}
            </button>
          </div>
        </div>

        {/* Config + Result */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '20px' }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 16 }}>Configuration</h2>
            {[['Tenant ID', TENANT_ID], ['Connection ID', CONNECTION_ID], ['Phone Number ID', '804095206128236']].map(([label, val]) => (
              <div key={label} style={{ marginBottom: 12 }}>
                <p style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>{label}</p>
                <code style={{ fontSize: 12, color: '#22C55E', background: 'rgba(34,197,94,0.08)', padding: '4px 10px', borderRadius: 6, display: 'block', wordBreak: 'break-all' }}>{val}</code>
              </div>
            ))}
          </div>

          {result && (
            <div style={{ background: status === 'success' ? 'rgba(34,197,94,0.05)' : 'rgba(239,68,68,0.05)', border: `1px solid ${status === 'success' ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}`, borderRadius: 16, padding: '20px', flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <span style={{ fontSize: 16 }}>{status === 'success' ? '✅' : '❌'}</span>
                <h2 style={{ fontSize: 15, fontWeight: 700, color: status === 'success' ? '#22C55E' : '#f87171' }}>
                  {status === 'success' ? 'Message sent!' : 'Error occurred'}
                </h2>
              </div>
              <pre style={{ fontSize: 12, color: status === 'success' ? '#22C55E' : '#f87171', overflowX: 'auto', lineHeight: 1.6, fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>{result}</pre>
            </div>
          )}
        </div>
      </div>

      {/* Edge function debug info */}
      <div style={{ marginTop: 20, background: 'rgba(245,184,0,0.05)', border: '1px solid rgba(245,184,0,0.15)', borderRadius: 16, padding: '18px 22px' }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: '#F5B800', marginBottom: 8 }}>💡 If still failing — check in Supabase:</p>
        <code style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', display: 'block', lineHeight: 1.8 }}>
          {`SELECT id, phone_number_id, meta->>'access_token' as token FROM connections WHERE id = '4bbc2e87-3194-4163-a716-1efc0f41fe35';`}
        </code>
      </div>
    </div>
  );
}
