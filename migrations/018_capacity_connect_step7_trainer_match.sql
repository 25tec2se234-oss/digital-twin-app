-- Step 7: AI Trainer Matching & Competency-Based Trainer Selection Engine

-- 1. Trainer Availability
CREATE TABLE IF NOT EXISTS org_trainer_availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    trainer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    available_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    timezone VARCHAR(50) DEFAULT 'UTC',
    
    status VARCHAR(50) DEFAULT 'AVAILABLE' CHECK (status IN ('AVAILABLE', 'UNAVAILABLE', 'PARTIALLY_AVAILABLE', 'ASSIGNED', 'BLOCKED')),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(trainer_id, available_date, start_time, end_time)
);
CREATE INDEX IF NOT EXISTS idx_trainer_avail_org_trainer ON org_trainer_availability(organization_id, trainer_id);
CREATE INDEX IF NOT EXISTS idx_trainer_avail_date ON org_trainer_availability(available_date);

-- 2. Trainer Matches
CREATE TABLE IF NOT EXISTS org_trainer_matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    training_need_id UUID NOT NULL REFERENCES org_training_needs(id) ON DELETE CASCADE,
    trainer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    overall_match_score DECIMAL(5,2) DEFAULT 0,
    
    competency_score DECIMAL(5,2) DEFAULT 0,
    skill_score DECIMAL(5,2) DEFAULT 0,
    qualification_score DECIMAL(5,2) DEFAULT 0,
    certification_score DECIMAL(5,2) DEFAULT 0,
    experience_score DECIMAL(5,2) DEFAULT 0,
    availability_score DECIMAL(5,2) DEFAULT 0,
    language_score DECIMAL(5,2) DEFAULT 0,
    workload_score DECIMAL(5,2) DEFAULT 0,
    performance_score DECIMAL(5,2) DEFAULT 0,
    
    mandatory_requirements_met BOOLEAN DEFAULT false,
    
    confidence VARCHAR(50) DEFAULT 'LOW' CHECK (confidence IN ('LOW', 'MEDIUM', 'HIGH', 'NONE')),
    match_status VARCHAR(50) DEFAULT 'ELIGIBLE' CHECK (match_status IN ('ELIGIBLE', 'PARTIALLY_MATCHED', 'INSUFFICIENT_EVIDENCE', 'INELIGIBLE', 'UNAVAILABLE')),
    
    explanation_json JSONB DEFAULT '{}'::jsonb, -- Deterministic score breakdown
    ai_explanation TEXT NULL, -- Optional generated text based strictly on explanation_json
    
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    engine_version VARCHAR(50) DEFAULT '1.0',
    
    UNIQUE(training_need_id, trainer_id)
);
CREATE INDEX IF NOT EXISTS idx_trainer_matches_need ON org_trainer_matches(training_need_id);
CREATE INDEX IF NOT EXISTS idx_trainer_matches_trainer ON org_trainer_matches(trainer_id);

-- 3. Trainer Assignments
CREATE TABLE IF NOT EXISTS org_trainer_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    training_need_id UUID NOT NULL REFERENCES org_training_needs(id) ON DELETE CASCADE,
    trainer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    assigned_by UUID REFERENCES users(id) ON DELETE SET NULL,
    
    status VARCHAR(50) DEFAULT 'PENDING_REVIEW' CHECK (status IN ('PENDING_REVIEW', 'ASSIGNED', 'ACCEPTED', 'DECLINED')),
    reason_declined TEXT NULL,
    assignment_reason TEXT NULL, -- Why admin assigned this trainer
    
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    responded_at TIMESTAMP WITH TIME ZONE NULL,
    
    UNIQUE(training_need_id, trainer_id)
);
CREATE INDEX IF NOT EXISTS idx_trainer_assign_need ON org_trainer_assignments(training_need_id);
CREATE INDEX IF NOT EXISTS idx_trainer_assign_trainer ON org_trainer_assignments(trainer_id);
