-- 1. Ensure `fix_auth_users_nulls` function handles all required string columns properly
CREATE OR REPLACE FUNCTION public.fix_auth_users_nulls()
RETURNS trigger AS $$
BEGIN
  NEW.confirmation_token = COALESCE(NEW.confirmation_token, '');
  NEW.recovery_token = COALESCE(NEW.recovery_token, '');
  NEW.email_change_token_new = COALESCE(NEW.email_change_token_new, '');
  NEW.email_change = COALESCE(NEW.email_change, '');
  NEW.email_change_token_current = COALESCE(NEW.email_change_token_current, '');
  NEW.phone = COALESCE(NEW.phone, '');
  NEW.phone_change = COALESCE(NEW.phone_change, '');
  NEW.phone_change_token = COALESCE(NEW.phone_change_token, '');
  NEW.reauthentication_token = COALESCE(NEW.reauthentication_token, '');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Make sure the trigger is attached to auth.users
DROP TRIGGER IF EXISTS ensure_auth_users_no_nulls ON auth.users;
CREATE TRIGGER ensure_auth_users_no_nulls
  BEFORE INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.fix_auth_users_nulls();

-- 3. Fix the unique constraint on phone so it doesn't fail on empty strings
ALTER TABLE auth.users DROP CONSTRAINT IF EXISTS users_phone_key;
DROP INDEX IF EXISTS users_phone_key;
CREATE UNIQUE INDEX users_phone_key ON auth.users (phone) WHERE phone IS NOT NULL AND phone <> '';

-- 4. Fix existing auth.users records for the phone column and others
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


-- 5. Refactor Constraints for Multi-Tenancy

-- 5.1 Status Table
ALTER TABLE public.status DROP CONSTRAINT IF EXISTS status_name_key;
DROP INDEX IF EXISTS status_name_key;
ALTER TABLE public.status ADD CONSTRAINT status_name_organization_id_key UNIQUE (name, organization_id);

-- 5.2 Products Table
ALTER TABLE public.products DROP CONSTRAINT IF EXISTS products_name_key;
DROP INDEX IF EXISTS products_name_key;
ALTER TABLE public.products ADD CONSTRAINT products_name_organization_id_key UNIQUE (name, organization_id);

-- 5.3 Cadence Templates Table
ALTER TABLE public.cadence_templates DROP CONSTRAINT IF EXISTS cadence_templates_name_key;
DROP INDEX IF EXISTS cadence_templates_name_key;
ALTER TABLE public.cadence_templates ADD CONSTRAINT cadence_templates_name_organization_id_key UNIQUE (name, organization_id);

-- 5.4 WhatsApp Instances Table
ALTER TABLE public.whatsapp_instances DROP CONSTRAINT IF EXISTS whatsapp_instances_instance_name_key;
DROP INDEX IF EXISTS whatsapp_instances_instance_name_key;
ALTER TABLE public.whatsapp_instances ADD CONSTRAINT whatsapp_instances_instance_name_org_id_key UNIQUE (instance_name, organization_id);
