import { useState, type ReactNode } from 'react'
import { cn } from '@/utils/cn'
import { Icon } from './Icon'

interface AccordionProps {
  number?: number
  title: string
  subtitle?: string
  defaultOpen?: boolean
  children: ReactNode
  className?: string
}

export function Accordion({
  number,
  title,
  subtitle,
  defaultOpen = false,
  children,
  className,
}: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div
      className={cn(
        'rounded-xl border border-border-light dark:border-border-dark',
        'bg-surface-light dark:bg-surface-dark overflow-hidden transition-all duration-300',
        isOpen && 'shadow-md',
        className
      )}
    >
      <button
        type="button"
        className={cn(
          'flex w-full items-center justify-between gap-6 p-6 select-none',
          'bg-surface-light dark:bg-surface-dark',
          'hover:bg-gray-50 dark:hover:bg-white/5 transition-colors'
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-4">
          {number !== undefined && (
            <span
              className={cn(
                'flex items-center justify-center size-8 rounded-full font-bold text-sm',
                isOpen
                  ? 'bg-primary/10 text-primary dark:bg-primary/20'
                  : 'bg-gray-100 text-gray-500 dark:bg-white/10 dark:text-gray-300'
              )}
            >
              {number}
            </span>
          )}
          <div className="flex flex-col text-left">
            <p className="text-text-main-light dark:text-white text-base font-bold">
              {title}
            </p>
            {subtitle && !isOpen && (
              <p className="text-text-muted-light dark:text-gray-400 text-sm">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        <Icon
          name="expand_more"
          className={cn(
            'text-text-main-light dark:text-white transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </button>
      {isOpen && (
        <div className="px-6 pb-6 pt-2 border-t border-border-light dark:border-border-dark">
          {children}
        </div>
      )}
    </div>
  )
}
