import { Navigate } from 'react-router-dom'
import { useStore } from '../store/useStore'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const isLoggedIn = useStore(s => s.isLoggedIn)
  if (!isLoggedIn) return <Navigate to="/login" replace />
  return <>{children}</>
}
