// app/customer/app/CustomerAppShell.tsx
'use client'

import { ReactNode, useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface CustomerAppShellProps {
  children: ReactNode
  workspace?: {
    name?: string
    // add other workspace fields if needed
  }
}

export default function CustomerAppShell({
  children,
  workspace,
}: CustomerAppShellProps) {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  const [userName, setUserName] = useState<string>('Customer')
  const [avatarUrl, setAvatarUrl] = useState<string>('/default-avatar.png')
  const [idleTimer, setIdleTimer] = useState<NodeJS.Timeout | null>(null)

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const name =
        user.user_metadata?.full_name ||
        user.email?.split('@')[0] ||
        'Customer'

      setUserName(name)

      if (user.user_metadata?.picture) {
        setAvatarUrl(user.user_metadata.picture)
      }
    }

    fetchUser()
  }, [supabase, router])

  // Idle timeout → auto logout after 10 minutes inactivity
  useEffect(() => {
    const LOGOUT_TIMEOUT = 10 * 60 * 1000 // 10 minutes

    const resetTimer = () => {
      if (idleTimer) clearTimeout(idleTimer)

      const newTimer = setTimeout(async () => {
        await supabase.auth.signOut()
        router.push('/login')
      }, LOGOUT_TIMEOUT)

      setIdleTimer(newTimer)
    }

    const events = ['mousemove', 'keydown', 'scroll']

    events.forEach((event) => window.addEventListener(event, resetTimer))

    resetTimer() // initialize

    return () => {
      if (idleTimer) clearTimeout(idleTimer)
      events.forEach((event) => window.removeEventListener(event, resetTimer))
    }
  }, [supabase, router, idleTimer])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const navItems = [
    { href: '/customer/app', label: 'Dashboard', emoji: '📊' },
    { href: '/customer/app/contacts', label: 'Contacts', emoji: '👥' },
    { href: '/customer/app/campaigns', label: 'Campaigns', emoji: '🚀' },
    { href: '/customer/app/templates', label: 'Templates', emoji: '📝' },
    { href: '/customer/app/settings', label: 'Settings', emoji: '⚙️' },
  ]

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-slate-900 border-r border-slate-700 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-slate-700">
          <h1 className="text-3xl font-bold text-blue-400 m-0">EnaTalk</h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-6">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`
                    flex items-center px-4 py-3 rounded-lg text-slate-200
                    hover:bg-slate-800 transition-colors
                    ${pathname === item.href ? 'bg-slate-800 font-medium' : ''}
                  `}
                >
                  <span className="mr-3 text-lg">{item.emoji}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Workspace info */}
        <div className="p-5 border-t border-slate-700 text-sm">
          <p className="text-slate-300 font-medium">
            {workspace?.name || 'Workspace'}
          </p>
          <p className="text-slate-500 mt-1">Free Plan</p>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-8 py-4 bg-slate-900 border-b border-slate-700">
          <h2 className="text-xl font-semibold">
            {workspace?.name || 'Dashboard'}
          </h2>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <img
                src={avatarUrl}
                alt="User avatar"
                className="w-8 h-8 rounded-full border border-slate-700 object-cover"
              />
              <span className="text-slate-200">{userName}</span>
            </div>

            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg font-medium transition-colors"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-8 bg-slate-950">{children}</main>
      </div>
    </div>
  )
}