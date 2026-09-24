-- Step 6: AI Skill Gap & Training Need Analysis Engine

-- 1. Roles (Job Positions)
CREATE TABLE IF NOT EXISTS org_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    department VARCHAR(255),
    status VARCHAR(50) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'ARCHIVED')),
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(organization_id, name)
);

CREATE INDEX IF NOT EXISTS idx_org_roles_org_id ON org_roles(organization_id);
CREATE INDEX IF NOT EXISTS idx_org_roles_status ON org_roles(status);

-- 2. User Roles Mapping (Trainees assigned to roles)
CREATE TABLE IF NOT EXISTS org_user_roles (
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES org_roles(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    assigned_by UUID REFERENCES users(id) ON DELETE SET NULL,
    PRIMARY KEY (organization_id, user_id, role_id)
);

-- 3. Competency Requirements
CREATE TABLE IF NOT EXISTS org_competency_requirements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    target_type VARCHAR(50) NOT NULL CHECK (target_type IN ('ROLE', 'TRAINING_PROGRAM', 'COURSE', 'ORGANIZATION', 'INDIVIDUAL')),
    target_id UUID NOT NULL, -- e.g., role_id
    competency_id UUID NULL REFERENCES org_competencies(id) ON DELETE CASCADE,
    skill_id UUID NULL REFERENCES org_skills(id) ON DELETE CASCADE,
    
    required_level VARCHAR(100), -- Matches org_competency_levels.level_name
    required_score DECIMAL(5,2), -- Numeric score requirement
    importance VARCHAR(50) DEFAULT 'MEDIUM' CHECK (importance IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    mandatory BOOLEAN DEFAULT false,
    
    effective_from TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    effective_until TIMESTAMP WITH TIME ZONE NULL,
    
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT check_requirement_target CHECK (competency_id IS NOT NULL OR skill_id IS NOT NULL),
    UNIQUE(organization_id, target_type, target_id, competency_id, skill_id)
);

CREATE INDEX IF NOT EXISTS idx_requirements_target ON org_competency_requirements(target_type, target_id);

-- 4. Skill Gaps (Calculated Output)
CREATE TABLE IF NOT EXISTS org_skill_gaps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    trainee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    target_type VARCHAR(50) NOT NULL,
    target_id UUID NOT NULL,
    
    competency_id UUID NULL REFERENCES org_competencies(id) ON DELETE CASCADE,
    skill_id UUID NULL REFERENCES org_skills(id) ON DELETE CASCADE,
    
    current_score DECIMAL(5,2),
    required_score DECIMAL(5,2),
    score_gap DECIMAL(5,2),
    
    current_level VARCHAR(100),
    required_level VARCHAR(100),
    level_gap INTEGER, -- e.g. -2 means 2 levels below
    
    gap_type VARCHAR(50) NOT NULL CHECK (gap_type IN ('NO_GAP', 'SCORE_GAP', 'LEVEL_GAP', 'EVIDENCE_GAP', 'STALE_EVIDENCE')),
    priority VARCHAR(50) NOT NULL CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL', 'NONE')),
    
    confidence VARCHAR(50), -- Inherited from current competency snapshot
    evidence_recency TIMESTAMP WITH TIME ZONE,
    
    is_current BOOLEAN DEFAULT true, -- Only one active gap calculation per context
    status VARCHAR(50) DEFAULT 'IDENTIFIED' CHECK (status IN ('IDENTIFIED', 'RESOLVED', 'DISMISSED')),
    
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP WITH TIME ZONE NULL,
    
    CONSTRAINT check_gap_target CHECK (competency_id IS NOT NULL OR skill_id IS NOT NULL)
);

CREATE INDEX IF NOT EXISTS idx_skill_gaps_trainee ON org_skill_gaps(trainee_id, is_current);
CREATE INDEX IF NOT EXISTS idx_skill_gaps_target ON org_skill_gaps(target_type, target_id);

-- 5. Training Needs
CREATE TABLE IF NOT EXISTS org_training_needs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    trainee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    target_type VARCHAR(50) NOT NULL,
    target_id UUID NOT NULL,
    competency_id UUID NULL REFERENCES org_competencies(id) ON DELETE CASCADE,
    skill_id UUID NULL REFERENCES org_skills(id) ON DELETE CASCADE,
    
    priority VARCHAR(50) NOT NULL CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    reason TEXT, -- Deterministic explanation generated by the engine
    ai_explanation TEXT NULL, -- Optional AI generated context
    
    status VARCHAR(50) DEFAULT 'IDENTIFIED' CHECK (status IN ('IDENTIFIED', 'RECOMMENDED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'DISMISSED')),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT check_need_target CHECK (competency_id IS NOT NULL OR skill_id IS NOT NULL)
);

-- 6. Training Recommendations (Maps Need to Course)
CREATE TABLE IF NOT EXISTS org_training_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    training_need_id UUID NOT NULL REFERENCES org_training_needs(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES org_courses(id) ON DELETE CASCADE,
    
    matching_score DECIMAL(5,2), -- Represents algorithmic relevance (0-100)
    match_factors JSONB, -- Details on why this matched (e.g. {"skill_match": true, "level_match": false})
    
    ai_rationale TEXT NULL, -- Optional explanation for the recommendation
    
    status VARCHAR(50) DEFAULT 'SUGGESTED' CHECK (status IN ('SUGGESTED', 'SELECTED', 'REJECTED')),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(training_need_id, course_id)
);
