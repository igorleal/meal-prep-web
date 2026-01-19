import { useState, type KeyboardEvent } from 'react'
import { cn } from '@/utils/cn'
import { Chip } from './Chip'

interface ChipInputProps {
  label?: string
  values: string[]
  onChange: (values: string[]) => void
  placeholder?: string
  variant?: 'success' | 'danger' | 'default'
  className?: string
}

export function ChipInput({
  label,
  values,
  onChange,
  placeholder = 'Type and press Enter...',
  variant = 'default',
  className,
}: ChipInputProps) {
  const [inputValue, setInputValue] = useState('')

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault()
      if (!values.includes(inputValue.trim())) {
        onChange([...values, inputValue.trim()])
      }
      setInputValue('')
    } else if (e.key === 'Backspace' && !inputValue && values.length > 0) {
      onChange(values.slice(0, -1))
    }
  }

  const removeValue = (index: number) => {
    onChange(values.filter((_, i) => i !== index))
  }

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {label && (
        <span className="text-text-main-light dark:text-white text-sm font-medium">
          {label}
        </span>
      )}
      <div
        className={cn(
          'flex flex-wrap items-center gap-2 rounded-lg',
          'border border-border-light dark:border-border-dark',
          'bg-background-light dark:bg-white/5 px-3 py-2',
          'focus-within:ring-1 focus-within:ring-primary focus-within:border-primary'
        )}
      >
        {values.map((value, index) => (
          <Chip
            key={`${value}-${index}`}
            variant={variant}
            selected
            onRemove={() => removeValue(index)}
          >
            {value}
          </Chip>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={values.length === 0 ? placeholder : ''}
          className={cn(
            'flex-1 bg-transparent border-none focus:ring-0',
            'text-text-main-light dark:text-white p-1 text-sm min-w-[120px]',
            'placeholder:text-gray-400'
          )}
        />
      </div>
    </div>
  )
}
