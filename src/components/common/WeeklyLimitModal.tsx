import { Icon } from './Icon'
import { Button } from './Button'

interface WeeklyLimitModalProps {
  onClose: () => void
}

export function WeeklyLimitModal({ onClose }: WeeklyLimitModalProps) {
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
            <Icon name="hourglass_empty" className="text-amber-600 dark:text-amber-400 text-[32px]" />
          </div>
          <h3 className="text-xl font-bold text-text-main-light dark:text-white mb-2">
            Weekly Limit Reached
          </h3>
          <p className="text-text-muted-light dark:text-text-muted-dark mb-6">
            You've used all your recipe generations for this week. Your quota will reset at the beginning of next week. Come back then to create more delicious meal plans!
          </p>
          <Button onClick={onClose} className="w-full">
            Got It
          </Button>
        </div>
      </div>
    </div>
  )
}
