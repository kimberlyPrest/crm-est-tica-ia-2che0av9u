import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase/client'
import {
  startOfMonth,
  subMonths,
  startOfWeek,
  subWeeks,
  subDays,
  startOfYear,
} from 'date-fns'

export type Period = '7d' | '30d' | '90d' | '1y'

export interface KPI {
  label: string
  value: string | number
  change: number
  trend: 'up' | 'down' | 'neutral'
  icon: 'users' | 'dollar' | 'calendar' | 'check'
  loading: boolean
  error?: boolean
}

export interface FunnelStage {
  id: string
  name: string
  count: number
  color: string
}

export interface Activity {
  id: string
  type: string
  description: string
  created_at: string
  lead_id: string | null
  leads?: {
    name: string | null
    phone: string | null
  } | null
}

export function useDashboardData() {
  const [kpis, setKpis] = useState<{ [key: string]: KPI }>({
    leads: {
      label: 'Total Leads',
      value: 0,
      change: 0,
      trend: 'neutral',
      icon: 'users',
      loading: true,
    },
    revenue: {
      label: 'Receita Estimada',
      value: 'R$ 0,00',
      change: 0,
      trend: 'neutral',
      icon: 'dollar',
      loading: true,
    },
    appointments: {
      label: 'Agendamentos',
      value: 0,
      change: 0,
      trend: 'neutral',
      icon: 'calendar',
      loading: true,
    },
    sales: {
      label: 'Vendas Fechadas',
      value: 0,
      change: 0,
      trend: 'neutral',
      icon: 'check',
      loading: true,
    },
  })

  const [funnelData, setFunnelData] = useState<FunnelStage[]>([])
  const [funnelLoading, setFunnelLoading] = useState(true)
  const [funnelPeriod, setFunnelPeriod] = useState<Period>('30d')

  const [activities, setActivities] = useState<Activity[]>([])
  const [activitiesLoading, setActivitiesLoading] = useState(true)

  const fetchKPIs = useCallback(async () => {
    try {
      const now = new Date()
      const startOfCurrentMonth = startOfMonth(now).toISOString()
      const startOfPreviousMonth = startOfMonth(subMonths(now, 1)).toISOString()
      const startOfCurrentWeek = startOfWeek(now).toISOString()
      const startOfPreviousWeek = startOfWeek(subWeeks(now, 1)).toISOString()

      // 1. Leads
      const { count: totalLeads } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true })

      const { count: leadsCurrentMonth } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startOfCurrentMonth)

      const { count: leadsPrevMonth } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startOfPreviousMonth)
        .lt('created_at', startOfCurrentMonth)

      const leadsChange =
        leadsPrevMonth && leadsPrevMonth > 0
          ? ((leadsCurrentMonth || 0) - leadsPrevMonth) / leadsPrevMonth
          : 0

      // 2. Revenue (Deals active)
      const { data: deals } = await supabase
        .from('deals')
        .select('total_value, discount_value')
        .eq('status', 'active')

      const revenue =
        deals?.reduce(
          (acc, deal) => acc + (deal.total_value - (deal.discount_value || 0)),
          0,
        ) || 0

      // 3. Appointments
      const { count: totalAppointments } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .in('status', ['pending', 'confirmed'])

      const { count: appointmentsCurrentWeek } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .in('status', ['pending', 'confirmed'])
        .gte('created_at', startOfCurrentWeek)

      const { count: appointmentsPrevWeek } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .in('status', ['pending', 'confirmed'])
        .gte('created_at', startOfPreviousWeek)
        .lt('created_at', startOfCurrentWeek)

      const appointmentsChange =
        appointmentsPrevWeek && appointmentsPrevWeek > 0
          ? ((appointmentsCurrentWeek || 0) - appointmentsPrevWeek) /
            appointmentsPrevWeek
          : 0

      // 4. Closed Sales (Status = 'Cliente')
      const { data: statusData } = await supabase
        .from('status')
        .select('id')
        .eq('name', 'Cliente')
        .maybeSingle()

      let closedSalesCount = 0
      if (statusData) {
        const { count } = await supabase
          .from('leads')
          .select('*', { count: 'exact', head: true })
          .eq('status_id', statusData.id)
        closedSalesCount = count || 0
      }

      setKpis((prev) => ({
        leads: {
          ...prev.leads,
          value: totalLeads || 0,
          change: leadsChange * 100,
          trend: leadsChange >= 0 ? 'up' : 'down',
          loading: false,
        },
        revenue: {
          ...prev.revenue,
          value: new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }).format(revenue),
          change: 0,
          trend: 'neutral',
          loading: false,
        },
        appointments: {
          ...prev.appointments,
          value: totalAppointments || 0,
          change: appointmentsChange * 100,
          trend: appointmentsChange >= 0 ? 'up' : 'down',
          loading: false,
        },
        sales: {
          ...prev.sales,
          value: closedSalesCount,
          change: 0,
          trend: 'neutral',
          loading: false,
        },
      }))
    } catch (error) {
      console.error('Error fetching KPIs:', error)
      setKpis((prev) => {
        const newState = { ...prev }
        Object.keys(newState).forEach((key) => {
          newState[key] = { ...newState[key], loading: false, error: true }
        })
        return newState
      })
    }
  }, [])

  const fetchFunnel = useCallback(async () => {
    setFunnelLoading(true)
    try {
      const now = new Date()
      let startDate
      switch (funnelPeriod) {
        case '7d':
          startDate = subDays(now, 7)
          break
        case '30d':
          startDate = subMonths(now, 1)
          break
        case '90d':
          startDate = subMonths(now, 3)
          break
        case '1y':
          startDate = startOfYear(now)
          break
        default:
          startDate = subMonths(now, 1)
      }

      const { data: statuses } = await supabase
        .from('status')
        .select('*')
        .order('order', { ascending: true })

      if (!statuses) throw new Error('No statuses found')

      const stagesToTrack = ['Novo', 'Qualificado', 'Agendado', 'Cliente']
      const relevantStatuses = statuses.filter((s) =>
        stagesToTrack.includes(s.name),
      )

      relevantStatuses.sort(
        (a, b) => stagesToTrack.indexOf(a.name) - stagesToTrack.indexOf(b.name),
      )

      const funnelStages: FunnelStage[] = []

      await Promise.all(
        relevantStatuses.map(async (status) => {
          const { count } = await supabase
            .from('leads')
            .select('*', { count: 'exact', head: true })
            .eq('status_id', status.id)
            .gte('created_at', startDate.toISOString())

          let color = '#DDD6FE'
          if (status.name === 'Novo') color = '#DDD6FE'
          if (status.name === 'Qualificado') color = '#BAE6FD'
          if (status.name === 'Agendado') color = '#FEF3C7'
          if (status.name === 'Cliente') color = '#D9F99D'

          funnelStages.push({
            id: status.id,
            name: status.name,
            count: count || 0,
            color,
          })
        }),
      )

      funnelStages.sort(
        (a, b) => stagesToTrack.indexOf(a.name) - stagesToTrack.indexOf(b.name),
      )

      setFunnelData(funnelStages)
    } catch (error) {
      console.error('Error fetching funnel:', error)
    } finally {
      setFunnelLoading(false)
    }
  }, [funnelPeriod])

  const fetchActivities = useCallback(async () => {
    setActivitiesLoading(true)
    try {
      const { data, error } = await supabase
        .from('activities')
        .select(
          `
          *,
          leads (
            name,
            phone
          )
        `,
        )
        .order('created_at', { ascending: false })
        .limit(20)

      if (error) throw error
      setActivities((data as any) || [])
    } catch (error) {
      console.error('Error fetching activities:', error)
    } finally {
      setActivitiesLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchKPIs()
    fetchFunnel()
    fetchActivities()

    const channel = supabase
      .channel('dashboard-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'leads' },
        () => {
          fetchKPIs()
          fetchFunnel()
        },
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'deals' },
        () => {
          fetchKPIs()
        },
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'appointments' },
        () => {
          fetchKPIs()
          fetchActivities()
        },
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'activities' },
        () => {
          fetchActivities()
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [fetchKPIs, fetchFunnel, fetchActivities])

  return {
    kpis,
    funnelData,
    funnelLoading,
    funnelPeriod,
    setFunnelPeriod,
    activities,
    activitiesLoading,
    refreshActivities: fetchActivities,
    refreshKPIs: fetchKPIs,
    refreshFunnel: fetchFunnel,
  }
}
