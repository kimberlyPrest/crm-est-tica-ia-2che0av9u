import { CRMLead, CRMStatus } from '@/hooks/use-crm-data'
import { LeadCard } from './LeadCard'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Inbox } from 'lucide-react'

interface CRMKanbanColumnProps {
  status: CRMStatus
  leads: CRMLead[]
}

export function CRMKanbanColumn({ status, leads }: CRMKanbanColumnProps) {
  return (
    <div className="flex flex-col h-full min-w-[320px] max-w-[320px] rounded-2xl bg-white/30 backdrop-blur-sm border border-white/20 overflow-hidden">
      {/* Column Header */}
      <div className="p-4 flex items-center justify-between bg-white/40 border-b border-white/20">
        <div className="flex items-center gap-2">
          <div
            className="h-3 w-3 rounded-full shadow-sm"
            style={{ backgroundColor: status.color }}
          />
          <h3 className="font-bold text-gray-700 text-sm">{status.name}</h3>
        </div>
        <Badge
          variant="secondary"
          className="bg-white/60 text-gray-600 hover:bg-white/80 font-bold"
        >
          {leads.length}
        </Badge>
      </div>

      {/* Column Content */}
      <ScrollArea className="flex-1 p-3">
        <div className="flex flex-col gap-3 pb-4">
          {leads.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-gray-400 gap-2 opacity-60">
              <Inbox className="h-10 w-10" />
              <span className="text-xs font-medium">
                Nenhum lead neste status
              </span>
            </div>
          ) : (
            leads.map((lead) => (
              <div key={lead.id} className="animate-fade-in-up">
                <LeadCard lead={lead} />
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
