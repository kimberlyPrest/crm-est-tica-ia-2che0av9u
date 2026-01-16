import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { AppointmentWithDetails } from '@/hooks/use-appointments'
import { AppButton } from '@/components/AppButton'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useAppointmentActions } from '@/hooks/use-appointment-actions'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  Phone,
  Mail,
  User,
  Clock,
  Calendar,
  CheckCircle2,
  XCircle,
  Ban,
  Trash2,
  AlertCircle,
} from 'lucide-react'
import { useState } from 'react'

interface AppointmentDetailModalProps {
  appointment: AppointmentWithDetails | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function AppointmentDetailModal({
  appointment,
  open,
  onOpenChange,
  onSuccess,
}: AppointmentDetailModalProps) {
  const [notes, setNotes] = useState(appointment?.notes || '')

  const {
    loading,
    confirmAppointment,
    completeAppointment,
    markNoShow,
    cancelAppointment,
  } = useAppointmentActions(() => {
    onOpenChange(false)
    onSuccess()
  })

  if (!appointment) return null

  const scheduledDate = new Date(appointment.scheduled_at)
  const isPending = appointment.status === 'pending'
  const isConfirmed = appointment.status === 'confirmed'
  const isCompleted = appointment.status === 'completed'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg bg-white/95 backdrop-blur-xl border-white/20">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Detalhes do Agendamento
            <Badge
              className="ml-auto capitalize"
              variant={
                isCompleted ? 'default' : isConfirmed ? 'secondary' : 'outline'
              }
            >
              {appointment.status === 'no_show'
                ? 'Não Compareceu'
                : appointment.status === 'pending'
                  ? 'Pendente'
                  : appointment.status === 'confirmed'
                    ? 'Confirmado'
                    : 'Concluído'}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Client Info */}
          <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50/80 border border-gray-100">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-brand-lime/20 text-brand-lime-dark font-bold">
                {appointment.leads?.name?.[0] || 'C'}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h4 className="font-bold text-gray-900">
                {appointment.leads?.name || 'Cliente sem nome'}
              </h4>
              <div className="flex flex-col gap-0.5 text-sm text-gray-500">
                <div className="flex items-center gap-1.5">
                  <Phone className="h-3 w-3" />
                  {appointment.leads?.phone}
                </div>
                {appointment.leads?.email && (
                  <div className="flex items-center gap-1.5">
                    <Mail className="h-3 w-3" />
                    {appointment.leads?.email}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Appointment Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-xs text-gray-500 uppercase">
                Data e Hora
              </Label>
              <div className="flex items-center gap-2 text-sm font-medium">
                <Calendar className="h-4 w-4 text-brand-lime" />
                {format(scheduledDate, "dd 'de' MMMM", { locale: ptBR })}
              </div>
              <div className="flex items-center gap-2 text-sm font-medium">
                <Clock className="h-4 w-4 text-brand-lime" />
                {format(scheduledDate, 'HH:mm')}
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-gray-500 uppercase">
                Profissional
              </Label>
              <div className="flex items-center gap-2 text-sm font-medium">
                <User className="h-4 w-4 text-brand-sky" />
                {appointment.users?.name || 'Não atribuído'}
              </div>
            </div>
            <div className="space-y-1 col-span-2">
              <Label className="text-xs text-gray-500 uppercase">Tipo</Label>
              <div className="font-medium text-brand-slate capitalize">
                {appointment.type === 'evaluation'
                  ? 'Avaliação Inicial'
                  : 'Sessão de Tratamento'}
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label>Observações</Label>
            <Textarea
              value={notes}
              readOnly
              className="bg-white min-h-[80px]"
              placeholder="Nenhuma observação registrada"
            />
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            {isPending && (
              <AppButton
                variant="default"
                className="bg-brand-sky hover:bg-brand-sky-light text-white hover:text-brand-sky"
                onClick={() => confirmAppointment(appointment.id)}
                loading={loading}
              >
                <CheckCircle2 className="mr-2 h-4 w-4" /> Confirmar
              </AppButton>
            )}

            {(isPending || isConfirmed) && (
              <AppButton
                variant="default"
                className="bg-brand-lime hover:bg-brand-lime-light text-brand-slate"
                onClick={() => completeAppointment(appointment)}
                loading={loading}
              >
                <CheckCircle2 className="mr-2 h-4 w-4" /> Concluir
              </AppButton>
            )}

            {(isPending || isConfirmed) && (
              <AppButton
                variant="outline"
                className="border-red-200 text-red-600 hover:bg-red-50"
                onClick={() => markNoShow(appointment)}
                loading={loading}
              >
                <Ban className="mr-2 h-4 w-4" /> Não Compareceu
              </AppButton>
            )}

            <AppButton
              variant="ghost"
              className="text-gray-500 hover:text-red-500 hover:bg-red-50"
              onClick={() => {
                if (
                  confirm('Tem certeza que deseja cancelar este agendamento?')
                ) {
                  cancelAppointment(appointment.id)
                }
              }}
              loading={loading}
            >
              <Trash2 className="mr-2 h-4 w-4" /> Cancelar
            </AppButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
