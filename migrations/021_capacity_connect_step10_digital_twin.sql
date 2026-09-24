-- Step 10: Organizational Digital Twin & Enterprise AI

CREATE TABLE IF NOT EXISTS org_digital_twin_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    
    -- Coverage / Confidence
    data_coverage NUMERIC(5,2) DEFAULT 0,
    evidence_coverage NUMERIC(5,2) DEFAULT 0,
    competency_coverage NUMERIC(5,2) DEFAULT 0,
    learning_coverage NUMERIC(5,2) DEFAULT 0,
    confidence VARCHAR(50) DEFAULT 'LOW' CHECK (confidence IN ('LOW', 'MEDIUM', 'HIGH')),
    
    -- State Payloads (Cached aggregates)
    workforce_state JSONB DEFAULT '{}'::jsonb,
    competency_state JSONB DEFAULT '{}'::jsonb,
    training_state JSONB DEFAULT '{}'::jsonb,
    learning_state JSONB DEFAULT '{}'::jsonb,
    certification_state JSONB DEFAULT '{}'::jsonb,
    
    snapshot_version VARCHAR(50) DEFAULT '1.0',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_org_digital_twin_snapshots_org ON org_digital_twin_snapshots(organization_id);

CREATE TABLE IF NOT EXISTS org_ai_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    query_text TEXT NOT NULL,
    ai_response JSONB NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb, -- e.g. sources, grounding
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_org_ai_conversations_org_user ON org_ai_conversations(organization_id, user_id);
