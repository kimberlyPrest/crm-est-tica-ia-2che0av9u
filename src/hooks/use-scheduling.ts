import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase/client'
import {
  format,
  addDays,
  startOfDay,
  parseISO,
  isSameDay,
  getHours,
  setHours,
  setMinutes,
  isBefore,
  isPast,
  endOfDay,
} from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { toast } from 'sonner'
import { CRMLead } from './use-crm-data'

export interface StaffMember {
  id: string
  name: string
  email: string
  avatar_url?: string
  role: string
  appointment_count?: number
}

export interface TimeSlot {
  time: string // HH:mm
  available: boolean
  reason?: string // 'booked' | 'past' | 'unavailable'
}

export interface SchedulingState {
  step: 'details' | 'confirmation'
  type: 'evaluation' | 'session'
  staffId: string | null
  date: Date | undefined
  time: string | null
  notes: string
  dealId: string | null
}

export function useScheduling(
  lead: CRMLead | null,
  isOpen: boolean,
  initialDealId?: string,
  initialDate?: Date,
  initialTime?: string,
) {
  const [state, setState] = useState<SchedulingState>({
    step: 'details',
    type: 'evaluation',
    staffId: null,
    date: undefined,
    time: null,
    notes: '',
    dealId: null,
  })

  const [staff, setStaff] = useState<StaffMember[]>([])
  const [loadingStaff, setLoadingStaff] = useState(false)

  const [availability, setAvailability] = useState<any[]>([])
  const [loadingAvailability, setLoadingAvailability] = useState(false)

  const [slots, setSlots] = useState<TimeSlot[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)

  const [deals, setDeals] = useState<any[]>([])
  const [loadingDeals, setLoadingDeals] = useState(false)

  const [submitting, setSubmitting] = useState(false)

  // Reset state when modal opens/closes or lead changes
  useEffect(() => {
    if (isOpen) {
      setState({
        step: 'details',
        type: initialDealId ? 'session' : 'evaluation',
        staffId: null,
        date: initialDate || undefined,
        time: initialTime || null,
        notes: '',
        dealId: initialDealId || null,
      })
      setSlots([])
      fetchStaff()
      if (lead) fetchDeals()
    }
  }, [isOpen, lead, initialDealId, initialDate, initialTime])

  // Fetch active staff members
  const fetchStaff = async () => {
    setLoadingStaff(true)
    try {
      // Fetch users with role that might be staff (assuming 'admin' or 'staff')
      const { data: users, error } = await supabase
        .from('users')
        .select('*')
        .in('role', ['admin', 'staff', 'user']) // Adjust roles as needed based on your system
        .eq('is_active', true)

      if (error) throw error

      // For a real app, we would join with appointments to get count
      // Mocking the count for now or doing a separate count query
      const today = new Date().toISOString().split('T')[0]
      const staffWithCounts = await Promise.all(
        (users || []).map(async (user) => {
          const { count } = await supabase
            .from('appointments')
            .select('*', { count: 'exact', head: true })
            .eq('staff_id', user.id)
            .gte('scheduled_at', `${today}T00:00:00`)
            .lte('scheduled_at', `${today}T23:59:59`)

          return {
            ...user,
            appointment_count: count || 0,
          }
        }),
      )

      setStaff(staffWithCounts)
    } catch (err) {
      console.error('Error fetching staff:', err)
      toast.error('Erro ao carregar profissionais')
    } finally {
      setLoadingStaff(false)
    }
  }

  // Fetch deals for the lead to validate "Session" type
  const fetchDeals = async () => {
    if (!lead) return
    setLoadingDeals(true)
    try {
      const { data, error } = await supabase
        .from('deals')
        .select(`*, products (name)`)
        .eq('lead_id', lead.id)
        .eq('status', 'active')

      if (error) throw error

      const activeDeals = (data || []).filter(
        (d) => d.total_sessions > (d.completed_sessions || 0),
      )
      setDeals(activeDeals)
    } catch (err) {
      console.error('Error fetching deals:', err)
    } finally {
      setLoadingDeals(false)
    }
  }

  // Fetch availability when staff changes
  useEffect(() => {
    const fetchAvailability = async () => {
      if (!state.staffId) {
        setAvailability([])
        return
      }
      setLoadingAvailability(true)
      try {
        const { data, error } = await supabase
          .from('staff_availability')
          .select('*')
          .eq('staff_id', state.staffId)
          .eq('is_active', true)

        if (error) throw error
        setAvailability(data || [])
      } catch (err) {
        console.error('Error fetching availability:', err)
        toast.error('Erro ao carregar disponibilidade')
      } finally {
        setLoadingAvailability(false)
      }
    }

    fetchAvailability()
  }, [state.staffId])

  // Generate slots when date or staff changes
  useEffect(() => {
    const generateSlots = async () => {
      // If we have initial time but no staff selected yet, we can't generate accurate slots
      // but we should respect the initial state.
      if (!state.staffId || !state.date) {
        setSlots([])
        return
      }

      setLoadingSlots(true)
      try {
        const dayOfWeek = state.date.getDay() // 0-6
        const schedule = availability.find((a) => a.day_of_week === dayOfWeek)

        if (!schedule) {
          setSlots([])
          setLoadingSlots(false)
          return
        }

        // Get appointments for conflict checking
        const startDay = startOfDay(state.date).toISOString()
        const endDay = endOfDay(state.date).toISOString()

        const { data: appointments, error } = await supabase
          .from('appointments')
          .select('scheduled_at')
          .eq('staff_id', state.staffId)
          .gte('scheduled_at', startDay)
          .lte('scheduled_at', endDay)
          .in('status', ['pending', 'confirmed'])

        if (error) throw error

        const bookedTimes = new Set(
          (appointments || []).map((appt) =>
            format(new Date(appt.scheduled_at), 'HH:mm'),
          ),
        )

        // Generate hourly slots
        const startTime = parseInt(schedule.start_time.split(':')[0])
        const endTime = parseInt(schedule.end_time.split(':')[0])

        const generatedSlots: TimeSlot[] = []
        const now = new Date()

        for (let hour = startTime; hour < endTime; hour++) {
          const timeStr = `${hour.toString().padStart(2, '0')}:00`
          const slotDate = setHours(setMinutes(state.date, 0), hour)

          let isAvailable = true
          let reason: TimeSlot['reason']

          // Check if past
          if (isBefore(slotDate, now)) {
            isAvailable = false
            reason = 'past'
          }
          // Check conflicts
          else if (bookedTimes.has(timeStr)) {
            isAvailable = false
            reason = 'booked'
          }

          generatedSlots.push({
            time: timeStr,
            available: isAvailable,
            reason,
          })
        }

        setSlots(generatedSlots)
      } catch (err) {
        console.error('Error generating slots:', err)
      } finally {
        setLoadingSlots(false)
      }
    }

    generateSlots()
  }, [state.staffId, state.date, availability])

  const confirmBooking = async (onSuccess: () => void) => {
    if (!lead || !state.staffId || !state.date || !state.time) return

    setSubmitting(true)
    try {
      // 1. Get current user and organization
      const { data: { user } } = await supabase.auth.getUser()
      const { data: userData } = await supabase.from('users').select('organization_id').eq('id', user?.id).single()
      const organizationId = userData?.organization_id

      if (!organizationId) {
        toast.error('Erro de organização')
        setSubmitting(false)
        return
      }

      // 1.5 Get Status ID for 'Agendado'
      const { data: statusData } = await supabase
        .from('status')
        .select('id')
        .ilike('name', '%Agendado%')
        .single()

      const scheduledStatusId = statusData?.id

      // 2. Prepare scheduled_at
      const [hours, minutes] = state.time.split(':').map(Number)
      const scheduledAt = setMinutes(
        setHours(state.date, hours),
        minutes,
      ).toISOString()

      // 2.5 Check for conflicts again (Server side check ideally, but client side for now)
      const { count: conflictCount } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .eq('staff_id', state.staffId)
        .eq('scheduled_at', scheduledAt)
        .in('status', ['pending', 'confirmed'])

      if (conflictCount && conflictCount > 0) {
        toast.error('Horário já está ocupado')
        setSubmitting(false)
        return
      }

      // 3. Create Appointment
      const { data: appointment, error: apptError } = await supabase
        .from('appointments')
        .insert({
          lead_id: lead.id,
          staff_id: state.staffId,
          scheduled_at: scheduledAt,
          type: state.type,
          status: 'pending',
          notes: state.notes,
          organization_id: organizationId,
        })
        .select()
        .single()

      if (apptError) throw apptError

      // 4. If Session, link to Deal
      if (state.type === 'session' && state.dealId) {
        // Get current session count
        const deal = deals.find((d) => d.id === state.dealId)
        const sessionNumber = (deal?.completed_sessions || 0) + 1

        await supabase.from('deal_sessions').insert({
          deal_id: state.dealId,
          appointment_id: appointment.id,
          session_number: sessionNumber,
          notes: state.notes,
          organization_id: organizationId,
        })
      }

      // 5. Update Lead Status
      if (scheduledStatusId) {
        await supabase
          .from('leads')
          .update({ status_id: scheduledStatusId })
          .eq('id', lead.id)
      }

      // 6. Log Activity
      await supabase.from('activities').insert({
        lead_id: lead.id,
        type: 'appointment_created',
        description: `Agendamento de ${state.type === 'evaluation' ? 'Avaliação' : 'Sessão'} realizado para ${format(new Date(scheduledAt), "dd/MM 'às' HH:mm")}`,
        metadata: { appointment_id: appointment.id },
        organization_id: organizationId,
      })

      toast.success('Agendamento realizado com sucesso!')
      onSuccess()
    } catch (err) {
      console.error('Booking error:', err)
      toast.error('Erro ao realizar agendamento')
    } finally {
      setSubmitting(false)
    }
  }

  // Helper to check if a day is disabled in calendar
  const isDayDisabled = (date: Date) => {
    if (isPast(date) && !isSameDay(date, new Date())) return true

    // Check if staff works on this day of week
    if (state.staffId && availability.length > 0) {
      const dayOfWeek = date.getDay()
      const works = availability.some((a) => a.day_of_week === dayOfWeek)
      return !works
    }

    return false
  }

  return {
    state,
    setState,
    staff,
    loadingStaff,
    availability,
    slots,
    loadingSlots,
    deals,
    submitting,
    confirmBooking,
    isDayDisabled,
  }
}
