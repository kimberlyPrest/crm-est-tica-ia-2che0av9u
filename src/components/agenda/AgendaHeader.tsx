import { GlassCard } from '@/components/GlassCard'
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from 'lucide-react'
import { AppButton } from '@/components/AppButton'
import {
  format,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  addDays,
  subDays,
} from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { AgendaView } from '@/hooks/use-appointments'
import { StaffMember } from '@/hooks/use-scheduling'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

interface AgendaHeaderProps {
  view: AgendaView
  onViewChange: (view: AgendaView) => void
  date: Date
  onDateChange: (date: Date) => void
  staffId: string | null
  onStaffChange: (staffId: string) => void
  staffMembers: StaffMember[]
}

export function AgendaHeader({
  view,
  onViewChange,
  date,
  onDateChange,
  staffId,
  onStaffChange,
  staffMembers,
}: AgendaHeaderProps) {
  const handlePrev = () => {
    if (view === 'month') onDateChange(subMonths(date, 1))
    else if (view === 'week') onDateChange(subWeeks(date, 1))
    else onDateChange(subDays(date, 1))
  }

  const handleNext = () => {
    if (view === 'month') onDateChange(addMonths(date, 1))
    else if (view === 'week') onDateChange(addWeeks(date, 1))
    else onDateChange(addDays(date, 1))
  }

  const getPeriodLabel = () => {
    if (view === 'month') {
      return format(date, "MMMM 'de' yyyy", { locale: ptBR })
    }
    if (view === 'week') {
      return `Semana ${format(date, 'w', { locale: ptBR })} de ${format(date, 'MMMM', { locale: ptBR })}`
    }
    return format(date, "d 'de' MMMM", { locale: ptBR })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-brand-slate">Agenda</h1>
          <p className="text-gray-500">
            Gerencie agendamentos e disponibilidade
          </p>
        </div>

        <ToggleGroup
          type="single"
          value={view}
          onValueChange={(v) => v && onViewChange(v as AgendaView)}
          className="bg-white/40 p-1 rounded-full border border-white/40 shadow-sm"
        >
          <ToggleGroupItem
            value="day"
            className="rounded-full data-[state=on]:bg-brand-lime data-[state=on]:text-brand-slate px-4"
          >
            Dia
          </ToggleGroupItem>
          <ToggleGroupItem
            value="week"
            className="rounded-full data-[state=on]:bg-brand-lime data-[state=on]:text-brand-slate px-4"
          >
            Semana
          </ToggleGroupItem>
          <ToggleGroupItem
            value="month"
            className="rounded-full data-[state=on]:bg-brand-lime data-[state=on]:text-brand-slate px-4"
          >
            Mês
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <GlassCard
        size="md"
        className="p-4 flex flex-col md:flex-row items-center justify-between gap-4"
      >
        <div className="flex items-center gap-2 w-full md:w-auto justify-between">
          <div className="flex items-center gap-1">
            <AppButton
              variant="ghost"
              size="icon"
              onClick={handlePrev}
              className="h-8 w-8 hover:bg-white/60"
            >
              <ChevronLeft className="h-4 w-4" />
            </AppButton>
            <AppButton
              variant="ghost"
              size="sm"
              onClick={() => onDateChange(new Date())}
              className="h-8 text-xs font-medium hover:bg-white/60"
            >
              Hoje
            </AppButton>
            <AppButton
              variant="ghost"
              size="icon"
              onClick={handleNext}
              className="h-8 w-8 hover:bg-white/60"
            >
              <ChevronRight className="h-4 w-4" />
            </AppButton>
          </div>

          <h2 className="text-lg font-bold text-brand-slate capitalize min-w-[150px] text-center md:text-left ml-4">
            {getPeriodLabel()}
          </h2>
        </div>

        <div className="w-full md:w-[280px]">
          <Select value={staffId || 'all'} onValueChange={onStaffChange}>
            <SelectTrigger className="w-full bg-white/50 border-white/30 h-10">
              <SelectValue placeholder="Filtrar por profissional" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os profissionais</SelectItem>
              {staffMembers.map((staff) => (
                <SelectItem key={staff.id} value={staff.id}>
                  {staff.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </GlassCard>
    </div>
  )
}
