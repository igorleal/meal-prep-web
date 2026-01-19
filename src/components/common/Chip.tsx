import { cn } from '@/utils/cn'
import { Icon } from './Icon'

interface ChipProps {
  children: React.ReactNode
  selected?: boolean
  onSelect?: () => void
  onRemove?: () => void
  variant?: 'default' | 'success' | 'danger'
  className?: string
}

const variantClasses = {
  default: {
    selected: 'border-primary bg-primary text-white',
    unselected:
      'border-border-light dark:border-border-dark bg-white dark:bg-white/5 text-text-main-light dark:text-gray-300 hover:border-primary hover:text-primary',
  },
  success: {
    selected: 'border-green-500 bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300',
    unselected: 'border-green-500 bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300',
  },
  danger: {
    selected: 'border-red-500 bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300',
    unselected: 'border-red-500 bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300',
  },
}

export function Chip({
  children,
  selected = false,
  onSelect,
  onRemove,
  variant = 'default',
  className,
}: ChipProps) {
  const isClickable = !!onSelect

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-3 py-1.5 rounded-full border text-sm font-medium transition-all',
        isClickable && 'cursor-pointer',
        selected ? variantClasses[variant].selected : variantClasses[variant].unselected,
        className
      )}
      onClick={onSelect}
    >
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          className="ml-1 hover:opacity-70 transition-opacity"
        >
          <Icon name="close" size="sm" />
        </button>
      )}
    </span>
  )
}
