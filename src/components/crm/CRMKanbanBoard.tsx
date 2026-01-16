import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { useState } from 'react'
import { createPortal } from 'react-dom'
import { CRMLead, CRMStatus } from '@/hooks/use-crm-data'
import { CRMKanbanColumn } from './CRMKanbanColumn'
import { LeadCard } from './LeadCard'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface CRMKanbanBoardProps {
  statuses: CRMStatus[]
  leadsByStatus: Record<string, CRMLead[]>
  refresh: () => void
  onLeadClick: (lead: CRMLead) => void
  onSchedule: (lead: CRMLead) => void
}

export function CRMKanbanBoard({
  statuses,
  leadsByStatus,
  refresh,
  onLeadClick,
  onSchedule,
}: CRMKanbanBoardProps) {
  const [activeLead, setActiveLead] = useState<CRMLead | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  )

  const handleDragStart = (event: DragStartEvent) => {
    // We are using native HTML5 drag and drop for the card visual in LeadCard
    // but dnd-kit for the column logic. This is a hybrid approach.
    // However, since LeadCard uses draggable={true}, let's stick to dnd-kit fully if possible.
    // For now, assume dnd-kit handles the logic.
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    setActiveLead(null)

    if (!over) return

    // Parse data passed via HTML5 drag event if available, or dnd-kit context
    // In this implementation, we rely on event.active.data or just parsing the ID if needed.
    // But since we use native drag in LeadCard, dnd-kit might not catch 'active' correctly unless configured.
    // Assuming we passed standard dnd-kit setup.

    // Let's implement a simpler drop handler compatible with the LeadCard native drag
    // OR just use the provided props to update status.
    // NOTE: The previous context didn't have full dnd logic. I'll implement basic status update.

    // Currently dnd-kit logic requires Draggable/Sortable components.
    // Since LeadCard has `draggable` (native), it might conflict.
    // I will assume the user wants the board to render.
    // The previous implementation of KanbanBoard wasn't provided fully, so I am creating it based on context.
    // But wait, the file exists in the list "CAN UPDATE".
  }

  // Simplified custom drag and drop handling since LeadCard uses native drag
  const onDrop = async (e: React.DragEvent, statusId: string) => {
    e.preventDefault()
    const data = e.dataTransfer.getData('application/json')
    if (!data) return

    try {
      const lead = JSON.parse(data) as CRMLead
      if (lead.status_id === statusId) return

      // Update in Supabase
      const { error } = await supabase
        .from('leads')
        .update({ status_id: statusId })
        .eq('id', lead.id)

      if (error) throw error

      toast.success('Status atualizado')
      refresh()
    } catch (error) {
      console.error('Error updating status:', error)
      toast.error('Erro ao atualizar status')
    }
  }

  return (
    <div className="flex h-full gap-4 overflow-x-auto pb-4 px-6 snap-x snap-mandatory">
      {statuses.map((status) => (
        <div
          key={status.id}
          className="snap-center h-full"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => onDrop(e, status.id)}
        >
          <CRMKanbanColumn
            id={status.id}
            title={status.name}
            color={status.color}
            leads={leadsByStatus[status.id] || []}
            onLeadClick={onLeadClick}
            onSchedule={onSchedule}
          />
        </div>
      ))}
    </div>
  )
}
