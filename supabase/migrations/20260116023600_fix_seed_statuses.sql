-- Migration to seed default CRM statuses
-- Fixes duplicate key issue by using ON CONFLICT (name)
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
ON CONFLICT (name) DO NOTHING;
