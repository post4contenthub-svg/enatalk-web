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

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
      } catch (err) {
        console.error('Error checking user:', err)
      } finally {
        setLoading(false)
      }
    }
    checkUser()
  }, [supabase])

  if (loading) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.2rem'
      }}>
        Loading...
      </div>
    )
  }

  if (user) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
          You're already signed in
        </h1>
        <p style={{ fontSize: '1.25rem', marginBottom: '2rem', color: '#444' }}>
          No need to log in again.
        </p>
        <button
          onClick={() => router.push('/customer/app')}
          style={{
            background: '#0070f3',
            color: 'white',
            border: 'none',
            padding: '14px 40px',
            borderRadius: '8px',
            fontSize: '1.1rem',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}
        >
          Go to Dashboard →
        </button>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      background: '#f8f9fa'
    }}>
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '420px',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '2.2rem', marginBottom: '1rem' }}>
          Sign in to EnaTalk
        </h1>
        <p style={{ color: '#555', marginBottom: '2rem' }}>
          Use your Google account
        </p>

        <button
          onClick={async () => {
            const { error } = await supabase.auth.signInWithOAuth({
              provider: 'google',
              options: {
                redirectTo: `${window.location.origin}/auth/callback`
              }
            })

            if (error) {
              console.error('Google login failed:', error)
              alert('Could not start Google login. Please try again.')
            }
          }}
          style={{
            background: '#4285F4',
            color: 'white',
            border: 'none',
            padding: '14px 32px',
            borderRadius: '6px',
            fontSize: '1.15rem',
            fontWeight: 500,
            cursor: 'pointer',
            width: '100%',
            marginBottom: '1.5rem'
          }}
        >
          Continue with Google
        </button>

        <p style={{ color: '#777', fontSize: '0.95rem' }}>
          Email & password sign-in coming soon
        </p>
      </div>
    </div>
  )
}