-- Migration: 025_student_career_readiness.sql
-- Structured career readiness workflow: Profiles, Assessments, Roadmaps, Tasks, and Evidence

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Student Career Profile (Target role, timeline, and education level)
CREATE TABLE IF NOT EXISTS student_career_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  target_role_id varchar(64) NOT NULL DEFAULT 'sde_backend',
  target_role_title varchar(255) NOT NULL DEFAULT 'Software Development Engineer (Backend)',
  current_education_level varchar(128) NOT NULL DEFAULT 'undergraduate_final_year',
  target_timeline_weeks integer NOT NULL DEFAULT 4,
  weekly_hours_available integer NOT NULL DEFAULT 15,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_student_career_profiles_user UNIQUE (user_id)
);

CREATE INDEX IF NOT EXISTS idx_student_career_profiles_user_id ON student_career_profiles(user_id);

-- 2. Readiness Assessments (Historical attempts, evaluated objective & self-reported responses)
CREATE TABLE IF NOT EXISTS readiness_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  target_role_id varchar(64) NOT NULL,
  attempt_number integer NOT NULL DEFAULT 1,
  responses jsonb NOT NULL DEFAULT '{}'::jsonb,
  scores jsonb NOT NULL DEFAULT '{}'::jsonb,
  skill_gaps jsonb NOT NULL DEFAULT '[]'::jsonb,
  limitations text NOT NULL,
  recommendations jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_readiness_assessments_user_role ON readiness_assessments(user_id, target_role_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_readiness_assessments_attempt ON readiness_assessments(user_id, attempt_number);

-- 3. Personalized Roadmaps
CREATE TABLE IF NOT EXISTS readiness_roadmaps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  assessment_id uuid REFERENCES readiness_assessments(id) ON DELETE SET NULL,
  target_role_id varchar(64) NOT NULL,
  title varchar(255) NOT NULL,
  summary text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_readiness_roadmaps_user_active ON readiness_roadmaps(user_id, is_active);

-- 4. Practical Tasks & Verification Evidence
CREATE TABLE IF NOT EXISTS readiness_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  roadmap_id uuid NOT NULL REFERENCES readiness_roadmaps(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  task_key varchar(64) NOT NULL,
  week_number integer NOT NULL DEFAULT 1,
  title varchar(255) NOT NULL,
  description text NOT NULL,
  priority varchar(32) NOT NULL DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
  estimated_hours numeric(4,1) NOT NULL DEFAULT 4.0,
  relevant_skill varchar(128) NOT NULL,
  completion_criteria text NOT NULL,
  resources jsonb NOT NULL DEFAULT '[]'::jsonb,
  status varchar(32) NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
  evidence_type varchar(64),
  evidence_url text,
  evidence_notes text,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_readiness_tasks_roadmap_task UNIQUE (roadmap_id, task_key)
);

CREATE INDEX IF NOT EXISTS idx_readiness_tasks_roadmap ON readiness_tasks(roadmap_id);
CREATE INDEX IF NOT EXISTS idx_readiness_tasks_user_status ON readiness_tasks(user_id, status);
