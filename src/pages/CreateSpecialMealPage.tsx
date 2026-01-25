import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Button, Icon, Card, DatePicker, WeeklyLimitBanner } from '@/components/common'
import { userService } from '@/api/services'
import { cn } from '@/utils/cn'

const dietaryOptions = [
  { id: 'vegetarian', label: 'Vegetarian', icon: 'eco' },
  { id: 'vegan', label: 'Vegan', icon: 'spa' },
  { id: 'gluten-free', label: 'Gluten-Free', icon: 'grain' },
  { id: 'dairy-free', label: 'Dairy-Free', icon: 'egg_alt' },
  { id: 'nut-free', label: 'Nut-Free', icon: 'hide_source' },
]

export default function CreateSpecialMealPage() {
  const navigate = useNavigate()

  // Fetch current user to check weekly limit
  const { data: currentUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: userService.getMe,
  })

  const [name, setName] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [dateError, setDateError] = useState('')
  const [restrictions, setRestrictions] = useState<string[]>([])
  const [customRestriction, setCustomRestriction] = useState('')
  const [mustHaves, setMustHaves] = useState<string[]>([])
  const [mustHaveInput, setMustHaveInput] = useState('')
  const [exclusions, setExclusions] = useState<string[]>([])
  const [exclusionInput, setExclusionInput] = useState('')

  const hasReachedLimit = currentUser?.hasReachedWeeklyLimit ?? false

  const isValidDate = (dateString: string): boolean => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return false
    }
    const [year, month, day] = dateString.split('-').map(Number)
    const date = new Date(year, month - 1, day)
    return (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    )
  }

  const handleDateChange = (value: string) => {
    setEventDate(value)
    // Validate when complete
    if (value.length === 10) {
      if (!isValidDate(value)) {
        setDateError('Please enter a valid date')
      } else {
        setDateError('')
      }
    } else {
      setDateError('')
    }
  }

  const toggleRestriction = (id: string) => {
    setRestrictions((prev) =>
      prev.includes(id)
        ? prev.filter((r) => r !== id)
        : [...prev, id]
    )
  }

  const handleAddCustomRestriction = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && customRestriction.trim()) {
      e.preventDefault()
      if (!restrictions.includes(customRestriction.trim())) {
        setRestrictions([...restrictions, customRestriction.trim()])
      }
      setCustomRestriction('')
    }
  }

  const removeRestriction = (item: string) => {
    setRestrictions(restrictions.filter((r) => r !== item))
  }

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

  const handleAddExclusion = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && exclusionInput.trim()) {
      e.preventDefault()
      if (!exclusions.includes(exclusionInput.trim())) {
        setExclusions([...exclusions, exclusionInput.trim()])
      }
      setExclusionInput('')
    }
  }

  const removeExclusion = (item: string) => {
    setExclusions(exclusions.filter((e) => e !== item))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate date before submitting
    if (!isValidDate(eventDate)) {
      setDateError('Please enter a valid date')
      return
    }

    const request = {
      name,
      eventDate,
      mustHaves,
      restrictions,
      exclusions,
    }

    // Store request and navigate immediately - the selection page will make the API call
    sessionStorage.setItem(
      'pendingSpecialMealRequest',
      JSON.stringify({
        name,
        eventDate,
        restrictions,
        mustHaves,
        exclusions,
        request,
      })
    )
    // Clear any previous recipes
    sessionStorage.removeItem('pendingSpecialMeal')
    navigate('/special-meals/recipes')
  }

  return (
    <div className="max-w-[1000px] mx-auto px-6 py-8 lg:px-10 lg:py-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-8 text-sm font-medium text-text-muted-light dark:text-text-muted-dark">
        <button
          onClick={() => navigate('/special-meals')}
          className="hover:text-primary flex items-center gap-1 transition-colors"
        >
          <Icon name="arrow_back" size="sm" />
          Back to Dashboard
        </button>
        <span className="text-gray-300">/</span>
        <span className="text-text-main-light dark:text-white">Create Event</span>
      </div>

      {/* Weekly Limit Banner */}
      {hasReachedLimit && <WeeklyLimitBanner />}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Main form */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          {/* Header */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                Food with Friends
              </span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-extrabold text-text-main-light dark:text-white mb-3">
              What are you planning?
            </h1>
            <p className="text-text-muted-light dark:text-text-muted-dark text-lg">
              Let&apos;s start with the basics to curate the perfect menu for your guests.
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-border-light dark:border-border-dark shadow-sm p-6 lg:p-8 space-y-8"
          >
            {/* Event Name */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-text-main-light dark:text-white flex justify-between">
                Event Name
                <span className="text-text-muted-light dark:text-text-muted-dark font-normal text-xs">Required</span>
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Icon name="celebration" className="text-primary text-xl" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Game Night, Birthday Brunch, Potluck"
                  required
                  className="block w-full pl-12 pr-4 py-4 border-2 border-border-light dark:border-border-dark rounded-xl text-lg font-semibold text-text-main-light dark:text-white bg-background-light dark:bg-white/5 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors placeholder:text-text-muted-light/60 placeholder:font-normal"
                />
              </div>
            </div>

            {/* Event Date */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-text-main-light dark:text-white flex justify-between">
                Event Date
                <span className="text-text-muted-light dark:text-text-muted-dark font-normal text-xs">Required</span>
              </label>
              <DatePicker
                value={eventDate}
                onChange={handleDateChange}
                error={dateError}
                required
              />
            </div>

            {/* Dietary Restrictions */}
            <div className="space-y-4">
              <label className="block text-sm font-bold text-text-main-light dark:text-white">
                Dietary Restrictions for Guests
              </label>
              <div className="flex flex-wrap gap-3">
                {dietaryOptions.map((option) => (
                  <label key={option.id} className="cursor-pointer group relative">
                    <input
                      type="checkbox"
                      checked={restrictions.includes(option.id)}
                      onChange={() => toggleRestriction(option.id)}
                      className="peer sr-only"
                    />
                    <span
                      className={cn(
                        'flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all',
                        restrictions.includes(option.id)
                          ? 'bg-primary text-white border-primary'
                          : 'border-border-light dark:border-border-dark bg-background-light dark:bg-white/5 text-text-muted-light dark:text-text-muted-dark hover:bg-gray-100 dark:hover:bg-white/10'
                      )}
                    >
                      <Icon name={option.icon} size="sm" />
                      {option.label}
                    </span>
                  </label>
                ))}
                {/* Custom restrictions as chips */}
                {restrictions
                  .filter((r) => !dietaryOptions.some((opt) => opt.id === r))
                  .map((item) => (
                    <span
                      key={item}
                      className="inline-flex items-center gap-1.5 bg-primary text-white border border-primary px-4 py-2 rounded-full text-sm font-medium"
                    >
                      {item}
                      <button
                        type="button"
                        onClick={() => removeRestriction(item)}
                        className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                      >
                        <Icon name="close" size="sm" />
                      </button>
                    </span>
                  ))}
              </div>
              <div className="bg-surface-light dark:bg-white/5 p-4 rounded-xl border border-border-light dark:border-border-dark focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all shadow-sm">
                <input
                  type="text"
                  value={customRestriction}
                  onChange={(e) => setCustomRestriction(e.target.value)}
                  onKeyDown={handleAddCustomRestriction}
                  placeholder="Type a custom restriction and press Enter..."
                  className="w-full bg-transparent border-none p-0 text-text-main-light dark:text-white placeholder:text-text-muted-light dark:placeholder:text-text-muted-dark focus:ring-0 text-sm"
                />
              </div>
            </div>

            {/* Must-haves and Excludes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-text-main-light dark:text-white flex items-center gap-2">
                  <Icon name="check_circle" className="text-primary" size="sm" />
                  Must-haves
                </label>
                <div className="bg-surface-light dark:bg-white/5 p-3 rounded-xl border border-border-light dark:border-border-dark focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all shadow-sm min-h-[100px]">
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
                    placeholder="Type and press Enter..."
                    className="w-full bg-transparent border-none p-0 text-text-main-light dark:text-white placeholder:text-text-muted-light dark:placeholder:text-text-muted-dark focus:ring-0 text-sm"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-bold text-text-main-light dark:text-white flex items-center gap-2">
                  <Icon name="block" className="text-red-500" size="sm" />
                  Excludes
                </label>
                <div className="bg-surface-light dark:bg-white/5 p-3 rounded-xl border border-border-light dark:border-border-dark focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all shadow-sm min-h-[100px]">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {exclusions.map((item) => (
                      <span
                        key={item}
                        className="inline-flex items-center gap-1.5 bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full text-sm font-bold"
                      >
                        {item}
                        <button
                          type="button"
                          onClick={() => removeExclusion(item)}
                          className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                        >
                          <Icon name="close" size="sm" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={exclusionInput}
                    onChange={(e) => setExclusionInput(e.target.value)}
                    onKeyDown={handleAddExclusion}
                    placeholder="Type and press Enter..."
                    className="w-full bg-transparent border-none p-0 text-text-main-light dark:text-white placeholder:text-text-muted-light dark:placeholder:text-text-muted-dark focus:ring-0 text-sm"
                  />
                </div>
              </div>
            </div>
          </form>

          {/* Navigation */}
          <div className="flex items-center justify-end pt-4">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => navigate('/special-meals')}
                className="px-6 py-2.5 text-text-muted-light dark:text-text-muted-dark font-bold hover:text-text-main-light dark:hover:text-white transition-colors"
              >
                Cancel
              </button>
              <Button
                onClick={handleSubmit}
                icon="arrow_forward"
                iconPosition="right"
                disabled={!name.trim() || hasReachedLimit}
              >
                Next: Choose Theme
              </Button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="hidden lg:block lg:col-span-4 space-y-6">
          {/* AI Assistant Card */}
          <Card className="bg-gradient-to-br from-accent-green/20 to-white dark:from-accent-green/10 dark:to-surface-dark border-accent-green/20 relative overflow-hidden">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-accent-green/20 rounded-full blur-2xl" />
            <div className="flex items-center gap-2 mb-4 text-accent-green">
              <Icon name="auto_awesome" />
              <span className="text-xs font-bold uppercase tracking-wide">AI Assistant</span>
            </div>
            <h3 className="font-bold text-lg mb-2 text-text-main-light dark:text-white">
              Planning for a group?
            </h3>
            <p className="text-sm text-text-muted-light dark:text-text-muted-dark leading-relaxed mb-4">
              Be sure to list all known allergies. I&apos;ll automatically filter out recipes that contain unsafe ingredients and suggest safe alternatives!
            </p>
            <div className="bg-white/60 dark:bg-black/20 rounded-lg p-3 backdrop-blur-sm border border-white/50 dark:border-white/5">
              <div className="flex items-center gap-3 mb-2">
                <div className="size-8 rounded-full bg-accent-green/10 flex items-center justify-center text-accent-green">
                  <Icon name="lightbulb" size="sm" />
                </div>
                <span className="text-xs font-bold text-text-main-light dark:text-white">Tip: Mix it up!</span>
              </div>
              <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
                Try adding &quot;Finger foods&quot; to Must-haves for easier hosting.
              </p>
            </div>
          </Card>

        </div>
      </div>
    </div>
  )
}
