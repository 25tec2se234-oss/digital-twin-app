-- 014_capacity_connect_step3_lms.sql

CREATE TABLE IF NOT EXISTS org_courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    short_description VARCHAR(500),
    description TEXT,
    thumbnail VARCHAR(1024),
    category VARCHAR(255),
    level VARCHAR(100),
    language VARCHAR(100),
    estimated_duration INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'PUBLISHED', 'ARCHIVED')),
    trainer_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(organization_id, slug)
);

CREATE TABLE IF NOT EXISTS org_course_modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES org_courses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS org_course_resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id UUID NOT NULL REFERENCES org_course_modules(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    resource_type VARCHAR(50) NOT NULL CHECK (resource_type IN ('VIDEO', 'PDF', 'PRESENTATION', 'DOCUMENT', 'LINK', 'TEXT')),
    storage_url VARCHAR(1024),
    duration INTEGER DEFAULT 0,
    file_size INTEGER DEFAULT 0,
    mime_type VARCHAR(100),
    order_index INTEGER NOT NULL DEFAULT 0,
    is_required BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS org_course_enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES org_courses(id) ON DELETE CASCADE,
    trainee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'ENROLLED' CHECK (status IN ('ENROLLED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')),
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    last_accessed_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(course_id, trainee_id)
);

CREATE TABLE IF NOT EXISTS org_resource_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    enrollment_id UUID NOT NULL REFERENCES org_course_enrollments(id) ON DELETE CASCADE,
    resource_id UUID NOT NULL REFERENCES org_course_resources(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'NOT_STARTED' CHECK (status IN ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED')),
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    last_accessed_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(enrollment_id, resource_id)
);

-- Insert new permissions for course management
INSERT INTO permissions (permission_key, description) VALUES 
('course.create', 'Create organization courses'),
('course.read', 'Read organization courses'),
('course.update', 'Update organization courses'),
('course.delete', 'Delete/Archive organization courses'),
('course.publish', 'Publish organization courses'),
('course.enroll', 'Enroll trainees in organization courses')
ON CONFLICT (permission_key) DO NOTHING;

-- Grant permissions to ORGANIZATION_ADMIN
INSERT INTO role_permissions (role, permission_id)
SELECT 'ORGANIZATION_ADMIN', id FROM permissions WHERE permission_key LIKE 'course.%'
ON CONFLICT DO NOTHING;

-- Grant permissions to TRAINER
INSERT INTO role_permissions (role, permission_id)
SELECT 'TRAINER', id FROM permissions WHERE permission_key IN ('course.read', 'course.create', 'course.update')
ON CONFLICT DO NOTHING;
