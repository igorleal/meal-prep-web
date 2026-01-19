import { cn } from '@/utils/cn'

interface RangeSliderProps {
  label: string
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  showTicks?: boolean
  className?: string
}

export function RangeSlider({
  label,
  value,
  onChange,
  min = 0,
  max = 5,
  step = 1,
  showTicks = true,
  className,
}: RangeSliderProps) {
  const ticks = Array.from({ length: max - min + 1 }, (_, i) => min + i)

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div className="flex justify-between items-center">
        <label className="text-text-main-light dark:text-white text-sm font-medium">
          {label}
        </label>
        <span className="text-primary font-bold text-sm">
          {value}/{max}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-gray-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
      />
      {showTicks && (
        <div className="flex justify-between text-xs text-gray-400 px-1">
          {ticks.map((tick) => (
            <span key={tick}>{tick}</span>
          ))}
        </div>
      )}
    </div>
  )
}
