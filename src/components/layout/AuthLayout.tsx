import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { LoadingOverlay } from '@/components/common'

export default function AuthLayout() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
        <LoadingOverlay message="Loading..." />
      </div>
    )
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="min-h-screen flex bg-background-light dark:bg-background-dark">
      <Outlet />
    </div>
  )
}
