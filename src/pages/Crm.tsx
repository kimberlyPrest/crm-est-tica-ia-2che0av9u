import { useState } from 'react'
import { AppButton } from '@/components/AppButton'
import { Plus } from 'lucide-react'
import { useCrmData } from '@/hooks/use-crm-data'
import { CRMFilterBar } from '@/components/crm/CRMFilterBar'
import { CRMKanbanBoard } from '@/components/crm/CRMKanbanBoard'
import { NewLeadModal } from '@/components/crm/NewLeadModal'

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
  } = useCrmData()

  const [isNewLeadModalOpen, setIsNewLeadModalOpen] = useState(false)

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
        />
      )}

      {/* Modals */}
      <NewLeadModal
        open={isNewLeadModalOpen}
        onOpenChange={setIsNewLeadModalOpen}
        statuses={statuses}
        onSuccess={refresh}
      />
    </div>
  )
}
