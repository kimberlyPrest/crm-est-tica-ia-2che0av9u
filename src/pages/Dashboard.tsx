import { GlassCard } from '@/components/GlassCard'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default function Dashboard() {
  const currentDate = format(new Date(), "d 'de' MMMM 'de' yyyy", {
    locale: ptBR,
  })
  // Capitalize first letter
  const formattedDate =
    currentDate.charAt(0).toUpperCase() + currentDate.slice(1)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-medium text-gray-500">{formattedDate}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((kpi) => (
          <GlassCard
            key={kpi}
            size="md"
            className="h-[160px] flex items-center justify-center text-brand-slate/50 font-medium text-lg"
          >
            KPI {kpi}
          </GlassCard>
        ))}
      </div>

      <div className="mt-8">
        <GlassCard
          size="lg"
          className="min-h-[400px] flex items-center justify-center text-brand-slate/50"
        >
          Conteúdo do Dashboard
        </GlassCard>
      </div>
    </div>
  )
}
