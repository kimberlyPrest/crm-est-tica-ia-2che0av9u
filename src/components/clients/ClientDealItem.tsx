import { Deal } from '@/hooks/use-clients'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { AppButton } from '@/components/AppButton'
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
} from 'lucide-react'
import { format, isBefore, startOfDay, addDays, isAfter } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { cn } from '@/lib/utils'

interface ClientDealItemProps {
  deal: Deal
  onSchedule: (dealId: string) => void
}

export function ClientDealItem({ deal, onSchedule }: ClientDealItemProps) {
  const today = startOfDay(new Date())
  const progress =
    deal.total_sessions > 0
      ? (deal.completed_sessions / deal.total_sessions) * 100
      : 0

  const isCompleted = deal.completed_sessions >= deal.total_sessions
  const nextDue = deal.next_session_due ? new Date(deal.next_session_due) : null

  let statusBadge = null
  let statusMessage = null

  if (isCompleted) {
    statusBadge = (
      <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-emerald-200 gap-1">
        <CheckCircle2 className="h-3 w-3" /> Finalizado
      </Badge>
    )
  } else if (deal.status !== 'active') {
    statusBadge = <Badge variant="secondary">Inativo</Badge>
  } else if (nextDue && isBefore(nextDue, today)) {
    statusBadge = (
      <Badge className="bg-red-100 text-red-600 hover:bg-red-200 border-red-200 gap-1 animate-pulse">
        <AlertCircle className="h-3 w-3" /> Sessão Atrasada
      </Badge>
    )
    statusMessage = `Venceu em ${format(nextDue, 'dd/MM/yyyy')}`
  } else if (nextDue && isBefore(nextDue, addDays(today, 7))) {
    statusBadge = (
      <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200 border-amber-200 gap-1">
        <Calendar className="h-3 w-3" /> Agendar Retorno
      </Badge>
    )
    statusMessage = `Vence em ${format(nextDue, 'dd/MM/yyyy')}`
  } else {
    statusBadge = (
      <Badge className="bg-sky-100 text-sky-700 hover:bg-sky-200 border-sky-200 gap-1">
        <Clock className="h-3 w-3" /> Em andamento
      </Badge>
    )
  }

  const netValue = deal.total_value - (deal.discount_value || 0)

  return (
    <div className="p-4 rounded-xl bg-white/40 border border-white/40 space-y-3">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-semibold text-brand-slate">
            {deal.products?.name || 'Tratamento'}
          </h4>
          <p className="text-xs text-gray-500">
            {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            }).format(netValue)}
          </p>
        </div>
        {statusBadge}
      </div>

      <div className="space-y-1">
        <div className="flex justify-between text-xs font-medium text-gray-600">
          <span>Progresso do tratamento</span>
          <span>
            {deal.completed_sessions} de {deal.total_sessions} sessões
          </span>
        </div>
        <Progress value={progress} className="h-2 bg-gray-100" />
      </div>

      <div className="flex items-center justify-between pt-2">
        <span className="text-xs text-red-500 font-medium">
          {statusMessage}
        </span>
        {!isCompleted && deal.status === 'active' && (
          <AppButton
            variant="ghost"
            size="sm"
            className="h-8 text-xs text-sky-600 hover:text-sky-700 hover:bg-sky-50 px-2"
            onClick={() => onSchedule(deal.id)}
          >
            Agendar Sessão <ExternalLink className="ml-1 h-3 w-3" />
          </AppButton>
        )}
      </div>
    </div>
  )
}
