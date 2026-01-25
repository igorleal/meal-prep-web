import { useTranslation } from 'react-i18next'
import { Icon } from './Icon'
import { Button } from './Button'

interface SessionExpiredModalProps {
  onClose: () => void
}

export function SessionExpiredModal({ onClose }: SessionExpiredModalProps) {
  const { t } = useTranslation('auth')

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative bg-surface-light dark:bg-surface-dark rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
        {/* Icon */}
        <div className="mx-auto w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-6">
          <Icon name="lock_clock" className="text-red-500 text-[32px]" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-text-main-light dark:text-white mb-3">
          {t('session.expired')}
        </h2>

        {/* Message */}
        <p className="text-text-muted-light dark:text-text-muted-dark mb-8">
          {t('session.expiredMessage')}
        </p>

        {/* Button */}
        <Button onClick={onClose} className="w-full">
          {t('session.loginAgain')}
        </Button>
      </div>
    </div>
  )
}
