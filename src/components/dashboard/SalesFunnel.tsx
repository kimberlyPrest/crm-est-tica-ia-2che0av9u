import { GlassCard } from '@/components/GlassCard'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FunnelStage, Period } from '@/hooks/use-dashboard-data'
import { ChevronDown, Info } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

interface SalesFunnelProps {
  data: FunnelStage[]
  loading: boolean
  period: Period
  onPeriodChange: (period: Period) => void
}

export function SalesFunnel({
  data,
  loading,
  period,
  onPeriodChange,
}: SalesFunnelProps) {
  const totalLeads = data.reduce((acc, stage) => acc + stage.count, 0)

  // Calculate percentages between stages
  const getConversionRate = (index: number) => {
    if (index === 0) return null
    const prev = data[index - 1].count
    const curr = data[index].count
    if (prev === 0) return 0
    return ((curr / prev) * 100).toFixed(0)
  }

  const getConversionColor = (rate: number) => {
    if (rate >= 50) return 'text-emerald-500'
    if (rate >= 30) return 'text-amber-500'
    return 'text-red-500'
  }

  return (
    <GlassCard size="lg" className="h-full min-h-[400px] flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-lg font-bold text-gray-800">Funil de Vendas</h3>
          <p className="text-sm text-gray-500">
            Distribuição de leads por etapa
          </p>
        </div>
        <Select
          value={period}
          onValueChange={(v) => onPeriodChange(v as Period)}
        >
          <SelectTrigger className="w-[120px] bg-white/50 border-white/20 h-9 text-xs font-medium focus:ring-brand-lime">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">7 dias</SelectItem>
            <SelectItem value="30d">30 dias</SelectItem>
            <SelectItem value="90d">90 dias</SelectItem>
            <SelectItem value="1y">Ano todo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1 flex flex-col justify-center space-y-2">
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-[80%]" />
            <Skeleton className="h-12 w-[60%]" />
            <Skeleton className="h-12 w-[40%]" />
          </div>
        ) : data.length === 0 || totalLeads === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <Info className="h-10 w-10 mb-2 opacity-50" />
            <p>Sem dados para o período</p>
          </div>
        ) : (
          data.map((stage, index) => {
            const percentage =
              totalLeads > 0
                ? ((stage.count / totalLeads) * 100).toFixed(1)
                : '0'
            const conversionRate = getConversionRate(index)
            const maxCount = Math.max(...data.map((d) => d.count)) || 1
            const widthPercentage = Math.max((stage.count / maxCount) * 100, 15)

            return (
              <div key={stage.id} className="relative group">
                {/* Conversion Indicator */}
                {index > 0 && conversionRate !== null && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 flex items-center justify-center bg-white shadow-sm rounded-full px-2 py-0.5 border border-gray-100">
                    <ChevronDown
                      className={cn(
                        'h-3 w-3 mr-1',
                        getConversionColor(Number(conversionRate)),
                      )}
                    />
                    <span
                      className={cn(
                        'text-[10px] font-bold',
                        getConversionColor(Number(conversionRate)),
                      )}
                    >
                      {conversionRate}%
                    </span>
                  </div>
                )}

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className="relative h-14 rounded-xl flex items-center px-4 transition-all duration-300 hover:shadow-md cursor-help border border-transparent hover:border-white/40"
                        style={{
                          backgroundColor: stage.color,
                          width: `${widthPercentage}%`,
                          minWidth: '200px',
                        }}
                      >
                        <div className="flex justify-between items-center w-full text-gray-800">
                          <span className="font-semibold text-sm">
                            {stage.name}
                          </span>
                          <span className="font-bold bg-white/40 px-2 py-1 rounded-lg text-xs">
                            {stage.count}
                          </span>
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="glass border-white/20 p-3">
                      <div className="space-y-1">
                        <p className="font-bold text-gray-800">{stage.name}</p>
                        <p className="text-xs text-gray-600">
                          Total:{' '}
                          <span className="font-semibold">{stage.count}</span>
                        </p>
                        <p className="text-xs text-gray-600">
                          Representação:{' '}
                          <span className="font-semibold">{percentage}%</span>
                        </p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            )
          })
        )}
      </div>
    </GlassCard>
  )
}
