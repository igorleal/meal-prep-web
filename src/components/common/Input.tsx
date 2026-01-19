import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '@/utils/cn'
import { Icon } from './Icon'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: string
  suffix?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, suffix, className, ...props }, ref) => {
    return (
      <label className="flex flex-col gap-2">
        {label && (
          <span className="text-text-main-light dark:text-white text-sm font-medium">
            {label}
          </span>
        )}
        <div className="relative">
          {icon && (
            <Icon
              name={icon}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size="sm"
            />
          )}
          <input
            ref={ref}
            className={cn(
              'w-full rounded-lg border border-border-light dark:border-border-dark',
              'bg-background-light dark:bg-white/5 px-4 py-3',
              'text-text-main-light dark:text-white',
              'focus:border-primary focus:ring-primary focus:ring-1',
              'placeholder:text-gray-400 transition-colors',
              icon && 'pl-12',
              suffix && 'pr-12',
              error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
              className
            )}
            {...props}
          />
          {suffix && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">
              {suffix}
            </span>
          )}
        </div>
        {error && <span className="text-red-500 text-sm">{error}</span>}
      </label>
    )
  }
)

Input.displayName = 'Input'
