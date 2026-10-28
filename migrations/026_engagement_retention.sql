-- 026_engagement_retention.sql
-- Engagement, Milestones, Natural Return Journeys, Notification Preferences & Retention Telemetry

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Ensure unique milestone criteria per student (prevent duplicate achievement awards)
CREATE UNIQUE INDEX IF NOT EXISTS uq_achievements_student_criteria 
ON achievements(student_id, criteria_met) 
WHERE deleted_at IS NULL;

-- 2. Student Notification Preferences Table
CREATE TABLE IF NOT EXISTS student_notification_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    weekly_digest BOOLEAN DEFAULT true,
    milestone_alerts BOOLEAN DEFAULT true,
    roadmap_reminders BOOLEAN DEFAULT true,
    reminder_frequency VARCHAR(20) DEFAULT 'weekly', -- 'never', 'weekly', 'biweekly'
    last_notified_at TIMESTAMP WITH TIME ZONE,
    unsubscribe_token VARCHAR(64) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_student_notif_pref_user ON student_notification_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_student_notif_pref_token ON student_notification_preferences(unsubscribe_token);

-- 3. Student Retention & Engagement Telemetry Events Table
CREATE TABLE IF NOT EXISTS student_retention_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    event_name VARCHAR(100) NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    session_id VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_retention_events_user ON student_retention_events(user_id, event_name);
CREATE INDEX IF NOT EXISTS idx_retention_events_created ON student_retention_events(created_at);
