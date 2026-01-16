import { CRMLead, CRMStatus } from '@/hooks/use-crm-data'
import { LeadCard } from './LeadCard'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Inbox } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface CRMKanbanColumnProps {
  status: CRMStatus
  leads: CRMLead[]
  onLeadDrop: (lead: CRMLead, targetStatusId: string) => void
  onLeadClick: (lead: CRMLead) => void
}

export function CRMKanbanColumn({
  status,
  leads,
  onLeadDrop,
  onLeadClick,
}: CRMKanbanColumnProps) {
  const [isDragOver, setIsDragOver] = useState(false)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const data = e.dataTransfer.getData('application/json')
    if (data) {
      try {
        const lead = JSON.parse(data) as CRMLead
        if (lead.status_id !== status.id) {
          onLeadDrop(lead, status.id)
        }
      } catch (err) {
        console.error('Failed to parse dropped lead', err)
      }
    }
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        'flex flex-col h-full min-w-[320px] max-w-[320px] rounded-2xl bg-white/30 backdrop-blur-sm border transition-all duration-300 overflow-hidden',
        isDragOver
          ? 'border-2 border-dashed border-brand-lime bg-brand-lime/5 scale-[1.01]'
          : 'border-white/20',
      )}
    >
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
        <div className="flex flex-col gap-3 pb-4 min-h-[100px]">
          {leads.length === 0 && !isDragOver ? (
            <div className="flex flex-col items-center justify-center py-10 text-gray-400 gap-2 opacity-60">
              <Inbox className="h-10 w-10" />
              <span className="text-xs font-medium">
                Nenhum lead neste status
              </span>
            </div>
          ) : (
            leads.map((lead) => (
              <div key={lead.id} className="animate-fade-in-up">
                <LeadCard lead={lead} onClick={() => onLeadClick(lead)} />
              </div>
            ))
          )}
          {isDragOver && (
            <div className="h-32 rounded-[1.75rem] border-2 border-dashed border-gray-300 bg-gray-50/50 animate-pulse flex items-center justify-center text-gray-400 text-sm">
              Solte aqui
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
