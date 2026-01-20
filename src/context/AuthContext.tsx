import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { storage } from '@/utils/storage'
import { SessionExpiredModal } from '@/components/common'
import type { User } from '@/types'

interface AuthContextType {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (token: string, user: User) => void
  logout: () => void
  updateUser: (user: User) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Event name for session expiry
const SESSION_EXPIRED_EVENT = 'auth:session-expired'

// Function to trigger session expired from outside React (e.g., API interceptor)
export function triggerSessionExpired() {
  window.dispatchEvent(new CustomEvent(SESSION_EXPIRED_EVENT))
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showSessionExpiredModal, setShowSessionExpiredModal] = useState(false)

  useEffect(() => {
    // Check for existing auth on mount
    const storedToken = storage.getToken()
    const storedUser = storage.getUser<User>()

    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(storedUser)
    }
    setIsLoading(false)
  }, [])

  // Listen for session expired events from API interceptor
  useEffect(() => {
    const handleSessionExpired = () => {
      // Only show modal if user was authenticated
      if (token) {
        setShowSessionExpiredModal(true)
      }
    }

    window.addEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired)
    return () => {
      window.removeEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired)
    }
  }, [token])

  const handleSessionExpiredClose = useCallback(() => {
    storage.clear()
    setToken(null)
    setUser(null)
    setShowSessionExpiredModal(false)
    window.location.href = '/login'
  }, [])

  const login = (newToken: string, newUser: User) => {
    storage.setToken(newToken)
    storage.setUser(newUser)
    setToken(newToken)
    setUser(newUser)
  }

  const logout = () => {
    storage.clear()
    setToken(null)
    setUser(null)
  }

  const updateUser = (updatedUser: User) => {
    storage.setUser(updatedUser)
    setUser(updatedUser)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
      {showSessionExpiredModal && (
        <SessionExpiredModal onClose={handleSessionExpiredClose} />
      )}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
