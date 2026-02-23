import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase/client'
import { CRMLead } from './use-crm-data'
import { startOfDay, addDays, isBefore, isAfter } from 'date-fns'

export interface Deal {
  id: string
  created_at: string | null
  total_value: number
  discount_value: number | null
  status: string
  total_sessions: number
  completed_sessions: number
  next_session_due: string | null
  products: {
    name: string
    return_interval_days: number
  } | null
}

export interface Client extends CRMLead {
  deals: Deal[]
}

export type ClientFilter =
  | 'all'
  | 'pending'
  | 'near_return'
  | 'overdue'
  | 'completed'

export function useClients() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [filter, setFilter] = useState<ClientFilter>('all')

  const fetchClients = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error: supabaseError } = await supabase
        .from('leads')
        .select(
          `
          *,
          status!inner(id, name, color),
          deals(
            id,
            created_at,
            total_value,
            discount_value,
            status,
            total_sessions,
            completed_sessions,
            next_session_due,
            products(name, return_interval_days)
          )
        `,
        )
        .eq('status.name', 'Cliente')
        .order('name', { ascending: true })

      if (supabaseError) throw supabaseError

      setClients(data as unknown as Client[])
    } catch (err) {
      console.error('Error fetching clients:', err)
      setError('Erro ao carregar clientes')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchClients()
  }, [fetchClients])

  const filteredClients = clients.filter((client) => {
    // 1. Search Query (Debounce handled in UI)
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      const matchesName = client.name?.toLowerCase().includes(q)
      const matchesPhone = client.phone?.includes(q)
      if (!matchesName && !matchesPhone) return false
    }

    // 2. Filter Logic
    if (filter === 'all') return true

    const hasPending = client.deals?.some(
      (d) => d.completed_sessions < d.total_sessions && d.status === 'active',
    )
    const hasCompleted = client.deals?.some(
      (d) => d.completed_sessions >= d.total_sessions,
    )

    const today = startOfDay(new Date())
    const nextWeek = addDays(today, 7)

    const hasNearReturn = client.deals?.some((d) => {
      if (!d.next_session_due || d.status !== 'active') return false
      const due = new Date(d.next_session_due)
      return (
        isAfter(due, today) &&
        isBefore(due, nextWeek) &&
        d.completed_sessions < d.total_sessions
      )
    })

    const hasOverdue = client.deals?.some((d) => {
      if (!d.next_session_due || d.status !== 'active') return false
      const due = new Date(d.next_session_due)
      return isBefore(due, today) && d.completed_sessions < d.total_sessions
    })

    if (filter === 'pending') return hasPending
    if (filter === 'near_return') return hasNearReturn
    if (filter === 'overdue') return hasOverdue
    if (filter === 'completed') return hasCompleted

    return true
  })

  return {
    clients,
    filteredClients,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    filter,
    setFilter,
    refresh: fetchClients,
  }
}
