-- Step 8: Organization Capacity Intelligence & Analytics Engine

CREATE TABLE IF NOT EXISTS org_capacity_insights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    
    insight_type VARCHAR(50) NOT NULL CHECK (insight_type IN ('OBSERVATION', 'TREND', 'GAP', 'TRAINING_DEMAND', 'CAPACITY_CONSTRAINT', 'DATA_QUALITY')),
    
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    
    source_metrics_json JSONB DEFAULT '{}'::jsonb,
    confidence VARCHAR(50) DEFAULT 'MEDIUM' CHECK (confidence IN ('LOW', 'MEDIUM', 'HIGH')),
    
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_org_capacity_insights_org ON org_capacity_insights(organization_id);
CREATE INDEX IF NOT EXISTS idx_org_capacity_insights_type ON org_capacity_insights(insight_type);
CREATE INDEX IF NOT EXISTS idx_org_capacity_insights_date ON org_capacity_insights(generated_at);
