import { CRMLead, CRMStatus } from '@/hooks/use-crm-data'
import { CRMKanbanColumn } from './CRMKanbanColumn'
import { Skeleton } from '@/components/ui/skeleton'

interface CRMKanbanBoardProps {
  statuses: CRMStatus[]
  leadsByStatus: Record<string, CRMLead[]>
  loading: boolean
}

export function CRMKanbanBoard({
  statuses,
  leadsByStatus,
  loading,
}: CRMKanbanBoardProps) {
  if (loading) {
    return (
      <div className="flex gap-4 overflow-x-auto pb-4 h-[calc(100vh-240px)]">
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <div
              key={i}
              className="min-w-[320px] h-full rounded-2xl bg-white/20 animate-pulse p-4 space-y-4"
            >
              <div className="flex justify-between items-center">
                <Skeleton className="h-6 w-32 bg-white/40" />
                <Skeleton className="h-6 w-8 rounded-full bg-white/40" />
              </div>
              <Skeleton className="h-40 w-full rounded-[1.75rem] bg-white/30" />
              <Skeleton className="h-40 w-full rounded-[1.75rem] bg-white/30" />
              <Skeleton className="h-40 w-full rounded-[1.75rem] bg-white/30" />
            </div>
          ))}
      </div>
    )
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-6 h-[calc(100vh-220px)] snap-x snap-mandatory md:snap-none">
      {statuses.map((status) => (
        <div key={status.id} className="snap-center">
          <CRMKanbanColumn
            status={status}
            leads={leadsByStatus[status.id] || []}
          />
        </div>
      ))}
    </div>
  )
}
