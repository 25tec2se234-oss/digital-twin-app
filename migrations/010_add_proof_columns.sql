-- 010_add_proof_columns.sql

ALTER TABLE orders ADD COLUMN IF NOT EXISTS mobile_number VARCHAR(255);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS proof_file_path TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS user_name VARCHAR(255);
