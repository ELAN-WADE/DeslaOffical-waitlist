-- ==============================================================================
-- DESLA LUXURY ATELIER — SUPABASE POSTGRESQL SERVERLESS SCHEMA
-- ==============================================================================
-- Version: 1.0.0
-- Target: Supabase PostgreSQL (Serverless / Connection Pooled)
-- Description: Complete schema for Waitlist VIP Queue, Transactional Outbox,
--              Row-Level Security (RLS), Sequences, and Atomic Stored Procedures.
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. SEQUENTIAL VIP QUEUE NUMBER GENERATOR
-- Guarantees atomic, strictly sequential priority numbering (starts at #1421)
-- Immune to race conditions under thousands of concurrent serverless requests.
CREATE SEQUENCE IF NOT EXISTS waitlist_queue_seq
  START WITH 1421
  INCREMENT BY 1
  NO MINVALUE
  NO MAXVALUE
  CACHE 1;

-- 3. WAITLIST TABLE
CREATE TABLE IF NOT EXISTS public.waitlist (
  id TEXT PRIMARY KEY DEFAULT ('usr_' || extract(epoch from now())::bigint || '_' || substr(md5(random()::text), 1, 6)),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  city TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('shopper', 'creator', 'distributor', 'partner', 'ambassador')),
  skin_concern TEXT,
  creator_handle TEXT,
  creator_platform TEXT,
  distributor_business TEXT,
  distributor_volume TEXT,
  partner_organization TEXT,
  partner_focus TEXT,
  queue_number BIGINT NOT NULL UNIQUE DEFAULT nextval('waitlist_queue_seq'),
  referral_code TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'verified', 'archived')),
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Performance & Query Indexes
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON public.waitlist(email);
CREATE INDEX IF NOT EXISTS idx_waitlist_role ON public.waitlist(role);
CREATE INDEX IF NOT EXISTS idx_waitlist_queue ON public.waitlist(queue_number DESC);
CREATE INDEX IF NOT EXISTS idx_waitlist_created ON public.waitlist(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_waitlist_referral ON public.waitlist(referral_code);

-- 4. TRANSACTIONAL EMAIL OUTBOX TABLE
-- Implements the Transactional Outbox Pattern to guarantee zero lost emails
CREATE TABLE IF NOT EXISTS public.email_jobs (
  id TEXT PRIMARY KEY DEFAULT ('job_' || extract(epoch from now())::bigint || '_' || substr(md5(random()::text), 1, 6)),
  waitlist_id TEXT NOT NULL REFERENCES public.waitlist(id) ON DELETE CASCADE,
  recipient_email TEXT NOT NULL,
  recipient_name TEXT NOT NULL,
  role TEXT NOT NULL,
  subject TEXT NOT NULL,
  template_type TEXT NOT NULL,
  payload_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'sent', 'failed')),
  attempts INTEGER NOT NULL DEFAULT 0,
  max_attempts INTEGER NOT NULL DEFAULT 3,
  last_error TEXT,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Outbox Worker Indexes
CREATE INDEX IF NOT EXISTS idx_email_jobs_status ON public.email_jobs(status, attempts);
CREATE INDEX IF NOT EXISTS idx_email_jobs_waitlist_id ON public.email_jobs(waitlist_id);
CREATE INDEX IF NOT EXISTS idx_email_jobs_created ON public.email_jobs(created_at ASC);

-- 5. ROW-LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_jobs ENABLE ROW LEVEL SECURITY;

-- Waitlist RLS Policies
-- Allow public anon insertions (signup forms)
CREATE POLICY "Public anon can submit waitlist application" 
  ON public.waitlist FOR INSERT 
  TO anon, authenticated 
  WITH CHECK (true);

-- Allow public read of non-sensitive waitlist queue count (via security definer functions)
-- Protect individual PII (full name, email, phone) from public SELECT
CREATE POLICY "Public cannot read other member details" 
  ON public.waitlist FOR SELECT 
  TO anon, authenticated 
  USING (false);

-- Service role has full unrestricted administrative access
CREATE POLICY "Service role full access on waitlist" 
  ON public.waitlist FOR ALL 
  TO service_role 
  USING (true) 
  WITH CHECK (true);

