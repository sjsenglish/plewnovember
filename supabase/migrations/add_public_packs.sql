-- Migration: Add public packs tables
-- Created: 2025-11-19
-- Purpose: Move hardcoded shared packs to database for easier management

-- =====================================================
-- PUBLIC PACKS TABLE
-- =====================================================
-- Stores publicly accessible question packs
CREATE TABLE IF NOT EXISTS public_packs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pack_id VARCHAR NOT NULL UNIQUE, -- e.g., 'sample-pack-2026'
  name VARCHAR NOT NULL,
  description TEXT,
  size INTEGER NOT NULL DEFAULT 0,
  level INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for fast lookups by pack_id
CREATE INDEX IF NOT EXISTS idx_public_packs_pack_id ON public_packs(pack_id);
CREATE INDEX IF NOT EXISTS idx_public_packs_level ON public_packs(level);

-- =====================================================
-- PUBLIC PACK QUESTIONS TABLE
-- =====================================================
-- Stores questions within public packs
CREATE TABLE IF NOT EXISTS public_pack_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pack_id VARCHAR NOT NULL REFERENCES public_packs(pack_id) ON DELETE CASCADE,
  question_number INTEGER,
  year VARCHAR,
  question_text TEXT NOT NULL,
  actual_question TEXT,
  answer_options JSONB NOT NULL, -- Array of answer options
  correct_answer TEXT NOT NULL,
  correct_answer_number INTEGER,
  image_file VARCHAR,
  video_solution_link VARCHAR,
  source VARCHAR,
  primary_subject_area VARCHAR,
  passage_type VARCHAR,
  question_skill VARCHAR,
  object_id VARCHAR,
  question_id VARCHAR,
  passage TEXT,
  difficulty VARCHAR,
  subject VARCHAR,
  topic VARCHAR,
  requires_plew BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_public_pack_questions_pack_id ON public_pack_questions(pack_id);
CREATE INDEX IF NOT EXISTS idx_public_pack_questions_object_id ON public_pack_questions(object_id);

-- =====================================================
-- FUNCTION: Update timestamp on row update
-- =====================================================
CREATE OR REPLACE FUNCTION update_public_packs_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update timestamp
DROP TRIGGER IF EXISTS update_public_packs_timestamp ON public_packs;
CREATE TRIGGER update_public_packs_timestamp
  BEFORE UPDATE ON public_packs
  FOR EACH ROW
  EXECUTE FUNCTION update_public_packs_timestamp();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================
-- Enable RLS on public_packs and public_pack_questions
ALTER TABLE public_packs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public_pack_questions ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read public packs (they're public!)
CREATE POLICY "Anyone can view public packs" ON public_packs
  FOR SELECT USING (true);

CREATE POLICY "Anyone can view public pack questions" ON public_pack_questions
  FOR SELECT USING (true);

-- Service role can do anything
CREATE POLICY "Service role full access to public packs" ON public_packs
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access to public pack questions" ON public_pack_questions
  FOR ALL USING (auth.role() = 'service_role');

-- =====================================================
-- GRANT PERMISSIONS
-- =====================================================
-- Grant read access to everyone (including anonymous users)
GRANT SELECT ON public_packs TO anon, authenticated;
GRANT SELECT ON public_pack_questions TO anon, authenticated;

-- Grant full access to service role
GRANT ALL ON public_packs TO service_role;
GRANT ALL ON public_pack_questions TO service_role;

-- =====================================================
-- SEED DATA - Sample Pack 2026
-- =====================================================
-- Insert the existing sample pack data
INSERT INTO public_packs (pack_id, name, description, size, level)
VALUES ('sample-pack-2026', 'Sample Pack 2026', 'Try out a real CSAT question from 2026', 1, 3)
ON CONFLICT (pack_id) DO NOTHING;

INSERT INTO public_pack_questions (
  pack_id,
  question_number,
  year,
  question_text,
  actual_question,
  answer_options,
  correct_answer,
  correct_answer_number,
  image_file,
  video_solution_link,
  source,
  primary_subject_area,
  passage_type,
  question_skill,
  object_id,
  question_id,
  passage,
  difficulty,
  subject,
  topic,
  requires_plew
) VALUES (
  'sample-pack-2026',
  34,
  '2026',
  'Kant was a strong defender of the rule of law as the ultimate guarantee, not only of security and peace, but also of freedom. He believed that human societies were moving towards more rational forms regulated by effective and binding legal frameworks because only such frameworks enabled people to live in harmony, to prosper and to co-operate. However, his belief in inevitable progress was not based on an optimistic or high-minded view of human nature. On the contrary, it comes close to Hobbes''s outlook: man''s violent and conflict-prone nature makes it necessary to establish and maintain an effective legal framework in order to secure peace. We cannot count on people''s benevolence or goodwill, but even ''a nation of devils'' can live in harmony in a legal system that binds every citizen equally. Ideally, the law is the embodiment of those political principles that all rational beings would freely choose. If such laws forbid them to do something that they would not rationally choose to do anyway, then the law cannot be _______.',
  '다음 빈칸에 들어갈 말로 가장 적절한 것을 고르시오.',
  '["① regarded as reasonably confining human liberty", "② viewed as a strong defender of the justice system", "③ understood as a restraint on their freedom", "④ enforced effectively to suppress their evil nature", "⑤ accepted within the assumption of ideal legal frameworks"]'::jsonb,
  '③ understood as a restraint on their freedom',
  3,
  'default_image.jpg',
  '',
  'past-paper',
  'social science',
  'argumentative',
  '빈칸 추론',
  '2026_pp_36',
  '2026_pp_36',
  'Kant was a strong defender of the rule of law as the ultimate guarantee, not only of security and peace, but also of freedom. He believed that human societies were moving towards more rational forms regulated by effective and binding legal frameworks because only such frameworks enabled people to live in harmony, to prosper and to co-operate. However, his belief in inevitable progress was not based on an optimistic or high-minded view of human nature. On the contrary, it comes close to Hobbes''s outlook: man''s violent and conflict-prone nature makes it necessary to establish and maintain an effective legal framework in order to secure peace. We cannot count on people''s benevolence or goodwill, but even ''a nation of devils'' can live in harmony in a legal system that binds every citizen equally. Ideally, the law is the embodiment of those political principles that all rational beings would freely choose. If such laws forbid them to do something that they would not rationally choose to do anyway, then the law cannot be _______.',
  'medium',
  'English',
  '빈칸 추론',
  true
)
ON CONFLICT DO NOTHING;

-- =====================================================
-- COMMENTS
-- =====================================================
COMMENT ON TABLE public_packs IS 'Publicly accessible question packs that dont require authentication';
COMMENT ON TABLE public_pack_questions IS 'Questions within public packs';
