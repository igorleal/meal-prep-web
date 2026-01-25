import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Icon, Button } from '@/components/common'
import { cn } from '@/utils/cn'

interface PanelConfig {
  titleKey: string
  descriptionKey: string
  icon: string
  path: string
  buttonTextKey: string
  gradient: string
  buttonStyle: 'solid' | 'outline'
}

const panels: PanelConfig[] = [
  {
    titleKey: 'home.dietReceitai.title',
    descriptionKey: 'home.dietReceitai.description',
    icon: 'restaurant_menu',
    path: '/meal-plans',
    buttonTextKey: 'home.dietReceitai.button',
    gradient: 'linear-gradient(135deg, #ec4913 0%, #ff6b3d 100%)',
    buttonStyle: 'solid',
  },
  {
    titleKey: 'home.familyCalendar.title',
    descriptionKey: 'home.familyCalendar.description',
    icon: 'calendar_month',
    path: '/calendar',
    buttonTextKey: 'home.familyCalendar.button',
    gradient: 'linear-gradient(135deg, #F08E66 0%, #f4a585 100%)',
    buttonStyle: 'outline',
  },
  {
    titleKey: 'home.specialMeal.title',
    descriptionKey: 'home.specialMeal.description',
    icon: 'temp_preferences_custom',
    path: '/special-meals',
    buttonTextKey: 'home.specialMeal.button',
    gradient: 'linear-gradient(135deg, #5DAE63 0%, #81c786 100%)',
    buttonStyle: 'outline',
  },
]

function HomePanel({ panel, index }: { panel: PanelConfig; index: number }) {
  const navigate = useNavigate()
  const { t } = useTranslation('mealPlans')

  return (
    <div
      className={cn(
        'panel-item relative flex-1 flex flex-col justify-center items-center overflow-hidden cursor-pointer',
        'min-h-[200px] lg:min-h-0',
        index < panels.length - 1 && 'border-b lg:border-b-0 lg:border-r border-white/20'
      )}
      onClick={() => navigate(panel.path)}
    >
      {/* Background */}
      <div
        className="panel-bg absolute inset-0 z-0 transition-transform duration-700 ease-out"
        style={{ backgroundImage: panel.gradient }}
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/5 z-0 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 p-4 md:p-8 flex flex-col items-center text-center max-w-md panel-transition">
        <Icon
          name={panel.icon}
          className="text-white text-7xl mb-6 opacity-90"
          size="xl"
        />
        <h2 className="text-white text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight mb-3">
          {t(panel.titleKey)}
        </h2>
        <p className="text-white/90 text-base md:text-lg font-medium leading-relaxed mb-6 md:mb-8">
          {t(panel.descriptionKey)}
        </p>
        <Button
          variant={panel.buttonStyle === 'solid' ? 'secondary' : 'outline'}
          className={cn(
            'rounded-full uppercase tracking-wide',
            panel.buttonStyle === 'solid'
              ? 'bg-white text-primary hover:bg-white/90'
              : 'bg-white/20 backdrop-blur-sm border-2 border-white text-white hover:bg-white hover:text-[#5DAE63]'
          )}
          icon="arrow_forward"
          onClick={(e) => {
            e.stopPropagation()
            navigate(panel.path)
          }}
        >
          {t(panel.buttonTextKey)}
        </Button>
      </div>
    </div>
  )
}

export default function HomePage() {
  return (
    <div className="flex-1 flex flex-col lg:flex-row h-[calc(100vh-4rem)] md:h-[calc(100vh-4rem)]">
      {panels.map((panel, index) => (
        <HomePanel key={panel.titleKey} panel={panel} index={index} />
      ))}
    </div>
  )
}
