import { useClients, ClientFilter, Client } from '@/hooks/use-clients'
import { ClientCard } from '@/components/clients/ClientCard'
import { Input } from '@/components/ui/input'
import { Search, Users, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'
import { SchedulingModal } from '@/components/crm/SchedulingModal'
import { LeadDetailsDrawer } from '@/components/crm/LeadDetailsDrawer'
import { CRMLead } from '@/hooks/use-crm-data'
import { useNavigate } from 'react-router-dom'
import { AppButton } from '@/components/AppButton'

export default function Clientes() {
  const navigate = useNavigate()
  const {
    clients,
    filteredClients,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    filter,
    setFilter,
    refresh,
  } = useClients()

  const [localSearch, setLocalSearch] = useState(searchQuery)

  // Modals state
  const [schedulingOpen, setSchedulingOpen] = useState(false)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [selectedDealId, setSelectedDealId] = useState<string | undefined>(
    undefined,
  )

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchQuery(localSearch)
    }, 300)
    return () => clearTimeout(handler)
  }, [localSearch, setSearchQuery])

  const handleSchedule = (client: Client, dealId?: string) => {
    setSelectedClient(client)
    setSelectedDealId(dealId)
    setSchedulingOpen(true)
  }

  const handleViewDetails = (client: Client) => {
    setSelectedClient(client)
    setDetailsOpen(true)
  }

  const filters: { id: ClientFilter; label: string }[] = [
    { id: 'all', label: 'Todos' },
    { id: 'pending', label: 'Sessões Pendentes' },
    { id: 'near_return', label: 'Retorno Próximo' },
    { id: 'overdue', label: 'Sessões Atrasadas' },
    { id: 'completed', label: 'Finalizados' },
  ]

  if (loading && clients.length === 0) {
    return (
      <div className="flex h-[calc(100vh-100px)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-lime" />
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-10 animate-fade-in">
      {/* Header & Filters */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-brand-slate">Clientes</h1>
            <p className="text-gray-500 mt-1">
              Gerencie seus clientes e acompanhe o progresso dos tratamentos
            </p>
          </div>
          <div className="relative w-full md:w-[400px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por nome ou telefone..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="pl-10 h-12 rounded-full bg-white/60 border-white/40 shadow-sm focus:ring-brand-lime transition-all"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium transition-all duration-300',
                filter === f.id
                  ? 'bg-brand-slate text-white shadow-md scale-105'
                  : 'bg-white/60 text-gray-600 hover:bg-white hover:text-brand-slate hover:shadow-sm',
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Grid */}
      {filteredClients.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
          <div className="h-32 w-32 bg-gray-100 rounded-full flex items-center justify-center">
            <Users className="h-16 w-16 text-gray-300" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700">
            Nenhum cliente encontrado
          </h3>
          <p className="text-gray-500 max-w-sm">
            Tente ajustar seus filtros ou busque por outro nome.
          </p>
          <AppButton variant="outline" onClick={() => navigate('/crm')}>
            Ir para o CRM
          </AppButton>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredClients.map((client) => (
            <ClientCard
              key={client.id}
              client={client}
              onSchedule={handleSchedule}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <SchedulingModal
        open={schedulingOpen}
        onOpenChange={setSchedulingOpen}
        lead={selectedClient}
        initialType="session"
        initialDealId={selectedDealId}
        onSuccess={() => {
          refresh()
        }}
      />

      <LeadDetailsDrawer
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        lead={selectedClient as CRMLead}
        onUpdate={refresh}
        onAction={(action, lead) => {
          if (action === 'schedule') {
            handleSchedule(lead as Client)
          }
        }}
      />
    </div>
  )
}
