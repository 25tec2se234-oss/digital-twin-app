CREATE TABLE IF NOT EXISTS org_ai_query_logs (
    id SERIAL PRIMARY KEY,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    model_service VARCHAR(255) NOT NULL,
    success BOOLEAN NOT NULL DEFAULT true,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_org_ai_query_logs_org_id ON org_ai_query_logs(organization_id);
CREATE INDEX IF NOT EXISTS idx_org_ai_query_logs_user_id ON org_ai_query_logs(user_id);
