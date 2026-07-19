ALTER TABLE payment_consents ADD COLUMN IF NOT EXISTS age_and_parental_consent BOOLEAN DEFAULT FALSE;
