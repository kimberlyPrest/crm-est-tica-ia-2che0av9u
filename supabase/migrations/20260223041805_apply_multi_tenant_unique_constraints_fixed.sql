-- Fix existing auth.users nulls to ensure GoTrue compatibility and prevent 500 errors
-- Excluding phone because it has a unique constraint that we cannot alter due to permission limitations
UPDATE auth.users
SET
  confirmation_token = COALESCE(confirmation_token, ''),
  recovery_token = COALESCE(recovery_token, ''),
  email_change_token_new = COALESCE(email_change_token_new, ''),
  email_change = COALESCE(email_change, ''),
  email_change_token_current = COALESCE(email_change_token_current, ''),
  phone_change = COALESCE(phone_change, ''),
  phone_change_token = COALESCE(phone_change_token, ''),
  reauthentication_token = COALESCE(reauthentication_token, '')
WHERE
  confirmation_token IS NULL OR recovery_token IS NULL
  OR email_change_token_new IS NULL OR email_change IS NULL
  OR email_change_token_current IS NULL
  OR phone_change IS NULL OR phone_change_token IS NULL
  OR reauthentication_token IS NULL;

-- Update the trigger function to include columns per critical rules, excluding phone
CREATE OR REPLACE FUNCTION public.fix_auth_users_nulls()
RETURNS trigger AS $$
BEGIN
  NEW.confirmation_token = COALESCE(NEW.confirmation_token, '');
  NEW.recovery_token = COALESCE(NEW.recovery_token, '');
  NEW.email_change_token_new = COALESCE(NEW.email_change_token_new, '');
  NEW.email_change = COALESCE(NEW.email_change, '');
  NEW.email_change_token_current = COALESCE(NEW.email_change_token_current, '');
  NEW.phone_change = COALESCE(NEW.phone_change, '');
  NEW.phone_change_token = COALESCE(NEW.phone_change_token, '');
  NEW.reauthentication_token = COALESCE(NEW.reauthentication_token, '');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing global unique constraints that prevent multi-tenancy defaults
ALTER TABLE public.status DROP CONSTRAINT IF EXISTS status_name_key;
DROP INDEX IF EXISTS public.status_name_key;

ALTER TABLE public.products DROP CONSTRAINT IF EXISTS products_name_key;
DROP INDEX IF EXISTS public.products_name_key;

ALTER TABLE public.cadence_templates DROP CONSTRAINT IF EXISTS cadence_templates_name_key;
DROP INDEX IF EXISTS public.cadence_templates_name_key;

-- Add correct composite unique constraints per organization
ALTER TABLE public.status DROP CONSTRAINT IF EXISTS status_name_organization_id_key;
ALTER TABLE public.status ADD CONSTRAINT status_name_organization_id_key UNIQUE (name, organization_id);

ALTER TABLE public.products DROP CONSTRAINT IF EXISTS products_name_organization_id_key;
ALTER TABLE public.products ADD CONSTRAINT products_name_organization_id_key UNIQUE (name, organization_id);

ALTER TABLE public.cadence_templates DROP CONSTRAINT IF EXISTS cadence_templates_name_organization_id_key;
ALTER TABLE public.cadence_templates ADD CONSTRAINT cadence_templates_name_organization_id_key UNIQUE (name, organization_id);
