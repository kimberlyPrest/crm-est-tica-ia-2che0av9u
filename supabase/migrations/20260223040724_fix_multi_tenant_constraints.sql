-- Fix existing auth.users records for the phone column and others
UPDATE auth.users
SET
  confirmation_token = COALESCE(confirmation_token, ''),
  recovery_token = COALESCE(recovery_token, ''),
  email_change_token_new = COALESCE(email_change_token_new, ''),
  email_change = COALESCE(email_change, ''),
  email_change_token_current = COALESCE(email_change_token_current, ''),
  phone = COALESCE(phone, ''),
  phone_change = COALESCE(phone_change, ''),
  phone_change_token = COALESCE(phone_change_token, ''),
  reauthentication_token = COALESCE(reauthentication_token, '')
WHERE
  confirmation_token IS NULL OR recovery_token IS NULL
  OR email_change_token_new IS NULL OR email_change IS NULL
  OR email_change_token_current IS NULL OR phone IS NULL
  OR phone_change IS NULL OR phone_change_token IS NULL
  OR reauthentication_token IS NULL;

-- Refactor Constraints for Multi-Tenancy

-- Status Table
ALTER TABLE public.status DROP CONSTRAINT IF EXISTS status_name_key;
DROP INDEX IF EXISTS status_name_key;
ALTER TABLE public.status DROP CONSTRAINT IF EXISTS status_name_organization_id_key;
ALTER TABLE public.status ADD CONSTRAINT status_name_organization_id_key UNIQUE (name, organization_id);

-- Products Table
ALTER TABLE public.products DROP CONSTRAINT IF EXISTS products_name_key;
DROP INDEX IF EXISTS products_name_key;
ALTER TABLE public.products DROP CONSTRAINT IF EXISTS products_name_organization_id_key;
ALTER TABLE public.products ADD CONSTRAINT products_name_organization_id_key UNIQUE (name, organization_id);

-- Cadence Templates Table
ALTER TABLE public.cadence_templates DROP CONSTRAINT IF EXISTS cadence_templates_name_key;
DROP INDEX IF EXISTS cadence_templates_name_key;
ALTER TABLE public.cadence_templates DROP CONSTRAINT IF EXISTS cadence_templates_name_organization_id_key;
ALTER TABLE public.cadence_templates ADD CONSTRAINT cadence_templates_name_organization_id_key UNIQUE (name, organization_id);

-- WhatsApp Instances Table
ALTER TABLE public.whatsapp_instances DROP CONSTRAINT IF EXISTS whatsapp_instances_instance_name_key;
DROP INDEX IF EXISTS whatsapp_instances_instance_name_key;
ALTER TABLE public.whatsapp_instances DROP CONSTRAINT IF EXISTS whatsapp_instances_instance_name_org_id_key;
ALTER TABLE public.whatsapp_instances ADD CONSTRAINT whatsapp_instances_instance_name_org_id_key UNIQUE (instance_name, organization_id);