-- Email Jobs RLS Policies
-- Only service role & edge functions can read/write outbox
CREATE POLICY "Service role full access on email_jobs" 
  ON public.email_jobs FOR ALL 
  TO service_role 
  USING (true) 
  WITH CHECK (true);

-- 6. DEDUPLICATED ADMIN VIEW (Latest Email Job Status per Member)
CREATE OR REPLACE VIEW public.v_waitlist_admin AS
SELECT 
  w.id,
  w.full_name,
  w.email,
  w.city,
  w.role,
  w.skin_concern,
  w.creator_handle,
  w.creator_platform,
  w.distributor_business,
  w.distributor_volume,
  w.partner_organization,
  w.partner_focus,
  w.queue_number,
  w.referral_code,
  w.status,
  w.status as member_status,
  w.created_at,
  w.updated_at,
  ej.id as latest_job_id,
  ej.status as email_status,
  ej.attempts as email_attempts,
  ej.sent_at as email_sent_at,
  ej.last_error as email_error
FROM public.waitlist w
LEFT JOIN LATERAL (
  SELECT id, status, attempts, sent_at, last_error
  FROM public.email_jobs
  WHERE waitlist_id = w.id
  ORDER BY created_at DESC
  LIMIT 1
) ej ON true
ORDER BY w.queue_number DESC;

