ALTER TABLE enquiries ADD COLUMN idempotency_key TEXT;
ALTER TABLE enquiries ADD COLUMN source TEXT NOT NULL DEFAULT 'contact_form';
ALTER TABLE enquiries ADD COLUMN notification_status TEXT NOT NULL DEFAULT 'pending';

CREATE UNIQUE INDEX idx_enquiries_idempotency
  ON enquiries (idempotency_key)
  WHERE idempotency_key IS NOT NULL;
