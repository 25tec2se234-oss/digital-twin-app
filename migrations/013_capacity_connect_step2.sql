-- 013_capacity_connect_step2.sql

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Invitations Table
CREATE TABLE IF NOT EXISTS organization_invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    inviter_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    token_hash TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING', -- PENDING, ACCEPTED, EXPIRED, REVOKED
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_org_invites_org ON organization_invitations(organization_id);
CREATE INDEX IF NOT EXISTS idx_org_invites_email ON organization_invitations(email);
CREATE UNIQUE INDEX IF NOT EXISTS idx_org_invites_token ON organization_invitations(token_hash);

-- 2. Trainer Profiles
CREATE TABLE IF NOT EXISTS trainer_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255),
    expertise JSONB DEFAULT '[]'::jsonb,
    experience_years INT DEFAULT 0,
    bio TEXT,
    qualifications JSONB DEFAULT '[]'::jsonb,
    certifications JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

-- 3. Trainee Profiles
CREATE TABLE IF NOT EXISTS trainee_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    learning_goals JSONB DEFAULT '[]'::jsonb,
    skills JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

-- 4. New Permissions
INSERT INTO permissions (permission_key, description) VALUES
('organization.invitations.create', 'Create and send invitations'),
('organization.invitations.read', 'View sent invitations'),
('organization.invitations.revoke', 'Revoke pending invitations'),
('organization.settings.update', 'Update organization profile and settings'),
('people.activate', 'Activate/Deactivate users')
ON CONFLICT DO NOTHING;

-- Map to Admin
INSERT INTO role_permissions (role, permission_id)
SELECT 'ORGANIZATION_ADMIN', id FROM permissions
WHERE permission_key IN (
    'organization.invitations.create', 
    'organization.invitations.read', 
    'organization.invitations.revoke',
    'organization.settings.update',
    'people.activate'
)
ON CONFLICT DO NOTHING;
