import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Button, Icon, Badge, LoadingOverlay } from '@/components/common'
import { familyPlanService } from '@/api/services'
import {
  format,
  getCalendarDays,
  isToday,
  isSameMonthAs,
  nextMonth,
  prevMonth,
  formatDateForApi,
  startOfMonth,
  endOfMonth,
} from '@/utils/date'
import { cn } from '@/utils/cn'
import type { FamilyPlanResponse } from '@/types'

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function CalendarDay({
  date,
  currentMonth,
  meals,
  onAddMeal,
}: {
  date: Date
  currentMonth: Date
  meals: FamilyPlanResponse[]
  onAddMeal: (date: Date) => void
}) {
  const isCurrentMonth = isSameMonthAs(date, currentMonth)
  const isTodayDate = isToday(date)
  const dayMeals = meals.filter(
    (m) => m.request.date === formatDateForApi(date)
  )

  return (
    <div
      className={cn(
        'min-h-[120px] p-2 border-b border-r border-border-light dark:border-border-dark',
        'transition-colors hover:bg-gray-50 dark:hover:bg-white/5',
        !isCurrentMonth && 'opacity-40'
      )}
    >
      {/* Date header */}
      <div className="flex items-center justify-between mb-2">
        <span
          className={cn(
            'flex items-center justify-center size-8 rounded-full text-sm font-medium',
            isTodayDate
              ? 'bg-primary text-white'
              : 'text-text-main-light dark:text-white'
          )}
        >
          {format(date, 'd')}
        </span>
        {isTodayDate && (
          <Badge variant="primary" className="text-xs">
            TODAY
          </Badge>
        )}
      </div>

      {/* Meals */}
      <div className="space-y-1">
        {dayMeals.map((meal) => (
          <div
            key={meal.request.id}
            className={cn(
              'px-2 py-1 rounded text-xs truncate',
              'bg-primary/10 text-primary border-l-2 border-primary'
            )}
          >
            {meal.recipe.name}
          </div>
        ))}
      </div>

      {/* Add button on hover */}
      {isCurrentMonth && (
        <button
          onClick={() => onAddMeal(date)}
          className="w-full mt-2 py-1 opacity-0 hover:opacity-100 transition-opacity text-text-muted-light dark:text-text-muted-dark text-xs flex items-center justify-center gap-1 hover:text-primary rounded hover:bg-primary/5"
        >
          <Icon name="add" size="sm" />
          Add meal
        </button>
      )}
    </div>
  )
}

export default function FamilyCalendarPage() {
  const navigate = useNavigate()
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const handleAddMeal = (date: Date) => {
    const dateStr = formatDateForApi(date)
    navigate(`/calendar/create?date=${dateStr}&meal=Dinner`)
  }

  const calendarDays = useMemo(
    () => getCalendarDays(currentMonth),
    [currentMonth]
  )

  const startDate = formatDateForApi(startOfMonth(currentMonth))
  const endDate = formatDateForApi(endOfMonth(currentMonth))

  const { data: meals, isLoading } = useQuery({
    queryKey: ['familyPlans', startDate, endDate],
    queryFn: () => familyPlanService.getPlans(startDate, endDate),
  })

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-text-main-light dark:text-white mb-2">
            Family Calendar
          </h1>
          <p className="text-text-muted-light dark:text-text-muted-dark">
            Plan and view your family&apos;s meals for the month
          </p>
        </div>
      </div>

      {/* Calendar Toolbar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setCurrentMonth(prevMonth(currentMonth))}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
          >
            <Icon name="chevron_left" />
          </button>
          <h2 className="text-xl font-bold text-text-main-light dark:text-white min-w-[200px] text-center">
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
          <button
            onClick={() => setCurrentMonth(nextMonth(currentMonth))}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
          >
            <Icon name="chevron_right" />
          </button>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCurrentMonth(new Date())}
        >
          Jump to Today
        </Button>
      </div>

      {/* Calendar Grid */}
      {isLoading ? (
        <LoadingOverlay message="Loading calendar..." />
      ) : (
        <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark overflow-hidden">
          {/* Week day headers */}
          <div className="grid grid-cols-7 border-b border-border-light dark:border-border-dark">
            {weekDays.map((day, index) => (
              <div
                key={day}
                className={cn(
                  'py-3 text-center text-sm font-semibold',
                  'border-r border-border-light dark:border-border-dark last:border-r-0',
                  index >= 5
                    ? 'text-text-muted-light dark:text-text-muted-dark bg-gray-50 dark:bg-white/5'
                    : 'text-text-main-light dark:text-white'
                )}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7">
            {calendarDays.map((date, index) => (
              <CalendarDay
                key={index}
                date={date}
                currentMonth={currentMonth}
                meals={meals || []}
                onAddMeal={handleAddMeal}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
