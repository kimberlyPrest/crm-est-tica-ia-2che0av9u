-- Migration to seed default CRM statuses
-- Colors: Ser Humano (#F87171), Novo (#A78BFA), Qualificado (#0EA5E9), Agendado (#FBBF24), 
-- Perdido (#6B7280), Aguardando Cliente (#C084FC), Cliente (#84CC16), Faltou o Agendamento (#FB923C)

INSERT INTO public.status (name, color, "order", is_system, is_default)
VALUES 
  ('Ser Humano', '#F87171', 0, true, false),
  ('Novo', '#A78BFA', 1, true, true),
  ('Qualificado', '#0EA5E9', 2, true, false),
  ('Agendado', '#FBBF24', 3, true, false),
  ('Perdido', '#6B7280', 4, true, false),
  ('Aguardando Cliente', '#C084FC', 5, true, false),
  ('Cliente', '#84CC16', 6, true, false),
  ('Faltou o Agendamento', '#FB923C', 7, true, false)
ON CONFLICT (id) DO NOTHING;

-- Note: Ideally we would match by name to avoid duplicates if IDs are different, 
-- but since this is a seed script for a likely empty table or one where we want to ensure these exist:
-- We'll use a safer approach to insert only if name doesn't exist to preserve existing data structure if any.

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.status WHERE name = 'Ser Humano') THEN
    INSERT INTO public.status (name, color, "order", is_system, is_default) VALUES ('Ser Humano', '#F87171', 0, true, false);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM public.status WHERE name = 'Novo') THEN
    INSERT INTO public.status (name, color, "order", is_system, is_default) VALUES ('Novo', '#A78BFA', 1, true, true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.status WHERE name = 'Qualificado') THEN
    INSERT INTO public.status (name, color, "order", is_system, is_default) VALUES ('Qualificado', '#0EA5E9', 2, true, false);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.status WHERE name = 'Agendado') THEN
    INSERT INTO public.status (name, color, "order", is_system, is_default) VALUES ('Agendado', '#FBBF24', 3, true, false);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.status WHERE name = 'Perdido') THEN
    INSERT INTO public.status (name, color, "order", is_system, is_default) VALUES ('Perdido', '#6B7280', 4, true, false);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.status WHERE name = 'Aguardando Cliente') THEN
    INSERT INTO public.status (name, color, "order", is_system, is_default) VALUES ('Aguardando Cliente', '#C084FC', 5, true, false);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.status WHERE name = 'Cliente') THEN
    INSERT INTO public.status (name, color, "order", is_system, is_default) VALUES ('Cliente', '#84CC16', 6, true, false);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.status WHERE name = 'Faltou o Agendamento') THEN
    INSERT INTO public.status (name, color, "order", is_system, is_default) VALUES ('Faltou o Agendamento', '#FB923C', 7, true, false);
  END IF;
END $$;
