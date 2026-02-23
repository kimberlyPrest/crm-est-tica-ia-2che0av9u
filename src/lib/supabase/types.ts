// AVOID UPDATING THIS FILE DIRECTLY. It is automatically generated.
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '14.1'
  }
  public: {
    Tables: {
      activities: {
        Row: {
          created_at: string | null
          description: string
          id: string
          lead_id: string | null
          metadata: Json | null
          organization_id: string
          type: string
          whatsapp_instance_id: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          lead_id?: string | null
          metadata?: Json | null
          organization_id?: string
          type: string
          whatsapp_instance_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          lead_id?: string | null
          metadata?: Json | null
          organization_id?: string
          type?: string
          whatsapp_instance_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'activities_lead_id_fkey'
            columns: ['lead_id']
            isOneToOne: false
            referencedRelation: 'leads'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'activities_organization_id_fkey'
            columns: ['organization_id']
            isOneToOne: false
            referencedRelation: 'organizations'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'activities_whatsapp_instance_id_fkey'
            columns: ['whatsapp_instance_id']
            isOneToOne: false
            referencedRelation: 'whatsapp_instances'
            referencedColumns: ['id']
          },
        ]
      }
      agent_config: {
        Row: {
          active_whatsapp_instance_id: string | null
          agent_name: string
          auto_schedule_enabled: boolean
          auto_schedule_end_time: string | null
          auto_schedule_start_time: string | null
          company_info: string | null
          created_at: string | null
          few_shot_examples: Json | null
          gemini_api_key: string | null
          guardrails: string | null
          human_handover_rules: string | null
          id: string
          is_enabled: boolean
          knowledge_instructions: string | null
          organization_id: string
          role_definition: string | null
          tone: string | null
          updated_at: string | null
        }
        Insert: {
          active_whatsapp_instance_id?: string | null
          agent_name?: string
          auto_schedule_enabled?: boolean
          auto_schedule_end_time?: string | null
          auto_schedule_start_time?: string | null
          company_info?: string | null
          created_at?: string | null
          few_shot_examples?: Json | null
          gemini_api_key?: string | null
          guardrails?: string | null
          human_handover_rules?: string | null
          id?: string
          is_enabled?: boolean
          knowledge_instructions?: string | null
          organization_id?: string
          role_definition?: string | null
          tone?: string | null
          updated_at?: string | null
        }
        Update: {
          active_whatsapp_instance_id?: string | null
          agent_name?: string
          auto_schedule_enabled?: boolean
          auto_schedule_end_time?: string | null
          auto_schedule_start_time?: string | null
          company_info?: string | null
          created_at?: string | null
          few_shot_examples?: Json | null
          gemini_api_key?: string | null
          guardrails?: string | null
          human_handover_rules?: string | null
          id?: string
          is_enabled?: boolean
          knowledge_instructions?: string | null
          organization_id?: string
          role_definition?: string | null
          tone?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'agent_config_active_whatsapp_instance_id_fkey'
            columns: ['active_whatsapp_instance_id']
            isOneToOne: false
            referencedRelation: 'whatsapp_instances'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'agent_config_organization_id_fkey'
            columns: ['organization_id']
            isOneToOne: false
            referencedRelation: 'organizations'
            referencedColumns: ['id']
          },
        ]
      }
      appointments: {
        Row: {
          created_at: string | null
          id: string
          lead_id: string
          notes: string | null
          organization_id: string
          scheduled_at: string
          staff_id: string | null
          status: string
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          lead_id: string
          notes?: string | null
          organization_id?: string
          scheduled_at: string
          staff_id?: string | null
          status?: string
          type?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          lead_id?: string
          notes?: string | null
          organization_id?: string
          scheduled_at?: string
          staff_id?: string | null
          status?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'appointments_lead_id_fkey'
            columns: ['lead_id']
            isOneToOne: false
            referencedRelation: 'leads'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'appointments_organization_id_fkey'
            columns: ['organization_id']
            isOneToOne: false
            referencedRelation: 'organizations'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'appointments_staff_id_fkey'
            columns: ['staff_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      cadence_logs: {
        Row: {
          error_message: string | null
          id: string
          lead_id: string
          sent_at: string | null
          status: string
          template_id: string
        }
        Insert: {
          error_message?: string | null
          id?: string
          lead_id: string
          sent_at?: string | null
          status?: string
          template_id: string
        }
        Update: {
          error_message?: string | null
          id?: string
          lead_id?: string
          sent_at?: string | null
          status?: string
          template_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'cadence_logs_lead_id_fkey'
            columns: ['lead_id']
            isOneToOne: false
            referencedRelation: 'leads'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'cadence_logs_template_id_fkey'
            columns: ['template_id']
            isOneToOne: false
            referencedRelation: 'cadence_templates'
            referencedColumns: ['id']
          },
        ]
      }
      cadence_templates: {
        Row: {
          created_at: string | null
          delay_hours: number
          id: string
          is_active: boolean
          message_template: string
          name: string
          organization_id: string
          trigger_status: string[]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          delay_hours: number
          id?: string
          is_active?: boolean
          message_template: string
          name: string
          organization_id?: string
          trigger_status: string[]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          delay_hours?: number
          id?: string
          is_active?: boolean
          message_template?: string
          name?: string
          organization_id?: string
          trigger_status?: string[]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'cadence_templates_organization_id_fkey'
            columns: ['organization_id']
            isOneToOne: false
            referencedRelation: 'organizations'
            referencedColumns: ['id']
          },
        ]
      }
      deal_sessions: {
        Row: {
          appointment_id: string | null
          completed_at: string | null
          created_at: string | null
          deal_id: string
          id: string
          notes: string | null
          session_number: number
        }
        Insert: {
          appointment_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          deal_id: string
          id?: string
          notes?: string | null
          session_number: number
        }
        Update: {
          appointment_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          deal_id?: string
          id?: string
          notes?: string | null
          session_number?: number
        }
        Relationships: [
          {
            foreignKeyName: 'deal_sessions_appointment_id_fkey'
            columns: ['appointment_id']
            isOneToOne: false
            referencedRelation: 'appointments'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'deal_sessions_deal_id_fkey'
            columns: ['deal_id']
            isOneToOne: false
            referencedRelation: 'deals'
            referencedColumns: ['id']
          },
        ]
      }
      deals: {
        Row: {
          completed_sessions: number
          created_at: string | null
          discount_value: number | null
          id: string
          lead_id: string
          next_session_due: string | null
          organization_id: string
          payment_method: string | null
          product_id: string
          purchase_date: string
          status: string
          total_sessions: number
          total_value: number
          updated_at: string | null
        }
        Insert: {
          completed_sessions?: number
          created_at?: string | null
          discount_value?: number | null
          id?: string
          lead_id: string
          next_session_due?: string | null
          organization_id?: string
          payment_method?: string | null
          product_id: string
          purchase_date?: string
          status?: string
          total_sessions: number
          total_value: number
          updated_at?: string | null
        }
        Update: {
          completed_sessions?: number
          created_at?: string | null
          discount_value?: number | null
          id?: string
          lead_id?: string
          next_session_due?: string | null
          organization_id?: string
          payment_method?: string | null
          product_id?: string
          purchase_date?: string
          status?: string
          total_sessions?: number
          total_value?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'deals_lead_id_fkey'
            columns: ['lead_id']
            isOneToOne: false
            referencedRelation: 'leads'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'deals_organization_id_fkey'
            columns: ['organization_id']
            isOneToOne: false
            referencedRelation: 'organizations'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'deals_product_id_fkey'
            columns: ['product_id']
            isOneToOne: false
            referencedRelation: 'products'
            referencedColumns: ['id']
          },
        ]
      }
      knowledge_base_audios: {
        Row: {
          audio_path: string
          id: string
          is_active: boolean
          name: string
          organization_id: string
          trigger_keywords: string[] | null
          uploaded_at: string | null
        }
        Insert: {
          audio_path: string
          id?: string
          is_active?: boolean
          name: string
          organization_id?: string
          trigger_keywords?: string[] | null
          uploaded_at?: string | null
        }
        Update: {
          audio_path?: string
          id?: string
          is_active?: boolean
          name?: string
          organization_id?: string
          trigger_keywords?: string[] | null
          uploaded_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'knowledge_base_audios_organization_id_fkey'
            columns: ['organization_id']
            isOneToOne: false
            referencedRelation: 'organizations'
            referencedColumns: ['id']
          },
        ]
      }
      knowledge_base_files: {
        Row: {
          file_path: string
          file_type: string
          id: string
          is_active: boolean
          name: string
          organization_id: string
          uploaded_at: string | null
        }
        Insert: {
          file_path: string
          file_type: string
          id?: string
          is_active?: boolean
          name: string
          organization_id?: string
          uploaded_at?: string | null
        }
        Update: {
          file_path?: string
          file_type?: string
          id?: string
          is_active?: boolean
          name?: string
          organization_id?: string
          uploaded_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'knowledge_base_files_organization_id_fkey'
            columns: ['organization_id']
            isOneToOne: false
            referencedRelation: 'organizations'
            referencedColumns: ['id']
          },
        ]
      }
      leads: {
        Row: {
          ai_agent_blocked: boolean
          created_at: string | null
          email: string | null
          has_pending_message: boolean
          id: string
          last_interaction_at: string | null
          name: string | null
          notes: string | null
          organization_id: string
          phone: string
          status_id: string
          tags: string[] | null
          updated_at: string | null
        }
        Insert: {
          ai_agent_blocked?: boolean
          created_at?: string | null
          email?: string | null
          has_pending_message?: boolean
          id?: string
          last_interaction_at?: string | null
          name?: string | null
          notes?: string | null
          organization_id?: string
          phone: string
          status_id: string
          tags?: string[] | null
          updated_at?: string | null
        }
        Update: {
          ai_agent_blocked?: boolean
          created_at?: string | null
          email?: string | null
          has_pending_message?: boolean
          id?: string
          last_interaction_at?: string | null
          name?: string | null
          notes?: string | null
          organization_id?: string
          phone?: string
          status_id?: string
          tags?: string[] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'leads_organization_id_fkey'
            columns: ['organization_id']
            isOneToOne: false
            referencedRelation: 'organizations'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'leads_status_id_fkey'
            columns: ['status_id']
            isOneToOne: false
            referencedRelation: 'status'
            referencedColumns: ['id']
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string | null
          direction: string
          id: string
          lead_id: string
          message_type: string
          meta_message_id: string | null
          organization_id: string
          read_at: string | null
          sent_by: string
          whatsapp_instance_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          direction: string
          id?: string
          lead_id: string
          message_type?: string
          meta_message_id?: string | null
          organization_id?: string
          read_at?: string | null
          sent_by: string
          whatsapp_instance_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          direction?: string
          id?: string
          lead_id?: string
          message_type?: string
          meta_message_id?: string | null
          organization_id?: string
          read_at?: string | null
          sent_by?: string
          whatsapp_instance_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'messages_lead_id_fkey'
            columns: ['lead_id']
            isOneToOne: false
            referencedRelation: 'leads'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'messages_organization_id_fkey'
            columns: ['organization_id']
            isOneToOne: false
            referencedRelation: 'organizations'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'messages_whatsapp_instance_id_fkey'
            columns: ['whatsapp_instance_id']
            isOneToOne: false
            referencedRelation: 'whatsapp_instances'
            referencedColumns: ['id']
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean
          lead_id: string
          message: string
          metadata: Json | null
          organization_id: string
          priority: string
          read_at: string | null
          title: string
          type: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean
          lead_id: string
          message: string
          metadata?: Json | null
          organization_id?: string
          priority?: string
          read_at?: string | null
          title: string
          type: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean
          lead_id?: string
          message?: string
          metadata?: Json | null
          organization_id?: string
          priority?: string
          read_at?: string | null
          title?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: 'notifications_lead_id_fkey'
            columns: ['lead_id']
            isOneToOne: false
            referencedRelation: 'leads'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'notifications_organization_id_fkey'
            columns: ['organization_id']
            isOneToOne: false
            referencedRelation: 'organizations'
            referencedColumns: ['id']
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          created_at: string | null
          default_price: number
          id: string
          is_active: boolean
          name: string
          organization_id: string
          return_interval_days: number
          total_sessions: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          default_price: number
          id?: string
          is_active?: boolean
          name: string
          organization_id?: string
          return_interval_days?: number
          total_sessions?: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          default_price?: number
          id?: string
          is_active?: boolean
          name?: string
          organization_id?: string
          return_interval_days?: number
          total_sessions?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'products_organization_id_fkey'
            columns: ['organization_id']
            isOneToOne: false
            referencedRelation: 'organizations'
            referencedColumns: ['id']
          },
        ]
      }
      staff_availability: {
        Row: {
          created_at: string | null
          day_of_week: number
          end_time: string
          id: string
          is_active: boolean
          organization_id: string
          staff_id: string
          start_time: string
        }
        Insert: {
          created_at?: string | null
          day_of_week: number
          end_time: string
          id?: string
          is_active?: boolean
          organization_id?: string
          staff_id: string
          start_time: string
        }
        Update: {
          created_at?: string | null
          day_of_week?: number
          end_time?: string
          id?: string
          is_active?: boolean
          organization_id?: string
          staff_id?: string
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: 'staff_availability_organization_id_fkey'
            columns: ['organization_id']
            isOneToOne: false
            referencedRelation: 'organizations'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'staff_availability_staff_id_fkey'
            columns: ['staff_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      status: {
        Row: {
          color: string
          created_at: string | null
          id: string
          is_default: boolean
          is_system: boolean
          name: string
          order: number
          organization_id: string
        }
        Insert: {
          color?: string
          created_at?: string | null
          id?: string
          is_default?: boolean
          is_system?: boolean
          name: string
          order?: number
          organization_id?: string
        }
        Update: {
          color?: string
          created_at?: string | null
          id?: string
          is_default?: boolean
          is_system?: boolean
          name?: string
          order?: number
          organization_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'status_organization_id_fkey'
            columns: ['organization_id']
            isOneToOne: false
            referencedRelation: 'organizations'
            referencedColumns: ['id']
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          id: string
          is_active: boolean
          name: string
          organization_id: string
          role: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          is_active?: boolean
          name: string
          organization_id: string
          role?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          is_active?: boolean
          name?: string
          organization_id?: string
          role?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'users_organization_id_fkey'
            columns: ['organization_id']
            isOneToOne: false
            referencedRelation: 'organizations'
            referencedColumns: ['id']
          },
        ]
      }
      whatsapp_instances: {
        Row: {
          connection_error_message: string | null
          connection_status: string
          created_at: string | null
          id: string
          instance_name: string
          last_checked_at: string | null
          last_connected_at: string | null
          last_disconnected_at: string | null
          metadata: Json | null
          organization_id: string
          phone_number: string | null
          profile_name: string | null
          profile_picture_url: string | null
          qr_code: string | null
          updated_at: string | null
          webhook_url: string | null
        }
        Insert: {
          connection_error_message?: string | null
          connection_status?: string
          created_at?: string | null
          id?: string
          instance_name: string
          last_checked_at?: string | null
          last_connected_at?: string | null
          last_disconnected_at?: string | null
          metadata?: Json | null
          organization_id?: string
          phone_number?: string | null
          profile_name?: string | null
          profile_picture_url?: string | null
          qr_code?: string | null
          updated_at?: string | null
          webhook_url?: string | null
        }
        Update: {
          connection_error_message?: string | null
          connection_status?: string
          created_at?: string | null
          id?: string
          instance_name?: string
          last_checked_at?: string | null
          last_connected_at?: string | null
          last_disconnected_at?: string | null
          metadata?: Json | null
          organization_id?: string
          phone_number?: string | null
          profile_name?: string | null
          profile_picture_url?: string | null
          qr_code?: string | null
          updated_at?: string | null
          webhook_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'whatsapp_instances_organization_id_fkey'
            columns: ['organization_id']
            isOneToOne: false
            referencedRelation: 'organizations'
            referencedColumns: ['id']
          },
        ]
      }
      whatsapp_webhooks: {
        Row: {
          created_at: string | null
          id: string
          lead_id: string | null
          message_id: string | null
          organization_id: string
          processed: boolean
          processed_at: string | null
          processing_error: string | null
          raw_payload: Json
          webhook_type: string
          whatsapp_instance_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          lead_id?: string | null
          message_id?: string | null
          organization_id?: string
          processed?: boolean
          processed_at?: string | null
          processing_error?: string | null
          raw_payload: Json
          webhook_type: string
          whatsapp_instance_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          lead_id?: string | null
          message_id?: string | null
          organization_id?: string
          processed?: boolean
          processed_at?: string | null
          processing_error?: string | null
          raw_payload?: Json
          webhook_type?: string
          whatsapp_instance_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'whatsapp_webhooks_lead_id_fkey'
            columns: ['lead_id']
            isOneToOne: false
            referencedRelation: 'leads'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'whatsapp_webhooks_message_id_fkey'
            columns: ['message_id']
            isOneToOne: false
            referencedRelation: 'messages'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'whatsapp_webhooks_organization_id_fkey'
            columns: ['organization_id']
            isOneToOne: false
            referencedRelation: 'organizations'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'whatsapp_webhooks_whatsapp_instance_id_fkey'
            columns: ['whatsapp_instance_id']
            isOneToOne: false
            referencedRelation: 'whatsapp_instances'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Views: {
      dashboard_kpis: {
        Row: {
          confirmed_appointments: number | null
          leads_waiting_human: number | null
          total_leads: number | null
          unread_notifications: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      decrypt_secret: {
        Args: { encrypted_secret: string; key?: string }
        Returns: string
      }
      encrypt_secret: {
        Args: { key?: string; secret: string }
        Returns: string
      }
      get_auth_org_id: { Args: never; Returns: string }
      get_available_slots: {
        Args: {
          p_date: string
          p_duration_minutes?: number
          p_staff_id: string
        }
        Returns: {
          is_available: boolean
          slot_time: string
        }[]
      }
      get_unread_notification_count: { Args: never; Returns: number }
      mark_notification_read: {
        Args: { p_notification_id: string }
        Returns: boolean
      }
      move_lead_to_human: {
        Args: { p_lead_id: string; p_reason?: string }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
        DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] &
        DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

// ====== DATABASE EXTENDED CONTEXT (auto-generated) ======
// This section contains constraints, RLS policies, functions, triggers,
// indexes and materialized views not present in the type definitions above.

// --- CONSTRAINTS ---
// Table: activities
//   FOREIGN KEY activities_lead_id_fkey: FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE
//   FOREIGN KEY activities_organization_id_fkey: FOREIGN KEY (organization_id) REFERENCES organizations(id)
//   PRIMARY KEY activities_pkey: PRIMARY KEY (id)
//   CHECK activities_type_check: CHECK ((type = ANY (ARRAY['status_change'::text, 'appointment_created'::text, 'appointment_confirmed'::text, 'deal_closed'::text, 'message_sent'::text, 'cadence_sent'::text, 'manual_action'::text, 'whatsapp_connected'::text, 'whatsapp_disconnected'::text, 'whatsapp_qr_generated'::text])))
//   FOREIGN KEY activities_whatsapp_instance_id_fkey: FOREIGN KEY (whatsapp_instance_id) REFERENCES whatsapp_instances(id) ON DELETE SET NULL
// Table: agent_config
//   FOREIGN KEY agent_config_active_whatsapp_instance_id_fkey: FOREIGN KEY (active_whatsapp_instance_id) REFERENCES whatsapp_instances(id) ON DELETE SET NULL
//   FOREIGN KEY agent_config_organization_id_fkey: FOREIGN KEY (organization_id) REFERENCES organizations(id)
//   PRIMARY KEY agent_config_pkey: PRIMARY KEY (id)
// Table: appointments
//   FOREIGN KEY appointments_lead_id_fkey: FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE
//   FOREIGN KEY appointments_organization_id_fkey: FOREIGN KEY (organization_id) REFERENCES organizations(id)
//   PRIMARY KEY appointments_pkey: PRIMARY KEY (id)
//   FOREIGN KEY appointments_staff_id_fkey: FOREIGN KEY (staff_id) REFERENCES users(id) ON DELETE SET NULL
//   CHECK appointments_status_check: CHECK ((status = ANY (ARRAY['pending'::text, 'confirmed'::text, 'completed'::text, 'no_show'::text, 'cancelled'::text])))
//   CHECK appointments_type_check: CHECK ((type = ANY (ARRAY['evaluation'::text, 'session'::text])))
// Table: cadence_logs
//   FOREIGN KEY cadence_logs_lead_id_fkey: FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE
//   PRIMARY KEY cadence_logs_pkey: PRIMARY KEY (id)
//   CHECK cadence_logs_status_check: CHECK ((status = ANY (ARRAY['sent'::text, 'failed'::text, 'scheduled'::text])))
//   FOREIGN KEY cadence_logs_template_id_fkey: FOREIGN KEY (template_id) REFERENCES cadence_templates(id) ON DELETE CASCADE
// Table: cadence_templates
//   CHECK cadence_templates_delay_hours_check: CHECK ((delay_hours >= 0))
//   UNIQUE cadence_templates_name_key: UNIQUE (name)
//   FOREIGN KEY cadence_templates_organization_id_fkey: FOREIGN KEY (organization_id) REFERENCES organizations(id)
//   PRIMARY KEY cadence_templates_pkey: PRIMARY KEY (id)
// Table: deal_sessions
//   FOREIGN KEY deal_sessions_appointment_id_fkey: FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE SET NULL
//   FOREIGN KEY deal_sessions_deal_id_fkey: FOREIGN KEY (deal_id) REFERENCES deals(id) ON DELETE CASCADE
//   UNIQUE deal_sessions_deal_id_session_number_key: UNIQUE (deal_id, session_number)
//   PRIMARY KEY deal_sessions_pkey: PRIMARY KEY (id)
//   CHECK deal_sessions_session_number_check: CHECK ((session_number >= 1))
// Table: deals
//   CHECK completed_sessions_check: CHECK (((completed_sessions >= 0) AND (completed_sessions <= total_sessions)))
//   CHECK deals_completed_sessions_check: CHECK ((completed_sessions >= 0))
//   CHECK deals_discount_value_check: CHECK ((discount_value >= 0))
//   FOREIGN KEY deals_lead_id_fkey: FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE
//   FOREIGN KEY deals_organization_id_fkey: FOREIGN KEY (organization_id) REFERENCES organizations(id)
//   PRIMARY KEY deals_pkey: PRIMARY KEY (id)
//   FOREIGN KEY deals_product_id_fkey: FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
//   CHECK deals_status_check: CHECK ((status = ANY (ARRAY['active'::text, 'completed'::text, 'cancelled'::text])))
//   CHECK deals_total_sessions_check: CHECK ((total_sessions >= 1))
//   CHECK deals_total_value_check: CHECK ((total_value >= 0))
// Table: knowledge_base_audios
//   FOREIGN KEY knowledge_base_audios_organization_id_fkey: FOREIGN KEY (organization_id) REFERENCES organizations(id)
//   PRIMARY KEY knowledge_base_audios_pkey: PRIMARY KEY (id)
// Table: knowledge_base_files
//   CHECK knowledge_base_files_file_type_check: CHECK ((file_type = ANY (ARRAY['pdf'::text, 'docx'::text, 'txt'::text])))
//   FOREIGN KEY knowledge_base_files_organization_id_fkey: FOREIGN KEY (organization_id) REFERENCES organizations(id)
//   PRIMARY KEY knowledge_base_files_pkey: PRIMARY KEY (id)
// Table: leads
//   FOREIGN KEY leads_organization_id_fkey: FOREIGN KEY (organization_id) REFERENCES organizations(id)
//   UNIQUE leads_phone_key: UNIQUE (phone)
//   PRIMARY KEY leads_pkey: PRIMARY KEY (id)
//   FOREIGN KEY leads_status_id_fkey: FOREIGN KEY (status_id) REFERENCES status(id) ON DELETE RESTRICT
// Table: messages
//   CHECK messages_direction_check: CHECK ((direction = ANY (ARRAY['inbound'::text, 'outbound'::text])))
//   FOREIGN KEY messages_lead_id_fkey: FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE
//   CHECK messages_message_type_check: CHECK ((message_type = ANY (ARRAY['text'::text, 'audio'::text, 'file'::text, 'image'::text])))
//   UNIQUE messages_meta_message_id_key: UNIQUE (meta_message_id)
//   FOREIGN KEY messages_organization_id_fkey: FOREIGN KEY (organization_id) REFERENCES organizations(id)
//   PRIMARY KEY messages_pkey: PRIMARY KEY (id)
//   CHECK messages_sent_by_check: CHECK ((sent_by = ANY (ARRAY['ai'::text, 'human'::text, 'system'::text])))
//   FOREIGN KEY messages_whatsapp_instance_id_fkey: FOREIGN KEY (whatsapp_instance_id) REFERENCES whatsapp_instances(id) ON DELETE SET NULL
// Table: notifications
//   FOREIGN KEY notifications_lead_id_fkey: FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE
//   FOREIGN KEY notifications_organization_id_fkey: FOREIGN KEY (organization_id) REFERENCES organizations(id)
//   PRIMARY KEY notifications_pkey: PRIMARY KEY (id)
//   CHECK notifications_priority_check: CHECK ((priority = ANY (ARRAY['low'::text, 'normal'::text, 'high'::text, 'urgent'::text])))
//   CHECK notifications_type_check: CHECK ((type = ANY (ARRAY['lead_to_human'::text, 'appointment_reminder'::text, 'no_show'::text, 'session_due'::text, 'system'::text])))
// Table: organizations
//   PRIMARY KEY organizations_pkey: PRIMARY KEY (id)
// Table: products
//   CHECK products_default_price_check: CHECK ((default_price >= 0))
//   UNIQUE products_name_key: UNIQUE (name)
//   FOREIGN KEY products_organization_id_fkey: FOREIGN KEY (organization_id) REFERENCES organizations(id)
//   PRIMARY KEY products_pkey: PRIMARY KEY (id)
//   CHECK products_return_interval_days_check: CHECK ((return_interval_days >= 0))
//   CHECK products_total_sessions_check: CHECK ((total_sessions >= 1))
// Table: staff_availability
//   CHECK staff_availability_day_of_week_check: CHECK (((day_of_week >= 0) AND (day_of_week <= 6)))
//   FOREIGN KEY staff_availability_organization_id_fkey: FOREIGN KEY (organization_id) REFERENCES organizations(id)
//   PRIMARY KEY staff_availability_pkey: PRIMARY KEY (id)
//   UNIQUE staff_availability_staff_id_day_of_week_start_time_key: UNIQUE (staff_id, day_of_week, start_time)
//   FOREIGN KEY staff_availability_staff_id_fkey: FOREIGN KEY (staff_id) REFERENCES users(id) ON DELETE CASCADE
//   CHECK time_range_check: CHECK ((end_time > start_time))
// Table: status
//   UNIQUE status_name_key: UNIQUE (name)
//   FOREIGN KEY status_organization_id_fkey: FOREIGN KEY (organization_id) REFERENCES organizations(id)
//   PRIMARY KEY status_pkey: PRIMARY KEY (id)
// Table: users
//   UNIQUE users_email_key: UNIQUE (email)
//   FOREIGN KEY users_organization_id_fkey: FOREIGN KEY (organization_id) REFERENCES organizations(id)
//   PRIMARY KEY users_pkey: PRIMARY KEY (id)
//   CHECK users_role_check: CHECK ((role = ANY (ARRAY['admin'::text, 'staff'::text])))
// Table: whatsapp_instances
//   UNIQUE whatsapp_instances_instance_name_key: UNIQUE (instance_name)
//   FOREIGN KEY whatsapp_instances_organization_id_fkey: FOREIGN KEY (organization_id) REFERENCES organizations(id)
//   PRIMARY KEY whatsapp_instances_pkey: PRIMARY KEY (id)
//   CHECK whatsapp_instances_status_check: CHECK ((connection_status = ANY (ARRAY['disconnected'::text, 'connecting'::text, 'qr_received'::text, 'connected'::text, 'failed'::text])))
// Table: whatsapp_webhooks
//   FOREIGN KEY whatsapp_webhooks_lead_id_fkey: FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE SET NULL
//   FOREIGN KEY whatsapp_webhooks_message_id_fkey: FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE SET NULL
//   FOREIGN KEY whatsapp_webhooks_organization_id_fkey: FOREIGN KEY (organization_id) REFERENCES organizations(id)
//   PRIMARY KEY whatsapp_webhooks_pkey: PRIMARY KEY (id)
//   CHECK whatsapp_webhooks_webhook_type_check: CHECK ((webhook_type = ANY (ARRAY['message'::text, 'status'::text, 'verification'::text, 'other'::text])))
//   FOREIGN KEY whatsapp_webhooks_whatsapp_instance_id_fkey: FOREIGN KEY (whatsapp_instance_id) REFERENCES whatsapp_instances(id) ON DELETE SET NULL

// --- ROW LEVEL SECURITY POLICIES ---
// Table: activities
//   Policy "Tenant Isolation" (ALL, PERMISSIVE) roles={public}
//     USING: (organization_id = get_auth_org_id())
//     WITH CHECK: (organization_id = get_auth_org_id())
//   Policy "Users can insert activities in their organization" (INSERT, PERMISSIVE) roles={public}
//     WITH CHECK: (auth.uid() IN ( SELECT users.id
//                    FROM users
//                   WHERE (users.organization_id = activities.organization_id)))
//   Policy "Users can only see activities in their organization" (SELECT, PERMISSIVE) roles={public}
//     USING: (auth.uid() IN ( SELECT users.id
//               FROM users
//              WHERE (users.organization_id = activities.organization_id)))
// Table: agent_config
//   Policy "Tenant Isolation" (ALL, PERMISSIVE) roles={public}
//     USING: (organization_id = get_auth_org_id())
//     WITH CHECK: (organization_id = get_auth_org_id())
//   Policy "Users can delete agent_config in their organization" (DELETE, PERMISSIVE) roles={public}
//     USING: (auth.uid() IN ( SELECT users.id
//               FROM users
//              WHERE (users.organization_id = agent_config.organization_id)))
//   Policy "Users can insert agent_config in their organization" (INSERT, PERMISSIVE) roles={public}
//     WITH CHECK: (auth.uid() IN ( SELECT users.id
//                    FROM users
//                   WHERE (users.organization_id = agent_config.organization_id)))
//   Policy "Users can only see agent_config in their organization" (SELECT, PERMISSIVE) roles={public}
//     USING: (auth.uid() IN ( SELECT users.id
//               FROM users
//              WHERE (users.organization_id = agent_config.organization_id)))
//   Policy "Users can update agent_config in their organization" (UPDATE, PERMISSIVE) roles={public}
//     USING: (auth.uid() IN ( SELECT users.id
//               FROM users
//              WHERE (users.organization_id = agent_config.organization_id)))
// Table: appointments
//   Policy "Authenticated users can manage appointments" (ALL, PERMISSIVE) roles={public}
//     USING: (auth.uid() IS NOT NULL)
//   Policy "Tenant Isolation" (ALL, PERMISSIVE) roles={public}
//     USING: (organization_id = get_auth_org_id())
//     WITH CHECK: (organization_id = get_auth_org_id())
//   Policy "Users can delete appointments in their organization" (DELETE, PERMISSIVE) roles={public}
//     USING: (auth.uid() IN ( SELECT users.id
//               FROM users
//              WHERE (users.organization_id = appointments.organization_id)))
//   Policy "Users can insert appointments in their organization" (INSERT, PERMISSIVE) roles={public}
//     WITH CHECK: (auth.uid() IN ( SELECT users.id
//                    FROM users
//                   WHERE (users.organization_id = appointments.organization_id)))
//   Policy "Users can only see appointments in their organization" (SELECT, PERMISSIVE) roles={public}
//     USING: (auth.uid() IN ( SELECT users.id
//               FROM users
//              WHERE (users.organization_id = appointments.organization_id)))
//   Policy "Users can update appointments in their organization" (UPDATE, PERMISSIVE) roles={public}
//     USING: (auth.uid() IN ( SELECT users.id
//               FROM users
//              WHERE (users.organization_id = appointments.organization_id)))
// Table: cadence_templates
//   Policy "Tenant Isolation" (ALL, PERMISSIVE) roles={public}
//     USING: (organization_id = get_auth_org_id())
//     WITH CHECK: (organization_id = get_auth_org_id())
//   Policy "Users can delete cadence templates in their organization" (DELETE, PERMISSIVE) roles={public}
//     USING: (auth.uid() IN ( SELECT users.id
//               FROM users
//              WHERE (users.organization_id = cadence_templates.organization_id)))
//   Policy "Users can insert cadence templates in their organization" (INSERT, PERMISSIVE) roles={public}
//     WITH CHECK: (auth.uid() IN ( SELECT users.id
//                    FROM users
//                   WHERE (users.organization_id = cadence_templates.organization_id)))
//   Policy "Users can only see cadence templates in their organization" (SELECT, PERMISSIVE) roles={public}
//     USING: (auth.uid() IN ( SELECT users.id
//               FROM users
//              WHERE (users.organization_id = cadence_templates.organization_id)))
//   Policy "Users can update cadence templates in their organization" (UPDATE, PERMISSIVE) roles={public}
//     USING: (auth.uid() IN ( SELECT users.id
//               FROM users
//              WHERE (users.organization_id = cadence_templates.organization_id)))
// Table: deal_sessions
//   Policy "Enable delete access for authenticated users" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "Enable insert access for authenticated users" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: true
//   Policy "Enable read access for authenticated users" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "Enable update access for authenticated users" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: deals
//   Policy "Authenticated users can manage deals" (ALL, PERMISSIVE) roles={public}
//     USING: (auth.uid() IS NOT NULL)
//   Policy "Tenant Isolation" (ALL, PERMISSIVE) roles={public}
//     USING: (organization_id = get_auth_org_id())
//     WITH CHECK: (organization_id = get_auth_org_id())
//   Policy "Users can delete deals in their organization" (DELETE, PERMISSIVE) roles={public}
//     USING: (auth.uid() IN ( SELECT users.id
//               FROM users
//              WHERE (users.organization_id = deals.organization_id)))
//   Policy "Users can insert deals in their organization" (INSERT, PERMISSIVE) roles={public}
//     WITH CHECK: (auth.uid() IN ( SELECT users.id
//                    FROM users
//                   WHERE (users.organization_id = deals.organization_id)))
//   Policy "Users can only see deals in their organization" (SELECT, PERMISSIVE) roles={public}
//     USING: (auth.uid() IN ( SELECT users.id
//               FROM users
//              WHERE (users.organization_id = deals.organization_id)))
//   Policy "Users can update deals in their organization" (UPDATE, PERMISSIVE) roles={public}
//     USING: (auth.uid() IN ( SELECT users.id
//               FROM users
//              WHERE (users.organization_id = deals.organization_id)))
// Table: knowledge_base_audios
//   Policy "Tenant Isolation" (ALL, PERMISSIVE) roles={public}
//     USING: (organization_id = get_auth_org_id())
//     WITH CHECK: (organization_id = get_auth_org_id())
//   Policy "Users can delete kb audios in their organization" (DELETE, PERMISSIVE) roles={public}
//     USING: (auth.uid() IN ( SELECT users.id
//               FROM users
//              WHERE (users.organization_id = knowledge_base_audios.organization_id)))
//   Policy "Users can insert kb audios in their organization" (INSERT, PERMISSIVE) roles={public}
//     WITH CHECK: (auth.uid() IN ( SELECT users.id
//                    FROM users
//                   WHERE (users.organization_id = knowledge_base_audios.organization_id)))
//   Policy "Users can only see kb audios in their organization" (SELECT, PERMISSIVE) roles={public}
//     USING: (auth.uid() IN ( SELECT users.id
//               FROM users
//              WHERE (users.organization_id = knowledge_base_audios.organization_id)))
//   Policy "Users can update kb audios in their organization" (UPDATE, PERMISSIVE) roles={public}
//     USING: (auth.uid() IN ( SELECT users.id
//               FROM users
//              WHERE (users.organization_id = knowledge_base_audios.organization_id)))
// Table: knowledge_base_files
//   Policy "Tenant Isolation" (ALL, PERMISSIVE) roles={public}
//     USING: (organization_id = get_auth_org_id())
//     WITH CHECK: (organization_id = get_auth_org_id())
//   Policy "Users can delete kb files in their organization" (DELETE, PERMISSIVE) roles={public}
//     USING: (auth.uid() IN ( SELECT users.id
//               FROM users
//              WHERE (users.organization_id = knowledge_base_files.organization_id)))
//   Policy "Users can insert kb files in their organization" (INSERT, PERMISSIVE) roles={public}
//     WITH CHECK: (auth.uid() IN ( SELECT users.id
//                    FROM users
//                   WHERE (users.organization_id = knowledge_base_files.organization_id)))
//   Policy "Users can only see kb files in their organization" (SELECT, PERMISSIVE) roles={public}
//     USING: (auth.uid() IN ( SELECT users.id
//               FROM users
//              WHERE (users.organization_id = knowledge_base_files.organization_id)))
//   Policy "Users can update kb files in their organization" (UPDATE, PERMISSIVE) roles={public}
//     USING: (auth.uid() IN ( SELECT users.id
//               FROM users
//              WHERE (users.organization_id = knowledge_base_files.organization_id)))
// Table: leads
//   Policy "Authenticated users can insert leads" (INSERT, PERMISSIVE) roles={public}
//     WITH CHECK: (auth.uid() IS NOT NULL)
//   Policy "Authenticated users can update leads" (UPDATE, PERMISSIVE) roles={public}
//     USING: (auth.uid() IS NOT NULL)
//   Policy "Authenticated users can view all leads" (SELECT, PERMISSIVE) roles={public}
//     USING: (auth.uid() IS NOT NULL)
//   Policy "Tenant Isolation" (ALL, PERMISSIVE) roles={public}
//     USING: (organization_id = get_auth_org_id())
//     WITH CHECK: (organization_id = get_auth_org_id())
//   Policy "Users can delete leads in their organization" (DELETE, PERMISSIVE) roles={public}
//     USING: (auth.uid() IN ( SELECT users.id
//               FROM users
//              WHERE (users.organization_id = leads.organization_id)))
//   Policy "Users can insert leads in their organization" (INSERT, PERMISSIVE) roles={public}
//     WITH CHECK: (auth.uid() IN ( SELECT users.id
//                    FROM users
//                   WHERE (users.organization_id = leads.organization_id)))
//   Policy "Users can only see leads in their organization" (SELECT, PERMISSIVE) roles={public}
//     USING: (auth.uid() IN ( SELECT users.id
//               FROM users
//              WHERE (users.organization_id = leads.organization_id)))
//   Policy "Users can update leads in their organization" (UPDATE, PERMISSIVE) roles={public}
//     USING: (auth.uid() IN ( SELECT users.id
//               FROM users
//              WHERE (users.organization_id = leads.organization_id)))
// Table: messages
//   Policy "Authenticated users can insert messages" (INSERT, PERMISSIVE) roles={public}
//     WITH CHECK: (auth.uid() IS NOT NULL)
//   Policy "Authenticated users can view all messages" (SELECT, PERMISSIVE) roles={public}
//     USING: (auth.uid() IS NOT NULL)
//   Policy "Tenant Isolation" (ALL, PERMISSIVE) roles={public}
//     USING: (organization_id = get_auth_org_id())
//     WITH CHECK: (organization_id = get_auth_org_id())
//   Policy "Users can delete messages in their organization" (DELETE, PERMISSIVE) roles={public}
//     USING: (auth.uid() IN ( SELECT users.id
//               FROM users
//              WHERE (users.organization_id = messages.organization_id)))
//   Policy "Users can insert messages in their organization" (INSERT, PERMISSIVE) roles={public}
//     WITH CHECK: (auth.uid() IN ( SELECT users.id
//                    FROM users
//                   WHERE (users.organization_id = messages.organization_id)))
//   Policy "Users can only see messages in their organization" (SELECT, PERMISSIVE) roles={public}
//     USING: (auth.uid() IN ( SELECT users.id
//               FROM users
//              WHERE (users.organization_id = messages.organization_id)))
//   Policy "Users can update messages in their organization" (UPDATE, PERMISSIVE) roles={public}
//     USING: (auth.uid() IN ( SELECT users.id
//               FROM users
//              WHERE (users.organization_id = messages.organization_id)))
// Table: notifications
//   Policy "Authenticated users can update notifications" (UPDATE, PERMISSIVE) roles={public}
//     USING: (auth.uid() IS NOT NULL)
//   Policy "Authenticated users can view all notifications" (SELECT, PERMISSIVE) roles={public}
//     USING: (auth.uid() IS NOT NULL)
//   Policy "Tenant Isolation" (ALL, PERMISSIVE) roles={public}
//     USING: (organization_id = get_auth_org_id())
//     WITH CHECK: (organization_id = get_auth_org_id())
//   Policy "Users can delete notifications in their organization" (DELETE, PERMISSIVE) roles={public}
//     USING: (auth.uid() IN ( SELECT users.id
//               FROM users
//              WHERE (users.organization_id = notifications.organization_id)))
//   Policy "Users can insert notifications in their organization" (INSERT, PERMISSIVE) roles={public}
//     WITH CHECK: (auth.uid() IN ( SELECT users.id
//                    FROM users
//                   WHERE (users.organization_id = notifications.organization_id)))
//   Policy "Users can only see notifications in their organization" (SELECT, PERMISSIVE) roles={public}
//     USING: (auth.uid() IN ( SELECT users.id
//               FROM users
//              WHERE (users.organization_id = notifications.organization_id)))
//   Policy "Users can update notifications in their organization" (UPDATE, PERMISSIVE) roles={public}
//     USING: (auth.uid() IN ( SELECT users.id
//               FROM users
//              WHERE (users.organization_id = notifications.organization_id)))
// Table: organizations
//   Policy "Tenant Isolation" (ALL, PERMISSIVE) roles={public}
//     USING: (id = get_auth_org_id())
// Table: products
//   Policy "Tenant Isolation" (ALL, PERMISSIVE) roles={public}
//     USING: (organization_id = get_auth_org_id())
//     WITH CHECK: (organization_id = get_auth_org_id())
//   Policy "Users can delete products in their organization" (DELETE, PERMISSIVE) roles={public}
//     USING: (auth.uid() IN ( SELECT users.id
//               FROM users
//              WHERE (users.organization_id = products.organization_id)))
//   Policy "Users can insert products in their organization" (INSERT, PERMISSIVE) roles={public}
//     WITH CHECK: (auth.uid() IN ( SELECT users.id
//                    FROM users
//                   WHERE (users.organization_id = products.organization_id)))
//   Policy "Users can only see products in their organization" (SELECT, PERMISSIVE) roles={public}
//     USING: (auth.uid() IN ( SELECT users.id
//               FROM users
//              WHERE (users.organization_id = products.organization_id)))
//   Policy "Users can update products in their organization" (UPDATE, PERMISSIVE) roles={public}
//     USING: (auth.uid() IN ( SELECT users.id
//               FROM users
//              WHERE (users.organization_id = products.organization_id)))
// Table: staff_availability
//   Policy "Tenant Isolation" (ALL, PERMISSIVE) roles={public}
//     USING: (organization_id = get_auth_org_id())
//     WITH CHECK: (organization_id = get_auth_org_id())
// Table: status
//   Policy "Tenant Isolation" (ALL, PERMISSIVE) roles={public}
//     USING: (organization_id = get_auth_org_id())
//     WITH CHECK: (organization_id = get_auth_org_id())
//   Policy "Users can delete statuses in their organization" (DELETE, PERMISSIVE) roles={public}
//     USING: (auth.uid() IN ( SELECT users.id
//               FROM users
//              WHERE (users.organization_id = status.organization_id)))
//   Policy "Users can insert statuses in their organization" (INSERT, PERMISSIVE) roles={public}
//     WITH CHECK: (auth.uid() IN ( SELECT users.id
//                    FROM users
//                   WHERE (users.organization_id = status.organization_id)))
//   Policy "Users can only see statuses in their organization" (SELECT, PERMISSIVE) roles={public}
//     USING: (auth.uid() IN ( SELECT users.id
//               FROM users
//              WHERE (users.organization_id = status.organization_id)))
//   Policy "Users can update statuses in their organization" (UPDATE, PERMISSIVE) roles={public}
//     USING: (auth.uid() IN ( SELECT users.id
//               FROM users
//              WHERE (users.organization_id = status.organization_id)))
// Table: users
//   Policy "Tenant Isolation" (ALL, PERMISSIVE) roles={public}
//     USING: (organization_id = get_auth_org_id())
//     WITH CHECK: (organization_id = get_auth_org_id())
//   Policy "Users can update own profile" (UPDATE, PERMISSIVE) roles={public}
//     USING: (( SELECT auth.uid() AS uid) = id)
//   Policy "Users can view all data" (SELECT, PERMISSIVE) roles={public}
//     USING: (auth.uid() IS NOT NULL)
// Table: whatsapp_instances
//   Policy "Tenant Isolation" (ALL, PERMISSIVE) roles={public}
//     USING: (organization_id = get_auth_org_id())
//     WITH CHECK: (organization_id = get_auth_org_id())
//   Policy "Users can delete instances in their organization" (DELETE, PERMISSIVE) roles={public}
//     USING: (auth.uid() IN ( SELECT users.id
//               FROM users
//              WHERE (users.organization_id = whatsapp_instances.organization_id)))
//   Policy "Users can insert instances in their organization" (INSERT, PERMISSIVE) roles={public}
//     WITH CHECK: (auth.uid() IN ( SELECT users.id
//                    FROM users
//                   WHERE (users.organization_id = whatsapp_instances.organization_id)))
//   Policy "Users can only see instances in their organization" (SELECT, PERMISSIVE) roles={public}
//     USING: (auth.uid() IN ( SELECT users.id
//               FROM users
//              WHERE (users.organization_id = whatsapp_instances.organization_id)))
//   Policy "Users can update instances in their organization" (UPDATE, PERMISSIVE) roles={public}
//     USING: (auth.uid() IN ( SELECT users.id
//               FROM users
//              WHERE (users.organization_id = whatsapp_instances.organization_id)))
//   Policy "admin_users_manage_instances" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1
//               FROM users
//              WHERE ((users.id = ( SELECT auth.uid() AS uid)) AND (users.role = 'admin'::text))))
//   Policy "authenticated_users_read_instances" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
// Table: whatsapp_webhooks
//   Policy "Authenticated users can view webhook logs" (SELECT, PERMISSIVE) roles={public}
//     USING: (auth.uid() IS NOT NULL)
//   Policy "Tenant Isolation" (ALL, PERMISSIVE) roles={public}
//     USING: (organization_id = get_auth_org_id())
//     WITH CHECK: (organization_id = get_auth_org_id())

// --- DATABASE FUNCTIONS ---
// FUNCTION auto_handle_whatsapp_lifecycle()
//   CREATE OR REPLACE FUNCTION public.auto_handle_whatsapp_lifecycle()
//    RETURNS trigger
//    LANGUAGE plpgsql
//    SET search_path TO 'public'
//   AS $function$
//   BEGIN
//       -- Handle Connection Success
//       IF NEW.connection_status = 'connected' AND OLD.connection_status != 'connected' THEN
//           NEW.qr_code = NULL; -- Security: Clear QR code
//           NEW.last_connected_at = now();
//       END IF;
//
//       -- Handle Disconnection
//       IF NEW.connection_status = 'disconnected' AND OLD.connection_status = 'connected' THEN
//           NEW.last_disconnected_at = now();
//       END IF;
//
//       -- Handle Failures
//       IF NEW.connection_status = 'failed' AND NEW.connection_error_message IS NULL THEN
//           NEW.connection_error_message = 'Erro desconhecido na conexão.';
//       END IF;
//
//       RETURN NEW;
//   END;
//   $function$
//
// FUNCTION calculate_next_session_due()
//   CREATE OR REPLACE FUNCTION public.calculate_next_session_due()
//    RETURNS trigger
//    LANGUAGE plpgsql
//    SET search_path TO 'public'
//   AS $function$
//   DECLARE
//     return_interval INTEGER;
//   BEGIN
//     IF (NEW.completed_sessions < NEW.total_sessions) THEN
//       SELECT return_interval_days INTO return_interval
//       FROM products WHERE id = NEW.product_id;
//
//       NEW.next_session_due := CURRENT_DATE + (return_interval || ' days')::INTERVAL;
//     ELSE
//       NEW.next_session_due := NULL;
//       NEW.status := 'completed';
//     END IF;
//     RETURN NEW;
//   END;
//   $function$
//
// FUNCTION decrypt_secret(text, text)
//   CREATE OR REPLACE FUNCTION public.decrypt_secret(encrypted_secret text, key text DEFAULT 'your-encryption-key-here'::text)
//    RETURNS text
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//    SET search_path TO 'public'
//   AS $function$
//   BEGIN
//     RETURN pgp_sym_decrypt(decode(encrypted_secret, 'base64'), key);
//   EXCEPTION WHEN OTHERS THEN RETURN NULL;
//   END;
//   $function$
//
// FUNCTION encrypt_secret(text, text)
//   CREATE OR REPLACE FUNCTION public.encrypt_secret(secret text, key text DEFAULT 'your-encryption-key-here'::text)
//    RETURNS text
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//    SET search_path TO 'public'
//   AS $function$
//   BEGIN
//     RETURN encode(pgp_sym_encrypt(secret, key), 'base64');
//   END;
//   $function$
//
// FUNCTION fix_auth_users_nulls()
//   CREATE OR REPLACE FUNCTION public.fix_auth_users_nulls()
//    RETURNS trigger
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   BEGIN
//     NEW.confirmation_token = COALESCE(NEW.confirmation_token, '');
//     NEW.recovery_token = COALESCE(NEW.recovery_token, '');
//     NEW.email_change_token_new = COALESCE(NEW.email_change_token_new, '');
//     NEW.email_change = COALESCE(NEW.email_change, '');
//     NEW.email_change_token_current = COALESCE(NEW.email_change_token_current, '');
//     NEW.phone_change = COALESCE(NEW.phone_change, '');
//     NEW.phone_change_token = COALESCE(NEW.phone_change_token, '');
//     NEW.reauthentication_token = COALESCE(NEW.reauthentication_token, '');
//     RETURN NEW;
//   END;
//   $function$
//
// FUNCTION get_auth_org_id()
//   CREATE OR REPLACE FUNCTION public.get_auth_org_id()
//    RETURNS uuid
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//    SET search_path TO 'public'
//   AS $function$
//   DECLARE
//       org_id UUID;
//   BEGIN
//       SELECT organization_id INTO org_id
//       FROM public.users
//       WHERE id = auth.uid();
//       RETURN org_id;
//   END;
//   $function$
//
// FUNCTION get_available_slots(uuid, date, integer)
//   CREATE OR REPLACE FUNCTION public.get_available_slots(p_staff_id uuid, p_date date, p_duration_minutes integer DEFAULT 60)
//    RETURNS TABLE(slot_time timestamp with time zone, is_available boolean)
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//    SET search_path TO 'public'
//   AS $function$
//   DECLARE
//     v_start_time TIME; v_end_time TIME; v_current_slot TIMESTAMP WITH TIME ZONE;
//   BEGIN
//     SELECT start_time, end_time INTO v_start_time, v_end_time FROM staff_availability
//     WHERE staff_id = p_staff_id AND day_of_week = EXTRACT(DOW FROM p_date) AND is_active = true LIMIT 1;
//     IF v_start_time IS NULL THEN RETURN; END IF;
//     v_current_slot := p_date + v_start_time;
//     WHILE v_current_slot + (p_duration_minutes || ' minutes')::INTERVAL <= p_date + v_end_time LOOP
//       RETURN QUERY SELECT v_current_slot, NOT EXISTS (SELECT 1 FROM appointments WHERE staff_id = p_staff_id AND scheduled_at = v_current_slot AND status IN ('pending', 'confirmed'));
//       v_current_slot := v_current_slot + (p_duration_minutes || ' minutes')::INTERVAL;
//     END LOOP;
//   END;
//   $function$
//
// FUNCTION get_unread_notification_count()
//   CREATE OR REPLACE FUNCTION public.get_unread_notification_count()
//    RETURNS integer
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//    SET search_path TO 'public'
//   AS $function$
//   BEGIN
//     RETURN (SELECT COUNT(*)::INTEGER FROM notifications WHERE is_read = false);
//   END;
//   $function$
//
// FUNCTION handle_new_user()
//   CREATE OR REPLACE FUNCTION public.handle_new_user()
//    RETURNS trigger
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//    SET search_path TO 'public'
//   AS $function$
//   DECLARE
//       v_org_id UUID;
//       v_org_name TEXT;
//       v_meta_role TEXT;
//       v_meta_org_id UUID;
//       v_user_name TEXT;
//   BEGIN
//       -- Extract metadata
//       v_org_name := NEW.raw_user_meta_data->>'organization_name';
//       v_meta_role := COALESCE(NEW.raw_user_meta_data->>'role', 'admin');
//       v_user_name := COALESCE(NEW.raw_user_meta_data->>'name', 'Usuário');
//
//       -- Check if organization_id is provided in metadata (e.g. invited user)
//       IF NEW.raw_user_meta_data->>'organization_id' IS NOT NULL THEN
//           v_meta_org_id := (NEW.raw_user_meta_data->>'organization_id')::UUID;
//       END IF;
//
//       -- Logic:
//       IF v_meta_org_id IS NOT NULL THEN
//           v_org_id := v_meta_org_id;
//       ELSE
//           IF v_org_name IS NULL OR v_org_name = '' THEN
//               v_org_name := v_user_name || ' Estética';
//           END IF;
//
//           INSERT INTO public.organizations (name) VALUES (v_org_name) RETURNING id INTO v_org_id;
//
//           -- Seed Default Statuses for new Org
//           INSERT INTO public.status (name, color, "order", is_system, is_default, organization_id) VALUES
//           ('Novo', '#DDD6FE', 1, true, true, v_org_id),
//           ('Qualificado', '#BAE6FD', 2, false, false, v_org_id),
//           ('Agendado', '#FEF3C7', 3, false, false, v_org_id),
//           ('Cliente', '#D9F99D', 4, false, false, v_org_id),
//           ('Perdido', '#FCA5A5', 5, true, false, v_org_id),
//           ('Ser Humano', '#E5E7EB', 6, true, false, v_org_id);
//       END IF;
//
//       -- Insert into public.users
//       INSERT INTO public.users (id, email, name, role, is_active, organization_id)
//       VALUES (
//           NEW.id,
//           NEW.email,
//           v_user_name,
//           v_meta_role,
//           true,
//           v_org_id
//       )
//       ON CONFLICT (id) DO UPDATE
//       SET
//           email = EXCLUDED.email,
//           name = EXCLUDED.name,
//           role = EXCLUDED.role,
//           organization_id = EXCLUDED.organization_id;
//
//       RETURN NEW;
//   END;
//   $function$
//
// FUNCTION log_status_change()
//   CREATE OR REPLACE FUNCTION public.log_status_change()
//    RETURNS trigger
//    LANGUAGE plpgsql
//    SET search_path TO 'public'
//   AS $function$
//   BEGIN
//     IF (OLD.status_id IS DISTINCT FROM NEW.status_id) THEN
//       INSERT INTO activities (lead_id, type, description, metadata)
//       VALUES (
//         NEW.id,
//         'status_change',
//         'Status alterado',
//         jsonb_build_object(
//           'status_from', (SELECT name FROM status WHERE id = OLD.status_id),
//           'status_to', (SELECT name FROM status WHERE id = NEW.status_id)
//         )
//       );
//     END IF;
//     RETURN NEW;
//   END;
//   $function$
//
// FUNCTION mark_notification_read(uuid)
//   CREATE OR REPLACE FUNCTION public.mark_notification_read(p_notification_id uuid)
//    RETURNS boolean
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//    SET search_path TO 'public'
//   AS $function$
//   BEGIN
//     UPDATE notifications SET is_read = true, read_at = now() WHERE id = p_notification_id AND is_read = false;
//     RETURN FOUND;
//   END;
//   $function$
//
// FUNCTION move_lead_to_human(uuid, text)
//   CREATE OR REPLACE FUNCTION public.move_lead_to_human(p_lead_id uuid, p_reason text DEFAULT 'IA não conseguiu responder'::text)
//    RETURNS jsonb
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//    SET search_path TO 'public'
//   AS $function$
//   DECLARE
//     v_lead_name TEXT;
//     v_ser_humano_status_id UUID;
//     v_notification_id UUID;
//   BEGIN
//     SELECT name INTO v_lead_name FROM leads WHERE id = p_lead_id;
//     IF NOT FOUND THEN RETURN jsonb_build_object('success', false, 'error', 'Lead não encontrado'); END IF;
//
//     SELECT id INTO v_ser_humano_status_id FROM status WHERE name = 'Ser Humano' LIMIT 1;
//
//     UPDATE leads SET status_id = v_ser_humano_status_id, ai_agent_blocked = true, updated_at = now() WHERE id = p_lead_id;
//
//     INSERT INTO notifications (lead_id, type, title, message, priority, metadata)
//     VALUES (p_lead_id, 'lead_to_human', '🚨 IA transferiu lead', format('Lead %s movido. Motivo: %s', COALESCE(v_lead_name, 'Sem nome'), p_reason), 'urgent', jsonb_build_object('reason', p_reason))
//     RETURNING id INTO v_notification_id;
//
//     RETURN jsonb_build_object('success', true, 'lead_id', p_lead_id, 'notification_id', v_notification_id);
//   END;
//   $function$
//
// FUNCTION notify_lead_to_human()
//   CREATE OR REPLACE FUNCTION public.notify_lead_to_human()
//    RETURNS trigger
//    LANGUAGE plpgsql
//    SET search_path TO 'public'
//   AS $function$
//   DECLARE v_sh_id UUID;
//   BEGIN
//     SELECT id INTO v_sh_id FROM status WHERE name = 'Ser Humano' LIMIT 1;
//     IF (NEW.status_id = v_sh_id AND OLD.status_id != v_sh_id) THEN
//       INSERT INTO notifications (lead_id, type, title, message, priority)
//       VALUES (NEW.id, 'lead_to_human', '🚨 Atendimento Humano', 'Lead movido para Ser Humano', 'urgent');
//       NEW.ai_agent_blocked := true;
//     END IF;
//     RETURN NEW;
//   END; $function$
//
// FUNCTION update_deal_completed_sessions()
//   CREATE OR REPLACE FUNCTION public.update_deal_completed_sessions()
//    RETURNS trigger
//    LANGUAGE plpgsql
//    SET search_path TO 'public'
//   AS $function$
//   BEGIN
//     IF (TG_OP = 'INSERT' AND NEW.completed_at IS NOT NULL) THEN
//       UPDATE deals
//       SET completed_sessions = completed_sessions + 1
//       WHERE id = NEW.deal_id;
//     END IF;
//     RETURN NEW;
//   END;
//   $function$
//
// FUNCTION update_lead_last_interaction()
//   CREATE OR REPLACE FUNCTION public.update_lead_last_interaction()
//    RETURNS trigger
//    LANGUAGE plpgsql
//    SET search_path TO 'public'
//   AS $function$
//   BEGIN
//     UPDATE leads
//     SET last_interaction_at = NEW.created_at
//     WHERE id = NEW.lead_id;
//     RETURN NEW;
//   END;
//   $function$
//
// FUNCTION update_updated_at()
//   CREATE OR REPLACE FUNCTION public.update_updated_at()
//    RETURNS trigger
//    LANGUAGE plpgsql
//    SET search_path TO 'public'
//   AS $function$
//   BEGIN
//     NEW.updated_at = now();
//     RETURN NEW;
//   END;
//   $function$
//
// FUNCTION update_whatsapp_instances_updated_at()
//   CREATE OR REPLACE FUNCTION public.update_whatsapp_instances_updated_at()
//    RETURNS trigger
//    LANGUAGE plpgsql
//    SET search_path TO 'public'
//   AS $function$
//   BEGIN
//       NEW.updated_at = now();
//       RETURN NEW;
//   END;
//   $function$
//

// --- TRIGGERS ---
// Table: agent_config
//   update_agent_config_updated_at: CREATE TRIGGER update_agent_config_updated_at BEFORE UPDATE ON public.agent_config FOR EACH ROW EXECUTE FUNCTION update_updated_at()
// Table: appointments
//   update_appointments_updated_at: CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON public.appointments FOR EACH ROW EXECUTE FUNCTION update_updated_at()
// Table: cadence_templates
//   update_cadence_templates_updated_at: CREATE TRIGGER update_cadence_templates_updated_at BEFORE UPDATE ON public.cadence_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at()
// Table: deal_sessions
//   update_sessions_count: CREATE TRIGGER update_sessions_count AFTER INSERT ON public.deal_sessions FOR EACH ROW EXECUTE FUNCTION update_deal_completed_sessions()
// Table: deals
//   calculate_deal_next_session: CREATE TRIGGER calculate_deal_next_session BEFORE UPDATE ON public.deals FOR EACH ROW WHEN ((old.completed_sessions IS DISTINCT FROM new.completed_sessions)) EXECUTE FUNCTION calculate_next_session_due()
//   update_deals_updated_at: CREATE TRIGGER update_deals_updated_at BEFORE UPDATE ON public.deals FOR EACH ROW EXECUTE FUNCTION update_updated_at()
// Table: leads
//   log_lead_status_change: CREATE TRIGGER log_lead_status_change AFTER UPDATE ON public.leads FOR EACH ROW EXECUTE FUNCTION log_status_change()
//   trigger_notify_lead_to_human: CREATE TRIGGER trigger_notify_lead_to_human BEFORE UPDATE ON public.leads FOR EACH ROW EXECUTE FUNCTION notify_lead_to_human()
//   update_leads_updated_at: CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON public.leads FOR EACH ROW EXECUTE FUNCTION update_updated_at()
// Table: messages
//   update_lead_interaction_on_message: CREATE TRIGGER update_lead_interaction_on_message AFTER INSERT ON public.messages FOR EACH ROW EXECUTE FUNCTION update_lead_last_interaction()
// Table: products
//   update_products_updated_at: CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION update_updated_at()
// Table: users
//   update_users_updated_at: CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at()
// Table: whatsapp_instances
//   auto_handle_whatsapp_lifecycle: CREATE TRIGGER auto_handle_whatsapp_lifecycle BEFORE UPDATE ON public.whatsapp_instances FOR EACH ROW EXECUTE FUNCTION auto_handle_whatsapp_lifecycle()
//   update_whatsapp_instances_updated_at: CREATE TRIGGER update_whatsapp_instances_updated_at BEFORE UPDATE ON public.whatsapp_instances FOR EACH ROW EXECUTE FUNCTION update_whatsapp_instances_updated_at()

// --- INDEXES ---
// Table: activities
//   CREATE INDEX idx_activities_created_at ON public.activities USING btree (created_at DESC)
//   CREATE INDEX idx_activities_instance_id ON public.activities USING btree (whatsapp_instance_id)
//   CREATE INDEX idx_activities_lead_id ON public.activities USING btree (lead_id)
//   CREATE INDEX idx_activities_organization_id ON public.activities USING btree (organization_id)
// Table: agent_config
//   CREATE INDEX idx_agent_config_instance_id ON public.agent_config USING btree (active_whatsapp_instance_id)
//   CREATE INDEX idx_agent_config_organization_id ON public.agent_config USING btree (organization_id)
//   CREATE UNIQUE INDEX idx_agent_config_singleton ON public.agent_config USING btree ((1))
// Table: appointments
//   CREATE INDEX idx_appointments_lead_id ON public.appointments USING btree (lead_id)
//   CREATE UNIQUE INDEX idx_appointments_no_double_booking ON public.appointments USING btree (staff_id, scheduled_at) WHERE (status = ANY (ARRAY['pending'::text, 'confirmed'::text]))
//   CREATE INDEX idx_appointments_organization_id ON public.appointments USING btree (organization_id)
//   CREATE INDEX idx_appointments_scheduled_at ON public.appointments USING btree (scheduled_at)
//   CREATE INDEX idx_appointments_staff_id ON public.appointments USING btree (staff_id)
//   CREATE INDEX idx_appointments_staff_scheduled_status ON public.appointments USING btree (staff_id, scheduled_at, status)
//   CREATE INDEX idx_appointments_status ON public.appointments USING btree (status) WHERE (status = ANY (ARRAY['pending'::text, 'confirmed'::text]))
// Table: cadence_logs
//   CREATE INDEX idx_cadence_logs_lead_id ON public.cadence_logs USING btree (lead_id)
//   CREATE INDEX idx_cadence_logs_template_id ON public.cadence_logs USING btree (template_id)
// Table: cadence_templates
//   CREATE UNIQUE INDEX cadence_templates_name_key ON public.cadence_templates USING btree (name)
//   CREATE INDEX idx_cadence_templates_organization_id ON public.cadence_templates USING btree (organization_id)
// Table: deal_sessions
//   CREATE UNIQUE INDEX deal_sessions_deal_id_session_number_key ON public.deal_sessions USING btree (deal_id, session_number)
//   CREATE INDEX idx_deal_sessions_appointment_id ON public.deal_sessions USING btree (appointment_id)
//   CREATE INDEX idx_deal_sessions_deal_id ON public.deal_sessions USING btree (deal_id)
// Table: deals
//   CREATE INDEX idx_deals_lead_id ON public.deals USING btree (lead_id)
//   CREATE INDEX idx_deals_next_session_due ON public.deals USING btree (next_session_due) WHERE ((status = 'active'::text) AND (next_session_due IS NOT NULL))
//   CREATE INDEX idx_deals_organization_id ON public.deals USING btree (organization_id)
//   CREATE INDEX idx_deals_product_id ON public.deals USING btree (product_id)
//   CREATE INDEX idx_deals_status ON public.deals USING btree (status) WHERE (status = 'active'::text)
// Table: knowledge_base_audios
//   CREATE INDEX idx_knowledge_base_audios_organization_id ON public.knowledge_base_audios USING btree (organization_id)
// Table: knowledge_base_files
//   CREATE INDEX idx_knowledge_base_files_organization_id ON public.knowledge_base_files USING btree (organization_id)
// Table: leads
//   CREATE INDEX idx_leads_ai_blocked ON public.leads USING btree (ai_agent_blocked) WHERE (ai_agent_blocked = true)
//   CREATE INDEX idx_leads_last_interaction ON public.leads USING btree (last_interaction_at DESC)
//   CREATE INDEX idx_leads_name_trgm ON public.leads USING gin (name gin_trgm_ops)
//   CREATE INDEX idx_leads_notes_trgm ON public.leads USING gin (notes gin_trgm_ops)
//   CREATE INDEX idx_leads_organization_id ON public.leads USING btree (organization_id)
//   CREATE INDEX idx_leads_pending_message ON public.leads USING btree (has_pending_message) WHERE (has_pending_message = true)
//   CREATE INDEX idx_leads_phone_trgm ON public.leads USING gin (phone gin_trgm_ops)
//   CREATE INDEX idx_leads_status_id ON public.leads USING btree (status_id)
//   CREATE INDEX idx_leads_status_interaction ON public.leads USING btree (status_id, last_interaction_at DESC NULLS LAST)
//   CREATE UNIQUE INDEX leads_phone_key ON public.leads USING btree (phone)
// Table: messages
//   CREATE INDEX idx_messages_created_at ON public.messages USING btree (lead_id, created_at DESC)
//   CREATE INDEX idx_messages_direction_created ON public.messages USING btree (direction, created_at DESC)
//   CREATE INDEX idx_messages_instance_id ON public.messages USING btree (whatsapp_instance_id)
//   CREATE INDEX idx_messages_instance_lead_created ON public.messages USING btree (whatsapp_instance_id, lead_id, created_at DESC)
//   CREATE INDEX idx_messages_lead_id ON public.messages USING btree (lead_id)
//   CREATE INDEX idx_messages_organization_id ON public.messages USING btree (organization_id)
//   CREATE UNIQUE INDEX messages_meta_message_id_key ON public.messages USING btree (meta_message_id)
// Table: notifications
//   CREATE INDEX idx_notifications_created_at ON public.notifications USING btree (created_at DESC)
//   CREATE INDEX idx_notifications_lead_id ON public.notifications USING btree (lead_id)
//   CREATE INDEX idx_notifications_organization_id ON public.notifications USING btree (organization_id)
//   CREATE INDEX idx_notifications_unread ON public.notifications USING btree (is_read) WHERE (is_read = false)
// Table: products
//   CREATE INDEX idx_products_organization_id ON public.products USING btree (organization_id)
//   CREATE UNIQUE INDEX products_name_key ON public.products USING btree (name)
// Table: staff_availability
//   CREATE INDEX idx_staff_availability_organization_id ON public.staff_availability USING btree (organization_id)
//   CREATE INDEX idx_staff_availability_staff_id ON public.staff_availability USING btree (staff_id)
//   CREATE UNIQUE INDEX staff_availability_staff_id_day_of_week_start_time_key ON public.staff_availability USING btree (staff_id, day_of_week, start_time)
// Table: status
//   CREATE INDEX idx_status_organization_id ON public.status USING btree (organization_id)
//   CREATE UNIQUE INDEX status_name_key ON public.status USING btree (name)
// Table: users
//   CREATE INDEX idx_users_organization_id ON public.users USING btree (organization_id)
//   CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email)
// Table: whatsapp_instances
//   CREATE INDEX idx_whatsapp_instances_organization_id ON public.whatsapp_instances USING btree (organization_id)
//   CREATE INDEX idx_whatsapp_instances_phone ON public.whatsapp_instances USING btree (phone_number)
//   CREATE INDEX idx_whatsapp_instances_status ON public.whatsapp_instances USING btree (connection_status)
//   CREATE INDEX idx_whatsapp_instances_status_updated ON public.whatsapp_instances USING btree (connection_status, updated_at DESC)
//   CREATE INDEX idx_whatsapp_instances_updated_at ON public.whatsapp_instances USING btree (updated_at DESC)
//   CREATE UNIQUE INDEX whatsapp_instances_instance_name_key ON public.whatsapp_instances USING btree (instance_name)
// Table: whatsapp_webhooks
//   CREATE INDEX idx_webhooks_created_at ON public.whatsapp_webhooks USING btree (created_at DESC)
//   CREATE INDEX idx_whatsapp_webhooks_instance_id ON public.whatsapp_webhooks USING btree (whatsapp_instance_id)
//   CREATE INDEX idx_whatsapp_webhooks_lead_created ON public.whatsapp_webhooks USING btree (lead_id, created_at DESC)
//   CREATE INDEX idx_whatsapp_webhooks_message_id ON public.whatsapp_webhooks USING btree (message_id)
//   CREATE INDEX idx_whatsapp_webhooks_organization_id ON public.whatsapp_webhooks USING btree (organization_id)
//   CREATE INDEX idx_whatsapp_webhooks_processed ON public.whatsapp_webhooks USING btree (processed) WHERE (processed = false)
//   CREATE INDEX idx_whatsapp_webhooks_processed_queue ON public.whatsapp_webhooks USING btree (processed, created_at) WHERE (processed = false)
//   CREATE INDEX idx_whatsapp_webhooks_type_created ON public.whatsapp_webhooks USING btree (webhook_type, created_at DESC)
