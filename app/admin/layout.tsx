// app/admin/layout.tsx
import type { ReactNode } from 'react';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
        backgroundColor: '#f5f7fb',
      }}
    >
      <header
        style={{
          height: 56,
          borderBottom: '1px solid #e5e7eb',
          background: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          padding: '0 1.5rem',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span style={{ fontWeight: 600 }}>Enatalk</span>
          <nav style={{ display: 'flex', gap: '0.75rem', fontSize: 14 }}>
            <a href="/" style={{ textDecoration: 'none', color: '#4b5563' }}>
              Home
            </a>
            <a
              href="/admin"
              style={{ textDecoration: 'none', color: '#111827', fontWeight: 500 }}
            >
              Admin
            </a>
          </nav>
        </div>
      </header>

      <div style={{ display: 'flex', flex: 1 }}>
        <aside
          style={{
            width: 240,
            borderRight: '1px solid #e5e7eb',
            background: '#ffffff',
            padding: '1.5rem 1rem',
          }}
        >
          <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: '1rem' }}>
            Admin
          </h2>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 14 }}>
            <a href="/admin" style={{ textDecoration: 'none', color: '#111827' }}>
              Dashboard
            </a>
            <a href="/admin/messages" style={{ textDecoration: 'none', color: '#4b5563' }}>
              Messages
            </a>
            <a href="/admin/test-whatsapp" style={{ textDecoration: 'none', color: '#4b5563' }}>
              Test WhatsApp
            </a>
          </nav>
        </aside>

        <main style={{ flex: 1, padding: '1.5rem' }}>{children}</main>
      </div>
    </div>
  );
}
