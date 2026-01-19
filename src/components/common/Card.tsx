import { type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/utils/cn'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  hover?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}

export function Card({
  children,
  hover = false,
  padding = 'md',
  className,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-border-light dark:border-border-dark',
        'bg-surface-light dark:bg-surface-dark',
        hover && 'transition-all duration-200 hover:shadow-lg hover:-translate-y-1',
        paddingClasses[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
