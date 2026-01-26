export function isContentValidationError(error: unknown): boolean {
  const err = error as { response?: { status?: number; data?: { error?: string } } }
  return (
    err.response?.status === 400 &&
    err.response?.data?.error === 'Content validation failed'
  )
}
