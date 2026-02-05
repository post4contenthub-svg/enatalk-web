// app/customer/app/CustomerAppShell.tsx
import { ReactNode } from 'react';
import Link from 'next/link';

interface CustomerAppShellProps {
  children: ReactNode;
  workspace?: any; // optional – can be removed if not used
}

export default function CustomerAppShell({
  children,
  workspace,
}: CustomerAppShellProps) {
  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: '#0f172a', // dark background to match dashboard
      }}
    >
      {/* LEFT SIDEBAR */}
      <aside
        style={{
          width: '260px',
          backgroundColor: '#1e293b',
          color: '#e2e8f0',
          borderRight: '1px solid #334155',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
        }}
      >
        {/* Logo / Brand */}
        <div style={{ padding: '24px 20px', borderBottom: '1px solid #334155' }}>
          <h1 style={{ fontSize: '1.8rem', margin: 0, color: '#60a5fa' }}>
            EnaTalk
          </h1>
        </div>

        {/* Navigation – FIXED LINKS */}
        <nav style={{ flex: 1, padding: '24px 16px' }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li>
              <Link
                href="/customer/app"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px 16px',
                  color: '#e2e8f0',
                  textDecoration: 'none',
                  borderRadius: '6px',
                  marginBottom: '8px',
                  backgroundColor:
                    typeof window !== 'undefined' && window.location.pathname === '/customer/app'
                      ? '#334155'
                      : 'transparent',
                  fontWeight: typeof window !== 'undefined' && window.location.pathname === '/customer/app' ? 600 : 400,
                }}
              >
                <span style={{ marginRight: '12px' }}>📊</span> Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="/customer/app/contacts"  // FIXED
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px 16px',
                  color: '#e2e8f0',
                  textDecoration: 'none',
                  borderRadius: '6px',
                  marginBottom: '8px',
                  backgroundColor:
                    typeof window !== 'undefined' && window.location.pathname === '/customer/app/contacts'
                      ? '#334155'
                      : 'transparent',
                  fontWeight: typeof window !== 'undefined' && window.location.pathname === '/customer/app/contacts' ? 600 : 400,
                }}
              >
                <span style={{ marginRight: '12px' }}>👥</span> Contacts
              </Link>
            </li>
            <li>
              <Link
                href="/customer/app/campaigns"  // FIXED
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px 16px',
                  color: '#e2e8f0',
                  textDecoration: 'none',
                  borderRadius: '6px',
                  marginBottom: '8px',
                  backgroundColor:
                    typeof window !== 'undefined' && window.location.pathname === '/customer/app/campaigns'
                      ? '#334155'
                      : 'transparent',
                  fontWeight: typeof window !== 'undefined' && window.location.pathname === '/customer/app/campaigns' ? 600 : 400,
                }}
              >
                <span style={{ marginRight: '12px' }}>🚀</span> Campaigns
              </Link>
            </li>
            <li>
              <Link
                href="/customer/app/templates"  // FIXED
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px 16px',
                  color: '#e2e8f0',
                  textDecoration: 'none',
                  borderRadius: '6px',
                  marginBottom: '8px',
                  backgroundColor:
                    typeof window !== 'undefined' && window.location.pathname === '/customer/app/templates'
                      ? '#334155'
                      : 'transparent',
                  fontWeight: typeof window !== 'undefined' && window.location.pathname === '/customer/app/templates' ? 600 : 400,
                }}
              >
                <span style={{ marginRight: '12px' }}>📝</span> Templates
              </Link>
            </li>
            <li>
              <Link
                href="/customer/app/settings"  // FIXED
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px 16px',
                  color: '#e2e8f0',
                  textDecoration: 'none',
                  borderRadius: '6px',
                  backgroundColor:
                    typeof window !== 'undefined' && window.location.pathname === '/customer/app/settings'
                      ? '#334155'
                      : 'transparent',
                  fontWeight: typeof window !== 'undefined' && window.location.pathname === '/customer/app/settings' ? 600 : 400,
                }}
              >
                <span style={{ marginRight: '12px' }}>⚙️</span> Settings
              </Link>
            </li>
          </ul>
        </nav>

        {/* Bottom section – workspace info */}
        <div style={{ padding: '20px', borderTop: '1px solid #334155' }}>
          <p style={{ fontSize: '0.9rem', margin: 0, color: '#94a3b8' }}>
            {workspace?.name || 'Workspace'}
          </p>
          <p style={{ fontSize: '0.85rem', marginTop: '4px', color: '#64748b' }}>
            Free Plan
          </p>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Optional header */}
        <header
          style={{
            padding: '16px 32px',
            backgroundColor: '#1e293b',
            borderBottom: '1px solid #334155',
            color: '#e2e8f0',
          }}
        >
          <h2 style={{ margin: 0, fontSize: '1.4rem' }}>
            {workspace?.name || 'Dashboard'}
          </h2>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, padding: '32px', backgroundColor: '#0f172a' }}>
          {children}
        </main>
      </div>
    </div>
  );
}