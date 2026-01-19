import { Icon, Badge, Button } from '@/components/common'
import { useNavigate } from 'react-router-dom'

interface ComingSoonPageProps {
  title: string
  icon?: string
}

export default function ComingSoonPage({ title, icon = 'construction' }: ComingSoonPageProps) {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="text-center max-w-md">
        <div className="mb-6 inline-flex items-center justify-center size-20 rounded-full bg-primary/10">
          <Icon name={icon} className="text-primary" size="xl" />
        </div>

        <Badge variant="warning" className="mb-4">
          Coming Soon
        </Badge>

        <h1 className="text-3xl font-extrabold text-text-main-light dark:text-white mb-3">
          {title}
        </h1>

        <p className="text-text-muted-light dark:text-text-muted-dark mb-8">
          We&apos;re working hard to bring you this feature. Stay tuned for updates!
        </p>

        <Button onClick={() => navigate('/')} icon="arrow_back" iconPosition="left">
          Back to Home
        </Button>
      </div>
    </div>
  )
}
