import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Icon } from './Icon'
import { LoadingSpinner } from './LoadingSpinner'
import { ingredientService } from '@/api/services'
import type { IngredientState } from '@/api/services/ingredient.service'
import type { RecipeIngredient } from '@/types'
import { useFormatUnit } from '@/hooks'

interface IngredientConversionModalProps {
  ingredient: RecipeIngredient
  onClose: () => void
}

export function IngredientConversionModal({
  ingredient,
  onClose,
}: IngredientConversionModalProps) {
  const { t } = useTranslation('common')
  const { formatUnit } = useFormatUnit()
  const currentAmount = `${ingredient.quantity} ${formatUnit(ingredient.unit)}`

  const { data, isLoading, error } = useQuery({
    queryKey: ['ingredient-conversion', ingredient.name, currentAmount],
    queryFn: () =>
      ingredientService.convertUnit({
        ingredient: ingredient.name,
        currentAmount,
      }),
  })

  const conversions = data
    ? [
        { label: t('ingredientConversion.units.grams'), value: data.grams },
        { label: t('ingredientConversion.units.milliliters'), value: data.milliliters },
        { label: t('ingredientConversion.units.deciliters'), value: data.deciliters },
        { label: t('ingredientConversion.units.tablespoons'), value: data.tablespoons },
        { label: t('ingredientConversion.units.cups'), value: data.cups },
      ].filter((c): c is { label: string; value: string } =>
        c.value !== null && c.value !== '0' && c.value !== '-'
      )
    : []

  const getStateLabel = (state: IngredientState): string => {
    return t(`ingredientConversion.states.${state.toLowerCase()}`)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-surface-light dark:bg-surface-dark rounded-2xl p-6 max-w-md w-full shadow-xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 h-8 w-8 flex items-center justify-center rounded-full text-text-muted-light dark:text-text-muted-dark hover:bg-background-light dark:hover:bg-background-dark transition-colors"
        >
          <Icon name="close" className="text-[20px]" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Icon name="scale" className="text-primary text-[24px]" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-text-main-light dark:text-white">
              {t('ingredientConversion.title')}
            </h3>
            <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
              {ingredient.quantity} {formatUnit(ingredient.unit)} {ingredient.name}
              {data?.detectedState && (
                <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                  {getStateLabel(data.detectedState)}
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Content */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-8 gap-3">
            <LoadingSpinner size="lg" />
            <span className="text-sm text-text-muted-light dark:text-text-muted-dark">
              {t('ingredientConversion.loading')}
            </span>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-3">
              <Icon name="error" className="text-red-600 dark:text-red-400 text-[24px]" />
            </div>
            <p className="text-text-muted-light dark:text-text-muted-dark">
              {t('ingredientConversion.error')}
            </p>
          </div>
        )}

        {data && !isLoading && (
          <>
            {/* Conversions grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {conversions.map((conversion) => (
                <div
                  key={conversion.label}
                  className="bg-background-light dark:bg-background-dark rounded-xl p-4 text-center"
                >
                  <span className="block text-xl font-bold text-text-main-light dark:text-white">
                    {conversion.value}
                  </span>
                  <span className="text-xs font-medium text-text-muted-light dark:text-text-muted-dark uppercase tracking-wide">
                    {conversion.label}
                  </span>
                </div>
              ))}
            </div>

            {/* State Conversion */}
            {data.stateConversion && (
              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800 mb-4">
                <div className="flex gap-3">
                  <Icon
                    name="swap_horiz"
                    className="text-amber-600 dark:text-amber-400 text-[20px] flex-shrink-0 mt-0.5"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-amber-800 dark:text-amber-200 mb-2">
                      {t('ingredientConversion.stateConversion.title')}
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {data.stateConversion.driedWeight && (
                        <div className="bg-white/50 dark:bg-black/20 rounded-lg p-2">
                          <span className="block text-xs text-amber-600 dark:text-amber-400">
                            {t('ingredientConversion.stateConversion.driedWeight')}
                          </span>
                          <span className="font-semibold text-amber-800 dark:text-amber-200">
                            {data.stateConversion.driedWeight}
                          </span>
                        </div>
                      )}
                      {data.stateConversion.cookedWeight && (
                        <div className="bg-white/50 dark:bg-black/20 rounded-lg p-2">
                          <span className="block text-xs text-amber-600 dark:text-amber-400">
                            {t('ingredientConversion.stateConversion.cookedWeight')}
                          </span>
                          <span className="font-semibold text-amber-800 dark:text-amber-200">
                            {data.stateConversion.cookedWeight}
                          </span>
                        </div>
                      )}
                    </div>
                    <p className="mt-2 text-xs text-amber-700 dark:text-amber-300">
                      {data.stateConversion.explanation}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Explanation */}
            {data.explanation && (
              <div className="bg-primary/5 dark:bg-primary/10 rounded-xl p-4 border border-primary/10">
                <div className="flex gap-3">
                  <Icon
                    name="lightbulb"
                    className="text-primary text-[20px] flex-shrink-0 mt-0.5"
                  />
                  <p className="text-sm text-text-main-light dark:text-white/80 leading-relaxed">
                    {data.explanation}
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
