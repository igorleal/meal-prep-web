import { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/utils/cn'
import { Icon } from './Icon'
import { Button } from './Button'

interface OnboardingTipsModalProps {
  onClose: () => void
}

const TIPS = [
  { key: 'dietaryRestrictions', icon: 'nutrition', color: 'bg-green-100 text-green-600' },
  { key: 'mealPlanner', icon: 'lunch_dining', color: 'bg-orange-100 text-orange-600' },
  { key: 'familyCalendar', icon: 'calendar_clock', color: 'bg-rose-100 text-rose-600' },
  { key: 'specialMeals', icon: 'celebration', color: 'bg-emerald-100 text-emerald-600' },
  { key: 'favorites', icon: 'favorite', color: 'bg-pink-100 text-pink-600' },
  { key: 'loadRecipes', icon: 'upload', color: 'bg-purple-100 text-purple-600' },
  { key: 'unitConverter', icon: 'scale', color: 'bg-amber-100 text-amber-600' },
]

export function OnboardingTipsModal({ onClose }: OnboardingTipsModalProps) {
  const { t } = useTranslation('onboarding')
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'center',
    containScroll: 'trimSnaps',
    dragFree: false,
  })
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [canScrollPrev, setCanScrollPrev] = useState(false)

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
    setCanScrollPrev(emblaApi.canScrollPrev())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on('select', onSelect)
    return () => {
      emblaApi.off('select', onSelect)
    }
  }, [emblaApi, onSelect])

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext()
  }, [emblaApi])

  const scrollTo = useCallback(
    (index: number) => {
      emblaApi?.scrollTo(index)
    },
    [emblaApi]
  )

  const isLastSlide = selectedIndex === TIPS.length - 1

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-lg mx-4 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header with dismiss */}
        <div className="flex justify-end p-4">
          <button
            onClick={onClose}
            className="text-sm font-medium text-text-muted-light dark:text-text-muted-dark hover:text-primary transition-colors"
          >
            {t('modal.dismissAll')}
          </button>
        </div>

        {/* Carousel */}
        <div className="overflow-hidden px-4" ref={emblaRef}>
          <div className="flex">
            {TIPS.map((tip) => (
              <div
                key={tip.key}
                className="flex-[0_0_100%] min-w-0 px-4"
              >
                <div className="flex flex-col items-center text-center pb-4">
                  {/* Icon */}
                  <div
                    className={cn(
                      'w-20 h-20 rounded-2xl flex items-center justify-center mb-6',
                      tip.color
                    )}
                  >
                    <Icon name={tip.icon} className="text-[40px]" />
                  </div>

                  {/* Title */}
                  <h2 className="text-2xl font-bold text-text-main-light dark:text-white mb-3">
                    {t(`tips.${tip.key}.title`)}
                  </h2>

                  {/* Description */}
                  <p className="text-text-muted-light dark:text-text-muted-dark leading-relaxed max-w-sm">
                    {t(`tips.${tip.key}.description`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-2 py-4">
          {TIPS.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={cn(
                'w-2 h-2 rounded-full transition-all',
                selectedIndex === index
                  ? 'bg-primary w-6'
                  : 'bg-gray-300 dark:bg-gray-600'
              )}
              aria-label={`Go to tip ${index + 1}`}
            />
          ))}
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center justify-between gap-4 p-6 pt-2">
          <Button
            variant="ghost"
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            className={cn(!canScrollPrev && 'opacity-0 pointer-events-none')}
          >
            {t('modal.previous')}
          </Button>

          <Button
            onClick={isLastSlide ? onClose : scrollNext}
            icon={isLastSlide ? undefined : 'arrow_forward'}
            iconPosition="right"
          >
            {isLastSlide ? t('modal.finish') : t('modal.next')}
          </Button>
        </div>
      </div>
    </div>
  )
}
