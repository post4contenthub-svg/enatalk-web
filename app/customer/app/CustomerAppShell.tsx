'use client'

import { ReactNode, useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useWhatsappStatus } from './hooks/useWhatsappStatus'

const DEV_MODE = true // 🔓 TEMP: allow Templates & Campaigns without WhatsApp

interface CustomerAppShellProps {
  children: ReactNode
  workspace?: {
    name?: string
  }
}

export default function CustomerAppShell({
  children,
  workspace,
}: CustomerAppShellProps) {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  const whatsappConnected = useWhatsappStatus()

  const [userName, setUserName] = useState('Customer')
  const [avatarUrl, setAvatarUrl] = useState('/default-avatar.png')
  const [idleTimer, setIdleTimer] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      setUserName(
        user.user_metadata?.full_name ||
        user.email?.split('@')[0] ||
        'Customer'
      )

      if (user.user_metadata?.picture) {
        setAvatarUrl(user.user_metadata.picture)
      }
    }
    fetchUser()
  }, [supabase, router])

  useEffect(() => {
    const LOGOUT_TIMEOUT = 10 * 60 * 1000
    const resetTimer = () => {
      if (idleTimer) clearTimeout(idleTimer)
      const timer = setTimeout(async () => {
        await supabase.auth.signOut()
        router.push('/login')
      }, LOGOUT_TIMEOUT)
      setIdleTimer(timer)
    }
    const events = ['mousemove', 'keydown', 'scroll']
    events.forEach(e => window.addEventListener(e, resetTimer))
    resetTimer()
    return () => {
      if (idleTimer) clearTimeout(idleTimer)
      events.forEach(e => window.removeEventListener(e, resetTimer))
    }
  }, [supabase, router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const navItems = [
    { href: '/customer/app', label: 'Dashboard', emoji: '📊' },
    { href: '/customer/app/contacts', label: 'Contacts', emoji: '👥' },
    { href: '/customer/app/campaigns', label: 'Campaigns', emoji: '🚀', needsWhatsApp: true },
    { href: '/customer/app/templates', label: 'Templates', emoji: '📝', needsWhatsApp: true },
    { href: '/customer/app/settings', label: 'Settings', emoji: '⚙️' },
    { href: '/customer/app/help', label: 'Help', emoji: '❓' },
  ]

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <aside className="w-64 bg-slate-900 border-r border-slate-700 flex flex-col">
        <div className="p-6 border-b border-slate-700">
          <h1 className="text-3xl font-bold text-blue-400">EnaTalk</h1>
        </div>

        <nav className="flex-1 p-6">
          <ul className="space-y-1">
            {navItems.map(item => {
              const locked =
                !DEV_MODE &&
                item.needsWhatsApp &&
                whatsappConnected === false

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`
                      flex items-center px-4 py-3 rounded-lg transition-colors
                      ${
                        locked
                          ? 'text-slate-500 cursor-not-allowed'
                          : 'text-slate-200 hover:bg-slate-800'
                      }
                      ${
                        pathname === item.href
                          ? 'bg-slate-800 font-medium'
                          : ''
                      }
                    `}
                  >
                    <span className="mr-3 text-lg">{item.emoji}</span>
                    {item.label}
                    {locked && (
                      <span className="ml-auto text-xs text-yellow-400">🔒</span>
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>

          {!DEV_MODE && whatsappConnected === false && (
            <Link
              href="/customer/app/connect-whatsapp"
              className="mt-4 block text-xs text-yellow-400 hover:text-yellow-300"
            >
              ⚠ Connect WhatsApp to unlock Campaigns & Templates →
            </Link>
          )}
        </nav>

        <div className="p-5 border-t border-slate-700 text-sm">
          <p className="text-slate-300 font-medium">
            {workspace?.name || 'Workspace'}
          </p>
          <p className="text-slate-500 mt-1">Free Plan</p>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-between px-8 py-4 bg-slate-900 border-b border-slate-700">
          <h2 className="text-xl font-semibold">
            {workspace?.name || 'Dashboard'}
          </h2>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <img
                src={avatarUrl}
                className="w-8 h-8 rounded-full border border-slate-700"
              />
              <span>{userName}</span>
            </div>

            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-lg text-white"
            >
              Logout
            </button>
          </div>
        </header>

        <main className="flex-1 p-8 bg-slate-950">
          {children}
        </main>
      </div>
    </div>
  )
}
