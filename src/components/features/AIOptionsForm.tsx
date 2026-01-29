import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { ChipInput, RangeSlider, Input, Accordion } from '@/components/common'
import { configService } from '@/api/services'
import { useAuth } from '@/context/AuthContext'
import { cn } from '@/utils/cn'

export type AIOptionsPlanType = 'mealPlan' | 'familyPlan' | 'specialMeal'

export interface AIOptionsFormData {
  restrictions: string[]
  mustHaves: string[]
  exclusions: string[]
  // Meal plan specific
  focusAreas?: Record<string, { enabled: boolean; value: number }>
  macros?: {
    calories: number | null
    protein: number | null
    carbs: number | null
    fats: number | null
  }
  mealsPerDay?: number
  days?: number
}

interface AIOptionsFormProps {
  planType: AIOptionsPlanType
  data: AIOptionsFormData
  onChange: (data: AIOptionsFormData) => void
}

export function AIOptionsForm({
  planType,
  data,
  onChange,
}: AIOptionsFormProps) {
  const { t } = useTranslation('common')
  const { t: tMealPlans } = useTranslation('mealPlans')
  const { user } = useAuth()

  // Map from backend key to user-friendly label
  const focusAreaKeyToLabel: Record<string, string> = {
    HIGH_PROTEIN: tMealPlans('create.sections.focusAreas.highProtein'),
    LOW_CARB: tMealPlans('create.sections.focusAreas.lowCarb'),
    KETO: tMealPlans('create.sections.focusAreas.keto'),
    BALANCED: tMealPlans('create.sections.focusAreas.balanced'),
    QUICK_MEALS: tMealPlans('create.sections.focusAreas.quickMeals'),
    BUDGET_FRIENDLY: tMealPlans('create.sections.focusAreas.budgetFriendly'),
    LONG_LASTING: tMealPlans('create.sections.focusAreas.longLasting'),
    ECO_FRIENDLY: tMealPlans('create.sections.focusAreas.ecoFriendly'),
  }

  // Fetch focus areas from backend (only for meal plans)
  const { data: backendFocusAreas = [] } = useQuery({
    queryKey: ['focusAreas'],
    queryFn: configService.getFocusAreas,
    enabled: planType === 'mealPlan',
  })

  // Pre-fill dietary restrictions from user profile
  useEffect(() => {
    if (user?.restrictions && data.restrictions.length === 0) {
      onChange({ ...data, restrictions: user.restrictions })
    }
  }, [user?.restrictions])

  // Initialize focus areas from backend (only for meal plans)
  useEffect(() => {
    if (planType === 'mealPlan' && backendFocusAreas.length > 0 && (!data.focusAreas || Object.keys(data.focusAreas).length === 0)) {
      const initialFocusAreas: Record<string, { enabled: boolean; value: number }> = {}
      backendFocusAreas.forEach((key) => {
        initialFocusAreas[key] = { enabled: false, value: 3 }
      })
      onChange({ ...data, focusAreas: initialFocusAreas })
    }
  }, [backendFocusAreas, planType])

  const updateField = <K extends keyof AIOptionsFormData>(field: K, value: AIOptionsFormData[K]) => {
    onChange({ ...data, [field]: value })
  }

  const isMealPlan = planType === 'mealPlan'

  // Get subtitle for restrictions accordion
  const getRestrictionsSubtitle = () => {
    if (data.restrictions.length > 0) {
      return data.restrictions.join(', ')
    }
    return t('aiOptions.noneSelected')
  }

  // Get subtitle for preferences accordion
  const getPreferencesSubtitle = () => {
    const parts = []
    if (data.mustHaves.length > 0) {
      parts.push(`${data.mustHaves.length} ${t('aiOptions.included')}`)
    }
    if (data.exclusions.length > 0) {
      parts.push(`${data.exclusions.length} ${t('aiOptions.excluded')}`)
    }
    return parts.length > 0 ? parts.join(', ') : t('aiOptions.noneSelected')
  }

  // Get subtitle for focus areas accordion
  const getFocusAreasSubtitle = () => {
    if (!data.focusAreas) return tMealPlans('create.sections.focusAreas.subtitle')
    const enabledCount = Object.values(data.focusAreas).filter(f => f.enabled).length
    if (enabledCount > 0) {
      return `${enabledCount} ${t('aiOptions.selected')}`
    }
    return tMealPlans('create.sections.focusAreas.subtitle')
  }

  // Get subtitle for macros accordion
  const getMacrosSubtitle = () => {
    if (!data.macros) return tMealPlans('create.sections.macros.subtitle')
    const setCount = [data.macros.calories, data.macros.protein, data.macros.carbs, data.macros.fats].filter(v => v !== null).length
    if (setCount > 0) {
      return `${setCount} ${t('aiOptions.goalsSet')}`
    }
    return tMealPlans('create.sections.macros.subtitle')
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Dietary Restrictions */}
      <Accordion
        number={1}
        title={t('aiOptions.restrictions')}
        subtitle={getRestrictionsSubtitle()}
        defaultOpen={data.restrictions.length > 0}
      >
        <ChipInput
          values={data.restrictions}
          onChange={(values) => updateField('restrictions', values)}
          placeholder={t('aiOptions.restrictionsPlaceholder')}
        />
      </Accordion>

      {/* Preferences (Must Haves & Exclusions) */}
      <Accordion
        number={2}
        title={t('aiOptions.preferences')}
        subtitle={getPreferencesSubtitle()}
      >
        <div className="flex flex-col gap-6">
          <ChipInput
            label={t('aiOptions.mustHaves')}
            values={data.mustHaves}
            onChange={(values) => updateField('mustHaves', values)}
            placeholder={t('aiOptions.mustHavesPlaceholder')}
            variant="success"
          />
          <ChipInput
            label={t('aiOptions.exclusions')}
            values={data.exclusions}
            onChange={(values) => updateField('exclusions', values)}
            placeholder={t('aiOptions.exclusionsPlaceholder')}
            variant="danger"
          />
        </div>
      </Accordion>

      {/* Meal Plan Specific Fields */}
      {isMealPlan && (
        <>
          {/* Focus Areas */}
          {data.focusAreas && Object.keys(data.focusAreas).length > 0 && (
            <Accordion
              number={3}
              title={tMealPlans('create.sections.focusAreas.title')}
              subtitle={getFocusAreasSubtitle()}
            >
              <div className="flex flex-col gap-3">
                {Object.entries(data.focusAreas).map(([key, { enabled, value }]) => (
                  <div
                    key={key}
                    className="p-4 rounded-lg bg-background-light dark:bg-[#181411] border border-border-light dark:border-border-dark"
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={enabled}
                        onChange={(e) =>
                          updateField('focusAreas', {
                            ...data.focusAreas,
                            [key]: { ...data.focusAreas![key], enabled: e.target.checked },
                          })
                        }
                        className="mt-1 w-5 h-5 accent-primary rounded border-border-light dark:border-border-dark bg-background-light dark:bg-[#27211b]"
                      />
                      <div className={cn('flex-1', !enabled && 'opacity-50 pointer-events-none')}>
                        <p className="text-text-main-light dark:text-white font-medium mb-3">
                          {focusAreaKeyToLabel[key] || key}
                        </p>
                        <div className="flex items-center gap-4">
                          <span className="text-text-muted-light dark:text-text-muted-dark text-xs">
                            {tMealPlans('create.sections.focusAreas.priority')}
                          </span>
                          <input
                            type="range"
                            min={1}
                            max={5}
                            step={1}
                            value={value}
                            onChange={(e) =>
                              updateField('focusAreas', {
                                ...data.focusAreas,
                                [key]: { ...data.focusAreas![key], value: Number(e.target.value) },
                              })
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
          )}

          {/* Macros */}
          <Accordion
            number={4}
            title={tMealPlans('create.sections.macros.title')}
            subtitle={getMacrosSubtitle()}
          >
            <p className="text-sm text-text-muted-light dark:text-text-muted-dark mb-4">
              {tMealPlans('create.sections.macros.description')}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label={tMealPlans('create.sections.macros.calories')}
                type="number"
                suffix="kcal"
                value={data.macros?.calories ?? ''}
                onChange={(e) =>
                  updateField('macros', {
                    ...data.macros!,
                    calories: e.target.value === '' ? null : Number(e.target.value),
                  })
                }
              />
              <Input
                label={tMealPlans('create.sections.macros.protein')}
                type="number"
                suffix="g"
                value={data.macros?.protein ?? ''}
                onChange={(e) =>
                  updateField('macros', {
                    ...data.macros!,
                    protein: e.target.value === '' ? null : Number(e.target.value),
                  })
                }
              />
              <Input
                label={tMealPlans('create.sections.macros.carbs')}
                type="number"
                suffix="g"
                value={data.macros?.carbs ?? ''}
                onChange={(e) =>
                  updateField('macros', {
                    ...data.macros!,
                    carbs: e.target.value === '' ? null : Number(e.target.value),
                  })
                }
              />
              <Input
                label={tMealPlans('create.sections.macros.fats')}
                type="number"
                suffix="g"
                value={data.macros?.fats ?? ''}
                onChange={(e) =>
                  updateField('macros', {
                    ...data.macros!,
                    fats: e.target.value === '' ? null : Number(e.target.value),
                  })
                }
              />
            </div>
          </Accordion>

          {/* Schedule */}
          <Accordion
            number={5}
            title={tMealPlans('create.sections.schedule.title')}
            subtitle={tMealPlans('create.sections.schedule.subtitle')}
            defaultOpen
          >
            <div className="flex flex-col gap-6">
              <RangeSlider
                label={tMealPlans('create.sections.schedule.mealsPerDay')}
                value={data.mealsPerDay ?? 1}
                onChange={(value) => updateField('mealsPerDay', value)}
                min={1}
                max={6}
              />
              <RangeSlider
                label={tMealPlans('create.sections.schedule.numberOfDays')}
                value={data.days ?? 5}
                onChange={(value) => updateField('days', value)}
                min={1}
                max={7}
              />
            </div>
          </Accordion>
        </>
      )}

    </div>
  )
}
