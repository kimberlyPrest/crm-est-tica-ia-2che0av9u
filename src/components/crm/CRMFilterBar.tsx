import { GlassCard } from '@/components/GlassCard'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CRMFilter } from '@/hooks/use-crm-data'
import { useEffect, useState } from 'react'

interface CRMFilterBarProps {
  filter: CRMFilter
  setFilter: (filter: CRMFilter) => void
  searchQuery: string
  setSearchQuery: (query: string) => void
}

export function CRMFilterBar({
  filter,
  setFilter,
  searchQuery,
  setSearchQuery,
}: CRMFilterBarProps) {
  const [localSearch, setLocalSearch] = useState(searchQuery)

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchQuery(localSearch)
    }, 300)

    return () => {
      clearTimeout(handler)
    }
  }, [localSearch, setSearchQuery])

  const filters: { id: CRMFilter; label: string }[] = [
    { id: 'all', label: 'Todos' },
    { id: 'pending_message', label: 'Com Mensagem Pendente' },
    { id: 'ai_blocked', label: 'IA Bloqueada' },
    { id: 'created_today', label: 'Criados Hoje' },
  ]

  return (
    <GlassCard
      size="md"
      className="p-6 flex flex-col md:flex-row gap-4 items-center justify-between"
    >
      {/* Filters */}
      <div className="flex flex-wrap gap-2 w-full md:w-auto">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={cn(
              'px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300',
              filter === f.id
                ? 'bg-brand-lime text-brand-slate shadow-md scale-105'
                : 'bg-white/40 text-gray-600 hover:bg-white/60 hover:text-brand-slate',
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative w-full md:w-[300px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        <Input
          placeholder="Buscar por nome ou telefone..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className="pl-9 rounded-full bg-white/50 border-white/30 focus:bg-white/80 transition-all h-10"
        />
      </div>
    </GlassCard>
  )
}
