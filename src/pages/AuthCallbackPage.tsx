import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { userService } from '@/api/services'
import { storage } from '@/utils/storage'
import { Icon } from '@/components/common'

export default function AuthCallbackPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { login } = useAuth()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const token = searchParams.get('token')

    if (!token) {
      setError('No authentication token received')
      return
    }

    // Store token temporarily to make the API call
    storage.setToken(token)

    // Fetch user info and complete login
    userService
      .getMe()
      .then((user) => {
        login(token, user)
        navigate('/', { replace: true })
      })
      .catch(() => {
        storage.removeToken()
        setError('Failed to authenticate. Please try again.')
      })
  }, [searchParams, login, navigate])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
        <div className="text-center p-8">
          <div className="size-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
            <Icon name="error" className="text-red-500 text-3xl" />
          </div>
          <h1 className="text-xl font-bold text-text-main-light dark:text-white mb-2">
            Authentication Failed
          </h1>
          <p className="text-text-muted-light dark:text-text-muted-dark mb-6">
            {error}
          </p>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            Back to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
      <div className="text-center p-8">
        <div className="size-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
          <div className="size-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
        <h1 className="text-xl font-bold text-text-main-light dark:text-white mb-2">
          Signing you in...
        </h1>
        <p className="text-text-muted-light dark:text-text-muted-dark">
          Please wait while we complete your authentication.
        </p>
      </div>
    </div>
  )
}
