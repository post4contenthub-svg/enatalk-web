// app/customer/app/CustomerAppShell.tsx
'use client'

import { ReactNode, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

interface CustomerAppShellProps {
  children: ReactNode;
  workspace?: any; // optional, can be removed if not used
}

export default function CustomerAppShell({
  children,
  workspace,
}: CustomerAppShellProps) {
  const router = useRouter();
  const supabase = createClient();
  const [userName, setUserName] = useState<string>('Customer');
  const [avatarUrl, setAvatarUrl] = useState<string>('/default-avatar.png'); // fallback image
  const [idleTimer, setIdleTimer] = useState<NodeJS.Timeout | null>(null);

  // Fetch user name and avatar
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const name = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Customer';
        setUserName(name);
        if (user.user_metadata?.picture) {
          setAvatarUrl(user.user_metadata.picture); // Google profile pic
        }
      } else {
        router.push('/login');
      }
    };
    fetchUser();
  }, [supabase, router]);

  // Auto-logout after 10 minutes inactivity
  useEffect(() => {
    const LOGOUT_TIMEOUT = 10 * 60 * 1000; // 10 minutes
    const handleActivity = () => {
      if (idleTimer) clearTimeout(idleTimer);
      const newTimer = setTimeout(async () => {
        await supabase.auth.signOut();
        router.push('/login');
      }, LOGOUT_TIMEOUT);
      setIdleTimer(newTimer);
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('scroll', handleActivity);

    handleActivity(); // start timer

    return () => {
      if (idleTimer) clearTimeout(idleTimer);
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('scroll', handleActivity);
    };
  }, [supabase, router]);

  // Logout function
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

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

        {/* Navigation */}
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
                }}
              >
                <span style={{ marginRight: '12px' }}>📊</span> Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="/customer/app/contacts"
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
                }}
              >
                <span style={{ marginRight: '12px' }}>👥</span> Contacts
              </Link>
            </li>
            <li>
              <Link
                href="/customer/app/campaigns"
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
                }}
              >
                <span style={{ marginRight: '12px' }}>🚀</span> Campaigns
              </Link>
            </li>
            <li>
              <Link
                href="/customer/app/templates"
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
                }}
              >
                <span style={{ marginRight: '12px' }}>📝</span> Templates
              </Link>
            </li>
            <li>
              <Link
                href="/customer/app/settings"
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
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <h2 style={{ margin: 0, fontSize: '1.4rem' }}>
            {workspace?.name || 'Dashboard'}
          </h2>

          {/* User profile + logout */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <img
                src={avatarUrl}
                alt="Profile Avatar"
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  border: '1px solid #334155',
                }}
              />
              <span style={{ fontSize: '1rem' }}>{userName}</span>
            </div>
            <button
              onClick={handleLogout}
              style={{
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.95rem',
              }}
            >
              Logout
            </button>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, padding: '32px', backgroundColor: '#0f172a' }}>
          {children}
        </main>
      </div>
    </div>
  );
}