-- 7. ATOMIC STORED PROCEDURE: RESERVE WAITLIST SPOT
-- Performs atomic validation, sequence reservation, duplicate check, and outbox enqueue in ONE ACID transaction.
CREATE OR REPLACE FUNCTION public.reserve_waitlist_spot(
  p_full_name TEXT,
  p_email TEXT,
  p_city TEXT,
  p_role TEXT,
  p_skin_concern TEXT DEFAULT NULL,
  p_creator_handle TEXT DEFAULT NULL,
  p_creator_platform TEXT DEFAULT NULL,
  p_distributor_business TEXT DEFAULT NULL,
  p_distributor_volume TEXT DEFAULT NULL,
  p_partner_organization TEXT DEFAULT NULL,
  p_partner_focus TEXT DEFAULT NULL,
  p_ip_address TEXT DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_existing RECORD;
  v_new_id TEXT;
  v_queue_num BIGINT;
  v_referral_code TEXT;
  v_job_id TEXT;
  v_subject TEXT;
  v_payload JSONB;
BEGIN
  -- Normalize email
  p_email := LOWER(TRIM(p_email));
  p_full_name := TRIM(p_full_name);

  -- 1. Check if email already registered
  SELECT * INTO v_existing FROM public.waitlist WHERE email = p_email;

  IF FOUND THEN
    -- Update existing record with refreshed role preferences
    UPDATE public.waitlist SET
      full_name = p_full_name,
      city = p_city,
      role = p_role,
      skin_concern = p_skin_concern,
      creator_handle = p_creator_handle,
      creator_platform = p_creator_platform,
      distributor_business = p_distributor_business,
      distributor_volume = p_distributor_volume,
      partner_organization = p_partner_organization,
      partner_focus = p_partner_focus,
      updated_at = timezone('utc'::text, now())
    WHERE id = v_existing.id;

    -- Generate personalized email subject
    IF p_role = 'creator' THEN
      v_subject := 'Desla Creator Atelier — VIP Waitlist Confirmation (Queue #' || v_existing.queue_number || ')';
    ELSIF p_role = 'distributor' THEN
      v_subject := 'Desla Commercial & Distribution Allocation Confirmed (Queue #' || v_existing.queue_number || ')';
    ELSIF p_role = 'partner' THEN
      v_subject := 'Desla Brand & Formulation Partnership Confirmed (Queue #' || v_existing.queue_number || ')';
    ELSE
      v_subject := 'Welcome to Desla — Your Place Is Reserved (Queue #' || v_existing.queue_number || ')';
    END IF;

    v_job_id := 'job_' || extract(epoch from now())::bigint || '_' || substr(md5(random()::text), 1, 6);

    v_payload := jsonb_build_object(
      'fullName', p_full_name,
      'email', v_existing.email,
      'role', p_role,
      'queueNumber', v_existing.queue_number,
      'referralCode', v_existing.referral_code,
      'city', p_city,
      'skinConcern', p_skin_concern,
      'creatorHandle', p_creator_handle,
      'creatorPlatform', p_creator_platform,
      'distributorBusiness', p_distributor_business,
      'distributorVolume', p_distributor_volume,
      'partnerOrganization', p_partner_organization,
      'partnerFocus', p_partner_focus
    );

    INSERT INTO public.email_jobs (
      id, waitlist_id, recipient_email, recipient_name, role, subject, template_type, payload_json, status, attempts, max_attempts
    ) VALUES (
      v_job_id, v_existing.id, v_existing.email, p_full_name, p_role, v_subject, 'welcome_' || p_role, v_payload, 'pending', 0, 3
    );

    RETURN jsonb_build_object(
      'is_existing', true,
      'job_id', v_job_id,
      'entry', jsonb_build_object(
        'id', v_existing.id,
        'fullName', p_full_name,
        'email', v_existing.email,
        'city', p_city,
        'role', p_role,
        'skinConcern', p_skin_concern,
        'creatorHandle', p_creator_handle,
        'creatorPlatform', p_creator_platform,
        'distributorBusiness', p_distributor_business,
        'distributorVolume', p_distributor_volume,
        'partnerOrganization', p_partner_organization,
        'partnerFocus', p_partner_focus,
        'queueNumber', v_existing.queue_number,
        'referralCode', v_existing.referral_code,
        'status', v_existing.status,
        'timestamp', to_char(v_existing.created_at, 'Mon DD, YYYY')
      )
    );
  END IF;

  -- 2. New reservation: Draw atomic sequential queue number
  v_queue_num := nextval('waitlist_queue_seq');
  v_new_id := 'usr_' || extract(epoch from now())::bigint || '_' || substr(md5(random()::text), 1, 6);

  -- Generate collision-free referral code (DLS-XXXXX)
  LOOP
    v_referral_code := 'DLS-' || upper(substr(md5(random()::text), 1, 5));
    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.waitlist WHERE referral_code = v_referral_code);
  END LOOP;

  INSERT INTO public.waitlist (
    id, full_name, email, city, role, skin_concern,
    creator_handle, creator_platform, distributor_business, distributor_volume,
    partner_organization, partner_focus, queue_number, referral_code,
    status, ip_address, user_agent
  ) VALUES (
    v_new_id, p_full_name, p_email, p_city, p_role, p_skin_concern,
    p_creator_handle, p_creator_platform, p_distributor_business, p_distributor_volume,
    p_partner_organization, p_partner_focus, v_queue_num, v_referral_code,
    'confirmed', p_ip_address, p_user_agent
  );

  -- Enqueue transactional email job
  IF p_role = 'creator' THEN
    v_subject := 'Desla Creator Atelier — VIP Waitlist Confirmation (Queue #' || v_queue_num || ')';
  ELSIF p_role = 'distributor' THEN
    v_subject := 'Desla Commercial & Distribution Allocation Confirmed (Queue #' || v_queue_num || ')';
  ELSIF p_role = 'partner' THEN
    v_subject := 'Desla Brand & Formulation Partnership Confirmed (Queue #' || v_queue_num || ')';
  ELSE
    v_subject := 'Welcome to Desla — Your Place Is Reserved (Queue #' || v_queue_num || ')';
  END IF;

  v_job_id := 'job_' || extract(epoch from now())::bigint || '_' || substr(md5(random()::text), 1, 6);

  v_payload := jsonb_build_object(
    'fullName', p_full_name,
    'email', p_email,
    'role', p_role,
    'queueNumber', v_queue_num,
    'referralCode', v_referral_code,
    'city', p_city,
    'skinConcern', p_skin_concern,
    'creatorHandle', p_creator_handle,
    'creatorPlatform', p_creator_platform,
    'distributorBusiness', p_distributor_business,
    'distributorVolume', p_distributor_volume,
    'partnerOrganization', p_partner_organization,
    'partnerFocus', p_partner_focus
  );

  INSERT INTO public.email_jobs (
    id, waitlist_id, recipient_email, recipient_name, role, subject, template_type, payload_json, status, attempts, max_attempts
  ) VALUES (
    v_job_id, v_new_id, p_email, p_full_name, p_role, v_subject, 'welcome_' || p_role, v_payload, 'pending', 0, 3
  );

  RETURN jsonb_build_object(
    'is_existing', false,
    'job_id', v_job_id,
    'entry', jsonb_build_object(
      'id', v_new_id,
      'fullName', p_full_name,
      'email', p_email,
      'city', p_city,
      'role', p_role,
      'skinConcern', p_skin_concern,
      'creatorHandle', p_creator_handle,
      'creatorPlatform', p_creator_platform,
      'distributorBusiness', p_distributor_business,
      'distributorVolume', p_distributor_volume,
      'partnerOrganization', p_partner_organization,
      'partnerFocus', p_partner_focus,
      'queueNumber', v_queue_num,
      'referralCode', v_referral_code,
      'status', 'confirmed',
      'timestamp', to_char(timezone('utc'::text, now()), 'Mon DD, YYYY')
    )
  );
