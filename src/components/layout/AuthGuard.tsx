import { useAuth } from '@/hooks/use-auth'
import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Loader2 } from 'lucide-react'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (loading) return

    const isAuthRoute =
      location.pathname === '/login' || location.pathname === '/signup'

    if (!session && !isAuthRoute) {
      navigate('/login', { replace: true })
    } else if (session && isAuthRoute) {
      navigate('/dashboard', { replace: true })
    }
  }, [session, loading, navigate, location.pathname])

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-brand-lime" />
      </div>
    )
  }

  return <>{children}</>
}
