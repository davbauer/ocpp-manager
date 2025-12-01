-- Add soft delete support to charge_authorization table
ALTER TABLE charge_authorization ADD COLUMN deleted_at TIMESTAMPTZ DEFAULT NULL;

-- Create index for efficient filtering of non-deleted records
CREATE INDEX idx_charge_authorization_deleted_at ON charge_authorization(deleted_at) WHERE deleted_at IS NULL;
