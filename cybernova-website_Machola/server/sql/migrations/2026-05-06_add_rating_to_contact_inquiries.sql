-- Add rating support to contact inquiries and migrate legacy feedback rows.

BEGIN;

ALTER TABLE public.contact_inquiries
  ADD COLUMN IF NOT EXISTS rating INTEGER CHECK (rating >= 1 AND rating <= 5);

INSERT INTO public.contact_inquiries (
  name,
  email,
  phone,
  organization,
  job_title,
  country,
  issue_type,
  rating,
  description,
  status,
  submitted_at,
  updated_at
)
SELECT
  f.name,
  f.email,
  NULL,
  f.company,
  f.role,
  NULL,
  'general',
  f.rating,
  f.comment,
  COALESCE(f.status, 'pending'),
  f.created_at,
  f.updated_at
FROM public.feedback f
WHERE NOT EXISTS (
  SELECT 1
  FROM public.contact_inquiries ci
  WHERE ci.email = f.email
    AND COALESCE(ci.description, '') = COALESCE(f.comment, '')
    AND COALESCE(ci.organization, '') = COALESCE(f.company, '')
    AND COALESCE(ci.job_title, '') = COALESCE(f.role, '')
);

COMMIT;
