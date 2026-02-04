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
  const [error, setError] = useState<string | null>(null)

  // Check current user session
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
        justifyContent: 'center' 
      }}>
        <p>Loading...</p>
      </div>
    )
  }

  // Already logged in → show friendly message
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
          Welcome back!
        </h1>
        <p style={{ fontSize: '1.2rem', marginBottom: '2rem', color: '#555' }}>
          You're already signed in.
        </p>
        <button
          onClick={() => router.push('/customer/app')}
          style={{
            backgroundColor: '#0070f3',
            color: 'white',
            border: 'none',
            padding: '14px 40px',
            borderRadius: '8px',
            fontSize: '1.1rem',
            fontWeight: 500,
            cursor: 'pointer',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}
        >
          Go to Dashboard →
        </button>
      </div>
    )
  }

  // Not logged in → show login options
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      background: '#f9f9f9'
    }}>
      <div style={{
        background: 'white',
        padding: '40px 30px',
        borderRadius: '12px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '420px',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
          Sign in to EnaTalk
        </h1>
        <p style={{ color: '#666', marginBottom: '2rem' }}>
          Use your Google account to get started
        </p>

        {error && (
          <p style={{ color: 'red', marginBottom: '1rem' }}>
            {error}
          </p>
        )}

        <button
          onClick={async () => {
            setError(null)
            const { error } = await supabase.auth.signInWithOAuth({
              provider: 'google',
              options: {
                redirectTo: `${window.location.origin}/auth/callback`
              }
            })

            if (error) {
              console.error('Google login error:', error)
              setError('Failed to start Google login. Please try again.')
            }
          }}
          style={{
            backgroundColor: '#4285F4',
            color: 'white',
            border: 'none',
            padding: '14px 30px',
            borderRadius: '6px',
            fontSize: '1.1rem',
            fontWeight: 500,
            cursor: 'pointer',
            width: '100%',
            marginBottom: '1.5rem',
            transition: 'background 0.2s'
          }}
          onMouseOver={e => e.currentTarget.style.backgroundColor = '#3367D6'}
          onMouseOut={e => e.currentTarget.style.backgroundColor = '#4285F4'}
        >
          Continue with Google
        </button>

        <p style={{ color: '#888', fontSize: '0.9rem' }}>
          Email + password login coming soon...
        </p>
      </div>
    </div>
  )
}