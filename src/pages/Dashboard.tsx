import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useDashboardData } from '@/hooks/use-dashboard-data'
import { KPICard } from '@/components/dashboard/KPICard'
import { SalesFunnel } from '@/components/dashboard/SalesFunnel'
import { ActivityFeed } from '@/components/dashboard/ActivityFeed'
import { OnboardingDashboard } from '@/components/dashboard/OnboardingDashboard'
import { Loader2 } from 'lucide-react'

export default function Dashboard() {
  const {
    kpis,
    funnelData,
    funnelLoading,
    funnelPeriod,
    setFunnelPeriod,
    activities,
    activitiesLoading,
  } = useDashboardData()

  const currentDate = format(new Date(), "EEEE, d 'de' MMMM 'de' yyyy", {
    locale: ptBR,
  })
  const formattedDate =
    currentDate.charAt(0).toUpperCase() + currentDate.slice(1)

  if (kpis.leads.loading) {
    return (
      <div className="flex h-[calc(100vh-100px)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-lime" />
      </div>
    )
  }

  // Se não houver leads, mostra a tela de onboarding
  if (kpis.leads.value === 0) {
    return <OnboardingDashboard />
  }

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <div className="flex flex-col gap-2">
        <p className="text-base text-gray-500 font-medium">{formattedDate}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <KPICard kpi={kpis.leads} />
        <KPICard kpi={kpis.revenue} />
        <KPICard kpi={kpis.appointments} />
        <KPICard kpi={kpis.sales} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-full">
          <SalesFunnel
            data={funnelData}
            loading={funnelLoading}
            period={funnelPeriod}
            onPeriodChange={setFunnelPeriod}
          />
        </div>
        <div className="h-full">
          <ActivityFeed activities={activities} loading={activitiesLoading} />
        </div>
      </div>
    </div>
  )
}
