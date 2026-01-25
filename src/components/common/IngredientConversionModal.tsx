import { useQuery } from '@tanstack/react-query'
import { Icon } from './Icon'
import { LoadingSpinner } from './LoadingSpinner'
import { ingredientService } from '@/api/services'
import type { RecipeIngredient } from '@/types'
import { formatUnit } from '@/utils/recipe'

interface IngredientConversionModalProps {
  ingredient: RecipeIngredient
  onClose: () => void
}

export function IngredientConversionModal({
  ingredient,
  onClose,
}: IngredientConversionModalProps) {
  const currentAmount = `${ingredient.quantity} ${formatUnit(ingredient.unit)}`

  const { data, isLoading, error } = useQuery({
    queryKey: ['ingredient-conversion', ingredient.name, currentAmount],
    queryFn: () =>
      ingredientService.convertUnit({
        ingredient: ingredient.name,
        currentAmount,
      }),
  })

  const conversions: { label: string; value: string }[] = data
    ? [
        { label: 'Grams', value: data.grams },
        { label: 'Milliliters', value: data.milliliters },
        { label: 'Tablespoons', value: data.tablespoons },
        { label: 'Cups', value: data.cups },
      ].filter((c) => c.value && c.value !== '0' && c.value !== '-')
    : []

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
              Unit Conversion
            </h3>
            <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
              {ingredient.quantity} {formatUnit(ingredient.unit)} {ingredient.name}
            </p>
          </div>
        </div>

        {/* Content */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-8 gap-3">
            <LoadingSpinner size="lg" />
            <span className="text-sm text-text-muted-light dark:text-text-muted-dark">
              Calculating conversions...
            </span>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-3">
              <Icon name="error" className="text-red-600 dark:text-red-400 text-[24px]" />
            </div>
            <p className="text-text-muted-light dark:text-text-muted-dark">
              Failed to get conversion. Please try again.
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
