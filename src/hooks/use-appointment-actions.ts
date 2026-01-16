import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { AppointmentWithDetails } from './use-appointments'

export function useAppointmentActions(onSuccess?: () => void) {
  const [loading, setLoading] = useState(false)

  const confirmAppointment = async (appointmentId: string) => {
    setLoading(true)
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: 'confirmed' })
        .eq('id', appointmentId)

      if (error) throw error
      toast.success('Agendamento confirmado!')
      onSuccess?.()
    } catch (err) {
      console.error(err)
      toast.error('Erro ao confirmar agendamento')
    } finally {
      setLoading(false)
    }
  }

  const completeAppointment = async (appointment: AppointmentWithDetails) => {
    setLoading(true)
    try {
      // 1. Update appointment status
      const { error: apptError } = await supabase
        .from('appointments')
        .update({ status: 'completed' })
        .eq('id', appointment.id)

      if (apptError) throw apptError

      // 2. If Session, update deal sessions
      if (appointment.type === 'session') {
        // Find the deal session linked to this appointment
        const { data: dealSession } = await supabase
          .from('deal_sessions')
          .select('id, deal_id')
          .eq('appointment_id', appointment.id)
          .single()

        if (dealSession) {
          // Update session completed_at
          await supabase
            .from('deal_sessions')
            .update({ completed_at: new Date().toISOString() })
            .eq('id', dealSession.id)

          // Increment completed_sessions in deal
          // Note: Ideally use an RPC for atomic increment, but read-update-write is ok for now
          const { data: deal } = await supabase
            .from('deals')
            .select('completed_sessions')
            .eq('id', dealSession.deal_id)
            .single()

          if (deal) {
            await supabase
              .from('deals')
              .update({
                completed_sessions: (deal.completed_sessions || 0) + 1,
              })
              .eq('id', dealSession.deal_id)
          }
        }
      }

      toast.success('Agendamento concluído!')
      onSuccess?.()
    } catch (err) {
      console.error(err)
      toast.error('Erro ao concluir agendamento')
    } finally {
      setLoading(false)
    }
  }

  const markNoShow = async (appointment: AppointmentWithDetails) => {
    setLoading(true)
    try {
      // 1. Update appointment status
      const { error: apptError } = await supabase
        .from('appointments')
        .update({ status: 'no_show' })
        .eq('id', appointment.id)

      if (apptError) throw apptError

      // 2. Find "Faltou o Agendamento" status
      const { data: statusData } = await supabase
        .from('status')
        .select('id')
        .eq('name', 'Faltou o Agendamento')
        .maybeSingle()

      // 3. Update Lead Status if status exists
      if (statusData && appointment.lead_id) {
        await supabase
          .from('leads')
          .update({ status_id: statusData.id })
          .eq('id', appointment.lead_id)
      }

      // 4. Create Activity
      await supabase.from('activities').insert({
        lead_id: appointment.lead_id,
        type: 'manual_action',
        description: 'Cliente não compareceu ao agendamento',
        metadata: { appointment_id: appointment.id },
      })

      toast.success('No-show registrado com sucesso')
      onSuccess?.()
    } catch (err) {
      console.error(err)
      toast.error('Erro ao registrar ausência')
    } finally {
      setLoading(false)
    }
  }

  const cancelAppointment = async (appointmentId: string) => {
    setLoading(true)
    try {
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', appointmentId)

      if (error) throw error
      toast.success('Agendamento cancelado')
      onSuccess?.()
    } catch (err) {
      console.error(err)
      toast.error('Erro ao cancelar agendamento')
    } finally {
      setLoading(false)
    }
  }

  const rescheduleAppointment = async (
    appointmentId: string,
    newDate: Date,
    time: string,
  ) => {
    setLoading(true)
    try {
      const [hours, minutes] = time.split(':').map(Number)
      const scheduledAt = new Date(newDate)
      scheduledAt.setHours(hours, minutes, 0, 0)

      const { error } = await supabase
        .from('appointments')
        .update({ scheduled_at: scheduledAt.toISOString() })
        .eq('id', appointmentId)

      if (error) throw error
      toast.success('Reagendamento realizado com sucesso')
      onSuccess?.()
    } catch (err) {
      console.error(err)
      toast.error('Erro ao reagendar')
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    confirmAppointment,
    completeAppointment,
    markNoShow,
    cancelAppointment,
    rescheduleAppointment,
  }
}
