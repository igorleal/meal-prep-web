import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '@/utils/cn'
import { Icon } from './Icon'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  icon?: string
  iconPosition?: 'left' | 'right'
  loading?: boolean
}

const variantClasses = {
  primary:
    'bg-primary hover:bg-primary-hover text-white shadow-lg shadow-primary/30',
  secondary:
    'bg-white dark:bg-surface-dark text-text-main-light dark:text-text-main-dark border border-border-light dark:border-border-dark hover:bg-gray-50 dark:hover:bg-white/5',
  outline:
    'bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-white',
  ghost:
    'bg-transparent text-text-main-light dark:text-text-main-dark hover:bg-gray-100 dark:hover:bg-white/10',
}

const sizeClasses = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      icon,
      iconPosition = 'right',
      loading = false,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-bold rounded-lg transition-all duration-200',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <Icon name="progress_activity" className="animate-spin" size="sm" />
        )}
        {icon && iconPosition === 'left' && !loading && (
          <Icon name={icon} size="sm" />
        )}
        {children}
        {icon && iconPosition === 'right' && !loading && (
          <Icon name={icon} size="sm" />
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'
