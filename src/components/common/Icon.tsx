import { cn } from '@/utils/cn'

interface IconProps {
  name: string
  className?: string
  filled?: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const sizeClasses = {
  sm: 'text-base',
  md: 'text-xl',
  lg: 'text-2xl',
  xl: 'text-4xl',
}

export function Icon({ name, className, filled = false, size = 'md' }: IconProps) {
  return (
    <span
      className={cn(
        'material-symbols-outlined',
        filled && 'filled',
        sizeClasses[size],
        className
      )}
    >
      {name}
    </span>
  )
}
