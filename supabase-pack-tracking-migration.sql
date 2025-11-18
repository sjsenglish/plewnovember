-- Migration: Add Pack Progress Tracking
-- This migration adds tables to track completed packs, user answers, and used questions

-- Table: completed_packs
-- Stores information about each completed pack session
CREATE TABLE IF NOT EXISTS completed_packs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_email VARCHAR(255) NOT NULL,
    pack_id VARCHAR(255) NOT NULL,
    pack_size INTEGER NOT NULL,
    level INTEGER DEFAULT 1,
    score INTEGER NOT NULL,
    total_questions INTEGER NOT NULL,
    time_taken_seconds INTEGER NOT NULL,
    started_at TIMESTAMPTZ NOT NULL,
    completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table: user_answers
-- Stores individual answers for each question in a completed pack
CREATE TABLE IF NOT EXISTS user_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    completed_pack_id UUID NOT NULL REFERENCES completed_packs(id) ON DELETE CASCADE,
    question_object_id VARCHAR(255) NOT NULL,
    question_text TEXT NOT NULL,
    selected_answer TEXT NOT NULL,
    correct_answer TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL,
    answered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table: used_questions
-- Tracks which questions have been used by each user to avoid repetition
CREATE TABLE IF NOT EXISTS used_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_email VARCHAR(255) NOT NULL,
    question_object_id VARCHAR(255) NOT NULL,
    level INTEGER DEFAULT 1,
    used_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    -- Ensure each user doesn't get the same question twice at the same level
    UNIQUE(user_email, question_object_id, level)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_completed_packs_user_email ON completed_packs(user_email);
CREATE INDEX IF NOT EXISTS idx_completed_packs_completed_at ON completed_packs(completed_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_answers_completed_pack_id ON user_answers(completed_pack_id);
CREATE INDEX IF NOT EXISTS idx_user_answers_question_object_id ON user_answers(question_object_id);
CREATE INDEX IF NOT EXISTS idx_used_questions_user_email ON used_questions(user_email);
CREATE INDEX IF NOT EXISTS idx_used_questions_level ON used_questions(level);

-- Function: get_user_stats
-- Returns aggregate statistics for a user
CREATE OR REPLACE FUNCTION get_user_stats(p_user_email VARCHAR)
RETURNS TABLE (
    total_packs_completed BIGINT,
    total_questions_answered BIGINT,
    total_correct_answers BIGINT,
    average_score NUMERIC,
    total_time_spent_seconds BIGINT,
    best_score INTEGER,
    recent_activity TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        COUNT(DISTINCT cp.id)::BIGINT as total_packs_completed,
        SUM(cp.total_questions)::BIGINT as total_questions_answered,
        SUM(cp.score)::BIGINT as total_correct_answers,
        ROUND(AVG(cp.score::NUMERIC / cp.total_questions * 100), 2) as average_score,
        SUM(cp.time_taken_seconds)::BIGINT as total_time_spent_seconds,
        MAX(cp.score) as best_score,
        MAX(cp.completed_at) as recent_activity
    FROM completed_packs cp
    WHERE cp.user_email = p_user_email;
END;
$$ LANGUAGE plpgsql;

-- Function: get_completed_packs_summary
-- Returns a summary of completed packs for a user
CREATE OR REPLACE FUNCTION get_completed_packs_summary(
    p_user_email VARCHAR,
    p_limit INTEGER DEFAULT 50,
    p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
    id UUID,
    pack_id VARCHAR,
    pack_size INTEGER,
    level INTEGER,
    score INTEGER,
    total_questions INTEGER,
    score_percentage NUMERIC,
    time_taken_seconds INTEGER,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    answer_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        cp.id,
        cp.pack_id,
        cp.pack_size,
        cp.level,
        cp.score,
        cp.total_questions,
        ROUND(cp.score::NUMERIC / cp.total_questions * 100, 2) as score_percentage,
        cp.time_taken_seconds,
        cp.started_at,
        cp.completed_at,
        COUNT(ua.id) as answer_count
    FROM completed_packs cp
    LEFT JOIN user_answers ua ON ua.completed_pack_id = cp.id
    WHERE cp.user_email = p_user_email
    GROUP BY cp.id
    ORDER BY cp.completed_at DESC
    LIMIT p_limit
    OFFSET p_offset;
END;
$$ LANGUAGE plpgsql;

-- Function: get_used_question_ids
-- Returns list of question IDs that have been used by a user at a specific level
CREATE OR REPLACE FUNCTION get_used_question_ids(
    p_user_email VARCHAR,
    p_level INTEGER DEFAULT 1
)
RETURNS TABLE (question_object_id VARCHAR) AS $$
BEGIN
    RETURN QUERY
    SELECT uq.question_object_id
    FROM used_questions uq
    WHERE uq.user_email = p_user_email
      AND uq.level = p_level;
END;
$$ LANGUAGE plpgsql;

-- View: pack_statistics
-- Aggregate statistics across all users
CREATE OR REPLACE VIEW pack_statistics AS
SELECT
    cp.level,
    cp.pack_size,
    COUNT(DISTINCT cp.id) as total_packs_completed,
    COUNT(DISTINCT cp.user_email) as unique_users,
    ROUND(AVG(cp.score::NUMERIC / cp.total_questions * 100), 2) as average_score_percentage,
    ROUND(AVG(cp.time_taken_seconds), 2) as average_time_seconds,
    MIN(cp.completed_at) as first_completion,
    MAX(cp.completed_at) as latest_completion
FROM completed_packs cp
GROUP BY cp.level, cp.pack_size;

-- Comments for documentation
COMMENT ON TABLE completed_packs IS 'Stores completed pack sessions with scores and timing';
COMMENT ON TABLE user_answers IS 'Stores individual question answers for each completed pack';
COMMENT ON TABLE used_questions IS 'Tracks which questions have been used by users to prevent repetition';
COMMENT ON FUNCTION get_user_stats IS 'Returns aggregate statistics for a specific user';
COMMENT ON FUNCTION get_completed_packs_summary IS 'Returns paginated list of completed packs for a user';
COMMENT ON FUNCTION get_used_question_ids IS 'Returns question IDs already used by a user at a specific level';
