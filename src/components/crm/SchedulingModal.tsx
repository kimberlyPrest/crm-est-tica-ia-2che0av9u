import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Calendar } from '@/components/ui/calendar'
import { AppButton } from '@/components/AppButton'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { useScheduling } from '@/hooks/use-scheduling'
import { CRMLead } from '@/hooks/use-crm-data'
import {
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  AlertCircle,
  User,
  Info,
} from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface SchedulingModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  lead: CRMLead | null
  initialType?: 'evaluation' | 'session'
  onSuccess: () => void
}

export function SchedulingModal({
  open,
  onOpenChange,
  lead,
  initialType,
  onSuccess,
}: SchedulingModalProps) {
  const {
    state,
    setState,
    staff,
    loadingStaff,
    slots,
    loadingSlots,
    deals,
    submitting,
    confirmBooking,
    isDayDisabled,
  } = useScheduling(lead, open)

  const handleTypeChange = (value: string) => {
    const type = value as 'evaluation' | 'session'
    setState((prev) => ({
      ...prev,
      type,
      // Auto select first deal if switching to session and has deals
      dealId: type === 'session' && deals.length > 0 ? deals[0].id : null,
    }))
  }

  const handleConfirm = async () => {
    await confirmBooking(() => {
      onOpenChange(false)
      onSuccess()
    })
  }

  const hasActiveDeals = deals.length > 0
  const isFormValid = state.staffId && state.date && state.time

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 gap-0 overflow-hidden bg-white/95 backdrop-blur-xl border-white/20">
        <div className="flex flex-col h-[85vh] md:h-auto md:min-h-[600px]">
          {/* Header */}
          <div className="p-6 border-b border-gray-100 flex justify-between items-start bg-white/50">
            <div>
              <DialogTitle className="text-2xl font-bold text-brand-slate flex items-center gap-2">
                <CalendarIcon className="h-6 w-6 text-brand-lime" />
                Agendar Horário
              </DialogTitle>
              <p className="text-gray-500 mt-1">
                {lead?.name} • {lead?.phone}
              </p>
            </div>
          </div>

          <div className="flex-1 overflow-auto md:overflow-hidden flex flex-col md:flex-row">
            {/* Left Column: Configuration */}
            <div className="w-full md:w-1/2 p-6 space-y-6 border-r border-gray-100 overflow-y-auto">
              {/* Type Selection */}
              <div className="space-y-3">
                <Label>Tipo de Agendamento</Label>
                <Tabs
                  value={state.type}
                  onValueChange={handleTypeChange}
                  className="w-full"
                >
                  <TabsList className="w-full grid grid-cols-2">
                    <TabsTrigger value="evaluation">Avaliação</TabsTrigger>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="w-full">
                          <TabsTrigger
                            value="session"
                            disabled={!hasActiveDeals}
                            className="w-full"
                          >
                            Sessão
                          </TabsTrigger>
                        </span>
                      </TooltipTrigger>
                      {!hasActiveDeals && (
                        <TooltipContent>
                          <p>Cliente não possui contratos ativos</p>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </TabsList>
                </Tabs>

                {state.type === 'session' && hasActiveDeals && (
                  <Select
                    value={state.dealId || undefined}
                    onValueChange={(val) =>
                      setState((prev) => ({ ...prev, dealId: val }))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione o contrato" />
                    </SelectTrigger>
                    <SelectContent>
                      {deals.map((deal) => (
                        <SelectItem key={deal.id} value={deal.id}>
                          {deal.product_name || 'Contrato'} (
                          {deal.completed_sessions}/{deal.total_sessions}{' '}
                          sessões)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              {/* Staff Selection */}
              <div className="space-y-3">
                <Label>Profissional</Label>
                <Select
                  value={state.staffId || undefined}
                  onValueChange={(val) =>
                    setState((prev) => ({ ...prev, staffId: val, time: null }))
                  }
                  disabled={loadingStaff}
                >
                  <SelectTrigger className="w-full h-14">
                    <SelectValue placeholder="Selecione um profissional" />
                  </SelectTrigger>
                  <SelectContent>
                    {loadingStaff ? (
                      <div className="p-2 space-y-2">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                    ) : (
                      staff.map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-brand-lime/20 text-brand-lime-dark">
                                {member.name[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col text-left">
                              <span className="font-medium">{member.name}</span>
                              <span className="text-xs text-gray-500">
                                {member.appointment_count || 0} agendamentos
                                hoje
                              </span>
                            </div>
                          </div>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Calendar */}
              <div className="space-y-3">
                <Label>Data</Label>
                <div className="border rounded-lg p-2 bg-white/50">
                  <Calendar
                    mode="single"
                    selected={state.date}
                    onSelect={(date) =>
                      setState((prev) => ({ ...prev, date, time: null }))
                    }
                    disabled={isDayDisabled}
                    className="w-full flex justify-center"
                    classNames={{
                      day_selected:
                        'bg-brand-lime text-brand-slate hover:bg-brand-lime hover:text-brand-slate focus:bg-brand-lime focus:text-brand-slate',
                      day_today: 'bg-gray-100 text-gray-900',
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Slots & Summary */}
            <div className="w-full md:w-1/2 p-6 bg-gray-50/50 flex flex-col overflow-y-auto">
              <div className="flex-1 space-y-6">
                {/* Time Slots */}
                <div>
                  <Label className="mb-3 block">Horários Disponíveis</Label>
                  {!state.staffId || !state.date ? (
                    <div className="h-32 flex items-center justify-center text-gray-400 border-2 border-dashed rounded-lg">
                      <p className="text-sm">
                        Selecione profissional e data para ver horários
                      </p>
                    </div>
                  ) : loadingSlots ? (
                    <div className="grid grid-cols-3 gap-2">
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <Skeleton key={i} className="h-10 w-full" />
                      ))}
                    </div>
                  ) : slots.length === 0 ? (
                    <div className="h-32 flex items-center justify-center text-gray-400 bg-white rounded-lg border">
                      <div className="text-center">
                        <Clock className="h-6 w-6 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">
                          Nenhum horário disponível para esta data
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {slots.map((slot) => (
                        <button
                          key={slot.time}
                          disabled={!slot.available}
                          onClick={() =>
                            setState((prev) => ({ ...prev, time: slot.time }))
                          }
                          className={cn(
                            'relative px-2 py-2 text-sm font-medium rounded-md border transition-all duration-200',
                            state.time === slot.time
                              ? 'bg-brand-lime text-brand-slate border-brand-lime shadow-md transform scale-105'
                              : slot.available
                                ? 'bg-white text-gray-700 border-gray-200 hover:border-brand-lime hover:text-brand-lime'
                                : 'bg-gray-100 text-gray-300 border-transparent cursor-not-allowed line-through',
                          )}
                        >
                          {slot.time}
                          {state.time === slot.time && (
                            <div className="absolute -top-1.5 -right-1.5 bg-brand-slate text-white rounded-full p-0.5">
                              <CheckCircle2 className="h-3 w-3" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Notes */}
                <div className="space-y-3">
                  <Label>Observações</Label>
                  <Textarea
                    placeholder="Notas sobre o agendamento..."
                    value={state.notes}
                    onChange={(e) =>
                      setState((prev) => ({ ...prev, notes: e.target.value }))
                    }
                    className="min-h-[80px] bg-white resize-none"
                  />
                </div>
              </div>

              {/* Summary Card */}
              <div className="mt-6 bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-4">
                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Info className="h-4 w-4 text-brand-lime" />
                  Resumo
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-1 border-b border-gray-50">
                    <span className="text-gray-500">Tipo:</span>
                    <span className="font-medium capitalize text-brand-slate">
                      {state.type === 'evaluation' ? 'Avaliação' : 'Sessão'}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-50">
                    <span className="text-gray-500">Profissional:</span>
                    <span className="font-medium text-brand-slate">
                      {staff.find((s) => s.id === state.staffId)?.name || '-'}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-50">
                    <span className="text-gray-500">Data e Hora:</span>
                    <span className="font-medium text-brand-slate">
                      {state.date && state.time
                        ? `${format(state.date, 'dd/MM/yyyy')} às ${state.time}`
                        : '-'}
                    </span>
                  </div>
                </div>

                <AppButton
                  className="w-full"
                  variant={isFormValid ? 'default' : 'outline'}
                  disabled={!isFormValid || submitting}
                  loading={submitting}
                  onClick={handleConfirm}
                >
                  {!isFormValid && <AlertCircle className="mr-2 h-4 w-4" />}
                  {isFormValid ? 'Confirmar Agendamento' : 'Preencha os dados'}
                </AppButton>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
