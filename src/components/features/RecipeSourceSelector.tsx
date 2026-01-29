import { useTranslation } from 'react-i18next'
import { WeeklyLimitBanner } from '@/components/common'
import { RecipeSourceCard, type RecipeSourceType } from './RecipeSourceCard'

interface RecipeSourceSelectorProps {
  hasReachedWeeklyLimit: boolean
  onSelectSource: (source: RecipeSourceType) => void
}

export function RecipeSourceSelector({
  hasReachedWeeklyLimit,
  onSelectSource,
}: RecipeSourceSelectorProps) {
  const { t } = useTranslation('common')

  return (
    <div className="flex flex-col gap-6">
      {/* Weekly Limit Banner */}
      {hasReachedWeeklyLimit && <WeeklyLimitBanner />}

      {/* Source Cards */}
      <div className="flex flex-col gap-4">
        {/* Generate with AI */}
        <RecipeSourceCard
          icon="auto_awesome"
          title={t('recipeSource.ai.title')}
          description={t('recipeSource.ai.description')}
          badge={t('recipeSource.ai.badge')}
          disabled={hasReachedWeeklyLimit}
          disabledReason={hasReachedWeeklyLimit ? t('recipeSource.quotaExceeded') : undefined}
          onClick={() => onSelectSource('ai')}
        />

        {/* Load from Favorites */}
        <RecipeSourceCard
          icon="favorite"
          title={t('recipeSource.favorite.title')}
          description={t('recipeSource.favorite.description')}
          badge={t('recipeSource.favorite.badge')}
          onClick={() => onSelectSource('favorite')}
        />

        {/* Load from URL/Text */}
        <RecipeSourceCard
          icon="upload"
          title={t('recipeSource.loaded.title')}
          description={t('recipeSource.loaded.description')}
          badge={t('recipeSource.loaded.badge')}
          disabled={hasReachedWeeklyLimit}
          disabledReason={hasReachedWeeklyLimit ? t('recipeSource.quotaExceeded') : undefined}
          onClick={() => onSelectSource('loaded')}
        />
      </div>
    </div>
  )
}
