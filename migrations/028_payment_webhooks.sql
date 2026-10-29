-- 028_payment_webhooks.sql
-- Webhook audit trail and payment idempotency safeguards

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS payment_webhooks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id VARCHAR(255) UNIQUE NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    razorpay_order_id VARCHAR(255),
    razorpay_payment_id VARCHAR(255),
    payload JSONB NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PROCESSED' CHECK (status IN ('PROCESSED', 'IGNORED', 'FAILED')),
    error_message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payment_webhooks_event_id ON payment_webhooks(event_id);
CREATE INDEX IF NOT EXISTS idx_payment_webhooks_type ON payment_webhooks(event_type);
CREATE INDEX IF NOT EXISTS idx_payment_webhooks_order ON payment_webhooks(razorpay_order_id);
CREATE INDEX IF NOT EXISTS idx_payment_webhooks_created ON payment_webhooks(created_at DESC);

-- Ensure orders table has unique payment ID constraint to prevent double-claiming
CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_payment_id_unique 
ON orders(razorpay_payment_id) 
WHERE razorpay_payment_id IS NOT NULL AND status = 'paid';
