import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase/client'

export interface Message {
  id: string
  content: string
  direction: 'inbound' | 'outbound'
  sent_by: string
  created_at: string
  message_type: string
}

export interface Activity {
  id: string
  type: string
  description: string
  created_at: string
  metadata: any
}

export function useLeadDetails(leadId: string | null) {
  const [messages, setMessages] = useState<Message[]>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(false)

  const fetchDetails = useCallback(async () => {
    if (!leadId) return

    setLoading(true)
    try {
      // Fetch Messages
      const { data: msgs } = await supabase
        .from('messages')
        .select('*')
        .eq('lead_id', leadId)
        .order('created_at', { ascending: true })
        .limit(50)

      setMessages(msgs || [])

      // Fetch Activities
      const { data: acts } = await supabase
        .from('activities')
        .select('*')
        .eq('lead_id', leadId)
        .order('created_at', { ascending: false })

      setActivities(acts || [])
    } catch (error) {
      console.error('Error fetching lead details:', error)
    } finally {
      setLoading(false)
    }
  }, [leadId])

  useEffect(() => {
    if (leadId) {
      fetchDetails()
    } else {
      setMessages([])
      setActivities([])
    }
  }, [leadId, fetchDetails])

  return { messages, activities, loading, refreshDetails: fetchDetails }
}
