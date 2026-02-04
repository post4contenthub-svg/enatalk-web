// app/login/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'  // ← your new client helper

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()  // ← now from @supabase/ssr

  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }
    checkUser()
  }, [supabase])

  if (loading) {
    return <div style={{ padding: '100px', textAlign: 'center' }}>Loading...</div>
  }

  if (user) {
    return (
      <div style={{ padding: '80px 20px', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <h1>Welcome back!</h1>
        <p style={{ fontSize: '18px', margin: '20px 0' }}>
          You are already signed in.
        </p>
        <button
          onClick={() => router.push('/customer/app')}
          style={{
            backgroundColor: '#0070f3',
            color: 'white',
            padding: '14px 30px',
            border: 'none',
            borderRadius: '6px',
            fontSize: '18px',
            cursor: 'pointer'
          }}
        >
          Go to Dashboard →
        </button>
      </div>
    )
  }

  return (
    <div style={{
      padding: '60px 20px',
      maxWidth: '400px',
      margin: '0 auto',
      textAlign: 'center'
    }}>
      <h1>Sign in to EnaTalk</h1>
      <p style={{ color: '#666', marginBottom: '40px' }}>
        Login with your Google account
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
            console.error('Google login error:', error)
            alert('Login failed. Check console for details.')
          }
        }}
        style={{
          backgroundColor: '#4285F4',
          color: 'white',
          padding: '14px 30px',
          border: 'none',
          borderRadius: '6px',
          fontSize: '18px',
          cursor: 'pointer',
          width: '100%',
          marginBottom: '30px'
        }}
      >
        Continue with Google
      </button>

      <p style={{ color: '#888', fontSize: '14px' }}>
        Email + Password login coming soon...
      </p>
    </div>
  )
}