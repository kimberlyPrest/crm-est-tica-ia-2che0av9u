-- Enable RLS on all multi-tenant tables
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_base_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_base_audios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cadence_templates ENABLE ROW LEVEL SECURITY;

-- Note: In Supabase, the requesting user's ID is obtained via auth.uid().
-- We link auth.uid() to the `users` table to check their `organization_id`.

-- LEADS
CREATE POLICY "Users can only see leads in their organization" ON public.leads
  FOR SELECT USING (auth.uid() IN (SELECT id FROM users WHERE organization_id = leads.organization_id));

CREATE POLICY "Users can insert leads in their organization" ON public.leads
  FOR INSERT WITH CHECK (auth.uid() IN (SELECT id FROM users WHERE organization_id = leads.organization_id));

CREATE POLICY "Users can update leads in their organization" ON public.leads
  FOR UPDATE USING (auth.uid() IN (SELECT id FROM users WHERE organization_id = leads.organization_id));

CREATE POLICY "Users can delete leads in their organization" ON public.leads
  FOR DELETE USING (auth.uid() IN (SELECT id FROM users WHERE organization_id = leads.organization_id));


-- MESSAGES
CREATE POLICY "Users can only see messages in their organization" ON public.messages
  FOR SELECT USING (auth.uid() IN (SELECT id FROM users WHERE organization_id = messages.organization_id));

CREATE POLICY "Users can insert messages in their organization" ON public.messages
  FOR INSERT WITH CHECK (auth.uid() IN (SELECT id FROM users WHERE organization_id = messages.organization_id));

CREATE POLICY "Users can update messages in their organization" ON public.messages
  FOR UPDATE USING (auth.uid() IN (SELECT id FROM users WHERE organization_id = messages.organization_id));

CREATE POLICY "Users can delete messages in their organization" ON public.messages
  FOR DELETE USING (auth.uid() IN (SELECT id FROM users WHERE organization_id = messages.organization_id));


-- APPOINTMENTS
CREATE POLICY "Users can only see appointments in their organization" ON public.appointments
  FOR SELECT USING (auth.uid() IN (SELECT id FROM users WHERE organization_id = appointments.organization_id));

CREATE POLICY "Users can insert appointments in their organization" ON public.appointments
  FOR INSERT WITH CHECK (auth.uid() IN (SELECT id FROM users WHERE organization_id = appointments.organization_id));

CREATE POLICY "Users can update appointments in their organization" ON public.appointments
  FOR UPDATE USING (auth.uid() IN (SELECT id FROM users WHERE organization_id = appointments.organization_id));

CREATE POLICY "Users can delete appointments in their organization" ON public.appointments
  FOR DELETE USING (auth.uid() IN (SELECT id FROM users WHERE organization_id = appointments.organization_id));


-- STATUS
CREATE POLICY "Users can only see statuses in their organization" ON public.status
  FOR SELECT USING (auth.uid() IN (SELECT id FROM users WHERE organization_id = status.organization_id));

CREATE POLICY "Users can insert statuses in their organization" ON public.status
  FOR INSERT WITH CHECK (auth.uid() IN (SELECT id FROM users WHERE organization_id = status.organization_id));

CREATE POLICY "Users can update statuses in their organization" ON public.status
  FOR UPDATE USING (auth.uid() IN (SELECT id FROM users WHERE organization_id = status.organization_id));

CREATE POLICY "Users can delete statuses in their organization" ON public.status
  FOR DELETE USING (auth.uid() IN (SELECT id FROM users WHERE organization_id = status.organization_id));


-- ACTIVITIES
CREATE POLICY "Users can only see activities in their organization" ON public.activities
  FOR SELECT USING (auth.uid() IN (SELECT id FROM users WHERE organization_id = activities.organization_id));

CREATE POLICY "Users can insert activities in their organization" ON public.activities
  FOR INSERT WITH CHECK (auth.uid() IN (SELECT id FROM users WHERE organization_id = activities.organization_id));


-- WHATSAPP INSTANCES
CREATE POLICY "Users can only see instances in their organization" ON public.whatsapp_instances
  FOR SELECT USING (auth.uid() IN (SELECT id FROM users WHERE organization_id = whatsapp_instances.organization_id));

CREATE POLICY "Users can insert instances in their organization" ON public.whatsapp_instances
  FOR INSERT WITH CHECK (auth.uid() IN (SELECT id FROM users WHERE organization_id = whatsapp_instances.organization_id));

CREATE POLICY "Users can update instances in their organization" ON public.whatsapp_instances
  FOR UPDATE USING (auth.uid() IN (SELECT id FROM users WHERE organization_id = whatsapp_instances.organization_id));

CREATE POLICY "Users can delete instances in their organization" ON public.whatsapp_instances
  FOR DELETE USING (auth.uid() IN (SELECT id FROM users WHERE organization_id = whatsapp_instances.organization_id));


-- AGENT CONFIG
CREATE POLICY "Users can only see agent_config in their organization" ON public.agent_config
  FOR SELECT USING (auth.uid() IN (SELECT id FROM users WHERE organization_id = agent_config.organization_id));

CREATE POLICY "Users can insert agent_config in their organization" ON public.agent_config
  FOR INSERT WITH CHECK (auth.uid() IN (SELECT id FROM users WHERE organization_id = agent_config.organization_id));

CREATE POLICY "Users can update agent_config in their organization" ON public.agent_config
  FOR UPDATE USING (auth.uid() IN (SELECT id FROM users WHERE organization_id = agent_config.organization_id));

