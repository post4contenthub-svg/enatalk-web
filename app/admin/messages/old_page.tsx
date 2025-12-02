// app/admin/messages/page.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';

type Tenant = {
  id: string;
  name: string | null;
  slug?: string | null;
};

type MessageRow = {
  id: number;
  tenant_id: string | null;
  connection_id: string | null;
  direction: string | null;
  category: string | null;
  to_number: string | null;
  from_number: string | null;
  status: string | null;
  body_text: string | null;
  created_at: string;
};

type StatusFilter = 'all' | 'sent' | 'received' | 'failed';
type DirectionFilter = 'all' | 'inbound' | 'outbound';

export default function AdminMessagesPage() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [selectedTenantId, setSelectedTenantId] = useState<string | null>(null);

  const [messages, setMessages] = useState<MessageRow[]>([]);
  const [loadingTenants, setLoadingTenants] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [directionFilter, setDirectionFilter] = useState<DirectionFilter>('all');
  const [search, setSearch] = useState('');
  const [info, setInfo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [resendingId, setResendingId] = useState<number | null>(null);

  // ---- Load tenants via admin API ----
  useEffect(() => {
    async function loadTenants() {
      setLoadingTenants(true);
      setError(null);
      try {
        const res = await fetch('/api/admin/tenants');
        const json = await res.json();

        if (!res.ok) {
          throw new Error(json.error || 'Failed to load tenants');
        }

        const list = (json.tenants as Tenant[]) ?? [];
        setTenants(list);
        if (!selectedTenantId && list.length > 0) {
          setSelectedTenantId(list[0].id);
        }
      } catch (err: any) {
        console.error('Error loading tenants', err);
        setError(err?.message ?? 'Unexpected tenant load error');
      } finally {
        setLoadingTenants(false);
      }
    }

    loadTenants();
  }, [selectedTenantId]);

  // ---- Load messages whenever tenant changes (via admin API) ----
  useEffect(() => {
    if (!selectedTenantId) return;

    async function loadMessagesForTenant(tenantId: string) {
      setLoadingMessages(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/admin/messages?tenant_id=${encodeURIComponent(tenantId)}`
        );
        const json = await res.json();

        if (!res.ok) {
          throw new Error(json.error || 'Failed to load messages');
        }

        setMessages((json.messages as MessageRow[]) ?? []);
      } catch (err: any) {
        console.error('Error loading messages', err);
        setError(err?.message ?? 'Unexpected message load error');
      } finally {
        setLoadingMessages(false);
      }
    }

    loadMessagesForTenant(selectedTenantId);
  }, [selectedTenantId]);

  // ---- Derived stats from messages ----
  const stats = useMemo(() => {
    let inbound = 0;
    let outbound = 0;
    let errors = 0;

    for (const m of messages) {
      if (m.direction === 'inbound') inbound++;
      if (m.direction === 'outbound') outbound++;

      const s = (m.status || '').toLowerCase();
      if (s && s !== 'sent' && s !== 'delivered' && s !== 'read' && s !== 'received') {
        errors++;
      }
    }
    return { inbound, outbound, errors };
  }, [messages]);

  // ---- Client-side filters ----
  const filteredMessages = useMemo(() => {
    return messages.filter((m) => {
      if (directionFilter !== 'all' && m.direction !== directionFilter) return false;

      if (statusFilter !== 'all') {
        const s = (m.status || '').toLowerCase();
        if (statusFilter === 'sent' && s !== 'sent') return false;
        if (statusFilter === 'received' && s !== 'received') return false;
        if (statusFilter === 'failed' && s === 'sent') return false; // crude
      }

      if (search.trim()) {
        const q = search.trim().toLowerCase();
        const haystack = [
          m.to_number || '',
          m.from_number || '',
          m.body_text || '',
        ]
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }

      return true;
    });
  }, [messages, statusFilter, directionFilter, search]);

  const selectedTenant = tenants.find((t) => t.id === selectedTenantId) || null;

  // ---- Resend handler (unchanged, uses /api/resend-message) ----
  async function handleResend(msg: MessageRow) {
    setInfo(null);
    setError(null);

    if (!msg.to_number || !msg.body_text) {
      setError('This message has no to_number or body_text, cannot resend.');
      return;
    }
    if (!msg.tenant_id || !msg.connection_id) {
      setError('This message is missing tenant_id or connection_id.');
      return;
    }

    setResendingId(msg.id);
    try {
      const res = await fetch('/api/resend-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenant_id: msg.tenant_id,
          connection_id: msg.connection_id,
          to: msg.to_number,
          type: 'text',
          text: { body: msg.body_text },
        }),
      });

      const json = await res.json();
      if (json.success) {
        setInfo(
          `Resent message ${msg.id} successfully (new message_id: ${
            json.message_id ?? 'n/a'
          })`
        );
      } else {
        setError(`Resend failed for message ${msg.id}: ${JSON.stringify(json)}`);
      }
    } catch (err: any) {
      console.error('Error resending', err);
      setError(err?.message ?? 'Unexpected resend error');
    } finally {
      setResendingId(null);
    }
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 16 }}>
      {/* Left: tenants list */}
      <section
        style={{
          background: '#ffffff',
          borderRadius: 8,
          padding: 16,
          boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
          minHeight: 300,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 12,
          }}
        >
          <h2 style={{ fontSize: 16, fontWeight: 600 }}>Tenants</h2>
          {loadingTenants ? (
            <span style={{ fontSize: 12, color: '#6b7280' }}>Loading…</span>
          ) : (
            <span style={{ fontSize: 12, color: '#6b7280' }}>
              {tenants.length} tenants
            </span>
          )}
        </div>

        <div
          style={{
            border: '1px solid #e5e7eb',
            borderRadius: 6,
            overflow: 'hidden',
            maxHeight: 480,
            overflowY: 'auto',
          }}
        >
          {tenants.map((t) => {
            const active = t.id === selectedTenantId;
            return (
              <button
                key={t.id}
                onClick={() => setSelectedTenantId(t.id)}
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'left',
                  padding: '8px 10px',
                  fontSize: 14,
                  border: 'none',
                  background: active ? '#eff6ff' : '#ffffff',
                  borderBottom: '1px solid #e5e7eb',
                  cursor: 'pointer',
                }}
              >
                <div style={{ fontWeight: 500 }}>{t.name || '(no name)'}</div>
                {t.slug && (
                  <div style={{ fontSize: 12, color: '#6b7280' }}>{t.slug}</div>
                )}
              </button>
            );
          })}

          {!loadingTenants && tenants.length === 0 && (
            <div style={{ padding: 10, fontSize: 14 }}>No tenants yet.</div>
          )}
        </div>
      </section>

      {/* Right: selected tenant details and messages */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Selected tenant + stats */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: 8,
            padding: 16,
            boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: 12,
            }}
          >
            <div>
              <div style={{ fontSize: 12, color: '#6b7280' }}>Selected Tenant</div>
              <div style={{ fontSize: 18, fontWeight: 600 }}>
                {selectedTenant ? selectedTenant.name || selectedTenant.id : 'None'}
              </div>
            </div>
            <div style={{ textAlign: 'right', fontSize: 12 }}>
              <div>Inbound: {stats.inbound}</div>
              <div>Outbound: {stats.outbound}</div>
              <div style={{ color: stats.errors ? '#b91c1c' : '#6b7280' }}>
                Errors: {stats.errors}
              </div>
            </div>
          </div>
          <div style={{ fontSize: 13, color: '#6b7280' }}>
            Showing last {messages.length} messages for this tenant (max 200).
          </div>
        </div>

        {/* Messages table */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: 8,
            padding: 16,
            boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
            flex: 1,
            minHeight: 300,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: 8,
              alignItems: 'center',
              marginBottom: 12,
              flexWrap: 'wrap',
            }}
          >
            <h2 style={{ fontSize: 15, fontWeight: 600, marginRight: 'auto' }}>
              Messages
            </h2>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              style={{ fontSize: 13, padding: '4px 6px' }}
            >
              <option value="all">All status</option>
              <option value="sent">Sent</option>
              <option value="received">Received</option>
              <option value="failed">Failed (rough)</option>
            </select>

            <select
              value={directionFilter}
              onChange={(e) => setDirectionFilter(e.target.value as DirectionFilter)}
              style={{ fontSize: 13, padding: '4px 6px' }}
            >
              <option value="all">All direction</option>
              <option value="outbound">Outbound</option>
              <option value="inbound">Inbound</option>
            </select>

            <input
              placeholder="Search phone or body..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ fontSize: 13, padding: '4px 6px', minWidth: 200 }}
            />
          </div>

          {info && (
            <div
              style={{
                marginBottom: 8,
                padding: '6px 8px',
                background: '#e6ffed',
                border: '1px solid #b7eb8f',
                fontSize: 12,
              }}
            >
              {info}
            </div>
          )}
          {error && (
            <div
              style={{
                marginBottom: 8,
                padding: '6px 8px',
                background: '#fff1f0',
                border: '1px solid #ffa39e',
                fontSize: 12,
              }}
            >
              {error}
            </div>
          )}

          {loadingMessages ? (
            <p style={{ fontSize: 14 }}>Loading messages…</p>
          ) : filteredMessages.length === 0 ? (
            <p style={{ fontSize: 14 }}>No messages match the current filters.</p>
          ) : (
            <div style={{ overflowX: 'auto', flex: 1 }}>
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  fontSize: 12,
                }}
              >
                <thead>
                  <tr>
                    <th style={th}>Time</th>
                    <th style={th}>Dir</th>
                    <th style={th}>From</th>
                    <th style={th}>To</th>
                    <th style={th}>Status</th>
                    <th style={th}>Body</th>
                    <th style={th}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMessages.map((m) => (
                    <tr key={m.id}>
                      <td style={td}>
                        {new Date(m.created_at).toLocaleString()}
                      </td>
                      <td style={td}>{m.direction}</td>
                      <td style={td}>{m.from_number}</td>
                      <td style={td}>{m.to_number}</td>
                      <td style={td}>{m.status}</td>
                      <td style={{ ...td, maxWidth: 260 }}>
                        <span title={m.body_text || ''}>
                          {m.body_text ?? <em>(no text)</em>}
                        </span>
                      </td>
                      <td style={td}>
                        <button
                          onClick={() => handleResend(m)}
                          disabled={resendingId === m.id}
                          style={{
                            padding: '2px 8px',
                            fontSize: 11,
                            cursor: resendingId === m.id ? 'default' : 'pointer',
                          }}
                        >
                          {resendingId === m.id ? 'Resending…' : 'Resend'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

const th: React.CSSProperties = {
  textAlign: 'left',
  padding: '6px 4px',
  borderBottom: '1px solid #e5e7eb',
  whiteSpace: 'nowrap',
};

const td: React.CSSProperties = {
  padding: '6px 4px',
  borderBottom: '1px solid #f3f4f6',
  verticalAlign: 'top',
};
