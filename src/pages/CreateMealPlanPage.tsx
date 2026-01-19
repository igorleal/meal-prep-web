import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import {
  Button,
  Input,
  Accordion,
  Chip,
  ChipInput,
  RangeSlider,
} from '@/components/common'
import { receitaiPlanService } from '@/api/services'
import type { FocusArea, GenerateReceitAIPlanRequest } from '@/types'

const dietaryRestrictions = [
  'Vegan',
  'Vegetarian',
  'Keto',
  'Paleo',
  'Gluten-Free',
  'Dairy-Free',
  'Nut-Free',
]

const focusAreaLabels: Record<string, FocusArea> = {
  'High Protein': 'HIGH_PROTEIN',
  'Low Carb': 'LOW_CARB',
  'Quick Prep': 'QUICK_MEALS',
  'Budget Friendly': 'BUDGET_FRIENDLY',
  'Long Lasting': 'LONG_LASTING',
  'Eco Friendly': 'ECO_FRIENDLY',
}

export default function CreateMealPlanPage() {
  const navigate = useNavigate()

  // Form state
  const [planName, setPlanName] = useState('Summer Cut Plan')
  const [selectedRestrictions, setSelectedRestrictions] = useState<string[]>([])
  const [focusAreas, setFocusAreas] = useState({
    'High Protein': 4,
    'Low Carb': 2,
    'Quick Prep': 5,
  })
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

  const generateMutation = useMutation({
    mutationFn: receitaiPlanService.generateRecipes,
    onSuccess: (recipes) => {
      // Store recipes and request data in session storage for the next page
      const requestId = `req-${Date.now()}`
      sessionStorage.setItem(
        'pendingMealPlan',
        JSON.stringify({
          requestId,
          planName,
          recipes,
        })
      )
      navigate('/meal-plans/recipes')
    },
  })

  const handleSubmit = () => {
    const request: GenerateReceitAIPlanRequest = {
      name: planName,
      focusAreas: Object.entries(focusAreas).reduce(
        (acc, [label, value]) => {
          const key = focusAreaLabels[label]
          if (key) acc[key] = value
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

  const toggleRestriction = (restriction: string) => {
    setSelectedRestrictions((prev) =>
      prev.includes(restriction)
        ? prev.filter((r) => r !== restriction)
        : [...prev, restriction]
    )
  }

  const progress = 33 // Step 1 of 3

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-8 py-8">
      {/* Header & Progress */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-text-main-light dark:text-white mb-2">
          Let&apos;s build your plan
        </h1>
        <p className="text-text-muted-light dark:text-primary/80 mb-6">
          Step 1 of 3: Configuration
        </p>

        <div className="flex flex-col gap-2">
          <div className="flex gap-6 justify-between text-sm font-medium">
            <span className="text-text-main-light dark:text-white">Configuration</span>
            <span className="text-gray-400">Preview</span>
            <span className="text-gray-400">Confirm</span>
          </div>
          <div className="rounded-full bg-border-light dark:bg-white/10 h-2 overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
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
          <div className="flex flex-wrap gap-3">
            {dietaryRestrictions.map((restriction) => (
              <Chip
                key={restriction}
                selected={selectedRestrictions.includes(restriction)}
                onSelect={() => toggleRestriction(restriction)}
              >
                {restriction}
              </Chip>
            ))}
          </div>
        </Accordion>

        {/* Focus Areas */}
        <Accordion number={3} title="Focus Areas" subtitle="Set priorities">
          <div className="flex flex-col gap-6">
            {Object.entries(focusAreas).map(([label, value]) => (
              <RangeSlider
                key={label}
                label={label}
                value={value}
                onChange={(newValue) =>
                  setFocusAreas((prev) => ({ ...prev, [label]: newValue }))
                }
              />
            ))}
          </div>
        </Accordion>

        {/* Macros & Nutrition */}
        <Accordion number={4} title="Macros & Nutrition" subtitle="Goals set">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Daily Calories"
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
          className="shadow-lg shadow-primary/30"
        >
          Next: Generate Preview
        </Button>
      </div>
    </div>
  )
}
