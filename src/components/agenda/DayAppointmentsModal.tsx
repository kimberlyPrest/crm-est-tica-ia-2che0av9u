import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { AppointmentWithDetails } from '@/hooks/use-appointments'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface DayAppointmentsModalProps {
  date: Date
  appointments: AppointmentWithDetails[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onAppointmentClick: (appointment: AppointmentWithDetails) => void
}

export function DayAppointmentsModal({
  date,
  appointments,
  open,
  onOpenChange,
  onAppointmentClick,
}: DayAppointmentsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-white/95 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle>
            Agendamentos de {format(date, "d 'de' MMMM", { locale: ptBR })}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[60vh] -mr-4 pr-4">
          <div className="space-y-3 pt-2">
            {appointments.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                Nenhum agendamento para este dia.
              </p>
            ) : (
              appointments
                .sort(
                  (a, b) =>
                    new Date(a.scheduled_at).getTime() -
                    new Date(b.scheduled_at).getTime(),
                )
                .map((apt) => (
                  <div
                    key={apt.id}
                    onClick={() => {
                      onOpenChange(false)
                      onAppointmentClick(apt)
                    }}
                    className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-white hover:border-brand-lime hover:shadow-md transition-all cursor-pointer"
                  >
                    <div className="w-12 text-center">
                      <span className="text-sm font-bold text-gray-900 block">
                        {format(new Date(apt.scheduled_at), 'HH:mm')}
                      </span>
                    </div>

                    <div className="h-8 w-px bg-gray-200" />

                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs bg-gray-100 text-gray-600">
                        {apt.leads?.name?.[0]}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {apt.leads?.name}
                      </h4>
                      <p className="text-xs text-gray-500 truncate">
                        {apt.type === 'evaluation' ? 'Avaliação' : 'Sessão'} •{' '}
                        {apt.users?.name}
                      </p>
                    </div>

                    <div
                      className={cn(
                        'w-2 h-2 rounded-full',
                        apt.status === 'confirmed'
                          ? 'bg-brand-sky'
                          : apt.status === 'completed'
                            ? 'bg-emerald-500'
                            : apt.status === 'no_show'
                              ? 'bg-red-500'
                              : 'bg-amber-400',
                      )}
                    />
                  </div>
                ))
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
