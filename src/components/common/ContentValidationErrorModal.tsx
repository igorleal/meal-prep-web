import { useTranslation } from 'react-i18next'
import { Icon } from './Icon'
import { Button } from './Button'

interface ContentValidationErrorModalProps {
  onClose: () => void
  onGoBack: () => void
}

export function ContentValidationErrorModal({ onClose, onGoBack }: ContentValidationErrorModalProps) {
  const { t } = useTranslation('common')

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
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-4">
            <Icon name="edit_note" className="text-amber-600 dark:text-amber-400 text-[32px]" />
          </div>
          <h3 className="text-xl font-bold text-text-main-light dark:text-white mb-2">
            {t('contentValidation.title')}
          </h3>
          <p className="text-text-muted-light dark:text-text-muted-dark mb-4">
            {t('contentValidation.message')}
          </p>

          {/* Examples section */}
          <div className="w-full bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 mb-6 text-left">
            <p className="text-sm font-medium text-text-main-light dark:text-white mb-2">
              {t('contentValidation.examplesTitle')}
            </p>
            <ul className="text-sm text-text-muted-light dark:text-text-muted-dark space-y-1">
              <li>{t('contentValidation.example1')}</li>
              <li>{t('contentValidation.example2')}</li>
              <li>{t('contentValidation.example3')}</li>
            </ul>
          </div>

          <div className="flex gap-3 w-full">
            <Button variant="secondary" onClick={onClose} className="flex-1">
              {t('buttons.close')}
            </Button>
            <Button onClick={onGoBack} className="flex-1">
              {t('contentValidation.editInput')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
