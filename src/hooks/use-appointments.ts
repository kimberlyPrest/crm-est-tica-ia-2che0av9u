import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase/client'
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  startOfDay,
  endOfDay,
} from 'date-fns'
import { toast } from 'sonner'

export type AgendaView = 'day' | 'week' | 'month'

export interface AppointmentWithDetails {
  id: string
  scheduled_at: string
  type: 'evaluation' | 'session'
  status: 'pending' | 'confirmed' | 'completed' | 'no_show'
  notes: string | null
  lead_id: string
  staff_id: string | null
  leads: {
    id: string
    name: string | null
    phone: string
    email: string | null
    status: {
      name: string
      color: string
    } | null
  } | null
  users: {
    id: string
    name: string
    email: string
  } | null
}

export function useAppointments(
  view: AgendaView,
  date: Date,
  staffId: string | null,
) {
  const [appointments, setAppointments] = useState<AppointmentWithDetails[]>([])
  const [loading, setLoading] = useState(true)

  const fetchAppointments = useCallback(async () => {
    setLoading(true)
    try {
      let from: Date
      let to: Date

      if (view === 'month') {
        from = startOfWeek(startOfMonth(date))
        to = endOfWeek(endOfMonth(date))
      } else if (view === 'week') {
        from = startOfWeek(date)
        to = endOfWeek(date)
      } else {
        from = startOfDay(date)
        to = endOfDay(date)
      }

      let query = supabase
        .from('appointments')
        .select(
          `
          *,
          leads (
            id,
            name,
            phone,
            email,
            status (
              name,
              color
            )
          ),
          users (
            id,
            name,
            email
          )
        `,
        )
        .gte('scheduled_at', from.toISOString())
        .lte('scheduled_at', to.toISOString())

      if (staffId && staffId !== 'all') {
        query = query.eq('staff_id', staffId)
      }

      const { data, error } = await query

      if (error) throw error

      setAppointments((data as unknown as AppointmentWithDetails[]) || [])
    } catch (error) {
      console.error('Error fetching appointments:', error)
      toast.error('Erro ao carregar agendamentos')
    } finally {
      setLoading(false)
    }
  }, [view, date, staffId])

  useEffect(() => {
    fetchAppointments()

    const channel = supabase
      .channel('agenda-updates')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'appointments' },
        () => {
          fetchAppointments()
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [fetchAppointments])

  return {
    appointments,
    loading,
    refresh: fetchAppointments,
  }
}
