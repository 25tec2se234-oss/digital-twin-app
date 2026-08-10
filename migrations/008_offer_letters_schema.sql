CREATE TABLE IF NOT EXISTS offer_company_settings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name text NOT NULL DEFAULT 'Digital Twin Verse',
    brand_name text DEFAULT 'DTV',
    legal_entity_name text,
    company_logo text,
    company_address text,
    company_email text,
    company_phone text,
    website text DEFAULT 'https://digitaltwinvrs.com/',
    cin text,
    gstin text,
    tagline text,
    offer_prefix text DEFAULT 'DTV-OFR',
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS offer_signatories (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    designation text NOT NULL,
    email text,
    phone text,
    signature_url text,
    signature_type text DEFAULT 'typed',
    display_order integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS offer_templates (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    design_type text NOT NULL,
    default_clauses jsonb,
    is_active boolean DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS offer_letters (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    offer_id text UNIQUE NOT NULL,
    verification_token text UNIQUE NOT NULL,
    candidate_details jsonb NOT NULL,
    position_details jsonb NOT NULL,
    compensation_details jsonb NOT NULL,
    responsibilities jsonb,
    clauses jsonb,
    status text NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'GENERATED', 'SENT', 'ACCEPTED', 'DECLINED', 'EXPIRED', 'REVOKED')),
    signatory_id uuid REFERENCES offer_signatories(id) ON DELETE SET NULL,
    template_id uuid REFERENCES offer_templates(id) ON DELETE SET NULL,
    created_by uuid REFERENCES users(id) ON DELETE SET NULL,
    accepted_at timestamptz,
    accepted_ip text,
    accepted_signature text,
    declined_at timestamptz,
    declined_reason text,
    revoked_at timestamptz,
    expires_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS offer_audit_logs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    offer_id uuid REFERENCES offer_letters(id) ON DELETE CASCADE,
    action text NOT NULL,
    user_id uuid REFERENCES users(id) ON DELETE SET NULL,
    ip_address text,
    created_at timestamptz NOT NULL DEFAULT now()
);

-- Index for searching
CREATE INDEX IF NOT EXISTS idx_offer_letters_status ON offer_letters(status);
CREATE INDEX IF NOT EXISTS idx_offer_letters_created_by ON offer_letters(created_by);
CREATE INDEX IF NOT EXISTS idx_offer_verification_token ON offer_letters(verification_token);
