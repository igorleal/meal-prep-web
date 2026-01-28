import { useTranslation } from 'react-i18next'
import { useCallback } from 'react'

export function useFormatUnit() {
  const { t } = useTranslation('common')

  const formatUnit = useCallback(
    (unit: string | undefined | null): string => {
      if (!unit) return ''
      const key = unit.toLowerCase().trim()
      const translation = t(`ingredientUnits.${key}`, { defaultValue: '' })
      return translation || unit.toLowerCase()
    },
    [t]
  )

  return { formatUnit }
}
