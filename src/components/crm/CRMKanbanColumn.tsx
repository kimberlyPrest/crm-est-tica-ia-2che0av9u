import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CRMLead } from '@/hooks/use-crm-data'
import { LeadCard } from '@/components/crm/LeadCard'
import { cn } from '@/lib/utils'

interface CRMKanbanColumnProps {
  id: string
  title: string
  color: string
  leads: CRMLead[]
  onLeadClick: (lead: CRMLead) => void
  onSchedule: (lead: CRMLead) => void
}

export function CRMKanbanColumn({
  id,
  title,
  color,
  leads,
  onLeadClick,
  onSchedule,
}: CRMKanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
  })

  return (
    <div className="flex flex-col min-w-[320px] max-w-[320px] h-full">
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full shadow-sm"
            style={{ backgroundColor: color }}
          />
          <h3 className="font-bold text-brand-slate text-sm">{title}</h3>
          <span className="bg-white/50 px-2 py-0.5 rounded-full text-xs font-medium text-gray-500">
            {leads.length}
          </span>
        </div>
      </div>

      {/* Column Content (Droppable Area) */}
      <div
        ref={setNodeRef}
        className={cn(
          'flex-1 rounded-2xl p-2 transition-colors duration-200 overflow-y-auto scrollbar-hide',
          isOver ? 'bg-brand-lime/5 ring-2 ring-brand-lime/20' : '',
        )}
      >
        <div className="flex flex-col gap-3 pb-4">
          {leads.map((lead) => (
            <LeadCard
              key={lead.id}
              lead={lead}
              onClick={() => onLeadClick(lead)}
              onSchedule={onSchedule}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
