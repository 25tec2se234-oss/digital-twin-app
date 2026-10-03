-- 022_add_granular_permissions.sql
-- Add granular permissions for Phase 1 RBAC requirements

INSERT INTO permissions (permission_key, description) VALUES
('organization.view', 'View organization details'),
('organization.update', 'Update organization details'),
('members.view', 'View organization members'),
('members.invite', 'Invite users to organization'),
('members.remove', 'Remove users from organization'),
('members.update', 'Update member roles and statuses'),
('departments.manage', 'Manage organization departments'),
('roles.manage', 'Manage organization roles'),
('competencies.manage', 'Manage organization competencies'),
('training.create', 'Create training courses'),
('training.assign', 'Assign training to members'),
('training.view', 'View training resources'),
('assessment.manage', 'Manage assessments and questions'),
('knowledge.upload', 'Upload knowledge resources'),
('knowledge.view', 'View knowledge library'),
('reports.view', 'View and export reports'),
('digital_twin.view', 'View organizational digital twin'),
('enterprise_ai.use', 'Use Enterprise AI capabilities')
ON CONFLICT (permission_key) DO NOTHING;

-- Map to ORGANIZATION_ADMIN
INSERT INTO role_permissions (role, permission_id)
SELECT 'ORGANIZATION_ADMIN', id FROM permissions
WHERE permission_key IN (
    'organization.view', 
    'organization.update', 
    'members.view', 
    'members.invite', 
    'members.remove', 
    'members.update',
    'departments.manage',
    'roles.manage',
    'competencies.manage',
    'training.create',
    'training.assign',
    'training.view',
    'assessment.manage',
    'knowledge.upload',
    'knowledge.view',
    'reports.view',
    'digital_twin.view',
    'enterprise_ai.use'
)
ON CONFLICT DO NOTHING;

-- Map to TRAINER
INSERT INTO role_permissions (role, permission_id)
SELECT 'TRAINER', id FROM permissions
WHERE permission_key IN (
    'organization.view',
    'members.view',
    'competencies.manage',
    'training.create',
    'training.assign',
    'training.view',
    'assessment.manage',
    'knowledge.upload',
    'knowledge.view',
    'digital_twin.view'
)
ON CONFLICT DO NOTHING;

-- Map to TRAINEE
INSERT INTO role_permissions (role, permission_id)
SELECT 'TRAINEE', id FROM permissions
WHERE permission_key IN (
    'organization.view',
    'training.view',
    'knowledge.view'
)
ON CONFLICT DO NOTHING;
