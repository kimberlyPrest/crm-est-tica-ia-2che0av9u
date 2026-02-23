-- Verify and update get_auth_org_id to ensure tenant isolation works perfectly
CREATE OR REPLACE FUNCTION public.get_auth_org_id()
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
    org_id UUID;
BEGIN
    SELECT organization_id INTO org_id
    FROM public.users
    WHERE id = auth.uid() AND is_active = true;
    RETURN org_id;
END;
$$;

-- Fix existing nulls in auth.users to prevent schema query database errors
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

-- Create function to prevent future nulls
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

-- Hook trigger to ensure no null string columns in auth.users
DROP TRIGGER IF EXISTS ensure_auth_users_no_nulls ON auth.users;
CREATE TRIGGER ensure_auth_users_no_nulls
  BEFORE INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.fix_auth_users_nulls();

-- Recreate handle_new_user to ensure robust organization creation and data seeding
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
    v_org_id UUID;
    v_org_name TEXT;
    v_meta_role TEXT;
    v_meta_org_id UUID;
    v_user_name TEXT;
BEGIN
    -- Extract metadata securely using BTRIM
    v_org_name := NULLIF(BTRIM(NEW.raw_user_meta_data->>'organization_name'), '');
    v_meta_role := COALESCE(NULLIF(BTRIM(NEW.raw_user_meta_data->>'role'), ''), 'admin');
    v_user_name := COALESCE(NULLIF(BTRIM(NEW.raw_user_meta_data->>'name'), ''), 'Usuário');
    
    -- Check if organization_id is provided in metadata (e.g., when inviting users)
    IF NEW.raw_user_meta_data->>'organization_id' IS NOT NULL THEN
        v_meta_org_id := (NEW.raw_user_meta_data->>'organization_id')::UUID;
    END IF;

    -- Logic:
    IF v_meta_org_id IS NOT NULL THEN
        v_org_id := v_meta_org_id;
    ELSE
        -- Fallback to default user name for Organization Name if not provided
        IF v_org_name IS NULL THEN
            v_org_name := v_user_name || ' Estética';
        END IF;

        -- Create the isolated organization
        INSERT INTO public.organizations (name) VALUES (v_org_name) RETURNING id INTO v_org_id;
        
        -- Seed Default Statuses for the new Organization
        INSERT INTO public.status (name, color, "order", is_system, is_default, organization_id) VALUES
        ('Novo', '#DDD6FE', 1, true, true, v_org_id),
        ('Qualificado', '#BAE6FD', 2, false, false, v_org_id),
        ('Agendado', '#FEF3C7', 3, false, false, v_org_id),
        ('Cliente', '#D9F99D', 4, false, false, v_org_id),
        ('Perdido', '#FCA5A5', 5, true, false, v_org_id),
        ('Ser Humano', '#E5E7EB', 6, true, false, v_org_id);
    END IF;

    -- Link the user to the organization in public.users table
    INSERT INTO public.users (id, email, name, role, is_active, organization_id)
    VALUES (
        NEW.id,
        NEW.email,
        v_user_name,
        v_meta_role,
        true,
        v_org_id
    )
    ON CONFLICT (id) DO UPDATE
    SET
        email = EXCLUDED.email,
        name = EXCLUDED.name,
        role = EXCLUDED.role,
        organization_id = EXCLUDED.organization_id;

    RETURN NEW;
END;
$function$;

-- Ensure trigger is hooked safely on Auth
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

