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
    PostgrestVersion: "14.1"
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
          type: string
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          lead_id?: string | null
          metadata?: Json | null
          type: string
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          lead_id?: string | null
          metadata?: Json | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "activities_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_config: {
        Row: {
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
          role_definition: string | null
          tone: string | null
          updated_at: string | null
          webhook_verify_token: string | null
          whatsapp_api_key: string | null
          whatsapp_business_account_id: string | null
          whatsapp_phone_number_id: string | null
        }
        Insert: {
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
          role_definition?: string | null
          tone?: string | null
          updated_at?: string | null
          webhook_verify_token?: string | null
          whatsapp_api_key?: string | null
          whatsapp_business_account_id?: string | null
          whatsapp_phone_number_id?: string | null
        }
        Update: {
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
          role_definition?: string | null
          tone?: string | null
          updated_at?: string | null
          webhook_verify_token?: string | null
          whatsapp_api_key?: string | null
          whatsapp_business_account_id?: string | null
          whatsapp_phone_number_id?: string | null
        }
        Relationships: []
      }
      appointments: {
        Row: {
          created_at: string | null
          id: string
          lead_id: string
          notes: string | null
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
          scheduled_at?: string
          staff_id?: string | null
          status?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
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
            foreignKeyName: "cadence_logs_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cadence_logs_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "cadence_templates"
            referencedColumns: ["id"]
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
          trigger_status?: string[]
          updated_at?: string | null
        }
        Relationships: []
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
            foreignKeyName: "deal_sessions_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deal_sessions_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
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
            foreignKeyName: "deals_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deals_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_base_audios: {
        Row: {
          audio_path: string
          id: string
          is_active: boolean
          name: string
          trigger_keywords: string[] | null
          uploaded_at: string | null
        }
        Insert: {
          audio_path: string
          id?: string
          is_active?: boolean
          name: string
          trigger_keywords?: string[] | null
          uploaded_at?: string | null
        }
        Update: {
          audio_path?: string
          id?: string
          is_active?: boolean
          name?: string
          trigger_keywords?: string[] | null
          uploaded_at?: string | null
        }
        Relationships: []
      }
      knowledge_base_files: {
        Row: {
          file_path: string
          file_type: string
          id: string
          is_active: boolean
          name: string
          uploaded_at: string | null
        }
        Insert: {
          file_path: string
          file_type: string
          id?: string
          is_active?: boolean
          name: string
          uploaded_at?: string | null
        }
        Update: {
          file_path?: string
          file_type?: string
          id?: string
          is_active?: boolean
          name?: string
          uploaded_at?: string | null
        }
        Relationships: []
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
          phone?: string
          status_id?: string
          tags?: string[] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_status_id_fkey"
            columns: ["status_id"]
            isOneToOne: false
            referencedRelation: "status"
            referencedColumns: ["id"]
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
          read_at: string | null
          sent_by: string
        }
        Insert: {
          content: string
          created_at?: string | null
          direction: string
          id?: string
          lead_id: string
          message_type?: string
          meta_message_id?: string | null
          read_at?: string | null
          sent_by: string
        }
        Update: {
          content?: string
          created_at?: string | null
          direction?: string
          id?: string
          lead_id?: string
          message_type?: string
          meta_message_id?: string | null
          read_at?: string | null
          sent_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
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
          priority?: string
          read_at?: string | null
          title?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          created_at: string | null
          default_price: number
          id: string
          is_active: boolean
          name: string
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
          return_interval_days?: number
          total_sessions?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      staff_availability: {
        Row: {
          created_at: string | null
          day_of_week: number
          end_time: string
          id: string
          is_active: boolean
          staff_id: string
          start_time: string
        }
        Insert: {
          created_at?: string | null
          day_of_week: number
          end_time: string
          id?: string
          is_active?: boolean
          staff_id: string
          start_time: string
        }
        Update: {
          created_at?: string | null
          day_of_week?: number
          end_time?: string
          id?: string
          is_active?: boolean
          staff_id?: string
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "staff_availability_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
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
        }
        Insert: {
          color?: string
          created_at?: string | null
          id?: string
          is_default?: boolean
          is_system?: boolean
          name: string
          order?: number
        }
        Update: {
          color?: string
          created_at?: string | null
          id?: string
          is_default?: boolean
          is_system?: boolean
          name?: string
          order?: number
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          id: string
          is_active: boolean
          name: string
          role: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          is_active?: boolean
          name: string
          role?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          is_active?: boolean
          name?: string
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      whatsapp_webhooks: {
        Row: {
          created_at: string | null
          id: string
          lead_id: string | null
          message_id: string | null
          processed: boolean
          processed_at: string | null
          processing_error: string | null
          raw_payload: Json
          webhook_type: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          lead_id?: string | null
          message_id?: string | null
          processed?: boolean
          processed_at?: string | null
          processing_error?: string | null
          raw_payload: Json
          webhook_type: string
        }
        Update: {
          created_at?: string | null
          id?: string
          lead_id?: string | null
          message_id?: string | null
          processed?: boolean
          processed_at?: string | null
          processing_error?: string | null
          raw_payload?: Json
          webhook_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_webhooks_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "whatsapp_webhooks_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
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
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

