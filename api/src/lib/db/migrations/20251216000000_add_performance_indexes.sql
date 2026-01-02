CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_telemetry_transaction_id 
ON telemetry(transaction_id) WHERE transaction_id IS NOT NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_telemetry_meter_value_gin 
ON telemetry USING GIN (meter_value jsonb_path_ops);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_transaction_connector_id 
ON transaction(connector_id);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_transaction_start_time 
ON transaction(start_time DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_charge_authorization_charger_rfid 
ON charge_authorization(charger_id, rfid_tag_id) WHERE deleted_at IS NULL;
