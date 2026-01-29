import { Icon } from '@/components/common'
import { cn } from '@/utils/cn'

export type RecipeSourceType = 'ai' | 'favorite' | 'loaded'

interface RecipeSourceCardProps {
  icon: string
  title: string
  description: string
  badge?: string
  disabled?: boolean
  disabledReason?: string
  onClick: () => void
}

export function RecipeSourceCard({
  icon,
  title,
  description,
  badge,
  disabled = false,
  disabledReason,
  onClick,
}: RecipeSourceCardProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'relative flex items-center gap-4 p-5 rounded-2xl text-left transition-all',
        'bg-surface-light dark:bg-surface-dark',
        'border-2 border-border-light dark:border-border-dark',
        !disabled && 'hover:border-primary hover:shadow-md cursor-pointer',
        disabled && 'opacity-60 cursor-not-allowed'
      )}
    >
      {/* Icon */}
      <div
        className={cn(
          'flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-xl',
          disabled ? 'bg-gray-100 dark:bg-white/5' : 'bg-primary/10'
        )}
      >
        <Icon
          name={icon}
          className={cn(
            'text-2xl',
            disabled ? 'text-gray-400 dark:text-gray-600' : 'text-primary'
          )}
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3
          className={cn(
            'text-base font-bold mb-0.5',
            disabled
              ? 'text-gray-400 dark:text-gray-600'
              : 'text-text-main-light dark:text-white'
          )}
        >
          {title}
        </h3>
        <p
          className={cn(
            'text-sm leading-relaxed',
            disabled
              ? 'text-gray-400 dark:text-gray-600'
              : 'text-text-muted-light dark:text-text-muted-dark'
          )}
        >
          {description}
        </p>
        {/* Disabled reason */}
        {disabled && disabledReason && (
          <div className="mt-2 flex items-center gap-2 text-amber-600 dark:text-amber-400">
            <Icon name="info" className="text-sm" />
            <span className="text-xs font-medium">{disabledReason}</span>
          </div>
        )}
      </div>

      {/* Badge */}
      {badge && (
        <span
          className={cn(
            'flex-shrink-0 px-3 py-1 rounded-full text-xs font-medium',
            disabled
              ? 'bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-gray-600'
              : 'bg-primary/10 text-primary'
          )}
        >
          {badge}
        </span>
      )}

      {/* Arrow indicator */}
      {!disabled && (
        <div className="flex-shrink-0">
          <Icon
            name="chevron_right"
            className="text-text-muted-light dark:text-text-muted-dark"
          />
        </div>
      )}
    </button>
  )
}
