-- 012_capacity_connect_foundation.sql
-- Multi-tenant and RBAC foundation for Capacity Connect

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Organizations (Multi-tenant boundary)
CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    logo_url TEXT,
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);
CREATE INDEX IF NOT EXISTS idx_organizations_slug ON organizations(slug);

-- 2. Organization Memberships (Mapping users to tenants with specific roles)
CREATE TABLE IF NOT EXISTS organization_memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL, -- e.g., 'ORGANIZATION_ADMIN', 'TRAINER', 'TRAINEE'
    status VARCHAR(50) DEFAULT 'Active',
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(organization_id, user_id)
);
CREATE INDEX IF NOT EXISTS idx_org_members_user ON organization_memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_org_members_org ON organization_memberships(organization_id);

-- 3. Permissions (Fine-grained capabilities)
CREATE TABLE IF NOT EXISTS permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    permission_key VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Role Permissions (Mapping generic roles to explicit permissions)
CREATE TABLE IF NOT EXISTS role_permissions (
    role VARCHAR(50) NOT NULL,
    permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (role, permission_id)
);

-- Insert base permissions
INSERT INTO permissions (permission_key, description) VALUES
('organization.read', 'View organization details'),
('organization.update', 'Update organization details'),
('organization.users.read', 'View organization users'),
('organization.users.create', 'Invite or add users to organization'),
('organization.users.update', 'Update organization users'),
('organization.users.delete', 'Remove users from organization')
ON CONFLICT (permission_key) DO NOTHING;

-- Map basic permissions to ORGANIZATION_ADMIN
INSERT INTO role_permissions (role, permission_id)
SELECT 'ORGANIZATION_ADMIN', id FROM permissions
WHERE permission_key IN (
    'organization.read', 
    'organization.update', 
    'organization.users.read', 
    'organization.users.create', 
    'organization.users.update', 
    'organization.users.delete'
)
ON CONFLICT DO NOTHING;

-- Map basic permissions to TRAINER
INSERT INTO role_permissions (role, permission_id)
SELECT 'TRAINER', id FROM permissions
WHERE permission_key IN (
    'organization.read', 
    'organization.users.read'
)
ON CONFLICT DO NOTHING;

-- Map basic permissions to TRAINEE
INSERT INTO role_permissions (role, permission_id)
SELECT 'TRAINEE', id FROM permissions
WHERE permission_key IN (
    'organization.read'
)
ON CONFLICT DO NOTHING;
