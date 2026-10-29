-- 027_institutional_pilot.sql
-- Institutional Customer Validation: Inquiries, Cohort Management, and Multi-Tenant Readiness Reporting

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Institutional Inquiries (Inquiry workflow for prospective colleges)
CREATE TABLE IF NOT EXISTS institutional_inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reference_id VARCHAR(32) UNIQUE NOT NULL,
    contact_name VARCHAR(100) NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    institution_name VARCHAR(255) NOT NULL,
    role_title VARCHAR(100) NOT NULL,
    phone VARCHAR(50),
    cohort_size VARCHAR(50) NOT NULL,
    target_role VARCHAR(100) NOT NULL,
    pilot_timeline VARCHAR(100) NOT NULL,
    notes TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'NEW' CHECK (status IN ('NEW', 'CONTACTED', 'PILOT_APPROVED', 'DECLINED', 'SPAM')),
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inquiries_email ON institutional_inquiries(contact_email);
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON institutional_inquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inquiries_ref ON institutional_inquiries(reference_id);

-- 2. Cohorts (Multi-tenant student cohort groups for pilot colleges)
CREATE TABLE IF NOT EXISTS cohorts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    target_graduation_year INTEGER NOT NULL DEFAULT 2026,
    department VARCHAR(100) NOT NULL,
    target_role VARCHAR(100) NOT NULL DEFAULT 'full_stack',
    status VARCHAR(50) NOT NULL DEFAULT 'PILOT_ACTIVE' CHECK (status IN ('PLANNING', 'PILOT_ACTIVE', 'COMPLETED', 'ARCHIVED')),
    pilot_start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    pilot_end_date DATE NOT NULL DEFAULT (CURRENT_DATE + INTERVAL '30 days'),
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cohorts_org ON cohorts(organization_id);

-- 3. Cohort Student Enrollment Mapping (With explicit consent tracking)
CREATE TABLE IF NOT EXISTS cohort_students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cohort_id UUID NOT NULL REFERENCES cohorts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    roll_number VARCHAR(100),
    enrolled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    consent_institutional_reporting BOOLEAN NOT NULL DEFAULT true,
    UNIQUE(cohort_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_cohort_students_cohort ON cohort_students(cohort_id);
CREATE INDEX IF NOT EXISTS idx_cohort_students_user ON cohort_students(user_id);

-- 4. Permissions for Cohort Management & Institutional Readiness Reporting
INSERT INTO permissions (permission_key, description) VALUES
    ('cohorts.view', 'View student cohorts in the organization'),
    ('cohorts.create', 'Create and configure student cohorts'),
    ('cohorts.manage', 'Manage cohort rosters and enrollment'),
    ('reports.readiness.view', 'View aggregate cohort placement readiness heatmaps')
ON CONFLICT (permission_key) DO NOTHING;

-- Map permissions to ORGANIZATION_ADMIN
INSERT INTO role_permissions (role, permission_id)
SELECT 'ORGANIZATION_ADMIN', p.id 
FROM permissions p
WHERE p.permission_key IN (
    'cohorts.view',
    'cohorts.create',
    'cohorts.manage',
    'reports.readiness.view'
)
ON CONFLICT DO NOTHING;

-- Map permissions to PLACEMENT_OFFICER
INSERT INTO role_permissions (role, permission_id)
SELECT 'PLACEMENT_OFFICER', p.id 
FROM permissions p
WHERE p.permission_key IN (
    'cohorts.view',
    'cohorts.create',
    'cohorts.manage',
    'reports.readiness.view'
)
ON CONFLICT DO NOTHING;

-- Map view permissions to FACULTY_MENTOR
INSERT INTO role_permissions (role, permission_id)
SELECT 'FACULTY_MENTOR', p.id 
FROM permissions p
WHERE p.permission_key IN (
    'cohorts.view',
    'reports.readiness.view'
)
ON CONFLICT DO NOTHING;
