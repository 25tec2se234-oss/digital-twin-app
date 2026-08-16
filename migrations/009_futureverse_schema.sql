-- 009_futureverse_schema.sql
-- Schema for storing Futureverse progress

CREATE TABLE IF NOT EXISTS futureverse_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    level INT DEFAULT 1,
    xp INT DEFAULT 0,
    mastery NUMERIC(5,2) DEFAULT 0.0,
    difficulty_multiplier NUMERIC(5,2) DEFAULT 1.0,
    stats JSONB DEFAULT '{"correct": 0, "incorrect": 0, "consecutiveCorrect": 0}',
    completed_challenges JSONB DEFAULT '{}',
    explored_worlds JSONB DEFAULT '[]',
    explored_nodes JSONB DEFAULT '[]',
    has_seen_guide BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

CREATE INDEX IF NOT EXISTS idx_futureverse_progress_user ON futureverse_progress(user_id);
