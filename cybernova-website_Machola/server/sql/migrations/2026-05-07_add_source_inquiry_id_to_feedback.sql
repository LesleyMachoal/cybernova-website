-- Link approved feedback back to the inquiry that generated it.

BEGIN;

ALTER TABLE public.feedback
  ADD COLUMN IF NOT EXISTS source_inquiry_id BIGINT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_feedback_source_inquiry_id
  ON public.feedback(source_inquiry_id);

COMMIT;