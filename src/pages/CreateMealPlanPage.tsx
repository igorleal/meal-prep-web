import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import {
  Button,
  Input,
  Accordion,
  ChipInput,
  RangeSlider,
  WeeklyLimitBanner,
  WeeklyLimitModal,
} from '@/components/common'
import { receitaiPlanService, configService, userService } from '@/api/services'
import { useAuth } from '@/context/AuthContext'
import { cn } from '@/utils/cn'
import type { FocusArea, GenerateReceitAIPlanRequest } from '@/types'

// Map from backend key to user-friendly label
const focusAreaKeyToLabel: Record<string, string> = {
  HIGH_PROTEIN: 'High Protein',
  LOW_CARB: 'Low Carb',
  KETO: 'Keto',
  BALANCED: 'Balanced',
  QUICK_MEALS: 'Quick Prep',
  BUDGET_FRIENDLY: 'Budget Friendly',
  LONG_LASTING: 'Long Lasting',
  ECO_FRIENDLY: 'Eco Friendly',
}

export default function CreateMealPlanPage() {
  const navigate = useNavigate()
  const { user } = useAuth()

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
  const [macros, setMacros] = useState({
    calories: 2200,
    protein: 180,
    carbs: 200,
    fats: 75,
  })
  const [mustHaves, setMustHaves] = useState(['Avocado', 'Chicken Breast'])
  const [excludes, setExcludes] = useState(['Cilantro'])
  const [mealsPerDay, setMealsPerDay] = useState(3)
  const [days, setDays] = useState(7)
  const [showLimitModal, setShowLimitModal] = useState(false)

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

  const generateMutation = useMutation({
    mutationFn: receitaiPlanService.generateRecipes,
    onSuccess: (recipes) => {
      sessionStorage.setItem(
        'pendingMealPlan',
        JSON.stringify({
          planName,
          recipes,
        })
      )
      navigate('/meal-plans/recipes')
    },
    onError: (error: { response?: { status?: number } }) => {
      if (error.response?.status === 429) {
        setShowLimitModal(true)
      }
    },
  })

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
    generateMutation.mutate(request)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-8 py-8">
      {/* Weekly Limit Banner */}
      {hasReachedLimit && <WeeklyLimitBanner />}

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-text-main-light dark:text-white mb-2">
          Let&apos;s build your plan
        </h1>
        <p className="text-text-muted-light dark:text-text-muted-dark">
          Configure your meal plan preferences and let AI generate personalized recipes.
        </p>
      </div>

      {/* Form Sections */}
      <div className="flex flex-col gap-4">
        {/* Basic Info */}
        <Accordion number={1} title="Basic Info" subtitle={planName} defaultOpen>
          <Input
            label="Plan Name"
            value={planName}
            onChange={(e) => setPlanName(e.target.value)}
            placeholder="e.g., Summer Shred, Winter Bulk"
          />
        </Accordion>

        {/* Dietary Restrictions */}
        <Accordion
          number={2}
          title="Dietary Restrictions"
          subtitle={
            selectedRestrictions.length > 0
              ? selectedRestrictions.join(', ')
              : 'None selected'
          }
        >
          <ChipInput
            label="Dietary Restrictions"
            values={selectedRestrictions}
            onChange={setSelectedRestrictions}
            placeholder="Type a restriction and press Enter..."
          />
        </Accordion>

        {/* Focus Areas */}
        <Accordion number={3} title="Focus Areas" subtitle="Set priorities">
          <div className="flex flex-col gap-4">
            {Object.entries(focusAreas).map(([key, { enabled, value }]) => (
              <div key={key} className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={(e) =>
                    setFocusAreas((prev) => ({
                      ...prev,
                      [key]: { ...prev[key], enabled: e.target.checked },
                    }))
                  }
                  className="mt-1.5 w-4 h-4 accent-primary rounded"
                />
                <div className={cn('flex-1', !enabled && 'opacity-50')}>
                  <RangeSlider
                    label={focusAreaKeyToLabel[key] || key}
                    value={value}
                    onChange={(newValue) =>
                      setFocusAreas((prev) => ({
                        ...prev,
                        [key]: { ...prev[key], value: newValue },
                      }))
                    }
                    disabled={!enabled}
                  />
                </div>
              </div>
            ))}
          </div>
        </Accordion>

        {/* Macros & Nutrition */}
        <Accordion number={4} title="Macros & Nutrition (per meal)" subtitle="Goals set">
          <p className="text-sm text-text-muted-light dark:text-text-muted-dark mb-4">
            Set target macros per meal, not daily totals.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Calories"
              type="number"
              suffix="kcal"
              value={macros.calories}
              onChange={(e) =>
                setMacros((prev) => ({ ...prev, calories: Number(e.target.value) }))
              }
            />
            <Input
              label="Protein"
              type="number"
              suffix="g"
              value={macros.protein}
              onChange={(e) =>
                setMacros((prev) => ({ ...prev, protein: Number(e.target.value) }))
              }
            />
            <Input
              label="Carbohydrates"
              type="number"
              suffix="g"
              value={macros.carbs}
              onChange={(e) =>
                setMacros((prev) => ({ ...prev, carbs: Number(e.target.value) }))
              }
            />
            <Input
              label="Fats"
              type="number"
              suffix="g"
              value={macros.fats}
              onChange={(e) =>
                setMacros((prev) => ({ ...prev, fats: Number(e.target.value) }))
              }
            />
          </div>
        </Accordion>

        {/* Preferences */}
        <Accordion
          number={5}
          title="Preferences"
          subtitle={`${mustHaves.length} included, ${excludes.length} excluded`}
        >
          <div className="flex flex-col gap-6">
            <ChipInput
              label="Must Haves"
              values={mustHaves}
              onChange={setMustHaves}
              variant="success"
            />
            <ChipInput
              label="Excludes"
              values={excludes}
              onChange={setExcludes}
              variant="danger"
            />
          </div>
        </Accordion>

        {/* Weekly Schedule (Simplified) */}
        <Accordion number={6} title="Weekly Schedule" subtitle="Configure meals">
          <div className="flex flex-col gap-6">
            <RangeSlider
              label="Meals per Day"
              value={mealsPerDay}
              onChange={setMealsPerDay}
              min={1}
              max={6}
            />
            <RangeSlider
              label="Number of Days"
              value={days}
              onChange={setDays}
              min={1}
              max={7}
            />
          </div>
        </Accordion>
      </div>

      {/* Action Bar */}
      <div className="flex justify-end pt-8 pb-12">
        <Button
          icon="arrow_forward"
          onClick={handleSubmit}
          loading={generateMutation.isPending}
          disabled={!planName.trim() || hasReachedLimit}
          className="shadow-lg shadow-primary/30"
        >
          Next: Generate Preview
        </Button>
      </div>

      {/* Weekly Limit Modal */}
      {showLimitModal && (
        <WeeklyLimitModal onClose={() => setShowLimitModal(false)} />
      )}
    </div>
  )
}
