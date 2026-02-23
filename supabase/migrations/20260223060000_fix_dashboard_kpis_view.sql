DROP VIEW IF EXISTS public.dashboard_kpis;

CREATE OR REPLACE VIEW public.dashboard_kpis AS
SELECT
  COALESCE((SELECT count(*) FROM public.leads WHERE organization_id = public.get_auth_org_id()), 0)::bigint AS total_leads,
  COALESCE((SELECT count(*) FROM public.leads WHERE organization_id = public.get_auth_org_id() AND ai_agent_blocked = true), 0)::bigint AS leads_waiting_human,
  COALESCE((SELECT count(*) FROM public.appointments WHERE organization_id = public.get_auth_org_id() AND status = 'confirmed'), 0)::bigint AS confirmed_appointments,
  COALESCE((SELECT count(*) FROM public.notifications WHERE organization_id = public.get_auth_org_id() AND is_read = false), 0)::bigint AS unread_notifications;

GRANT SELECT ON public.dashboard_kpis TO authenticated;
