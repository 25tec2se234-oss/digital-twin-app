CREATE TABLE IF NOT EXISTS payment_consents (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255),
    terms_version VARCHAR(50) NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    user_agent TEXT,
    refund_accepted BOOLEAN NOT NULL,
    dispute_accepted BOOLEAN NOT NULL,
    fraud_logging_accepted BOOLEAN NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_payment_consents_user_id ON payment_consents(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_consents_ip ON payment_consents(ip_address);
