CREATE TABLE public.camp_previews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  preview_data JSONB NOT NULL,
  access_code TEXT NOT NULL,
  trainer_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.camp_previews ENABLE ROW LEVEL SECURITY;