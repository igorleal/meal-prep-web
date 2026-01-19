import { cn } from '@/utils/cn'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  return (
    <div
      className={cn(
        'animate-spin rounded-full border-2 border-gray-200 border-t-primary',
        sizeClasses[size],
        className
      )}
    />
  )
}

interface LoadingOverlayProps {
  message?: string
}

export function LoadingOverlay({ message = 'Loading...' }: LoadingOverlayProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      <LoadingSpinner size="lg" />
      <p className="text-text-muted-light dark:text-text-muted-dark text-sm">
        {message}
      </p>
    </div>
  )
}
