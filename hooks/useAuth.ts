'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  email: string
  user_metadata?: {
    full_name?: string
    user_type?: string
  }
}

export function useAuth() {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const getUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (user) {
          setUser(user as User)

          // Get user profile
          const { data: profileData } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single()

          setProfile(profileData)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to get user')
      } finally {
        setLoading(false)
      }
    }

    getUser()
  }, [])

  return { user, profile, loading, error }
}

export function useSignOut() {
  const router = useRouter()
  const supabase = createClient()

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      router.push('/auth/login')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return signOut
}
