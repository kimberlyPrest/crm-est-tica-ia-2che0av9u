DO $$
DECLARE
  v_user_id UUID;
  v_org_id UUID;
BEGIN
  -- Obter o ID do usuário kimberly@adapta.org
  SELECT id INTO v_user_id FROM auth.users WHERE email = 'kimberly@adapta.org' LIMIT 1;
  
  IF v_user_id IS NOT NULL THEN
    -- Atualizar metadados de nome na auth.users
    UPDATE auth.users 
    SET raw_user_meta_data = jsonb_set(COALESCE(raw_user_meta_data, '{}'::jsonb), '{name}', '"Administradora Demo"')
    WHERE id = v_user_id;

    -- Atualizar nome no perfil public.users
    UPDATE public.users 
    SET name = 'Administradora Demo', updated_at = now()
    WHERE id = v_user_id;

    -- Obter organization_id do usuário na public.users
    SELECT organization_id INTO v_org_id FROM public.users WHERE id = v_user_id LIMIT 1;

    IF v_org_id IS NOT NULL THEN
      -- Atualizar nome da organização
      UPDATE public.organizations 
      SET name = 'Clínica Estética Demo', updated_at = now()
      WHERE id = v_org_id;
    END IF;
  END IF;
END $$;
