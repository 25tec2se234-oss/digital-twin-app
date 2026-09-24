-- Step 5: DTV Competency Intelligence Engine
-- This migration establishes the granular structured competency framework, skills, mapping, levels, and verifiable evidence.

-- 1. Skills
-- Skills are specific, granular abilities (e.g. Python, SQL, Data Visualization)
CREATE TABLE IF NOT EXISTS org_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NULL REFERENCES organizations(id) ON DELETE CASCADE, -- Null means global skill available to all
    name VARCHAR(255) NOT NULL,
    code VARCHAR(100) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    status VARCHAR(50) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'ARCHIVED')),
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(organization_id, code) -- Code must be unique within org (or globally if org_id is null)
);

CREATE INDEX IF NOT EXISTS idx_org_skills_org_id ON org_skills(organization_id);
CREATE INDEX IF NOT EXISTS idx_org_skills_status ON org_skills(status);

-- 2. Competencies
-- Competencies are broader, measurable capabilities (e.g. Programming, Data Analysis)
CREATE TABLE IF NOT EXISTS org_competencies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NULL REFERENCES organizations(id) ON DELETE CASCADE, -- Null means global competency
    name VARCHAR(255) NOT NULL,
    code VARCHAR(100) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    status VARCHAR(50) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'ARCHIVED')),
    level_framework VARCHAR(100) DEFAULT 'DEFAULT_5_LEVEL', -- Allows different orgs to apply different rule engines
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(organization_id, code)
);

CREATE INDEX IF NOT EXISTS idx_org_competencies_org_id ON org_competencies(organization_id);
CREATE INDEX IF NOT EXISTS idx_org_competencies_status ON org_competencies(status);

-- 3. Competency-Skill Mappings
-- Maps granular skills to a competency with explicit configurable weighting.
CREATE TABLE IF NOT EXISTS org_competency_skills (
    competency_id UUID NOT NULL REFERENCES org_competencies(id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES org_skills(id) ON DELETE CASCADE,
    weight DECIMAL(5,2) DEFAULT 1.00, -- Multiplier for calculating competency score
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (competency_id, skill_id)
);

-- 4. Competency Levels (Framework Rules)
-- Defines what scores map to what descriptive levels for a specific framework.
CREATE TABLE IF NOT EXISTS org_competency_levels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NULL REFERENCES organizations(id) ON DELETE CASCADE,
    framework_code VARCHAR(100) NOT NULL DEFAULT 'DEFAULT_5_LEVEL',
    level_name VARCHAR(100) NOT NULL,
    level_order INTEGER NOT NULL,
    min_score DECIMAL(5,2) NOT NULL,
    max_score DECIMAL(5,2) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(organization_id, framework_code, level_order)
);

-- Default Level Data (Global)
INSERT INTO org_competency_levels (organization_id, framework_code, level_name, level_order, min_score, max_score, description)
VALUES 
  (NULL, 'DEFAULT_5_LEVEL', 'Awareness', 1, 0, 20, 'Understands basic concepts and terminology.'),
  (NULL, 'DEFAULT_5_LEVEL', 'Foundation', 2, 20.01, 40, 'Can perform basic tasks with guidance.'),
  (NULL, 'DEFAULT_5_LEVEL', 'Working', 3, 40.01, 60, 'Can independently perform expected tasks.'),
  (NULL, 'DEFAULT_5_LEVEL', 'Advanced', 4, 60.01, 80, 'Can solve complex problems and apply knowledge independently.'),
  (NULL, 'DEFAULT_5_LEVEL', 'Expert', 5, 80.01, 100, 'Can handle advanced problems, guide others and demonstrate deep mastery.')
ON CONFLICT DO NOTHING;

-- 5. Mappings for Evidence Generation (Courses and Assessments -> Skills)
-- Maps assessments (and later specific questions) to a skill
CREATE TABLE IF NOT EXISTS org_assessment_skills (
    assessment_id UUID NOT NULL REFERENCES org_assessments(id) ON DELETE CASCADE,
    question_id UUID NULL REFERENCES org_questions(id) ON DELETE CASCADE, -- If null, maps the whole assessment
    skill_id UUID NOT NULL REFERENCES org_skills(id) ON DELETE CASCADE,
    weight DECIMAL(5,2) DEFAULT 1.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (assessment_id, question_id, skill_id)
);

