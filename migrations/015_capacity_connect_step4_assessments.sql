-- 015_capacity_connect_step4_assessments.sql

CREATE TABLE IF NOT EXISTS org_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES org_courses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    instructions TEXT,
    duration_minutes INTEGER,
    passing_percentage INTEGER NOT NULL DEFAULT 60,
    max_attempts INTEGER NOT NULL DEFAULT 1,
    status VARCHAR(50) DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'PUBLISHED', 'CLOSED', 'ARCHIVED')),
    randomize_questions BOOLEAN DEFAULT false,
    randomize_options BOOLEAN DEFAULT false,
    show_results BOOLEAN DEFAULT true,
    allow_review BOOLEAN DEFAULT false,
    available_from TIMESTAMP WITH TIME ZONE,
    available_until TIMESTAMP WITH TIME ZONE,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS org_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    question_text TEXT NOT NULL,
    question_type VARCHAR(50) NOT NULL DEFAULT 'MCQ_SINGLE' CHECK (question_type IN ('MCQ_SINGLE', 'MCQ_MULTIPLE', 'TRUE_FALSE')),
    difficulty VARCHAR(50) DEFAULT 'MEDIUM' CHECK (difficulty IN ('EASY', 'MEDIUM', 'HARD')),
    explanation TEXT,
    points INTEGER NOT NULL DEFAULT 1 CHECK (points > 0),
    status VARCHAR(50) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'ARCHIVED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS org_question_options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id UUID NOT NULL REFERENCES org_questions(id) ON DELETE CASCADE,
    option_text TEXT NOT NULL,
    order_index INTEGER NOT NULL DEFAULT 0,
    is_correct BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS org_assessment_questions (
    assessment_id UUID NOT NULL REFERENCES org_assessments(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES org_questions(id) ON DELETE CASCADE,
    order_index INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (assessment_id, question_id)
);

CREATE TABLE IF NOT EXISTS org_assessment_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID NOT NULL REFERENCES org_assessments(id) ON DELETE CASCADE,
    trainee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    attempt_number INTEGER NOT NULL DEFAULT 1,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE,
    submitted_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) DEFAULT 'IN_PROGRESS' CHECK (status IN ('IN_PROGRESS', 'SUBMITTED', 'EXPIRED', 'CANCELLED')),
    score NUMERIC(5,2),
    percentage NUMERIC(5,2),
    is_passed BOOLEAN,
    snapshot_data JSONB, -- stores question points/passing percentage for historical integrity
    UNIQUE(assessment_id, trainee_id, attempt_number)
);

CREATE TABLE IF NOT EXISTS org_attempt_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    attempt_id UUID NOT NULL REFERENCES org_assessment_attempts(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES org_questions(id) ON DELETE CASCADE,
    selected_option_id UUID REFERENCES org_question_options(id) ON DELETE SET NULL,
    answered_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(attempt_id, question_id)
);

-- Insert new permissions for assessment management
INSERT INTO permissions (permission_key, description) VALUES 
('assessment.create', 'Create organization assessments'),
('assessment.read', 'Read organization assessments'),
('assessment.update', 'Update organization assessments'),
('assessment.delete', 'Delete/Archive organization assessments'),
('assessment.attempt', 'Attempt organization assessments')
ON CONFLICT (permission_key) DO NOTHING;

-- Grant permissions to ORGANIZATION_ADMIN
INSERT INTO role_permissions (role, permission_id)
SELECT 'ORGANIZATION_ADMIN', id FROM permissions WHERE permission_key LIKE 'assessment.%'
ON CONFLICT DO NOTHING;

-- Grant permissions to TRAINER
INSERT INTO role_permissions (role, permission_id)
SELECT 'TRAINER', id FROM permissions WHERE permission_key IN ('assessment.read', 'assessment.create', 'assessment.update')
ON CONFLICT DO NOTHING;
