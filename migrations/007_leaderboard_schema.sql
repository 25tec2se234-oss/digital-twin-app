-- Add leaderboard opt-in to users
ALTER TABLE users ADD COLUMN IF NOT EXISTS public_leaderboard_opt_in BOOLEAN DEFAULT TRUE;

-- Table to store configurable scoring weights
CREATE TABLE IF NOT EXISTS leaderboard_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    action_type TEXT UNIQUE NOT NULL,
    points INT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Insert default configurations
INSERT INTO leaderboard_config (action_type, points) VALUES
('daily_login', 10),
('simulation_complete', 50),
('assessment_complete', 100),
('profile_update', 20),
('onboarding_complete', 150)
ON CONFLICT (action_type) DO NOTHING;

-- Table to store granular actions (append-only style)
CREATE TABLE IF NOT EXISTS user_activity_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_id TEXT, -- For guest users
    action_type TEXT NOT NULL REFERENCES leaderboard_config(action_type) ON DELETE CASCADE,
    points_awarded INT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CHECK (user_id IS NOT NULL OR session_id IS NOT NULL)
);

-- Index for fast aggregation during the background cron job
CREATE INDEX IF NOT EXISTS idx_user_activity_user_session_created ON user_activity_log(user_id, session_id, created_at);
CREATE INDEX IF NOT EXISTS idx_user_activity_created ON user_activity_log(created_at);

-- Table for cached leaderboard snapshots (calculated periodically)
CREATE TABLE IF NOT EXISTS leaderboard_snapshot (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_id TEXT,
    period TEXT NOT NULL CHECK (period IN ('all_time', 'monthly', 'weekly')),
    score INT NOT NULL DEFAULT 0,
    rank INT NOT NULL,
    previous_rank INT,
    display_name TEXT NOT NULL,
    city TEXT,
    UNIQUE (user_id, session_id, period)
);

-- Unique index to handle nulls in user_id / session_id
CREATE UNIQUE INDEX IF NOT EXISTS idx_leaderboard_snapshot_unique 
ON leaderboard_snapshot (
    COALESCE(user_id, '00000000-0000-0000-0000-000000000000'::uuid), 
    COALESCE(session_id, 'none'), 
    period
);

-- Indexes for querying the leaderboard fast
CREATE INDEX IF NOT EXISTS idx_leaderboard_snapshot_period_rank ON leaderboard_snapshot(period, rank);
CREATE INDEX IF NOT EXISTS idx_leaderboard_snapshot_user_session ON leaderboard_snapshot(user_id, session_id);
