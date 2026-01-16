import { useState, useEffect } from 'react'
import {
  useAppointments,
  AgendaView,
  AppointmentWithDetails,
} from '@/hooks/use-appointments'
import { AgendaHeader } from '@/components/agenda/AgendaHeader'
import { MonthView } from '@/components/agenda/MonthView'
import { WeekView } from '@/components/agenda/WeekView'
import { DayView } from '@/components/agenda/DayView'
import { AppointmentDetailModal } from '@/components/agenda/AppointmentDetailModal'
import { DayAppointmentsModal } from '@/components/agenda/DayAppointmentsModal'
import { SchedulingModal } from '@/components/crm/SchedulingModal'
import { supabase } from '@/lib/supabase/client'
import { StaffMember } from '@/hooks/use-scheduling'
import { Loader2 } from 'lucide-react'
import { setHours, setMinutes } from 'date-fns'

export default function Agenda() {
  const [view, setView] = useState<AgendaView>('month')
  const [date, setDate] = useState(new Date())
  const [staffId, setStaffId] = useState<string | null>(null)

  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([])

  // Modal States
  const [detailOpen, setDetailOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] =
    useState<AppointmentWithDetails | null>(null)

  const [dayListOpen, setDayListOpen] = useState(false)
  const [selectedDay, setSelectedDay] = useState(new Date())
  const [dayAppointments, setDayAppointments] = useState<
    AppointmentWithDetails[]
  >([])

  const [schedulingOpen, setSchedulingOpen] = useState(false)
  const [initialTime, setInitialTime] = useState<string | null>(null)

  const { appointments, loading, refresh } = useAppointments(
    view,
    date,
    staffId,
  )

  // Fetch staff (simplified version of useScheduling logic)
  useEffect(() => {
    async function fetchStaff() {
      const { data } = await supabase
        .from('users')
        .select('*')
        .in('role', ['admin', 'staff', 'user'])
        .eq('is_active', true)

      if (data) {
        setStaffMembers(data.map((u) => ({ ...u, appointment_count: 0 })))
      }
    }
    fetchStaff()
  }, [])

  const handleAppointmentClick = (apt: AppointmentWithDetails) => {
    setSelectedAppointment(apt)
    setDetailOpen(true)
  }

  const handleDayClick = (day: Date, apts: AppointmentWithDetails[]) => {
    setSelectedDay(day)
    setDayAppointments(apts)
    setDayListOpen(true)
  }

  const handleEmptySlotClick = (time: string) => {
    setInitialTime(time)
    setSchedulingOpen(true)
  }

  return (
    <div className="space-y-6 pb-10 animate-fade-in">
      <AgendaHeader
        view={view}
        onViewChange={setView}
        date={date}
        onDateChange={setDate}
        staffId={staffId}
        onStaffChange={setStaffId}
        staffMembers={staffMembers}
      />

      {loading && appointments.length === 0 ? (
        <div className="h-[500px] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-brand-lime" />
        </div>
      ) : (
        <div className="transition-all duration-300">
          {view === 'month' && (
            <MonthView
              date={date}
              appointments={appointments}
              onDayClick={handleDayClick}
            />
          )}
          {view === 'week' && (
            <WeekView
              date={date}
              appointments={appointments}
              onAppointmentClick={handleAppointmentClick}
            />
          )}
          {view === 'day' && (
            <DayView
              date={date}
              appointments={appointments}
              onAppointmentClick={handleAppointmentClick}
              onEmptySlotClick={handleEmptySlotClick}
              refresh={refresh}
            />
          )}
        </div>
      )}

      {/* Modals */}
      <AppointmentDetailModal
        open={detailOpen}
        onOpenChange={setDetailOpen}
        appointment={selectedAppointment}
        onSuccess={refresh}
      />

      <DayAppointmentsModal
        open={dayListOpen}
        onOpenChange={setDayListOpen}
        date={selectedDay}
        appointments={dayAppointments}
        onAppointmentClick={handleAppointmentClick}
      />

      {/* Reusing SchedulingModal but we might need to tweak it to accept predefined date/time */}
      {/* Since SchedulingModal in context expects 'lead', we might need to adapt.
          However, the user story says "open scheduling modal with the time pre-selected".
          If I reuse SchedulingModal, it requires a Lead. 
          Assuming for now we open it empty or we need a "New Appointment" flow that selects lead first.
          The current SchedulingModal is designed to be opened FROM a lead context.
          
          I will create a placeholder logic here: If we had a GeneralSchedulingModal that selects lead first, I'd use that.
          Given constraints, I'll pass null lead and if the modal handles it, great.
          Looking at SchedulingModal code: It requires `lead: CRMLead | null`.
          If lead is null, it shows "Agendar Horário" and `lead?.name` which would be undefined.
          It doesn't seem to have a lead selector.
          
          User story: "Clicking opens the scheduling modal with the time pre-selected."
          Since I cannot rewrite SchedulingModal entirely to add Lead Selection (it's big), 
          I will assume for this MVP that creating appointments from Agenda is limited or 
          I should add a Lead Selector to SchedulingModal if I could.
          
          Actually, I can't modify SchedulingModal significantly to add Lead search without breaking scope potentially.
          But wait, the user story implies full management.
          
          I will use the `NewLeadModal` pattern or similar if it existed.
          For now, I'll pass `lead={null}` and `initialDate/Time` if I could.
          But SchedulingModal doesn't take initialDate/Time props in the interface provided in context!
          It uses `useScheduling` hook internally which resets state on open.
          
          I will skip passing initial time to SchedulingModal since it's not supported by the current component interface
          without modifying `SchedulingModal.tsx` and `use-scheduling.ts`.
          I will modify `SchedulingModal.tsx` to accept `initialDate` and `initialTime`?
          The instructions say "You CAN create new files".
          I'll modify `SchedulingModal.tsx` to accept optional `initialDate` and `initialTime`.
      */}

      {/* NOTE: I am not modifying SchedulingModal in this turn to avoid complexity explosion and breaking existing flows.
          I will just render it. The user will have to select date/time again.
          Wait, the User Story says: "clicking opens the scheduling modal with the time pre-selected".
          I MUST implement this.
          
          I will update `SchedulingModal.tsx` and `use-scheduling.ts` to support initialDate/Time.
      */}
    </div>
  )
}
