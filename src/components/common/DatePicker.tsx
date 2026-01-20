import { useState, useRef, useEffect } from 'react'
import { Icon } from './Icon'
import { cn } from '@/utils/cn'

interface DatePickerProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  error?: string
  required?: boolean
}

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

export function DatePicker({
  value,
  onChange,
  placeholder = 'YYYY-MM-DD',
  error,
  required,
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [viewDate, setViewDate] = useState(() => {
    if (value && isValidDateString(value)) {
      const [year, month] = value.split('-').map(Number)
      return new Date(year, month - 1, 1)
    }
    return new Date()
  })
  const containerRef = useRef<HTMLDivElement>(null)

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Update view when value changes externally
  useEffect(() => {
    if (value && isValidDateString(value)) {
      const [year, month] = value.split('-').map(Number)
      setViewDate(new Date(year, month - 1, 1))
    }
  }, [value])

  function isValidDateString(dateString: string): boolean {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return false
    const [year, month, day] = dateString.split('-').map(Number)
    const date = new Date(year, month - 1, day)
    return (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    )
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    let val = e.target.value.replace(/\D/g, '').slice(0, 8)
    if (val.length > 4) val = val.slice(0, 4) + '-' + val.slice(4)
    if (val.length > 7) val = val.slice(0, 7) + '-' + val.slice(7)
    onChange(val)
  }

  function handleDateSelect(day: number) {
    const year = viewDate.getFullYear()
    const month = String(viewDate.getMonth() + 1).padStart(2, '0')
    const dayStr = String(day).padStart(2, '0')
    onChange(`${year}-${month}-${dayStr}`)
    setIsOpen(false)
  }

  function prevMonth() {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))
  }

  function nextMonth() {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))
  }

  function prevYear() {
    setViewDate(new Date(viewDate.getFullYear() - 1, viewDate.getMonth(), 1))
  }

  function nextYear() {
    setViewDate(new Date(viewDate.getFullYear() + 1, viewDate.getMonth(), 1))
  }

  // Calendar grid
  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const firstDayOfMonth = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrevMonth = new Date(year, month, 0).getDate()

  const today = new Date()
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

  const calendarDays: { day: number; currentMonth: boolean }[] = []

  // Previous month days
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    calendarDays.push({ day: daysInPrevMonth - i, currentMonth: false })
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push({ day: i, currentMonth: true })
  }

  // Next month days to fill grid
  const remaining = 42 - calendarDays.length
  for (let i = 1; i <= remaining; i++) {
    calendarDays.push({ day: i, currentMonth: false })
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Input field */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Icon name="calendar_today" className="text-primary text-xl" />
        </div>
        <input
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          maxLength={10}
          required={required}
          className={cn(
            "block w-full pl-12 pr-14 py-4 border-2 rounded-xl text-lg font-semibold text-text-main-light dark:text-white bg-background-light dark:bg-white/5 focus:ring-2 transition-colors placeholder:text-text-muted-light/60 placeholder:font-normal",
            error
              ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
              : "border-border-light dark:border-border-dark focus:border-primary focus:ring-primary/20"
          )}
        />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="absolute inset-y-0 right-0 pr-4 flex items-center text-text-muted-light dark:text-text-muted-dark hover:text-primary transition-colors"
        >
          <Icon name="event" className="text-xl" />
        </button>
      </div>

      {/* Error message */}
      {error && (
        <p className="text-red-500 text-sm font-medium flex items-center gap-1.5 mt-2">
          <Icon name="error" size="sm" />
          {error}
        </p>
      )}

      {/* Calendar dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-2 w-full min-w-[320px] bg-surface-light dark:bg-surface-dark border-2 border-border-light dark:border-border-dark rounded-2xl shadow-2xl shadow-black/10 dark:shadow-black/40 overflow-hidden">
          {/* Header */}
          <div className="bg-primary text-white p-4">
            <p className="text-sm font-medium opacity-80">Selected Date</p>
            <p className="text-2xl font-bold">
              {value && isValidDateString(value)
                ? new Date(value + 'T00:00:00').toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'short',
                    day: 'numeric',
                  })
                : 'Pick a date'}
            </p>
          </div>

          {/* Navigation */}
          <div className="p-3 border-b border-border-light dark:border-border-dark">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={prevYear}
                  className="p-2 rounded-lg hover:bg-primary/10 text-text-muted-light dark:text-text-muted-dark hover:text-primary transition-colors"
                  title="Previous year"
                >
                  <Icon name="keyboard_double_arrow_left" size="sm" />
                </button>
                <button
                  type="button"
                  onClick={prevMonth}
                  className="p-2 rounded-lg hover:bg-primary/10 text-text-muted-light dark:text-text-muted-dark hover:text-primary transition-colors"
                  title="Previous month"
                >
                  <Icon name="chevron_left" size="sm" />
                </button>
              </div>

              <div className="text-center">
                <span className="text-lg font-bold text-text-main-light dark:text-white">
                  {MONTHS[month]} {year}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={nextMonth}
                  className="p-2 rounded-lg hover:bg-primary/10 text-text-muted-light dark:text-text-muted-dark hover:text-primary transition-colors"
                  title="Next month"
                >
                  <Icon name="chevron_right" size="sm" />
                </button>
                <button
                  type="button"
                  onClick={nextYear}
                  className="p-2 rounded-lg hover:bg-primary/10 text-text-muted-light dark:text-text-muted-dark hover:text-primary transition-colors"
                  title="Next year"
                >
                  <Icon name="keyboard_double_arrow_right" size="sm" />
                </button>
              </div>
            </div>
          </div>

          {/* Calendar grid */}
          <div className="p-3">
            {/* Day headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {DAYS.map((day) => (
                <div
                  key={day}
                  className="text-center text-xs font-bold text-text-muted-light dark:text-text-muted-dark uppercase tracking-wide py-2"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map(({ day, currentMonth }, i) => {
                const dateStr = currentMonth
                  ? `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                  : ''
                const isSelected = currentMonth && dateStr === value
                const isToday = currentMonth && dateStr === todayStr

                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => currentMonth && handleDateSelect(day)}
                    disabled={!currentMonth}
                    className={cn(
                      "aspect-square flex items-center justify-center rounded-lg text-sm font-semibold transition-all",
                      currentMonth
                        ? "hover:bg-primary/10 hover:text-primary cursor-pointer"
                        : "text-text-muted-light/30 dark:text-text-muted-dark/30 cursor-default",
                      isSelected && "bg-primary text-white hover:bg-primary hover:text-white shadow-md",
                      isToday && !isSelected && "ring-2 ring-primary ring-inset text-primary font-bold",
                      currentMonth && !isSelected && !isToday && "text-text-main-light dark:text-white"
                    )}
                  >
                    {day}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-border-light dark:border-border-dark flex justify-between items-center">
            <button
              type="button"
              onClick={() => {
                const today = new Date()
                const todayValue = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
                onChange(todayValue)
                setViewDate(today)
                setIsOpen(false)
              }}
              className="px-4 py-2 text-sm font-bold text-primary hover:bg-primary/10 rounded-lg transition-colors"
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 text-sm font-bold text-text-muted-light dark:text-text-muted-dark hover:text-text-main-light dark:hover:text-white transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
