import { Client } from '@/hooks/use-clients'
import { GlassCard } from '@/components/GlassCard'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { AppButton } from '@/components/AppButton'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  ChevronDown,
  Phone,
  Mail,
  MoreHorizontal,
  Calendar,
  Eye,
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { ClientDealItem } from './ClientDealItem'

interface ClientCardProps {
  client: Client
  onSchedule: (client: Client, dealId?: string) => void
  onViewDetails: (client: Client) => void
}

export function ClientCard({
  client,
  onSchedule,
  onViewDetails,
}: ClientCardProps) {
  const [isOpen, setIsOpen] = useState(false)

  const initial = client.name ? client.name[0].toUpperCase() : '?'

  const activeDeals = client.deals.filter(
    (d) => d.status === 'active' && d.completed_sessions < d.total_sessions,
  )
  const completedDeals = client.deals.filter(
    (d) => d.completed_sessions >= d.total_sessions,
  )

  const handleScheduleDeal = (dealId: string) => {
    onSchedule(client, dealId)
  }

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="group transition-all duration-300"
    >
      <GlassCard
        size="md"
        className="relative overflow-hidden transition-all duration-300 hover:shadow-lg border border-white/50 bg-white/60"
      >
        <CollapsibleTrigger asChild>
          <div className="p-6 cursor-pointer space-y-4">
            {/* Header Info */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 border-4 border-white shadow-sm">
                  <AvatarFallback className="bg-brand-lime/20 text-brand-lime-dark text-xl font-bold">
                    {initial}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-bold text-brand-slate">
                    {client.name}
                  </h3>
                  <div className="flex flex-col gap-1 text-sm text-gray-500 mt-1">
                    <div className="flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5" />
                      <span>{client.phone}</span>
                    </div>
                    {client.email && (
                      <div className="flex items-center gap-1.5">
                        <Mail className="h-3.5 w-3.5" />
                        <span className="truncate max-w-[200px]">
                          {client.email}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div
                  className={cn(
                    'h-8 w-8 rounded-full bg-white/50 flex items-center justify-center transition-transform duration-300',
                    isOpen ? 'rotate-180 bg-brand-lime text-brand-slate' : '',
                  )}
                >
                  <ChevronDown className="h-5 w-5" />
                </div>
              </div>
            </div>

            {/* Mini stats when collapsed */}
            {!isOpen && (
              <div className="flex gap-4 pt-2">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-brand-lime animate-pulse" />
                  <span className="text-xs font-medium text-gray-600">
                    {activeDeals.length} ativos
                  </span>
                </div>
                {completedDeals.length > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-gray-300" />
                    <span className="text-xs font-medium text-gray-400">
                      {completedDeals.length} finalizados
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="px-6 pb-6 pt-0 space-y-4">
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                Contratos
              </h4>
              {client.deals.length === 0 ? (
                <p className="text-sm text-gray-400 italic">
                  Nenhum contrato encontrado.
                </p>
              ) : (
                client.deals.map((deal) => (
                  <ClientDealItem
                    key={deal.id}
                    deal={deal}
                    onSchedule={handleScheduleDeal}
                  />
                ))
              )}
            </div>

            {/* Actions Footer */}
            <div className="pt-4 mt-4 border-t border-gray-100 flex gap-2">
              <AppButton
                variant="outline"
                className="flex-1"
                onClick={() => onSchedule(client)}
              >
                <Calendar className="mr-2 h-4 w-4 text-sky-500" />
                Agendar Sessão
              </AppButton>
              <AppButton
                variant="outline"
                className="flex-1"
                onClick={() => onViewDetails(client)}
              >
                <Eye className="mr-2 h-4 w-4 text-brand-lime" />
                Ver Detalhes
              </AppButton>
            </div>
          </div>
        </CollapsibleContent>
      </GlassCard>
    </Collapsible>
  )
}
