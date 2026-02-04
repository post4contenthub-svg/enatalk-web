// app/login/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()

  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [loggingIn, setLoggingIn] = useState(false)

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
      } catch (err) {
        console.error('Error checking session:', err)
      } finally {
        setLoading(false)
      }
    }
    checkUser()
  }, [supabase])

  const handleGoogleLogin = async () => {
    setLoggingIn(true)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          // Important: force re-authentication / consent screen
          queryParams: {
            prompt: 'select_account'  // ← forces Google to show account selection
          }
        }
      })

      if (error) throw error
    } catch (error) {
      console.error('Google login error:', error)
      alert('Failed to start Google login. Please try again.')
    } finally {
      setLoggingIn(false)
    }
  }

  if (loading) {
    return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>
  }

  // Case 1: Already logged in – professional UX
  if (user) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>You're already signed in</h1>
        <p style={{ fontSize: '1.25rem', marginBottom: '2rem', color: '#555' }}>
          Welcome back to EnaTalk
        </p>
        <button
          onClick={() => router.push('/customer/app')}
          style={{
            background: '#0070f3',
            color: 'white',
            border: 'none',
            padding: '1rem 2.5rem',
            borderRadius: '8px',
            fontSize: '1.2rem',
            cursor: 'pointer'
          }}
        >
          Go to Dashboard →
        </button>
      </div>
    )
  }

  // Case 2: Not logged in – show real login button
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      background: '#f9f9f9'
    }}>
      <div style={{
        background: 'white',
        padding: '3rem 2.5rem',
        borderRadius: '12px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '420px',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '2.2rem', marginBottom: '1rem' }}>Sign in to EnaTalk</h1>
        <p style={{ color: '#666', marginBottom: '2.5rem' }}>
          Get started with your Google account
        </p>

        <button
          onClick={handleGoogleLogin}
          disabled={loggingIn}
          style={{
            background: loggingIn ? '#5a8cf0' : '#4285F4',
            color: 'white',
            border: 'none',
            padding: '1rem 2rem',
            borderRadius: '6px',
            fontSize: '1.15rem',
            fontWeight: 500,
            cursor: loggingIn ? 'not-allowed' : 'pointer',
            width: '100%',
            transition: 'background 0.2s'
          }}
        >
          {loggingIn ? 'Connecting...' : 'Continue with Google'}
        </button>

        <p style={{ marginTop: '2rem', color: '#888', fontSize: '0.95rem' }}>
          Email & password login coming soon
        </p>
      </div>
    </div>
  )
}