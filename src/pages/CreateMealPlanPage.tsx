import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import {
  Button,
  Input,
  Accordion,
  ChipInput,
  RangeSlider,
  WeeklyLimitBanner,
} from '@/components/common'
import { configService, userService } from '@/api/services'
import { useAuth } from '@/context/AuthContext'
import { cn } from '@/utils/cn'
import type { FocusArea, GenerateReceitAIPlanRequest } from '@/types'

export default function CreateMealPlanPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { t } = useTranslation('mealPlans')

  // Map from backend key to user-friendly label
  const focusAreaKeyToLabel: Record<string, string> = {
    HIGH_PROTEIN: t('create.sections.focusAreas.highProtein'),
    LOW_CARB: t('create.sections.focusAreas.lowCarb'),
    KETO: t('create.sections.focusAreas.keto'),
    BALANCED: t('create.sections.focusAreas.balanced'),
    QUICK_MEALS: t('create.sections.focusAreas.quickMeals'),
    BUDGET_FRIENDLY: t('create.sections.focusAreas.budgetFriendly'),
    LONG_LASTING: t('create.sections.focusAreas.longLasting'),
    ECO_FRIENDLY: t('create.sections.focusAreas.ecoFriendly'),
  }

  // Fetch current user to check weekly limit
  const { data: currentUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: userService.getMe,
  })

  // Fetch focus areas from backend
  const { data: backendFocusAreas = [] } = useQuery({
    queryKey: ['focusAreas'],
    queryFn: configService.getFocusAreas,
  })

  // Form state
  const [planName, setPlanName] = useState('')
  const [selectedRestrictions, setSelectedRestrictions] = useState<string[]>([])
  // Focus areas state: keyed by backend key (e.g., HIGH_PROTEIN)
  const [focusAreas, setFocusAreas] = useState<Record<string, { enabled: boolean; value: number }>>({})
  const [macros, setMacros] = useState<{
    calories: number | null
    protein: number | null
    carbs: number | null
    fats: number | null
  }>({
    calories: null,
    protein: null,
    carbs: null,
    fats: null,
  })
  const [mustHaves, setMustHaves] = useState<string[]>([])
  const [excludes, setExcludes] = useState<string[]>([])
  const [mealsPerDay, setMealsPerDay] = useState(1)
  const [days, setDays] = useState(5)

  const hasReachedLimit = currentUser?.hasReachedWeeklyLimit ?? false

  // Pre-fill dietary restrictions from user profile
  useEffect(() => {
    if (user?.restrictions) {
      setSelectedRestrictions(user.restrictions)
    }
  }, [user?.restrictions])

  // Initialize focus areas from backend
  useEffect(() => {
    if (backendFocusAreas.length > 0 && Object.keys(focusAreas).length === 0) {
      const initialFocusAreas: Record<string, { enabled: boolean; value: number }> = {}
      backendFocusAreas.forEach((key) => {
        initialFocusAreas[key] = { enabled: false, value: 3 }
      })
      setFocusAreas(initialFocusAreas)
    }
  }, [backendFocusAreas, focusAreas])

  const handleSubmit = () => {
    const request: GenerateReceitAIPlanRequest = {
      name: planName,
      focusAreas: Object.entries(focusAreas).reduce(
        (acc, [key, { enabled, value }]) => {
          if (enabled) acc[key as FocusArea] = value
          return acc
        },
        {} as Record<FocusArea, number>
      ),
      goal: macros,
      mustHaves,
      exclusions: excludes,
      restrictions: selectedRestrictions,
      mealsPerDay,
      days,
    }
    // Store request and navigate immediately - the selection page will make the API call
    sessionStorage.setItem(
      'pendingMealPlanRequest',
      JSON.stringify({
        planName,
        request,
      })
    )
    // Clear any previous recipes
    sessionStorage.removeItem('pendingMealPlan')
    navigate('/meal-plans/recipes')
  }

  return (
    <div className="relative min-h-full pb-24">
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-8">
          {/* Weekly Limit Banner */}
          {hasReachedLimit && <WeeklyLimitBanner />}

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-text-main-light dark:text-white mb-2">
          {t('create.title')}
        </h1>
        <p className="text-text-muted-light dark:text-text-muted-dark">
          {t('create.subtitle')}
        </p>
      </div>

      {/* Form Sections */}
      <div className="flex flex-col gap-4">
        {/* Basic Info */}
        <Accordion number={1} title={t('create.sections.basicInfo.title')} subtitle={planName} defaultOpen>
          <Input
            label={t('create.sections.basicInfo.planName')}
            value={planName}
            onChange={(e) => setPlanName(e.target.value)}
            placeholder={t('create.sections.basicInfo.placeholder')}
          />
        </Accordion>

        {/* Dietary Restrictions */}
        <Accordion
          number={2}
          title={t('create.sections.restrictions.title')}
          subtitle={
            selectedRestrictions.length > 0
              ? selectedRestrictions.join(', ')
              : t('create.sections.restrictions.noneSelected')
          }
        >
          <ChipInput
            label={t('create.sections.restrictions.label')}
            values={selectedRestrictions}
            onChange={setSelectedRestrictions}
            placeholder={t('create.sections.restrictions.placeholder')}
          />
        </Accordion>

        {/* Focus Areas */}
        <Accordion number={3} title={t('create.sections.focusAreas.title')} subtitle={t('create.sections.focusAreas.subtitle')}>
          <div className="flex flex-col gap-4">
            {Object.entries(focusAreas).map(([key, { enabled, value }]) => (
              <div
                key={key}
                className="p-4 rounded-lg bg-background-light dark:bg-[#181411] border border-border-light dark:border-border-dark"
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={enabled}
                    onChange={(e) =>
                      setFocusAreas((prev) => ({
                        ...prev,
                        [key]: { ...prev[key], enabled: e.target.checked },
                      }))
                    }
                    className="mt-1 w-5 h-5 accent-primary rounded border-border-light dark:border-border-dark bg-background-light dark:bg-[#27211b]"
                  />
                  <div className={cn('flex-1', !enabled && 'opacity-50 pointer-events-none')}>
                    <p className="text-text-main-light dark:text-white font-medium mb-3">
                      {focusAreaKeyToLabel[key] || key}
                    </p>
                    <div className="flex items-center gap-4">
                      <span className="text-text-muted-light dark:text-text-muted-dark text-xs">
                        {t('create.sections.focusAreas.priority')}
                      </span>
                      <input
                        type="range"
                        min={1}
                        max={5}
                        step={1}
                        value={value}
                        onChange={(e) =>
                          setFocusAreas((prev) => ({
                            ...prev,
                            [key]: { ...prev[key], value: Number(e.target.value) },
                          }))
                        }
                        disabled={!enabled}
                        className={cn(
                          'flex-1 h-1 bg-gray-200 dark:bg-[#4b3e34] rounded-lg appearance-none accent-primary',
                          !enabled ? 'cursor-not-allowed grayscale' : 'cursor-pointer'
                        )}
                      />
                      <span className="text-text-main-light dark:text-white text-xs font-bold w-8 text-right">
                        {value}/5
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Accordion>

        {/* Macros & Nutrition */}
        <Accordion number={4} title={t('create.sections.macros.title')} subtitle={t('create.sections.macros.subtitle')}>
          <p className="text-sm text-text-muted-light dark:text-text-muted-dark mb-4">
            {t('create.sections.macros.description')}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label={t('create.sections.macros.calories')}
              type="number"
              suffix="kcal"
              value={macros.calories ?? ''}
              onChange={(e) =>
                setMacros((prev) => ({ ...prev, calories: e.target.value === '' ? null : Number(e.target.value) }))
              }
            />
            <Input
              label={t('create.sections.macros.protein')}
              type="number"
              suffix="g"
              value={macros.protein ?? ''}
              onChange={(e) =>
                setMacros((prev) => ({ ...prev, protein: e.target.value === '' ? null : Number(e.target.value) }))
              }
            />
            <Input
              label={t('create.sections.macros.carbs')}
              type="number"
              suffix="g"
              value={macros.carbs ?? ''}
              onChange={(e) =>
                setMacros((prev) => ({ ...prev, carbs: e.target.value === '' ? null : Number(e.target.value) }))
              }
            />
            <Input
              label={t('create.sections.macros.fats')}
              type="number"
              suffix="g"
              value={macros.fats ?? ''}
              onChange={(e) =>
                setMacros((prev) => ({ ...prev, fats: e.target.value === '' ? null : Number(e.target.value) }))
              }
            />
          </div>
        </Accordion>

        {/* Preferences */}
        <Accordion
          number={5}
          title={t('create.sections.preferences.title')}
          subtitle={t('create.sections.preferences.subtitle', { included: mustHaves.length, excluded: excludes.length })}
        >
          <div className="flex flex-col gap-6">
            <ChipInput
              label={t('create.sections.preferences.mustHaves')}
              values={mustHaves}
              onChange={setMustHaves}
              variant="success"
            />
            <ChipInput
              label={t('create.sections.preferences.excludes')}
              values={excludes}
              onChange={setExcludes}
              variant="danger"
            />
          </div>
        </Accordion>

        {/* Weekly Schedule (Simplified) */}
        <Accordion number={6} title={t('create.sections.schedule.title')} subtitle={t('create.sections.schedule.subtitle')}>
          <div className="flex flex-col gap-6">
            <RangeSlider
              label={t('create.sections.schedule.mealsPerDay')}
              value={mealsPerDay}
              onChange={setMealsPerDay}
              min={1}
              max={6}
            />
            <RangeSlider
              label={t('create.sections.schedule.numberOfDays')}
              value={days}
              onChange={setDays}
              min={1}
              max={7}
            />
          </div>
        </Accordion>
      </div>

      </div>

      {/* Fixed Footer */}
      <div className="fixed bottom-0 left-0 right-0 md:left-64 border-t border-border-light dark:border-border-dark bg-surface-light/95 dark:bg-background-dark/95 backdrop-blur-sm p-6 z-10 h-[92px]">
        <div className="flex justify-end items-center gap-4 h-full">
          <Button
            variant="secondary"
            onClick={() => navigate('/meal-plans')}
          >
            {t('create.cancelButton')}
          </Button>
          <Button
            icon="arrow_forward"
            iconPosition="right"
            onClick={handleSubmit}
            disabled={!planName.trim() || hasReachedLimit}
            className="shadow-lg shadow-primary/20"
          >
            {t('create.nextButton')}
          </Button>
        </div>
      </div>
    </div>
  )
}
