
-- =========================================================
-- 1. Founder allowlist
-- =========================================================
CREATE TABLE public.allowed_users (
  email TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
GRANT SELECT ON public.allowed_users TO authenticated;
GRANT ALL ON public.allowed_users TO service_role;
ALTER TABLE public.allowed_users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can read allowlist" ON public.allowed_users FOR SELECT TO authenticated USING (true);

INSERT INTO public.allowed_users (email) VALUES ('thirdroomhq@gmail.com');

-- Security-definer function: is the current user an allowed founder?
CREATE OR REPLACE FUNCTION public.is_founder()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM auth.users u
    JOIN public.allowed_users a ON lower(a.email) = lower(u.email)
    WHERE u.id = auth.uid()
      AND u.email_confirmed_at IS NOT NULL
  );
$$;

-- =========================================================
-- 2. Projects
-- =========================================================
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.projects TO authenticated;
GRANT ALL ON public.projects TO service_role;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Founders manage projects" ON public.projects FOR ALL TO authenticated USING (public.is_founder()) WITH CHECK (public.is_founder());

-- =========================================================
-- 3. Captures
-- =========================================================
CREATE TABLE public.captures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  raw_content TEXT,
  file_urls TEXT[] DEFAULT '{}',
  summary TEXT,
  capture_type VARCHAR(50),
  ai_payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.captures TO authenticated;
GRANT ALL ON public.captures TO service_role;
ALTER TABLE public.captures ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Founders manage captures" ON public.captures FOR ALL TO authenticated USING (public.is_founder()) WITH CHECK (public.is_founder());
CREATE INDEX captures_created_at_idx ON public.captures (created_at DESC);
CREATE INDEX captures_search_idx ON public.captures USING GIN (
  to_tsvector('english', coalesce(raw_content, '') || ' ' || coalesce(summary, ''))
);

-- =========================================================
-- 4. Decisions
-- =========================================================
CREATE TABLE public.decisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  capture_id UUID REFERENCES public.captures(id) ON DELETE CASCADE,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  decision_text TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.decisions TO authenticated;
GRANT ALL ON public.decisions TO service_role;
ALTER TABLE public.decisions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Founders manage decisions" ON public.decisions FOR ALL TO authenticated USING (public.is_founder()) WITH CHECK (public.is_founder());

-- =========================================================
-- 5. Tasks
-- =========================================================
CREATE TABLE public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  capture_id UUID REFERENCES public.captures(id) ON DELETE CASCADE,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  task_text TEXT NOT NULL,
  due_date TIMESTAMPTZ,
  priority VARCHAR(20) NOT NULL DEFAULT 'medium',
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tasks TO authenticated;
GRANT ALL ON public.tasks TO service_role;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Founders manage tasks" ON public.tasks FOR ALL TO authenticated USING (public.is_founder()) WITH CHECK (public.is_founder());
CREATE INDEX tasks_due_idx ON public.tasks (due_date NULLS LAST);

-- =========================================================
-- 6. Tags
-- =========================================================
CREATE TABLE public.tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) UNIQUE NOT NULL
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tags TO authenticated;
GRANT ALL ON public.tags TO service_role;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Founders manage tags" ON public.tags FOR ALL TO authenticated USING (public.is_founder()) WITH CHECK (public.is_founder());

CREATE TABLE public.capture_tags (
  capture_id UUID REFERENCES public.captures(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES public.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (capture_id, tag_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.capture_tags TO authenticated;
GRANT ALL ON public.capture_tags TO service_role;
ALTER TABLE public.capture_tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Founders manage capture_tags" ON public.capture_tags FOR ALL TO authenticated USING (public.is_founder()) WITH CHECK (public.is_founder());

-- =========================================================
-- 7. Partners
-- =========================================================
CREATE TABLE public.partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_name VARCHAR(100) NOT NULL,
  contact_email VARCHAR(100),
  current_phase VARCHAR(50) NOT NULL DEFAULT 'Blankspace',
  health_score INT NOT NULL DEFAULT 0,
  active_modules TEXT[] DEFAULT '{}',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.partners TO authenticated;
GRANT ALL ON public.partners TO service_role;
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Founders manage partners" ON public.partners FOR ALL TO authenticated USING (public.is_founder()) WITH CHECK (public.is_founder());

-- =========================================================
-- 8. Integrations
-- =========================================================
CREATE TABLE public.integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider VARCHAR(50) NOT NULL UNIQUE,
  display_name VARCHAR(100) NOT NULL,
  launch_url TEXT,
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  credentials JSONB DEFAULT '{}'::jsonb,
  last_synced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.integrations TO authenticated;
GRANT ALL ON public.integrations TO service_role;
ALTER TABLE public.integrations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Founders manage integrations" ON public.integrations FOR ALL TO authenticated USING (public.is_founder()) WITH CHECK (public.is_founder());

-- Seed default integrations (ecosystem launcher)
INSERT INTO public.integrations (provider, display_name, launch_url) VALUES
  ('claude', 'Claude', 'https://claude.ai'),
  ('canva', 'Canva', 'https://canva.com'),
  ('openai', 'OpenAI Console', 'https://platform.openai.com'),
  ('supabase', 'Supabase', 'https://supabase.com/dashboard'),
  ('whatsapp', 'WhatsApp Business API', 'https://business.whatsapp.com'),
  ('github', 'GitHub', 'https://github.com'),
  ('google_workspace', 'Google Workspace', 'https://workspace.google.com'),
  ('domain', 'Domain Registrar', 'https://domains.google.com');
