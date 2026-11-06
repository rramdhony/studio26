ALTER TABLE enquiries ADD COLUMN notify_attempts INTEGER;
ALTER TABLE enquiries ADD COLUMN notify_after TEXT;
CREATE INDEX idx_enquiries_created_at ON enquiries (created_at);
CREATE INDEX idx_enquiries_delivery ON enquiries (notification_status, notify_after) WHERE notify_attempts IS NOT NULL;
