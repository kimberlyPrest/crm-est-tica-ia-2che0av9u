import { GlassCard } from '@/components/GlassCard'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import {
  Users,
  DollarSign,
  Calendar,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  AlertCircle,
} from 'lucide-react'
import { KPI } from '@/hooks/use-dashboard-data'

interface KPICardProps {
  kpi: KPI
}

export function KPICard({ kpi }: KPICardProps) {
  const { label, value, change, trend, icon, loading, error } = kpi

  if (loading) {
    return (
      <GlassCard size="md" className="h-[160px] flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-4 w-32" />
        </div>
      </GlassCard>
    )
  }

  if (error) {
    return (
      <GlassCard
        size="md"
        className="h-[160px] flex flex-col items-center justify-center text-red-500"
      >
        <AlertCircle className="h-8 w-8 mb-2" />
        <span className="text-sm font-medium">Erro ao carregar dados</span>
      </GlassCard>
    )
  }

  const IconComponent = {
    users: Users,
    dollar: DollarSign,
    calendar: Calendar,
    check: CheckCircle2,
  }[icon]

  // Exact colors from requirements
  const exactIconColor =
    icon === 'users'
      ? 'text-[#A78BFA] bg-[#A78BFA]/10' // Lavender
      : icon === 'dollar'
        ? 'text-[#84CC16] bg-[#84CC16]/10' // Lime
        : icon === 'calendar'
          ? 'text-[#0EA5E9] bg-[#0EA5E9]/10' // Sky
          : 'text-[#10B981] bg-[#10B981]/10' // Emerald

  return (
    <GlassCard
      size="md"
      className="h-[160px] flex flex-col justify-between relative overflow-hidden group"
    >
      <div className="flex justify-between items-start z-10">
        <div
          className={cn(
            'p-2.5 rounded-xl transition-all duration-300 group-hover:scale-110',
            exactIconColor,
          )}
        >
          <IconComponent className="h-6 w-6" />
        </div>
        {change !== 0 && (
          <div
            className={cn(
              'flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold',
              trend === 'up'
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-red-100 text-red-700',
            )}
          >
            {trend === 'up' ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {Math.abs(change).toFixed(1)}%
          </div>
        )}
      </div>

      <div className="z-10">
        <h3 className="text-3xl font-bold text-gray-800 tracking-tight">
          {value}
        </h3>
        <p className="text-sm text-gray-500 font-medium mt-1">{label}</p>
      </div>

      <div
        className={cn(
          'absolute -bottom-4 -right-4 h-24 w-24 rounded-full opacity-5 blur-2xl transition-all duration-500 group-hover:opacity-10',
          exactIconColor.split(' ')[0].replace('text-', 'bg-'),
        )}
      />
    </GlassCard>
  )
}
