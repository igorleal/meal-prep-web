import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Icon, OnboardingTipsModal } from '@/components/common'
import { MobileCarousel } from '@/components/common/MobileCarousel'
import { storage } from '@/utils/storage'

interface CardConfig {
  titleKey: string
  descriptionKey: string
  icon: string
  path: string
  buttonTextKey: string
  gradient: string
  textColor: string
}

const cards: CardConfig[] = [
  {
    titleKey: 'home.mealPlans.title',
    descriptionKey: 'home.mealPlans.description',
    icon: 'lunch_dining',
    path: '/meal-plans',
    buttonTextKey: 'home.mealPlans.button',
    gradient: 'from-orange-500 to-amber-600',
    textColor: 'text-orange-50',
  },
  {
    titleKey: 'home.familyCalendar.title',
    descriptionKey: 'home.familyCalendar.description',
    icon: 'calendar_clock',
    path: '/calendar',
    buttonTextKey: 'home.familyCalendar.button',
    gradient: 'from-rose-500 to-pink-600',
    textColor: 'text-rose-50',
  },
  {
    titleKey: 'home.specialMeal.title',
    descriptionKey: 'home.specialMeal.description',
    icon: 'celebration',
    path: '/special-meals',
    buttonTextKey: 'home.specialMeal.button',
    gradient: 'from-emerald-500 to-teal-600',
    textColor: 'text-emerald-50',
  },
]

function HomeCard({ card }: { card: CardConfig }) {
  const navigate = useNavigate()
  const { t } = useTranslation('mealPlans')

  return (
    <div
      className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br ${card.gradient} p-8 shadow-lg transition-transform lg:hover:-translate-y-1 duration-300 min-h-[340px] cursor-pointer`}
      onClick={() => navigate(card.path)}
    >
      <div className="relative z-10 flex flex-col gap-4 h-full">
        {/* Icon */}
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 text-white backdrop-blur-sm shadow-inner">
          <Icon name={card.icon} className="text-[28px]" />
        </div>

        {/* Content */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-3">
            {t(card.titleKey)}
          </h2>
          <p className={`${card.textColor} font-medium leading-relaxed opacity-90 text-sm md:text-base`}>
            {t(card.descriptionKey)}
          </p>
        </div>

        {/* Button */}
        <div className="mt-auto pt-6">
          <button
            className="flex items-center justify-between w-full rounded-xl bg-white/20 py-4 px-6 text-sm font-bold text-white transition-colors hover:bg-white/30 backdrop-blur-md border border-white/10"
            onClick={(e) => {
              e.stopPropagation()
              navigate(card.path)
            }}
          >
            <span>{t(card.buttonTextKey)}</span>
            <Icon
              name="arrow_forward"
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>
        </div>
      </div>
    </div>
  )
}

export default function HomePage() {
  const { t } = useTranslation('mealPlans')
  const [showOnboarding, setShowOnboarding] = useState(false)

  useEffect(() => {
    if (!storage.getOnboardingCompleted()) {
      setShowOnboarding(true)
    }
  }, [])

  const handleOnboardingClose = () => {
    storage.setOnboardingCompleted()
    setShowOnboarding(false)
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-8 md:py-12 flex flex-col gap-8">
      {/* Greeting Section */}
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl md:text-4xl font-black tracking-tight text-[#181411] dark:text-white">
          {t('home.greeting.title')}
        </h2>
        <p className="text-[#baab9c] text-base md:text-lg">
          {t('home.greeting.subtitle')}
        </p>
      </div>

      {/* Desktop Grid */}
      <div className="hidden lg:grid grid-cols-3 gap-6">
        {cards.map((card) => (
          <HomeCard key={card.path} card={card} />
        ))}
      </div>

      {/* Mobile Carousel */}
      <div className="lg:hidden">
        <MobileCarousel
          items={cards}
          keyExtractor={(card) => card.path}
          renderItem={(card) => <HomeCard card={card} />}
        />
      </div>

      {showOnboarding && <OnboardingTipsModal onClose={handleOnboardingClose} />}
    </div>
  )
}
