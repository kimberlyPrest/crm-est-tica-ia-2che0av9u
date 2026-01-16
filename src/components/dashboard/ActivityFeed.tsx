import { GlassCard } from '@/components/GlassCard'
import { Activity } from '@/hooks/use-dashboard-data'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  ArrowRight,
  Calendar,
  Check,
  DollarSign,
  MessageCircle,
  Send,
  User,
  AlertCircle,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'

interface ActivityFeedProps {
  activities: Activity[]
  loading: boolean
}

export function ActivityFeed({ activities, loading }: ActivityFeedProps) {
  const navigate = useNavigate()

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'status_change':
        return { icon: ArrowRight, color: 'text-amber-500 bg-amber-100' }
      case 'appointment_created':
        return { icon: Calendar, color: 'text-sky-500 bg-sky-100' }
      case 'appointment_confirmed':
        return { icon: Check, color: 'text-emerald-500 bg-emerald-100' }
      case 'deal_closed':
        return { icon: DollarSign, color: 'text-lime-500 bg-lime-100' }
      case 'message_sent':
        return { icon: MessageCircle, color: 'text-[#A78BFA] bg-[#A78BFA]/20' }
      case 'cadence_sent':
        return { icon: Send, color: 'text-purple-500 bg-purple-100' }
      case 'manual_action':
        return { icon: User, color: 'text-gray-500 bg-gray-100' }
      default:
        return { icon: AlertCircle, color: 'text-gray-400 bg-gray-100' }
    }
  }

  return (
    <GlassCard size="lg" className="h-full min-h-[400px] flex flex-col">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-800">Atividades Recentes</h3>
        <p className="text-sm text-gray-500">Últimas interações do sistema</p>
      </div>

      <ScrollArea className="flex-1 -mr-4 pr-4 h-[400px]">
        <div className="space-y-4">
          {loading ? (
            Array(5)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              ))
          ) : activities.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <p>Nenhuma atividade recente</p>
            </div>
          ) : (
            activities.map((activity) => {
              const { icon: Icon, color } = getActivityIcon(activity.type)
              return (
                <div
                  key={activity.id}
                  className="group flex gap-3 items-start p-2 rounded-lg hover:bg-white/40 transition-colors cursor-pointer"
                  onClick={() =>
                    activity.lead_id &&
                    navigate(`/crm?lead_id=${activity.lead_id}`)
                  }
                >
                  <div
                    className={cn(
                      'flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center mt-1',
                      color,
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 leading-snug">
                      <span className="font-semibold">
                        {activity.leads?.name || 'Lead Desconhecido'}
                      </span>{' '}
                      {activity.description}
                    </p>
                    <span className="text-xs text-gray-500 block mt-1">
                      {formatDistanceToNow(new Date(activity.created_at), {
                        addSuffix: true,
                        locale: ptBR,
                      })}
                    </span>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </ScrollArea>
    </GlassCard>
  )
}