-- Maps courses to skills for learning-activity evidence
CREATE TABLE IF NOT EXISTS org_course_skills (
    course_id UUID NOT NULL REFERENCES org_courses(id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES org_skills(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (course_id, skill_id)
);

-- 6. Competency Evidence (Authoritative Proof)
-- Contains actual verifiable evidence linked to a trainee
CREATE TABLE IF NOT EXISTS org_competency_evidence (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    trainee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    competency_id UUID NULL REFERENCES org_competencies(id) ON DELETE CASCADE,
    skill_id UUID NULL REFERENCES org_skills(id) ON DELETE CASCADE,
    
    evidence_type VARCHAR(100) NOT NULL CHECK (evidence_type IN ('ASSESSMENT', 'COURSE_COMPLETION', 'LEARNING_ACTIVITY', 'CERTIFICATE', 'VERIFIED_QUALIFICATION', 'VERIFIED_EXPERIENCE', 'TRAINER_EVALUATION', 'MANUAL_EVALUATION', 'SELF_REPORTED')),
    source_id UUID NOT NULL, -- e.g., attempt_id, course_enrollment_id, evaluation_id
    evidence_value DECIMAL(8,2) NOT NULL, -- Raw value (e.g. 86.00 for percentage, 4 for 4/5)
    normalized_score DECIMAL(5,2) NOT NULL, -- Value normalized to 0-100 range
    
    confidence VARCHAR(50) DEFAULT 'MEDIUM' CHECK (confidence IN ('LOW', 'MEDIUM', 'HIGH', 'VERIFIED')),
    verification_status VARCHAR(50) DEFAULT 'VERIFIED' CHECK (verification_status IN ('UNVERIFIED', 'PENDING_VERIFICATION', 'VERIFIED', 'REJECTED')),
    
    observed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB, -- stores original snapshot data (like attempt IDs, correct counts, etc.)
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Ensure either competency_id or skill_id is provided
    CONSTRAINT check_evidence_target CHECK (competency_id IS NOT NULL OR skill_id IS NOT NULL),
    -- Idempotency check: Cannot have the same evidence from the same source twice
    UNIQUE (trainee_id, evidence_type, source_id, skill_id, competency_id)
);

CREATE INDEX IF NOT EXISTS idx_evidence_trainee ON org_competency_evidence(trainee_id);
CREATE INDEX IF NOT EXISTS idx_evidence_skill ON org_competency_evidence(skill_id);
CREATE INDEX IF NOT EXISTS idx_evidence_competency ON org_competency_evidence(competency_id);
CREATE INDEX IF NOT EXISTS idx_evidence_observed ON org_competency_evidence(observed_at);

-- 7. Competency Snapshots (Historical Profiling)
-- Preserves exactly what level/score a trainee had at a specific time, immune to future framework changes.
CREATE TABLE IF NOT EXISTS org_competency_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    trainee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    competency_id UUID NULL REFERENCES org_competencies(id) ON DELETE CASCADE,
    skill_id UUID NULL REFERENCES org_skills(id) ON DELETE CASCADE,
    
    score DECIMAL(5,2) NOT NULL, -- Final aggregated score (0-100)
    level_name VARCHAR(100) NULL, -- E.g., 'Advanced'
    level_order INTEGER NULL, -- E.g., 4
    confidence VARCHAR(50),
    evidence_count INTEGER DEFAULT 0,
    
    is_current BOOLEAN DEFAULT true, -- Only one snapshot per (trainee, competency/skill) is current
    snapshot_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT check_snapshot_target CHECK (competency_id IS NOT NULL OR skill_id IS NOT NULL)
);

CREATE INDEX IF NOT EXISTS idx_snapshots_trainee_current ON org_competency_snapshots(trainee_id, is_current);

-- 8. Trainer Evaluations (Manual Authoritative Proof)
CREATE TABLE IF NOT EXISTS org_trainer_evaluations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    trainee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    trainer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    competency_id UUID NULL REFERENCES org_competencies(id) ON DELETE CASCADE,
    skill_id UUID NULL REFERENCES org_skills(id) ON DELETE CASCADE,
    
    rating DECIMAL(5,2) NOT NULL,
    max_rating DECIMAL(5,2) NOT NULL DEFAULT 5.0,
    comments TEXT,
    
    status VARCHAR(50) DEFAULT 'PUBLISHED' CHECK (status IN ('DRAFT', 'PUBLISHED', 'REVOKED')),
    observed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT check_eval_target CHECK (competency_id IS NOT NULL OR skill_id IS NOT NULL)
);