END;
$$;

-- 8. ATOMIC STORED PROCEDURE: QUEUE BROADCAST ANNOUNCEMENT
CREATE OR REPLACE FUNCTION public.queue_broadcast_announcement(
  p_subject TEXT,
  p_headline TEXT,
  p_message_body TEXT,
  p_target_role TEXT DEFAULT 'all',
  p_cta_text TEXT DEFAULT NULL,
  p_cta_url TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_rec RECORD;
  v_count INTEGER := 0;
  v_job_id TEXT;
  v_payload JSONB;
BEGIN
  FOR v_rec IN 
    SELECT * FROM public.waitlist 
    WHERE (p_target_role = 'all' OR role = p_target_role)
    ORDER BY queue_number ASC
  LOOP
    v_job_id := 'bcast_' || extract(epoch from now())::bigint || '_' || substr(md5(random()::text), 1, 6);
    
    v_payload := jsonb_build_object(
      'fullName', v_rec.full_name,
      'email', v_rec.email,
      'role', v_rec.role,
      'queueNumber', v_rec.queue_number,
      'referralCode', v_rec.referral_code,
      'city', COALESCE(v_rec.city, 'Lagos'),
      'templateType', 'broadcast',
      'customSubject', TRIM(p_subject),
      'customHeadline', TRIM(p_headline),
      'messageBody', TRIM(p_message_body),
      'callToActionText', NULLIF(TRIM(p_cta_text), ''),
      'callToActionUrl', NULLIF(TRIM(p_cta_url), '')
    );

    INSERT INTO public.email_jobs (
      id, waitlist_id, recipient_email, recipient_name, role, subject, template_type, payload_json, status, attempts, max_attempts
    ) VALUES (
      v_job_id, v_rec.id, v_rec.email, v_rec.full_name, v_rec.role, TRIM(p_subject), 'broadcast', v_payload, 'pending', 0, 3
    );

    v_count := v_count + 1;
  END LOOP;

  RETURN jsonb_build_object(
    'success', true,
    'queuedCount', v_count
  );
END;
$$;

-- 9. ATOMIC TELEMETRY STATS FUNCTION
CREATE OR REPLACE FUNCTION public.get_waitlist_stats()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_total BIGINT;
  v_latest_queue BIGINT;
  v_roles JSONB;
BEGIN
  SELECT count(*) INTO v_total FROM public.waitlist;
  SELECT COALESCE(max(queue_number), 1420) INTO v_latest_queue FROM public.waitlist;
  
  SELECT jsonb_agg(r) INTO v_roles FROM (
    SELECT role, count(*)::int as count 
    FROM public.waitlist 
    GROUP BY role
  ) r;

  RETURN jsonb_build_object(
    'totalJoined', v_total,
    'displayTotal', v_total + 1420,
    'latestQueue', v_latest_queue,
    'roles', COALESCE(v_roles, '[]'::jsonb)
  );
END;
$$;

-- 10. SEQUENCE SYNCHRONIZATION RPC (For Data Migrations)
CREATE OR REPLACE FUNCTION public.set_queue_sequence(p_next_val BIGINT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  PERFORM setval('waitlist_queue_seq', p_next_val, false);
END;
$$;

