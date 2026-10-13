-- 024_audit_logs_org_extension.sql
-- Extend audit_logs table for multi-tenant organization tracking and ensure all RBAC keys exist

-- 1. Extend audit_logs table with tenant isolation and structured payload columns
ALTER TABLE audit_logs 
  ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS resource_type VARCHAR(255),
  ADD COLUMN IF NOT EXISTS resource_id VARCHAR(255),
  ADD COLUMN IF NOT EXISTS details JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS user_agent TEXT;

-- 2. Create performance indexes for tenant-scoped activity queries
CREATE INDEX IF NOT EXISTS idx_audit_logs_org_created ON audit_logs(organization_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);

-- 3. Ensure all permission keys used throughout backend routes exist in permissions table
INSERT INTO permissions (permission_key, description) VALUES
  ('organization.admin', 'Full administrative authority for organization'),
  ('organization.manage', 'Manage organization settings and structure'),
  ('organization.read', 'Read organization details'),
  ('organization.courses.manage', 'Manage organization courses and materials'),
  ('competency.read', 'Read competencies and frameworks'),
  ('competency.manage', 'Manage competencies and frameworks'),
  ('assessment.read', 'Read assessments and questions'),
  ('assessment.create', 'Create assessments and questions'),
  ('assessment.update', 'Update assessments and questions'),
  ('assessment.delete', 'Delete assessments and questions'),
  ('course.create', 'Create courses'),
  ('course.read', 'Read courses'),
  ('course.update', 'Update courses'),
  ('course.publish', 'Publish courses'),
  ('course.delete', 'Delete courses'),
  ('course.manage', 'Manage courses')
ON CONFLICT (permission_key) DO NOTHING;

-- 4. Map all permissions to ORGANIZATION_ADMIN role
INSERT INTO role_permissions (role, permission_id)
SELECT 'ORGANIZATION_ADMIN', p.id 
FROM permissions p
WHERE p.permission_key IN (
  'organization.admin',
  'organization.manage',
  'organization.read',
  'organization.courses.manage',
  'competency.read',
  'competency.manage',
  'assessment.read',
  'assessment.create',
  'assessment.update',
  'assessment.delete',
  'course.create',
  'course.read',
  'course.update',
  'course.publish',
  'course.delete',
  'course.manage'
)
ON CONFLICT DO NOTHING;
