import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
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
  formatDateWithOrdinal,
  startOfMonth,
  endOfMonth,
} from '@/utils/date'
import { cn } from '@/utils/cn'
import type { FamilyPlanResponse } from '@/types'

function CalendarDay({
  date,
  currentMonth,
  meals,
  onAddMeal,
  onViewMeal,
  onRequestRemove,
}: {
  date: Date
  currentMonth: Date
  meals: FamilyPlanResponse[]
  onAddMeal: (date: Date) => void
  onViewMeal: (meal: FamilyPlanResponse) => void
  onRequestRemove: (meal: FamilyPlanResponse) => void
}) {
  const { t } = useTranslation('familyCalendar')
  const { t: tCommon } = useTranslation('common')
  const isCurrentMonth = isSameMonthAs(date, currentMonth)
  const isTodayDate = isToday(date)
  const dayMeals = meals.filter(
    (m) => m.request.date === formatDateForApi(date)
  )
  const hasMeals = dayMeals.length > 0

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
            {tCommon('time.today')}
          </Badge>
        )}
      </div>

      {/* Meals */}
      <div className="space-y-1">
        {dayMeals.map((meal) => (
          <button
            key={meal.plan.id}
            onClick={() => onViewMeal(meal)}
            className={cn(
              'w-full px-2 py-1 rounded text-xs truncate text-left',
              'bg-primary/10 text-primary border-l-2 border-primary',
              'hover:bg-primary/20 transition-colors cursor-pointer'
            )}
          >
            {meal.recipe.name}
          </button>
        ))}
      </div>

      {/* Add or Remove button on hover */}
      {isCurrentMonth && (
        hasMeals ? (
          <button
            onClick={() => onRequestRemove(dayMeals[0])}
            className="w-full mt-2 py-1 opacity-0 hover:opacity-100 transition-opacity text-text-muted-light dark:text-text-muted-dark text-xs flex items-center justify-center gap-1 hover:text-red-500 rounded hover:bg-red-500/5"
          >
            <Icon name="delete" size="sm" />
            {t('day.removeMeal')}
          </button>
        ) : (
          <button
            onClick={() => onAddMeal(date)}
            className="w-full mt-2 py-1 opacity-0 hover:opacity-100 transition-opacity text-text-muted-light dark:text-text-muted-dark text-xs flex items-center justify-center gap-1 hover:text-primary rounded hover:bg-primary/5"
          >
            <Icon name="add" size="sm" />
            {t('day.addMeal')}
          </button>
        )
      )}
    </div>
  )
}

const weekDayKeys = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const

export default function FamilyCalendarPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { t } = useTranslation('familyCalendar')
  const { t: tCommon } = useTranslation('common')
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [mealToDelete, setMealToDelete] = useState<FamilyPlanResponse | null>(null)

  const handleAddMeal = (date: Date) => {
    const dateStr = formatDateForApi(date)
    navigate(`/calendar/create?date=${dateStr}&meal=Dinner`)
  }

  const handleViewMeal = (meal: FamilyPlanResponse) => {
    sessionStorage.setItem('viewingFamilyMeal', JSON.stringify(meal))
    navigate('/calendar/recipe')
  }

  const handleConfirmDelete = () => {
    if (mealToDelete) {
      deleteMutation.mutate(mealToDelete.plan.id)
    }
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

  const deleteMutation = useMutation({
    mutationFn: familyPlanService.deletePlan,
    onSuccess: () => {
      setMealToDelete(null)
      queryClient.invalidateQueries({ queryKey: ['familyPlans'] })
    },
  })

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-text-main-light dark:text-white mb-2">
            {t('page.title')}
          </h1>
          <p className="text-text-muted-light dark:text-text-muted-dark">
            {t('page.subtitle')}
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
          {t('toolbar.jumpToToday')}
        </Button>
      </div>

      {/* Calendar Grid */}
      {isLoading ? (
        <LoadingOverlay message={t('loading')} />
      ) : (
        <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark overflow-hidden">
          {/* Week day headers */}
          <div className="grid grid-cols-7 border-b border-border-light dark:border-border-dark">
            {weekDayKeys.map((day, index) => (
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
                {t(`weekDays.${day}`)}
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
                onViewMeal={handleViewMeal}
                onRequestRemove={setMealToDelete}
              />
            ))}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {mealToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMealToDelete(null)}
          />

          {/* Modal */}
          <div className="relative bg-surface-light dark:bg-surface-dark rounded-2xl p-6 max-w-md w-full shadow-xl">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <Icon name="delete" className="text-red-600 dark:text-red-400 text-2xl" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-text-main-light dark:text-white mb-2">
                  {t('delete.title')}
                </h3>
                <p className="text-text-muted-light dark:text-text-muted-dark">
                  {t('delete.message')}{' '}
                  <strong className="text-text-main-light dark:text-white">
                    {formatDateWithOrdinal(mealToDelete.request.date)}
                  </strong>
                  ?
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button
                variant="ghost"
                onClick={() => setMealToDelete(null)}
                disabled={deleteMutation.isPending}
              >
                {tCommon('buttons.cancel')}
              </Button>
              <Button
                variant="primary"
                onClick={handleConfirmDelete}
                loading={deleteMutation.isPending}
                className="bg-red-600 hover:bg-red-700"
              >
                {t('delete.confirmButton')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
