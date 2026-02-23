import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase/client'

interface AuthContextType {
  user: User | null
  session: Session | null
  organizationId: string | null
  signUp: (
    email: string,
    password: string,
    name: string,
  ) => Promise<{ error: any }>
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<{ error: any }>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [organizationId, setOrganizationId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const checkSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (error) {
          console.error('Session error on load:', error)
          await supabase.auth.signOut({ scope: 'local' }).catch(() => {})
          if (mounted) {
            setSession(null)
            setUser(null)
            setOrganizationId(null)
            setLoading(false)
          }
          return
        }

        if (mounted) {
          setSession(session)
          setUser(session?.user ?? null)
        }

        if (session?.user) {
          const { data, error: orgError } = await supabase
            .from('users')
            .select('organization_id')
            .eq('id', session.user.id)
            .single()

          if (orgError) {
            console.error('Error fetching org:', orgError)
          } else if (data && mounted) {
            setOrganizationId(data.organization_id)
          }
        }
      } catch (err) {
        console.error('Unexpected auth check error:', err)
        if (mounted) {
          setSession(null)
          setUser(null)
          setOrganizationId(null)
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }

    checkSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, currentSession) => {
      setSession(currentSession)
      setUser(currentSession?.user ?? null)

      if (!currentSession) {
        setOrganizationId(null)
        setLoading(false)
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        supabase
          .from('users')
          .select('organization_id')
          .eq('id', currentSession.user.id)
          .single()
          .then(
            ({ data }) => {
              if (data && mounted) setOrganizationId(data.organization_id)
              if (mounted) setLoading(false)
            },
            (err) => {
              console.error('Background org fetch error:', err)
              if (mounted) setLoading(false)
            },
          )
      } else if (event === 'SIGNED_OUT') {
        setSession(null)
        setUser(null)
        setOrganizationId(null)
        setLoading(false)
      } else {
        setLoading(false)
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const signUp = async (email: string, password: string, name: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
        emailRedirectTo: `${window.location.origin}/login`,
      },
    })
    return { error }
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { error }
  }

  const signOut = async () => {
    // Attempt global sign out first
    const { error } = await supabase.auth.signOut({ scope: 'global' })

    let finalError = error

    if (error) {
      console.error('Sign out error:', error)
      const isSessionNotFoundError =
        error.status === 403 ||
        error.message?.includes('session_not_found') ||
        error.message?.includes(
          'Session from session_id claim in JWT does not exist',
        ) ||
        (error as any).code === 'session_not_found'

      if (isSessionNotFoundError) {
        // If the server returns a session not found error, intercept it.
        // We force a local sign-out to clean up local storage/tokens.
        await supabase.auth.signOut({ scope: 'local' }).catch(() => {})
        // Nullify the error so the application gracefully redirects instead of crashing.
        finalError = null
      }
    }

    // Always proceed to clear all local authentication state to guarantee redirection.
    setSession(null)
    setUser(null)
    setOrganizationId(null)

    return { error: finalError }
  }

  const value = {
    user,
    session,
    organizationId,
    signUp,
    signIn,
    signOut,
    loading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