CREATE POLICY "Users can delete agent_config in their organization" ON public.agent_config
  FOR DELETE USING (auth.uid() IN (SELECT id FROM users WHERE organization_id = agent_config.organization_id));


-- KNOWLEDGE BASE FILES
CREATE POLICY "Users can only see kb files in their organization" ON public.knowledge_base_files
  FOR SELECT USING (auth.uid() IN (SELECT id FROM users WHERE organization_id = knowledge_base_files.organization_id));

CREATE POLICY "Users can insert kb files in their organization" ON public.knowledge_base_files
  FOR INSERT WITH CHECK (auth.uid() IN (SELECT id FROM users WHERE organization_id = knowledge_base_files.organization_id));

CREATE POLICY "Users can update kb files in their organization" ON public.knowledge_base_files
  FOR UPDATE USING (auth.uid() IN (SELECT id FROM users WHERE organization_id = knowledge_base_files.organization_id));

CREATE POLICY "Users can delete kb files in their organization" ON public.knowledge_base_files
  FOR DELETE USING (auth.uid() IN (SELECT id FROM users WHERE organization_id = knowledge_base_files.organization_id));


-- KNOWLEDGE BASE AUDIOS
CREATE POLICY "Users can only see kb audios in their organization" ON public.knowledge_base_audios
  FOR SELECT USING (auth.uid() IN (SELECT id FROM users WHERE organization_id = knowledge_base_audios.organization_id));

CREATE POLICY "Users can insert kb audios in their organization" ON public.knowledge_base_audios
  FOR INSERT WITH CHECK (auth.uid() IN (SELECT id FROM users WHERE organization_id = knowledge_base_audios.organization_id));

CREATE POLICY "Users can update kb audios in their organization" ON public.knowledge_base_audios
  FOR UPDATE USING (auth.uid() IN (SELECT id FROM users WHERE organization_id = knowledge_base_audios.organization_id));

CREATE POLICY "Users can delete kb audios in their organization" ON public.knowledge_base_audios
  FOR DELETE USING (auth.uid() IN (SELECT id FROM users WHERE organization_id = knowledge_base_audios.organization_id));


-- PRODUCTS
CREATE POLICY "Users can only see products in their organization" ON public.products
  FOR SELECT USING (auth.uid() IN (SELECT id FROM users WHERE organization_id = products.organization_id));

CREATE POLICY "Users can insert products in their organization" ON public.products
  FOR INSERT WITH CHECK (auth.uid() IN (SELECT id FROM users WHERE organization_id = products.organization_id));

CREATE POLICY "Users can update products in their organization" ON public.products
  FOR UPDATE USING (auth.uid() IN (SELECT id FROM users WHERE organization_id = products.organization_id));

CREATE POLICY "Users can delete products in their organization" ON public.products
  FOR DELETE USING (auth.uid() IN (SELECT id FROM users WHERE organization_id = products.organization_id));


-- DEALS
CREATE POLICY "Users can only see deals in their organization" ON public.deals
  FOR SELECT USING (auth.uid() IN (SELECT id FROM users WHERE organization_id = deals.organization_id));

CREATE POLICY "Users can insert deals in their organization" ON public.deals
  FOR INSERT WITH CHECK (auth.uid() IN (SELECT id FROM users WHERE organization_id = deals.organization_id));

CREATE POLICY "Users can update deals in their organization" ON public.deals
  FOR UPDATE USING (auth.uid() IN (SELECT id FROM users WHERE organization_id = deals.organization_id));

CREATE POLICY "Users can delete deals in their organization" ON public.deals
  FOR DELETE USING (auth.uid() IN (SELECT id FROM users WHERE organization_id = deals.organization_id));


-- NOTIFICATIONS
CREATE POLICY "Users can only see notifications in their organization" ON public.notifications
  FOR SELECT USING (auth.uid() IN (SELECT id FROM users WHERE organization_id = notifications.organization_id));

CREATE POLICY "Users can insert notifications in their organization" ON public.notifications
  FOR INSERT WITH CHECK (auth.uid() IN (SELECT id FROM users WHERE organization_id = notifications.organization_id));

CREATE POLICY "Users can update notifications in their organization" ON public.notifications
  FOR UPDATE USING (auth.uid() IN (SELECT id FROM users WHERE organization_id = notifications.organization_id));

CREATE POLICY "Users can delete notifications in their organization" ON public.notifications
  FOR DELETE USING (auth.uid() IN (SELECT id FROM users WHERE organization_id = notifications.organization_id));


-- CADENCE TEMPLATES
CREATE POLICY "Users can only see cadence templates in their organization" ON public.cadence_templates
  FOR SELECT USING (auth.uid() IN (SELECT id FROM users WHERE organization_id = cadence_templates.organization_id));

CREATE POLICY "Users can insert cadence templates in their organization" ON public.cadence_templates
  FOR INSERT WITH CHECK (auth.uid() IN (SELECT id FROM users WHERE organization_id = cadence_templates.organization_id));

CREATE POLICY "Users can update cadence templates in their organization" ON public.cadence_templates
  FOR UPDATE USING (auth.uid() IN (SELECT id FROM users WHERE organization_id = cadence_templates.organization_id));

CREATE POLICY "Users can delete cadence templates in their organization" ON public.cadence_templates
  FOR DELETE USING (auth.uid() IN (SELECT id FROM users WHERE organization_id = cadence_templates.organization_id));
