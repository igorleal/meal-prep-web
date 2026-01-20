import { Icon } from './Icon'

export function WeeklyLimitBanner() {
  return (
    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-6">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center">
          <Icon name="warning" className="text-amber-600 dark:text-amber-400" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-amber-800 dark:text-amber-200 mb-1">
            Weekly Limit Reached
          </h3>
          <p className="text-sm text-amber-700 dark:text-amber-300">
            You've reached your limit for generating new recipes this week. Please try again next week when your quota resets.
          </p>
        </div>
      </div>
    </div>
  )
}
