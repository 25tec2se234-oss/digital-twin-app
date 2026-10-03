-- Phase 9: Digital Twin 2.0
ALTER TABLE org_digital_twin_snapshots 
ADD COLUMN IF NOT EXISTS is_stale BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS ai_explanations JSONB DEFAULT '{}'::jsonb;
