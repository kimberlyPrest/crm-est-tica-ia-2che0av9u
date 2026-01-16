import { GlassCard } from '@/components/GlassCard'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { AppButton } from '@/components/AppButton'
import { CRMLead } from '@/hooks/use-crm-data'
import {
  AlertCircle,
  Ban,
  Calendar,
  MessageCircle,
  MoreHorizontal,
  Phone,
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { cn } from '@/lib/utils'

interface LeadCardProps {
  lead: CRMLead
  onClick?: () => void
}

export function LeadCard({ lead, onClick }: LeadCardProps) {
  const initial = lead.name ? lead.name[0].toUpperCase() : '?'

  let timeAgo = ''
  try {
    const date = lead.last_interaction_at || lead.created_at
    timeAgo = formatDistanceToNow(new Date(date), {
      addSuffix: true,
      locale: ptBR,
    })
  } catch (e) {
    timeAgo = 'Data inválida'
  }

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('application/json', JSON.stringify(lead))
    e.dataTransfer.effectAllowed = 'move'

    // Set opacity of the element being dragged
    const target = e.target as HTMLElement
    target.style.opacity = '0.5'
    target.style.transform = 'scale(1.05)'
  }

  const handleDragEnd = (e: React.DragEvent) => {
    const target = e.target as HTMLElement
    target.style.opacity = '1'
    target.style.transform = 'scale(1)'
  }

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={onClick}
      className="cursor-grab active:cursor-grabbing transform transition-all duration-200"
    >
      <GlassCard
        size="md"
        className="p-5 rounded-[1.75rem] hover:scale-[1.02] hover:shadow-[0_12px_48px_rgba(0,0,0,0.18)] transition-all duration-300 group border border-white/50 relative"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
              <AvatarFallback
                className="text-white font-bold"
                style={{ backgroundColor: lead.status?.color || '#cbd5e1' }}
              >
                {initial}
              </AvatarFallback>
            </Avatar>
            <div className="overflow-hidden">
              <h4
                className="font-bold text-brand-slate truncate max-w-[140px]"
                title={lead.name || ''}
              >
                {lead.name || 'Sem nome'}
              </h4>
              <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                <Phone className="h-3 w-3" />
                <span className="truncate">{lead.phone}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4 min-h-[24px]">
          {lead.has_pending_message && (
            <Badge
              variant="default"
              className="bg-red-100 text-red-600 hover:bg-red-200 border-none gap-1 px-2 py-0.5"
            >
              <AlertCircle className="h-3 w-3" /> Pendente
            </Badge>
          )}
          {lead.ai_agent_blocked && (
            <Badge
              variant="default"
              className="bg-orange-100 text-orange-600 hover:bg-orange-200 border-none gap-1 px-2 py-0.5"
            >
              <Ban className="h-3 w-3" /> IA Bloqueada
            </Badge>
          )}
          {lead.tags?.slice(0, 2).map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="bg-gray-100 text-gray-600 hover:bg-gray-200 border-none px-2 py-0.5"
            >
              {tag}
            </Badge>
          ))}
          {lead.tags && lead.tags.length > 2 && (
            <Badge
              variant="secondary"
              className="bg-gray-100 text-gray-600 px-2 py-0.5"
            >
              +{lead.tags.length - 2}
            </Badge>
          )}
        </div>

        {/* Footer & Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <span className="text-[10px] text-gray-400 font-medium">
            {timeAgo}
          </span>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <AppButton
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full bg-brand-sky-light/50 text-brand-sky hover:bg-brand-sky-light hover:text-brand-sky hover:scale-110"
              title="Agendar"
            >
              <Calendar className="h-4 w-4" />
            </AppButton>
            <AppButton
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full bg-brand-lavender-light/50 text-brand-lavender hover:bg-brand-lavender-light hover:text-brand-lavender hover:scale-110"
              title="Ver Chat"
            >
              <MessageCircle className="h-4 w-4" />
            </AppButton>
            <AppButton
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800 hover:scale-110"
              title="Mais Ações"
            >
              <MoreHorizontal className="h-4 w-4" />
            </AppButton>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}
