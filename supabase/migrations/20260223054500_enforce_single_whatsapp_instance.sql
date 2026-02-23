-- Remove all existing whatsapp instances to ensure a clean state
DELETE FROM public.whatsapp_instances;

-- Ensure no existing constraint with the same name blocks us
ALTER TABLE public.whatsapp_instances DROP CONSTRAINT IF EXISTS whatsapp_instances_organization_id_key;

-- Add unique constraint on organization_id to enforce single instance per org
ALTER TABLE public.whatsapp_instances ADD CONSTRAINT whatsapp_instances_organization_id_key UNIQUE (organization_id);
