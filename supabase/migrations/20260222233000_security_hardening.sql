-- Phase 1: Security Hardening

-- 1. Fix mutable search_path for functions
ALTER FUNCTION public.auto_handle_whatsapp_lifecycle() SET search_path = public;
ALTER FUNCTION public.calculate_next_session_due() SET search_path = public;
ALTER FUNCTION public.decrypt_secret(encrypted_secret text, key text) SET search_path = public;
ALTER FUNCTION public.encrypt_secret(secret text, key text) SET search_path = public;
ALTER FUNCTION public.get_available_slots(p_staff_id uuid, p_date date, p_duration_minutes integer) SET search_path = public;
ALTER FUNCTION public.get_unread_notification_count() SET search_path = public;
ALTER FUNCTION public.handle_new_auth_user() SET search_path = public;
ALTER FUNCTION public.handle_new_user() SET search_path = public;
ALTER FUNCTION public.log_status_change() SET search_path = public;
ALTER FUNCTION public.mark_notification_read(p_notification_id uuid) SET search_path = public;
ALTER FUNCTION public.move_lead_to_human(p_lead_id uuid, p_reason text) SET search_path = public;
ALTER FUNCTION public.notify_lead_to_human() SET search_path = public;
ALTER FUNCTION public.update_deal_completed_sessions() SET search_path = public;
ALTER FUNCTION public.update_lead_last_interaction() SET search_path = public;
ALTER FUNCTION public.update_updated_at() SET search_path = public;
ALTER FUNCTION public.update_whatsapp_instances_updated_at() SET search_path = public;

-- 2. Refactor dashboard_kpis view to use security_invoker
DROP VIEW IF EXISTS public.dashboard_kpis;
CREATE VIEW public.dashboard_kpis WITH (security_invoker=true) AS 
SELECT 
  (SELECT count(*) AS count FROM leads) AS total_leads,
  (SELECT count(*) AS count FROM appointments WHERE ((appointments.status = 'confirmed'::text) AND (appointments.scheduled_at >= now()))) AS confirmed_appointments,
  (SELECT count(*) AS count FROM notifications WHERE (notifications.is_read = false)) AS unread_notifications,
  (SELECT count(*) AS count FROM leads WHERE (leads.status_id = (SELECT status.id FROM status WHERE (status.name = 'Ser Humano'::text)))) AS leads_waiting_human;

-- 3. Enable RLS on deal_sessions
ALTER TABLE public.deal_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for authenticated users" ON public.deal_sessions
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable insert access for authenticated users" ON public.deal_sessions
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Enable update access for authenticated users" ON public.deal_sessions
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Enable delete access for authenticated users" ON public.deal_sessions
  FOR DELETE TO authenticated USING (true);

-- 4. Move pg_trgm extension to extensions schema if it exists in public
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_trgm' AND extnamespace = 'public'::regnamespace) THEN
    CREATE SCHEMA IF NOT EXISTS extensions;
    ALTER EXTENSION pg_trgm SET SCHEMA extensions;
  END IF;
END $$;
