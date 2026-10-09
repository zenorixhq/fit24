-- =========================================================================
-- FIT24 PREMIUM FITNESS CLUB — SUPABASE POSTGRESQL DATABASE SCHEMA
-- Grand Opening: Sunday, 18 October 2026 (Kanhangad, Kasaragod)
-- =========================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. MEMBERS TABLE (Client CRM & Membership Lifecycle)
CREATE TABLE IF NOT EXISTS public.members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_code VARCHAR(20) UNIQUE NOT NULL, -- e.g. F24-1001
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(25) UNIQUE NOT NULL,
    email VARCHAR(100),
    gender VARCHAR(20) DEFAULT 'Other',
    tier VARCHAR(20) NOT NULL CHECK (tier IN ('PRO', 'PRIME', 'ELITE')),
    duration_months INT NOT NULL CHECK (duration_months IN (1, 3, 6, 12, 24)),
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    end_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'PAUSED', 'EXPIRED', 'TRANSFERRED')),
    amount_paid NUMERIC(10, 2) NOT NULL,
    
    -- Recovery Quotas from Brochure
    sauna_total INT NOT NULL DEFAULT 0,
    sauna_used INT NOT NULL DEFAULT 0,
    ice_bath_total INT NOT NULL DEFAULT 0,
    ice_bath_used INT NOT NULL DEFAULT 0,
    guest_passes_total INT NOT NULL DEFAULT 0,
    guest_passes_used INT NOT NULL DEFAULT 0,
    
    -- Café & Wallet Perks
    cafe_credit NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    cafe_discount INT NOT NULL DEFAULT 0,
    snooker_discount INT NOT NULL DEFAULT 0,
    
    -- Pause Engine Rules
    total_pause_allowed INT NOT NULL DEFAULT 0, -- 0, 15, 30, 45, 60 days
    pause_days_used INT NOT NULL DEFAULT 0,
    pause_blocks_used INT NOT NULL DEFAULT 0, -- max 2 blocks allowed
    is_paused BOOLEAN NOT NULL DEFAULT FALSE,
    current_pause_start DATE,
    
    -- Attendance Counters
    total_visits INT NOT NULL DEFAULT 0,
    last_checkin TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. ATTENDANCE LOGS (Fast Search & QR Check-in)
CREATE TABLE IF NOT EXISTS public.attendances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id UUID NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
    member_code VARCHAR(20) NOT NULL,
    name VARCHAR(100) NOT NULL,
    tier VARCHAR(20) NOT NULL,
    checkin_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    method VARCHAR(50) NOT NULL DEFAULT 'Fast Search', -- 'QR Pass Scanner', 'Fast Search', 'Biometric'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. FACILITY QUOTA USAGE (Sauna, Ice Bath, Guest Passes, Snooker)
CREATE TABLE IF NOT EXISTS public.facility_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id UUID NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
    member_code VARCHAR(20) NOT NULL,
    member_name VARCHAR(100) NOT NULL,
    facility_type VARCHAR(50) NOT NULL CHECK (facility_type IN ('Sauna', 'Ice Bath', 'Guest Pass', 'Snooker')),
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    remaining_text VARCHAR(100),
    staff_notes TEXT,
    staff_name VARCHAR(50) DEFAULT 'Reception Desk'
);

-- 4. CAFÉ & WALLET POS TRANSACTIONS
CREATE TABLE IF NOT EXISTS public.cafe_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id UUID NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
    member_code VARCHAR(20) NOT NULL,
    member_name VARCHAR(100) NOT NULL,
    tier VARCHAR(20) NOT NULL,
    items TEXT NOT NULL,
    bill_gross NUMERIC(10, 2) NOT NULL,
    discount_applied VARCHAR(50),
    net_paid NUMERIC(10, 2) NOT NULL,
    paid_via VARCHAR(50) NOT NULL, -- 'FIT24 Wallet Credit', 'UPI / Cash', 'Card'
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. MEMBERSHIP PAUSE AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.pause_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id UUID NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
    member_code VARCHAR(20) NOT NULL,
    pause_start_date DATE NOT NULL,
    pause_days INT NOT NULL,
    resume_date DATE,
    reason TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE_PAUSE' CHECK (status IN ('ACTIVE_PAUSE', 'RESUMED', 'CANCELLED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =========================================================================
