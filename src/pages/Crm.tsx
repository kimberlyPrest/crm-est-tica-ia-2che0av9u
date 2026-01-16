import { useState, useCallback } from 'react'
import { AppButton } from '@/components/AppButton'
import { Plus } from 'lucide-react'
import { useCrmData, CRMLead } from '@/hooks/use-crm-data'
import { CRMFilterBar } from '@/components/crm/CRMFilterBar'
import { CRMKanbanBoard } from '@/components/crm/CRMKanbanBoard'
import { NewLeadModal } from '@/components/crm/NewLeadModal'
import { LostLeadModal } from '@/components/crm/LostLeadModal'
import { SaleModal } from '@/components/crm/SaleModal'
import { LeadDetailsDrawer } from '@/components/crm/LeadDetailsDrawer'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { useSearchParams } from 'react-router-dom'

export default function Crm() {
  const {
    statuses,
    loading,
    error,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    leadsByStatus,
    refresh,
    leads,
  } = useCrmData()

  const [searchParams, setSearchParams] = useSearchParams()
  const [isNewLeadModalOpen, setIsNewLeadModalOpen] = useState(false)
  const [isLostModalOpen, setIsLostModalOpen] = useState(false)
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false)

  // Use local state for selected lead instead of just URL to pass full object
  // But initialize from URL if needed
  const [selectedLead, setSelectedLead] = useState<CRMLead | null>(null)
  const [targetStatusId, setTargetStatusId] = useState<string>('')

  // Sync URL with selected lead
  const handleLeadClick = (lead: CRMLead) => {
    setSelectedLead(lead)
    setSearchParams({ lead_id: lead.id })
  }

  const handleCloseDrawer = (open: boolean) => {
    if (!open) {
      setSelectedLead(null)
      setSearchParams({})
    }
  }

  // Handle Drag & Drop
  const handleLeadDrop = useCallback(
    async (lead: CRMLead, newStatusId: string) => {
      const targetStatus = statuses.find((s) => s.id === newStatusId)
      if (!targetStatus) return

      // Specific Workflows
      if (targetStatus.name === 'Perdido') {
        setSelectedLead(lead)
        setTargetStatusId(newStatusId)
        setIsLostModalOpen(true)
        return
      }

      if (targetStatus.name === 'Cliente') {
        setSelectedLead(lead)
        setTargetStatusId(newStatusId)
        setIsSaleModalOpen(true)
        return
      }

      // Simple Update
      try {
        const { error } = await supabase
          .from('leads')
          .update({ status_id: newStatusId })
          .eq('id', lead.id)

        if (error) throw error

        await supabase.from('activities').insert({
          lead_id: lead.id,
          type: 'status_change',
          description: `Moveu para ${targetStatus.name}`,
        })

        refresh()
        toast.success(`Movido para ${targetStatus.name}`)
      } catch (err) {
        console.error('Error moving lead:', err)
        toast.error('Erro ao mover lead')
      }
    },
    [statuses, refresh],
  )

  const handleAction = (action: string, lead: CRMLead) => {
    if (action === 'lost') {
      const lostStatus = statuses.find((s) => s.name === 'Perdido')
      if (lostStatus) {
        setTargetStatusId(lostStatus.id)
        setIsLostModalOpen(true)
      }
    } else if (action === 'sale') {
      const clientStatus = statuses.find((s) => s.name === 'Cliente')
      if (clientStatus) {
        setTargetStatusId(clientStatus.id)
        setIsSaleModalOpen(true)
      }
    }
    // "schedule" handled by something else typically or opens another modal
  }

  // Check URL for initial lead selection (deep link)
  useState(() => {
    const leadId = searchParams.get('lead_id')
    if (leadId && leads.length > 0) {
      const lead = leads.find((l) => l.id === leadId)
      if (lead) setSelectedLead(lead)
    }
  })

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-brand-slate">CRM</h1>
        <AppButton
          variant="pill"
          onClick={() => setIsNewLeadModalOpen(true)}
          className="bg-brand-lime hover:bg-brand-lime-light text-brand-slate w-full sm:w-auto"
        >
          <Plus className="mr-2 h-4 w-4" /> Novo Lead
        </AppButton>
      </div>

      {/* Filter Bar */}
      <CRMFilterBar
        filter={filter}
        setFilter={setFilter}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Content */}
      {error ? (
        <div className="flex-1 flex flex-col items-center justify-center text-red-500">
          <p className="text-lg font-medium mb-4">{error}</p>
          <AppButton variant="outline" onClick={refresh}>
            Tentar novamente
          </AppButton>
        </div>
      ) : (
        <CRMKanbanBoard
          statuses={statuses}
          leadsByStatus={leadsByStatus}
          loading={loading}
          onLeadDrop={handleLeadDrop}
          onLeadClick={handleLeadClick}
        />
      )}

      {/* Modals */}
      <NewLeadModal
        open={isNewLeadModalOpen}
        onOpenChange={setIsNewLeadModalOpen}
        statuses={statuses}
        onSuccess={refresh}
      />

      <LostLeadModal
        open={isLostModalOpen}
        onOpenChange={setIsLostModalOpen}
        lead={selectedLead}
        statusId={targetStatusId}
        onSuccess={refresh}
      />

      <SaleModal
        open={isSaleModalOpen}
        onOpenChange={setIsSaleModalOpen}
        lead={selectedLead}
        statusId={targetStatusId}
        onSuccess={refresh}
      />

      <LeadDetailsDrawer
        open={!!selectedLead && !isLostModalOpen && !isSaleModalOpen}
        onOpenChange={handleCloseDrawer}
        lead={selectedLead}
        onUpdate={refresh}
        onAction={handleAction}
      />
    </div>
  )
}
