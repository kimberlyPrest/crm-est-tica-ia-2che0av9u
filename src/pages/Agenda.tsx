import { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
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

  // Fix for: Uncaught TypeError: setSearchQuery is not a function
  // Safely grab the context and provide a fallback no-op function
  const context = useOutletContext<{
    setSearchQuery?: (query: string) => void
  } | null>()
  const setSearchQuery = context?.setSearchQuery ?? (() => {})

  useEffect(() => {
    // Clear global search state when Agenda mounts to prevent stale queries
    setSearchQuery('')
    return () => setSearchQuery('')
  }, [setSearchQuery])

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

      <SchedulingModal
        open={schedulingOpen}
        onOpenChange={setSchedulingOpen}
        lead={null}
        initialDate={view === 'day' ? date : undefined}
        initialTime={initialTime || undefined}
        onSuccess={() => {
          setSchedulingOpen(false)
          refresh()
        }}
      />
    </div>
  )
}
