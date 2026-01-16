import { useState } from 'react'
import { CRMFilterBar } from '@/components/crm/CRMFilterBar'
import { CRMKanbanBoard } from '@/components/crm/CRMKanbanBoard'
import { LeadDetailsDrawer } from '@/components/crm/LeadDetailsDrawer'
import { SchedulingModal } from '@/components/crm/SchedulingModal'
import { useCrmData, CRMLead } from '@/hooks/use-crm-data'
import { Loader2 } from 'lucide-react'

export default function Crm() {
  const {
    loading,
    error,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    statuses,
    leadsByStatus,
    refresh,
  } = useCrmData()

  const [selectedLead, setSelectedLead] = useState<CRMLead | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)

  const [schedulingOpen, setSchedulingOpen] = useState(false)
  const [schedulingLead, setSchedulingLead] = useState<CRMLead | null>(null)
  const [schedulingType, setSchedulingType] = useState<
    'evaluation' | 'session' | undefined
  >(undefined)

  const handleLeadClick = (lead: CRMLead) => {
    setSelectedLead(lead)
    setDetailsOpen(true)
  }

  const handleSchedule = (lead: CRMLead, type?: 'evaluation' | 'session') => {
    setSchedulingLead(lead)
    setSchedulingType(type)
    setSchedulingOpen(true)
  }

  const handleDrawerAction = (action: string, lead: CRMLead) => {
    if (action === 'schedule') {
      handleSchedule(lead)
    }
    // Handle other actions like 'sale', 'lost' here if needed
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-brand-lime" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-red-500">
        {error}
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-theme(spacing.16))] flex flex-col overflow-hidden">
      {/* Filters */}
      <div className="px-6 py-4 flex-none">
        <CRMFilterBar
          filter={filter}
          onFilterChange={setFilter}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </div>

      {/* Board */}
      <div className="flex-1 overflow-hidden">
        <CRMKanbanBoard
          statuses={statuses}
          leadsByStatus={leadsByStatus}
          refresh={refresh}
          onLeadClick={handleLeadClick}
          onSchedule={handleSchedule}
        />
      </div>

      {/* Lead Details Drawer */}
      <LeadDetailsDrawer
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        lead={selectedLead}
        onUpdate={refresh}
        onAction={handleDrawerAction}
      />

      {/* Scheduling Modal */}
      <SchedulingModal
        open={schedulingOpen}
        onOpenChange={setSchedulingOpen}
        lead={schedulingLead}
        initialType={schedulingType}
        onSuccess={() => {
          refresh()
          if (selectedLead?.id === schedulingLead?.id) {
            // Optionally refresh details if needed, but refresh() handles the list
          }
        }}
      />
    </div>
  )
}
