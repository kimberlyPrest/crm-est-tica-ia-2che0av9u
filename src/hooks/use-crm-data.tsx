import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase/client'
import { startOfDay } from 'date-fns'

export interface CRMLead {
  id: string
  name: string | null
  phone: string
  email: string | null
  status_id: string
  created_at: string
  updated_at: string
  notes: string | null
  tags: string[] | null
  has_pending_message: boolean
  ai_agent_blocked: boolean
  last_interaction_at: string | null
  status?: {
    id: string
    name: string
    color: string
  }
}

export interface CRMStatus {
  id: string
  name: string
  color: string
  order: number
}

export type CRMFilter =
  | 'all'
  | 'pending_message'
  | 'ai_blocked'
  | 'created_today'

export function useCrmData() {
  const [leads, setLeads] = useState<CRMLead[]>([])
  const [statuses, setStatuses] = useState<CRMStatus[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<CRMFilter>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const fetchStatuses = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('status')
        .select('*')
        .order('order', { ascending: true })

      if (error) throw error
      setStatuses(data || [])
    } catch (err) {
      console.error('Error fetching statuses:', err)
      setError('Erro ao carregar status')
    }
  }, [])

  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('leads')
        .select(
          `
          *,
          status (
            id,
            name,
            color
          )
        `,
        )
        .order('updated_at', { ascending: false })

      if (error) throw error
      setLeads(data as CRMLead[])
    } catch (err) {
      console.error('Error fetching leads:', err)
      setError('Erro ao carregar leads')
    } finally {
      setLoading(false)
    }
  }, [])

  // Initial load
  useEffect(() => {
    fetchStatuses()
    fetchLeads()
  }, [fetchStatuses, fetchLeads])

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel('crm-updates')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'leads' },
        () => {
          fetchLeads()
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [fetchLeads])

  // Filter Logic
  const filteredLeads = leads.filter((lead) => {
    // 1. Text Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const matchesName = lead.name?.toLowerCase().includes(query)
      const matchesPhone = lead.phone.includes(query)
      if (!matchesName && !matchesPhone) return false
    }

    // 2. Quick Filters
    if (filter === 'all') return true
    if (filter === 'pending_message') return lead.has_pending_message
    if (filter === 'ai_blocked') return lead.ai_agent_blocked
    if (filter === 'created_today') {
      const today = startOfDay(new Date())
      const leadDate = new Date(lead.created_at)
      return leadDate >= today
    }

    return true
  })

  // Group by status
  const leadsByStatus = statuses.reduce(
    (acc, status) => {
      acc[status.id] = filteredLeads.filter(
        (lead) => lead.status_id === status.id,
      )
      return acc
    },
    {} as Record<string, CRMLead[]>,
  )

  return {
    leads,
    statuses,
    loading,
    error,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    filteredLeads,
    leadsByStatus,
    refresh: fetchLeads,
  }
}
