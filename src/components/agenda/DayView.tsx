import { AppointmentWithDetails } from '@/hooks/use-appointments'
import {
  format,
  isSameDay,
  addMinutes,
  startOfDay,
  setHours,
  setMinutes,
} from 'date-fns'
import { GlassCard } from '@/components/GlassCard'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { AppButton } from '@/components/AppButton'
import { Plus, Check, MoreHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAppointmentActions } from '@/hooks/use-appointment-actions'

interface DayViewProps {
  date: Date
  appointments: AppointmentWithDetails[]
  onAppointmentClick: (appointment: AppointmentWithDetails) => void
  onEmptySlotClick: (time: string) => void
  refresh: () => void
}

export function DayView({
  date,
  appointments,
  onAppointmentClick,
  onEmptySlotClick,
  refresh,
}: DayViewProps) {
  const { confirmAppointment, loading } = useAppointmentActions(refresh)

  const START_HOUR = 8
  const END_HOUR = 20
  const slots: Date[] = []

  for (let h = START_HOUR; h < END_HOUR; h++) {
    const slotDate = setHours(setMinutes(date, 0), h)
    slots.push(slotDate)
    slots.push(addMinutes(slotDate, 30))
  }

  const getSlotAppointment = (slotDate: Date) => {
    return appointments.find((a) => {
      const aDate = new Date(a.scheduled_at)
      return (
        aDate.getHours() === slotDate.getHours() &&
        aDate.getMinutes() === slotDate.getMinutes()
      )
    })
  }

  return (
    <GlassCard
      size="lg"
      className="p-0 overflow-hidden flex flex-col h-[700px]"
    >
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {slots.map((slot) => {
            const apt = getSlotAppointment(slot)
            const timeStr = format(slot, 'HH:mm')

            if (apt) {
              return (
                <div key={timeStr} className="flex gap-4">
                  <div className="w-14 pt-2 text-sm font-bold text-gray-400 text-right">
                    {timeStr}
                  </div>
                  <div
                    onClick={() => onAppointmentClick(apt)}
                    className={cn(
                      'flex-1 p-4 rounded-2xl border transition-all cursor-pointer hover:shadow-md',
                      apt.status === 'confirmed'
                        ? 'bg-sky-50 border-sky-100'
                        : apt.status === 'completed'
                          ? 'bg-emerald-50 border-emerald-100'
                          : apt.status === 'no_show'
                            ? 'bg-red-50 border-red-100'
                            : 'bg-amber-50 border-amber-100',
                    )}
                  >
                    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border border-white shadow-sm">
                          <AvatarFallback className="text-xs">
                            {apt.leads?.name?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-bold text-gray-900">
                            {apt.leads?.name}
                          </h4>
                          <p className="text-xs text-gray-500">
                            {apt.type === 'evaluation' ? 'Avaliação' : 'Sessão'}{' '}
                            com {apt.users?.name}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 w-full md:w-auto mt-2 md:mt-0">
                        <Badge
                          variant="outline"
                          className={cn(
                            'border-transparent',
                            apt.status === 'confirmed'
                              ? 'bg-sky-200 text-sky-700'
                              : apt.status === 'completed'
                                ? 'bg-emerald-200 text-emerald-700'
                                : apt.status === 'no_show'
                                  ? 'bg-red-200 text-red-700'
                                  : 'bg-amber-200 text-amber-700',
                          )}
                        >
                          {apt.status === 'no_show'
                            ? 'Não Compareceu'
                            : apt.status === 'pending'
                              ? 'Pendente'
                              : apt.status === 'confirmed'
                                ? 'Confirmado'
                                : 'Concluído'}
                        </Badge>

                        {apt.status === 'pending' && (
                          <AppButton
                            size="sm"
                            className="h-7 text-xs bg-white/50 hover:bg-brand-lime hover:text-brand-slate"
                            onClick={(e) => {
                              e.stopPropagation()
                              confirmAppointment(apt.id)
                            }}
                            loading={loading}
                          >
                            <Check className="h-3 w-3 mr-1" /> Confirmar
                          </AppButton>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            }

            return (
              <div key={timeStr} className="flex gap-4 group">
                <div className="w-14 pt-2 text-sm font-medium text-gray-300 text-right group-hover:text-brand-lime transition-colors">
                  {timeStr}
                </div>
                <div className="flex-1 relative">
                  <div className="absolute top-3 w-full border-t border-dashed border-gray-200 group-hover:border-brand-lime/30" />
                  <button
                    onClick={() => onEmptySlotClick(timeStr)}
                    className="absolute left-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity bg-brand-lime/10 text-brand-lime-dark text-xs font-medium px-3 py-1.5 rounded-full flex items-center gap-1 hover:bg-brand-lime hover:text-brand-slate transform translate-y-[-10%]"
                  >
                    <Plus className="h-3 w-3" /> Agendar
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </ScrollArea>
    </GlassCard>
  )
}