-- INDEXES FOR FAST LOOKUP & SCANNING
-- =========================================================================
CREATE INDEX IF NOT EXISTS idx_members_code ON public.members(member_code);
CREATE INDEX IF NOT EXISTS idx_members_phone ON public.members(phone);
CREATE INDEX IF NOT EXISTS idx_members_status ON public.members(status);
CREATE INDEX IF NOT EXISTS idx_attendances_checkin ON public.attendances(checkin_time DESC);

-- =========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.facility_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cafe_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pause_logs ENABLE ROW LEVEL SECURITY;

-- Allow public read for member pass lookup (Members checking their pass on smartphone)
CREATE POLICY "Allow public read for pass lookup" 
ON public.members FOR SELECT 
USING (true);

-- Allow authenticated staff full access (or public during initial launch setup)
CREATE POLICY "Allow full access for authenticated staff" 
ON public.members FOR ALL 
USING (true);

CREATE POLICY "Allow full access for attendances" 
ON public.attendances FOR ALL 
USING (true);

CREATE POLICY "Allow full access for facility_logs" 
ON public.facility_logs FOR ALL 
USING (true);

CREATE POLICY "Allow full access for cafe_logs" 
ON public.cafe_logs FOR ALL 
USING (true);

CREATE POLICY "Allow full access for pause_logs" 
ON public.pause_logs FOR ALL 
USING (true);

-- =========================================================================
-- SEED SAMPLE MEMBERS (Matches Brochure Data)
-- =========================================================================
INSERT INTO public.members (
    member_code, name, phone, email, gender, tier, duration_months, start_date, end_date, 
    status, amount_paid, sauna_total, sauna_used, ice_bath_total, ice_bath_used, 
    guest_passes_total, guest_passes_used, cafe_credit, cafe_discount, snooker_discount, 
    total_pause_allowed, pause_days_used, pause_blocks_used, is_paused, total_visits
) VALUES 
('F24-1001', 'Rahul Nambiar', '+91 98471 23456', 'rahul.nambiar@gmail.com', 'Male', 'ELITE', 12, '2026-10-18', '2027-10-18', 'ACTIVE', 42999.00, 12, 3, 12, 4, 3, 1, 1650.00, 15, 15, 45, 0, 0, false, 14),
('F24-1002', 'Dr. Anjali Menon', '+91 94472 88990', 'anjali.menon@hospital.org', 'Female', 'PRIME', 6, '2026-10-18', '2027-04-18', 'ACTIVE', 17299.00, 6, 2, 6, 2, 2, 0, 750.00, 10, 10, 30, 0, 0, false, 8),
('F24-1003', 'Mohammed Shafi', '+91 97455 33221', 'shafi.k@enterprise.com', 'Male', 'PRO', 12, '2026-10-18', '2027-10-18', 'ACTIVE', 19999.00, 0, 0, 0, 0, 1, 1, 120.00, 0, 0, 45, 0, 0, false, 19),
('F24-1004', 'Sneha Rao', '+91 96330 11223', 'sneha.rao@design.in', 'Female', 'PRIME', 3, '2026-10-18', '2027-01-25', 'PAUSED', 9699.00, 6, 1, 6, 1, 2, 0, 900.00, 10, 10, 15, 7, 1, true, 4),
('F24-1005', 'Arjun Balakrishnan', '+91 94001 77665', 'arjun.b@techkasaragod.com', 'Male', 'ELITE', 24, '2026-10-18', '2028-10-18', 'ACTIVE', 77999.00, 12, 1, 12, 2, 3, 0, 2000.00, 15, 15, 60, 0, 0, false, 22)
ON CONFLICT (member_code) DO NOTHING;
