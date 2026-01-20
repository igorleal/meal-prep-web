import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Icon } from '@/components/common'
import type { ReceitAIPlanResponse } from '@/types'

export default function MealPlanRecipeDetailPage() {
  const navigate = useNavigate()
  const [plan, setPlan] = useState<ReceitAIPlanResponse | null>(null)

  useEffect(() => {
    const stored = sessionStorage.getItem('viewingMealPlan')
    if (stored) {
      setPlan(JSON.parse(stored))
    } else {
      navigate('/meal-plans')
    }
  }, [navigate])

  if (!plan) {
    return null
  }

  const { recipe, request } = plan

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      {/* Hero image */}
      <div className="relative h-72 lg:h-96 w-full">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url("https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200&auto=format&fit=crop")`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Back button */}
        <div className="absolute top-4 left-4 z-20">
          <Button
            variant="secondary"
            icon="arrow_back"
            iconPosition="left"
            onClick={() => {
              sessionStorage.removeItem('viewingMealPlan')
              navigate('/meal-plans')
            }}
            className="bg-white/20 backdrop-blur-md border-0 text-white hover:bg-white hover:text-primary"
          >
            Back to Meal Plans
          </Button>
        </div>

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 w-full p-6 lg:p-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-2">
            {recipe.name}
          </h1>
          <div className="flex items-center gap-6 text-white/90 text-sm font-medium">
            <div className="flex items-center gap-1.5">
              <Icon name="restaurant" className="text-[18px]" />
              <span>{request.mealsPerDay * request.days} Meals</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Icon name="calendar_today" className="text-[18px]" />
              <span>{request.days} Days</span>
            </div>
            {recipe.cookTime && (
              <div className="flex items-center gap-1.5">
                <Icon name="schedule" className="text-[18px]" />
                <span>{recipe.cookTime}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto p-6 lg:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left column - Nutrition & Info */}
          <div className="lg:col-span-4 space-y-6">
            {/* Plan Name */}
            <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-2xl border border-border-light dark:border-border-dark shadow-sm">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-none">
                  <Icon name="auto_awesome" />
                </div>
                <div>
                  <p className="text-xs font-bold text-text-muted-light dark:text-text-muted-dark uppercase tracking-wide mb-1">
                    Plan Name
                  </p>
                  <p className="font-bold text-text-main-light dark:text-white text-lg">
                    {request.name}
                  </p>
                </div>
              </div>
            </div>

            {/* Nutrition Facts */}
            <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-2xl border border-border-light dark:border-border-dark shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-text-main-light dark:text-white">
                  Nutrition Facts
                </h3>
                <span className="text-xs font-medium text-text-muted-light dark:text-text-muted-dark bg-background-light dark:bg-background-dark px-2 py-1 rounded">
                  Per Serving
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-background-light dark:bg-background-dark rounded-xl text-center">
                  <span className="block text-2xl font-extrabold text-primary">
                    {recipe.macros.calories || '-'}
                  </span>
                  <span className="text-xs font-bold text-text-muted-light dark:text-text-muted-dark uppercase tracking-wide">
                    Calories
                  </span>
                </div>
                <div className="p-4 bg-background-light dark:bg-background-dark rounded-xl text-center">
                  <span className="block text-2xl font-extrabold text-text-main-light dark:text-white">
                    {recipe.macros.protein || '-'}g
                  </span>
                  <span className="text-xs font-bold text-text-muted-light dark:text-text-muted-dark uppercase tracking-wide">
                    Protein
                  </span>
                </div>
                <div className="p-4 bg-background-light dark:bg-background-dark rounded-xl text-center">
                  <span className="block text-2xl font-extrabold text-text-main-light dark:text-white">
                    {recipe.macros.carbs || '-'}g
                  </span>
                  <span className="text-xs font-bold text-text-muted-light dark:text-text-muted-dark uppercase tracking-wide">
                    Carbs
                  </span>
                </div>
                <div className="p-4 bg-background-light dark:bg-background-dark rounded-xl text-center">
                  <span className="block text-2xl font-extrabold text-text-main-light dark:text-white">
                    {recipe.macros.fats || '-'}g
                  </span>
                  <span className="text-xs font-bold text-text-muted-light dark:text-text-muted-dark uppercase tracking-wide">
                    Fat
                  </span>
                </div>
              </div>
            </div>

            {/* Servings info */}
            <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-2xl border border-border-light dark:border-border-dark shadow-sm">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-none">
                  <Icon name="group" />
                </div>
                <div>
                  <p className="text-xs font-bold text-text-muted-light dark:text-text-muted-dark uppercase tracking-wide mb-1">
                    Servings
                  </p>
                  <p className="font-bold text-text-main-light dark:text-white text-lg">
                    {recipe.servings} People
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right column - Ingredients & Instructions */}
          <div className="lg:col-span-8 space-y-10">
            {/* Ingredients */}
            <section>
              <h3 className="text-2xl font-extrabold text-text-main-light dark:text-white mb-6 flex items-center gap-3">
                Ingredients
                <span className="h-px flex-1 bg-border-light dark:bg-border-dark ml-4" />
              </h3>
              <div className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-border-light dark:border-border-dark shadow-sm p-6 lg:p-8">
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                  {recipe.ingredients.map((ing, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-text-main-light dark:text-white"
                    >
                      <Icon
                        name="radio_button_unchecked"
                        className="text-border-light dark:text-border-dark text-[20px] mt-0.5"
                      />
                      <span>
                        <strong className="font-bold">
                          {ing.quantity} {ing.unit}
                        </strong>{' '}
                        {ing.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Instructions */}
            <section>
              <h3 className="text-2xl font-extrabold text-text-main-light dark:text-white mb-6 flex items-center gap-3">
                Preparation
                <span className="h-px flex-1 bg-border-light dark:bg-border-dark ml-4" />
              </h3>
              <div className="space-y-6">
                {recipe.instructions.split('\n').filter(Boolean).map((step, i) => (
                  <div key={i} className="flex gap-4 md:gap-6 group">
                    <div className="flex-none flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg shadow-md">
                        {i + 1}
                      </div>
                      {i < recipe.instructions.split('\n').filter(Boolean).length - 1 && (
                        <div className="w-0.5 h-full bg-border-light dark:bg-border-dark mt-2" />
                      )}
                    </div>
                    <div className="pb-8">
                      <p className="text-text-main-light dark:text-white/80 leading-relaxed text-base">
                        {step}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
