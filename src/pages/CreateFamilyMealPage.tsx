import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Button, Icon, WeeklyLimitBanner, ChipInput } from '@/components/common'
import { userService } from '@/api/services'
import { useAuth } from '@/context/AuthContext'

const suggestedRestrictions = ['Gluten-Free', 'Vegetarian', 'Vegan', 'Keto', 'Dairy-Free', 'Paleo']

export default function CreateFamilyMealPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user } = useAuth()

  // Fetch current user to check weekly limit
  const { data: currentUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: userService.getMe,
  })

  // Parse date from URL params
  const dateParam = searchParams.get('date') || new Date().toISOString().split('T')[0]
  const mealType = searchParams.get('meal') || 'Dinner'

  const [restrictions, setRestrictions] = useState<string[]>([])
  const [mustHaves, setMustHaves] = useState<string[]>([])
  const [mustHaveInput, setMustHaveInput] = useState('')
  const [exclusions, setExclusions] = useState('')

  const hasReachedLimit = currentUser?.hasReachedWeeklyLimit ?? false

  // Pre-fill dietary restrictions from user profile
  useEffect(() => {
    if (user?.restrictions) {
      setRestrictions(user.restrictions)
    }
  }, [user?.restrictions])

  const addSuggestedRestriction = (restriction: string) => {
    if (!restrictions.includes(restriction)) {
      setRestrictions([...restrictions, restriction])
    }
  }

  // Parse date for display
  const date = new Date(dateParam)
  const dayName = date.toLocaleDateString('en-US', { weekday: 'long' })
  const month = date.toLocaleDateString('en-US', { month: 'short' })
  const dayNum = date.getDate()

  const handleAddMustHave = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && mustHaveInput.trim()) {
      e.preventDefault()
      if (!mustHaves.includes(mustHaveInput.trim())) {
        setMustHaves([...mustHaves, mustHaveInput.trim()])
      }
      setMustHaveInput('')
    }
  }

  const removeMustHave = (item: string) => {
    setMustHaves(mustHaves.filter((h) => h !== item))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const request = {
      date: dateParam,
      restrictions,
      mustHaves,
      exclusions: exclusions.split(',').map((s) => s.trim()).filter(Boolean),
    }
    // Store request and navigate immediately - the selection page will make the API call
    sessionStorage.setItem(
      'pendingFamilyMealRequest',
      JSON.stringify({
        date: dateParam,
        mealType,
        restrictions,
        mustHaves,
        exclusions: exclusions.split(',').map((s) => s.trim()).filter(Boolean),
        request,
      })
    )
    // Clear any previous recipes
    sessionStorage.removeItem('pendingFamilyMeal')
    navigate('/calendar/recipes')
  }

  return (
    <div className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark p-6 lg:p-10 flex justify-center">
      <div className="w-full max-w-3xl">
        {/* Back link */}
        <button
          onClick={() => navigate('/calendar')}
          className="inline-flex items-center text-text-muted-light dark:text-text-muted-dark hover:text-primary mb-8 transition-colors font-bold text-sm gap-2 group"
        >
          <Icon name="arrow_back" size="sm" className="group-hover:-translate-x-1 transition-transform" />
          Back to Monthly View
        </button>

        {/* Weekly Limit Banner */}
        {hasReachedLimit && <WeeklyLimitBanner />}

        {/* Header */}
        <div className="space-y-2 mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-text-main-light dark:text-white tracking-tight">
            Let&apos;s build your plan
          </h1>
          <p className="text-lg text-text-muted-light dark:text-text-muted-dark">
            Customize your meal for this slot. AI will generate options based on your preferences.
          </p>
        </div>

        {/* Date Card */}
        <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-2xl p-6 shadow-sm mb-10 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-2 h-full bg-primary" />
          <div className="flex items-center gap-5 relative z-10">
            <div className="bg-primary/10 text-primary p-3 rounded-xl min-w-[70px] text-center border border-primary/10">
              <span className="block text-xs font-bold uppercase tracking-wider mb-0.5">{month}</span>
              <span className="block text-3xl font-extrabold leading-none">{dayNum.toString().padStart(2, '0')}</span>
            </div>
            <h3 className="text-xl font-bold text-text-main-light dark:text-white">
              {dayName} {mealType}
            </h3>
          </div>
          <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Dietary Restrictions */}
          <div className="space-y-4">
            <label className="text-text-main-light dark:text-white font-bold text-lg flex items-center gap-2">
              <Icon name="spa" className="text-primary" />
              Dietary Restrictions
            </label>
            <ChipInput
              values={restrictions}
              onChange={setRestrictions}
              placeholder="Type a restriction and press Enter..."
            />
            {/* Suggested restrictions */}
            <div className="flex flex-wrap gap-2">
              <span className="text-xs text-text-muted-light dark:text-text-muted-dark py-1">
                Suggestions:
              </span>
              {suggestedRestrictions
                .filter((r) => !restrictions.includes(r))
                .map((restriction) => (
                  <button
                    key={restriction}
                    type="button"
                    onClick={() => addSuggestedRestriction(restriction)}
                    className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    {restriction}
                  </button>
                ))}
            </div>
          </div>

          {/* Must Have Ingredients */}
          <div className="space-y-4">
            <div className="flex justify-between items-baseline">
              <label className="text-text-main-light dark:text-white font-bold text-lg flex items-center gap-2">
                <Icon name="grocery" className="text-primary" />
                Must Have Ingredients
              </label>
              <span className="text-xs font-bold text-primary uppercase tracking-wide">Optional</span>
            </div>
            <div className="bg-surface-light dark:bg-white/5 p-4 rounded-xl border border-border-light dark:border-border-dark focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all shadow-sm">
              <div className="flex flex-wrap gap-2 mb-2">
                {mustHaves.map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-1.5 bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full text-sm font-bold"
                  >
                    {item}
                    <button
                      type="button"
                      onClick={() => removeMustHave(item)}
                      className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                    >
                      <Icon name="close" size="sm" />
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                value={mustHaveInput}
                onChange={(e) => setMustHaveInput(e.target.value)}
                onKeyDown={handleAddMustHave}
                placeholder="Type an ingredient and press Enter..."
                className="w-full bg-transparent border-none p-0 text-text-main-light dark:text-white placeholder:text-text-muted-light dark:placeholder:text-text-muted-dark focus:ring-0 text-base"
              />
            </div>
            <p className="text-sm text-text-muted-light dark:text-text-muted-dark pl-1">
              Ingredients you want to use up or are specifically craving today.
            </p>
          </div>

          {/* Exclude Ingredients */}
          <div className="space-y-4">
            <div className="flex justify-between items-baseline">
              <label className="text-text-main-light dark:text-white font-bold text-lg flex items-center gap-2">
                <Icon name="block" className="text-primary" />
                Exclude Ingredients
              </label>
              <span className="text-xs font-bold text-primary uppercase tracking-wide">Optional</span>
            </div>
            <div className="relative">
              <input
                type="text"
                value={exclusions}
                onChange={(e) => setExclusions(e.target.value)}
                placeholder="e.g. Peanuts, Mushrooms, Shellfish..."
                className="w-full bg-surface-light dark:bg-white/5 border border-border-light dark:border-border-dark rounded-xl py-4 pl-12 pr-4 text-text-main-light dark:text-white placeholder:text-text-muted-light/70 focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-sm transition-all"
              />
              <Icon
                name="search_off"
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted-light dark:text-text-muted-dark"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="pt-8 pb-10">
            <Button
              type="submit"
              className="w-full py-4 text-lg font-extrabold shadow-lg shadow-primary/30"
              icon="auto_awesome"
              disabled={hasReachedLimit}
            >
              Generate Recipe Suggestions
            </Button>
            <p className="text-center text-xs text-text-muted-light dark:text-text-muted-dark mt-4">
              AI will generate 3 personalized options based on your preferences.
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
