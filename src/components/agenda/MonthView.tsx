import { AppointmentWithDetails } from '@/hooks/use-appointments'
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  format,
} from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { GlassCard } from '@/components/GlassCard'

interface MonthViewProps {
  date: Date
  appointments: AppointmentWithDetails[]
  onDayClick: (day: Date, appointments: AppointmentWithDetails[]) => void
}

export function MonthView({ date, appointments, onDayClick }: MonthViewProps) {
  const monthStart = startOfMonth(date)
  const monthEnd = endOfMonth(date)
  const startDate = startOfWeek(monthStart)
  const endDate = endOfWeek(monthEnd)

  const days = eachDayOfInterval({ start: startDate, end: endDate })
  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

  const getDayAppointments = (day: Date) => {
    return appointments.filter((apt) =>
      isSameDay(new Date(apt.scheduled_at), day),
    )
  }

  return (
    <GlassCard size="lg" className="p-0 overflow-hidden">
      {/* Weekday Headers */}
      <div className="grid grid-cols-7 border-b border-gray-100 bg-white/30">
        {weekDays.map((day) => (
          <div
            key={day}
            className="py-3 text-center text-sm font-semibold text-gray-500 uppercase tracking-wide"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 auto-rows-fr bg-gray-50/30">
        {days.map((day, dayIdx) => {
          const dayAppointments = getDayAppointments(day)
          const isCurrentMonth = isSameMonth(day, monthStart)

          return (
            <div
              key={day.toISOString()}
              onClick={() => onDayClick(day, dayAppointments)}
              className={cn(
                'min-h-[120px] p-2 border-b border-r border-gray-100 transition-colors hover:bg-white/60 cursor-pointer flex flex-col gap-1',
                !isCurrentMonth && 'bg-gray-50/50 opacity-50',
                dayIdx % 7 === 6 && 'border-r-0', // No right border for last col
              )}
            >
              <div className="flex justify-between items-start">
                <span
                  className={cn(
                    'text-sm font-medium h-7 w-7 flex items-center justify-center rounded-full',
                    isToday(day)
                      ? 'bg-brand-lime text-brand-slate shadow-sm'
                      : isCurrentMonth
                        ? 'text-gray-700'
                        : 'text-gray-400',
                  )}
                >
                  {format(day, 'd')}
                </span>
                {dayAppointments.length > 0 && (
                  <span className="text-[10px] text-gray-400 font-medium md:hidden">
                    {dayAppointments.length}
                  </span>
                )}
              </div>

              {/* Appointment Pills */}
              <div className="flex-1 flex flex-col gap-1 mt-1">
                {dayAppointments.slice(0, 3).map((apt) => (
                  <div
                    key={apt.id}
                    className={cn(
                      'hidden md:block px-1.5 py-0.5 rounded text-[10px] font-medium truncate border-l-2',
                      apt.status === 'confirmed'
                        ? 'bg-sky-100 text-sky-700 border-sky-500'
                        : apt.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-700 border-emerald-500'
                          : apt.status === 'no_show'
                            ? 'bg-red-100 text-red-700 border-red-500'
                            : 'bg-amber-100 text-amber-700 border-amber-500',
                    )}
                  >
                    {format(new Date(apt.scheduled_at), 'HH:mm')} •{' '}
                    {apt.leads?.name}
                  </div>
                ))}

                {dayAppointments.length > 3 && (
                  <div className="hidden md:block px-1.5 py-0.5 text-[10px] text-gray-500 font-medium">
                    +{dayAppointments.length - 3} mais
                  </div>
                )}

                {/* Mobile Dots */}
                <div className="md:hidden flex flex-wrap gap-0.5 mt-auto justify-center">
                  {dayAppointments.slice(0, 4).map((apt, i) => (
                    <div
                      key={i}
                      className={cn(
                        'h-1.5 w-1.5 rounded-full',
                        apt.status === 'confirmed'
                          ? 'bg-sky-500'
                          : apt.status === 'completed'
                            ? 'bg-emerald-500'
                            : apt.status === 'no_show'
                              ? 'bg-red-500'
                              : 'bg-amber-500',
                      )}
                    />
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </GlassCard>
  )
}
