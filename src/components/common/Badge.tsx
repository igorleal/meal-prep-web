import { cn } from '@/utils/cn'
import { Icon } from './Icon'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'info'
  icon?: string
  className?: string
}

const variantClasses = {
  default: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300',
  primary: 'bg-primary/10 text-primary',
  success: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
  warning: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
  info: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
}

export function Badge({ children, variant = 'default', icon, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold',
        variantClasses[variant],
        className
      )}
    >
      {icon && <Icon name={icon} size="sm" />}
      {children}
    </span>
  )
}
