import type { User } from '@/types'

const BETA_USER_EMAILS = ['igor.mono@gmail.com'] as const

/**
 * Check if a user is a beta tester.
 * Beta users have access to features that are still in development.
 */
export function isBetaUser(user: User | null | undefined): boolean {
  if (!user?.email) return false
  return BETA_USER_EMAILS.includes(user.email as (typeof BETA_USER_EMAILS)[number])
}
