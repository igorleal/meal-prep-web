const AUTH_TOKEN_KEY = 'auth_token'
const USER_KEY = 'user'
const ONBOARDING_KEY = 'onboarding_tips_completed'

export const storage = {
  getToken: (): string | null => {
    return localStorage.getItem(AUTH_TOKEN_KEY)
  },

  setToken: (token: string): void => {
    localStorage.setItem(AUTH_TOKEN_KEY, token)
  },

  removeToken: (): void => {
    localStorage.removeItem(AUTH_TOKEN_KEY)
  },

  getUser: <T>(): T | null => {
    const user = localStorage.getItem(USER_KEY)
    return user ? JSON.parse(user) : null
  },

  setUser: <T>(user: T): void => {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  },

  removeUser: (): void => {
    localStorage.removeItem(USER_KEY)
  },

  clear: (): void => {
    localStorage.removeItem(AUTH_TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  },

  getOnboardingCompleted: (): boolean => {
    return localStorage.getItem(ONBOARDING_KEY) !== null
  },

  setOnboardingCompleted: (): void => {
    localStorage.setItem(ONBOARDING_KEY, new Date().toISOString())
  },

  clearOnboardingCompleted: (): void => {
    localStorage.removeItem(ONBOARDING_KEY)
  },
}
