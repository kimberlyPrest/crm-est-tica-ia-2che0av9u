import { AppointmentWithDetails } from '@/hooks/use-appointments'
import {
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameDay,
  isToday,
  addMinutes,
  differenceInMinutes,
  startOfDay,
} from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { GlassCard } from '@/components/GlassCard'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'

interface WeekViewProps {
  date: Date
  appointments: AppointmentWithDetails[]
  onAppointmentClick: (appointment: AppointmentWithDetails) => void
}

export function WeekView({
  date,
  appointments,
  onAppointmentClick,
}: WeekViewProps) {
  const weekStart = startOfWeek(date)
  const weekEnd = endOfWeek(date)
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd })

  const START_HOUR = 8
  const END_HOUR = 20
  const hours = Array.from(
    { length: END_HOUR - START_HOUR + 1 },
    (_, i) => START_HOUR + i,
  )

  return (
    <GlassCard
      size="lg"
      className="p-0 overflow-hidden flex flex-col h-[700px]"
    >
      {/* Header */}
      <div className="flex border-b border-gray-100 bg-white/30 sticky top-0 z-20">
        <div className="w-16 flex-shrink-0 border-r border-gray-100 bg-gray-50/50" />
        <div className="flex-1 grid grid-cols-7">
          {days.map((day) => (
            <div
              key={day.toISOString()}
              className={cn(
                'py-3 text-center border-r border-gray-100 last:border-r-0 transition-colors',
                isToday(day) && 'bg-brand-lime/5',
              )}
            >
              <div className="text-xs font-semibold text-gray-500 uppercase">
                {format(day, 'EEE', { locale: ptBR })}
              </div>
              <div
                className={cn(
                  'text-lg font-bold mx-auto w-9 h-9 flex items-center justify-center rounded-full mt-1 transition-all',
                  isToday(day)
                    ? 'bg-brand-lime text-brand-slate shadow-[0_4px_12px_rgba(132,204,22,0.4)] scale-105 ring-2 ring-white'
                    : 'text-brand-slate',
                )}
              >
                {format(day, 'd')}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Grid */}
      <ScrollArea className="flex-1 relative">
        <div className="flex relative min-w-[800px]">
          {/* Time Labels */}
          <div className="w-16 flex-shrink-0 bg-gray-50/30 border-r border-gray-100">
            {hours.map((hour) => (
              <div
                key={hour}
                className="h-20 border-b border-gray-100 relative"
              >
                <span className="absolute -top-2.5 right-2 text-xs text-gray-400 bg-transparent px-1">
                  {hour}:00
                </span>
              </div>
            ))}
          </div>

          {/* Days Columns */}
          <div className="flex-1 grid grid-cols-7 relative">
            {/* Horizontal Grid Lines */}
            <div className="absolute inset-0 z-0">
              {hours.map((hour) => (
                <div key={hour} className="h-20 border-b border-gray-100" />
              ))}
            </div>

            {/* Day Columns content */}
            {days.map((day, i) => {
              const dayAppointments = appointments.filter((a) =>
                isSameDay(new Date(a.scheduled_at), day),
              )

              return (
                <div
                  key={day.toISOString()}
                  className="relative h-full border-r border-gray-100 last:border-r-0 z-10"
                >
                  {dayAppointments.map((apt) => {
                    const aptDate = new Date(apt.scheduled_at)
                    const startMinutes =
                      aptDate.getHours() * 60 + aptDate.getMinutes()
                    const viewStartMinutes = START_HOUR * 60
                    const top = ((startMinutes - viewStartMinutes) / 60) * 80 // 80px per hour

                    // Assuming 30 min duration for simplicity if not calculated
                    const height = 40 // 30 min = 40px

                    if (
                      aptDate.getHours() < START_HOUR ||
                      aptDate.getHours() >= END_HOUR
                    )
                      return null

                    return (
                      <div
                        key={apt.id}
                        onClick={(e) => {
                          e.stopPropagation()
                          onAppointmentClick(apt)
                        }}
                        className={cn(
                          'absolute inset-x-1 rounded p-1.5 text-xs shadow-sm cursor-pointer border-l-4 transition-all hover:scale-[1.02] overflow-hidden hover:z-20',
                          apt.status === 'confirmed'
                            ? 'bg-sky-50 border-sky-500'
                            : apt.status === 'completed'
                              ? 'bg-emerald-50 border-emerald-500'
                              : apt.status === 'no_show'
                                ? 'bg-red-50 border-red-500'
                                : 'bg-amber-50 border-amber-500',
                        )}
                        style={{ top: `${top}px`, height: `${height}px` }}
                      >
                        <div className="font-semibold text-gray-900 truncate">
                          {apt.leads?.name}
                        </div>
                        <div className="text-[10px] text-gray-500 truncate">
                          {apt.type === 'evaluation' ? 'Avaliação' : 'Sessão'}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </GlassCard>
  )
}
