-- Step 9: Knowledge Sharing, Certification & Notifications

-- 1. Knowledge Sharing
CREATE TABLE IF NOT EXISTS org_knowledge_resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    created_by UUID NOT NULL REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    content_type VARCHAR(50) NOT NULL, -- PDF, VIDEO, LINK, ARTICLE
    resource_url VARCHAR(1024) NOT NULL,
    visibility VARCHAR(50) DEFAULT 'ORGANIZATION' CHECK (visibility IN ('PRIVATE', 'ORGANIZATION', 'COURSE', 'ROLE')),
    status VARCHAR(50) DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'PUBLISHED', 'ARCHIVED')),
    related_competency_id UUID REFERENCES org_competencies(id) ON DELETE SET NULL,
    related_course_id UUID REFERENCES org_courses(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_org_knowledge_resources_org ON org_knowledge_resources(organization_id);

-- 2. Certification
CREATE TABLE IF NOT EXISTS org_certificate_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    validity_days INTEGER, -- NULL means does not expire
    eligibility_rules JSONB NOT NULL DEFAULT '{}'::jsonb, -- e.g., {"course_id": "...", "min_score": 80}
    status VARCHAR(50) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS org_certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    template_id UUID NOT NULL REFERENCES org_certificate_templates(id),
    course_id UUID REFERENCES org_courses(id) ON DELETE SET NULL,
    certificate_number VARCHAR(100) NOT NULL UNIQUE,
    issued_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    valid_until TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'EXPIRED', 'REVOKED')),
    revoked_at TIMESTAMP WITH TIME ZONE,
    revoke_reason TEXT,
    UNIQUE (user_id, template_id)
);

CREATE INDEX IF NOT EXISTS idx_org_certificates_user ON org_certificates(user_id);
CREATE INDEX IF NOT EXISTS idx_org_certificates_org ON org_certificates(organization_id);
CREATE INDEX IF NOT EXISTS idx_org_certificates_number ON org_certificates(certificate_number);

-- 3. Notifications
CREATE TABLE IF NOT EXISTS org_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- COURSE, ASSESSMENT, CERTIFICATE, KNOWLEDGE, SYSTEM
    priority VARCHAR(50) DEFAULT 'NORMAL' CHECK (priority IN ('LOW', 'NORMAL', 'HIGH', 'CRITICAL')),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    action_url VARCHAR(1024),
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    idempotency_key VARCHAR(255) UNIQUE -- to prevent duplicate identical events
);

CREATE INDEX IF NOT EXISTS idx_org_notifications_user_read ON org_notifications(user_id, is_read);

CREATE TABLE IF NOT EXISTS org_notification_preferences (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    preferences JSONB DEFAULT '{"email": true, "in_app": true}'::jsonb,
    PRIMARY KEY (user_id, organization_id)
);
