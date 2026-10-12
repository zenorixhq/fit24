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

-- =========================================================================
-- 6. GST TAX INVOICES TABLE
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    member_code VARCHAR(20),
    member_name VARCHAR(150) NOT NULL,
    tier VARCHAR(50) DEFAULT 'PRO',
    duration_months INT DEFAULT 1,
    gross_amount DECIMAL(10, 2) NOT NULL,
    base_amount DECIMAL(10, 2) NOT NULL,
    cgst DECIMAL(10, 2) NOT NULL,
    sgst DECIMAL(10, 2) NOT NULL,
    paid_via VARCHAR(50) DEFAULT 'UPI',
    payment_ref VARCHAR(100),
    issued_date DATE DEFAULT CURRENT_DATE,
    items_description TEXT,
    status VARCHAR(30) DEFAULT 'PAID',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow full access for invoices" ON public.invoices FOR ALL USING (true);

-- =========================================================================
-- 7. BIOMETRICS LOG TABLE
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.biometrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_code VARCHAR(20),
    recorded_date DATE DEFAULT CURRENT_DATE,
    weight_kg DECIMAL(5, 2) NOT NULL,
    body_fat_percentage DECIMAL(5, 2),
    muscle_mass_kg DECIMAL(5, 2),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.biometrics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow full access for biometrics" ON public.biometrics FOR ALL USING (true);

-- =========================================================================
-- 8. TRAINERS & COACHES DIRECTORY
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.trainers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    title VARCHAR(100) NOT NULL,
    specialty VARCHAR(150) NOT NULL,
    bio TEXT,
    phone VARCHAR(25),
    photo_url TEXT,
    badge VARCHAR(50) DEFAULT 'COACH',
    badge_color VARCHAR(30) DEFAULT 'red',
    per_session_rate DECIMAL(10, 2) DEFAULT 500.00,
    classes_taught TEXT[],
    is_active BOOLEAN DEFAULT true,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.trainers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read for trainers" ON public.trainers FOR SELECT USING (true);
CREATE POLICY "Allow full access for trainers" ON public.trainers FOR ALL USING (true);

-- Member Table Columns for Trainer Roster & PT Sessions
ALTER TABLE public.members ADD COLUMN IF NOT EXISTS assigned_trainer_id UUID;
ALTER TABLE public.members ADD COLUMN IF NOT EXISTS pt_sessions_total INT DEFAULT 0;
ALTER TABLE public.members ADD COLUMN IF NOT EXISTS pt_sessions_used INT DEFAULT 0;
ALTER TABLE public.members ADD COLUMN IF NOT EXISTS emergency_contact VARCHAR(150);
ALTER TABLE public.members ADD COLUMN IF NOT EXISTS medical_alerts TEXT;
ALTER TABLE public.members ADD COLUMN IF NOT EXISTS blood_group VARCHAR(10);
ALTER TABLE public.members ADD COLUMN IF NOT EXISTS workout_plan JSONB;
ALTER TABLE public.members ADD COLUMN IF NOT EXISTS daily_habits JSONB;
ALTER TABLE public.members ADD COLUMN IF NOT EXISTS circumferences JSONB;
ALTER TABLE public.members ADD COLUMN IF NOT EXISTS diet_targets JSONB;
ALTER TABLE public.members ADD COLUMN IF NOT EXISTS transformation_photos JSONB;

-- =========================================================================
-- 9. ATHLETE SUNDAY CHECK-INS & COACH REVIEWS
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.check_ins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id VARCHAR(50) NOT NULL,
    member_code VARCHAR(50),
    check_in_date DATE DEFAULT CURRENT_DATE,
    energy INT CHECK (energy BETWEEN 1 AND 5),
    stress INT CHECK (stress BETWEEN 1 AND 5),
    adherence_percent INT CHECK (adherence_percent BETWEEN 0 AND 100),
    wins TEXT,
    questions_for_trainer TEXT,
    coach_feedback TEXT,
    photo_urls TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.check_ins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow full access for check_ins" ON public.check_ins FOR ALL USING (true);

-- =========================================================================
-- 10. PERSONAL TRAINING & 1-ON-1 COACHING BOOKINGS
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_code VARCHAR(50) UNIQUE,
    member_id VARCHAR(50) NOT NULL,
    member_name VARCHAR(100),
    trainer_id VARCHAR(50) NOT NULL,
    trainer_name VARCHAR(100),
    session_date DATE NOT NULL,
    session_time VARCHAR(20) NOT NULL,
    focus_area VARCHAR(100),
    status VARCHAR(30) DEFAULT 'CONFIRMED' CHECK (status IN ('CONFIRMED', 'COMPLETED', 'CANCELLED', 'RESCHEDULED')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow full access for bookings" ON public.bookings FOR ALL USING (true);

-- =========================================================================
-- 11. LIVE WORKOUT LOGS & PROGRESSIVE OVERLOAD TRACKER
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.workout_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id VARCHAR(50) NOT NULL,
    log_date DATE DEFAULT CURRENT_DATE,
    exercise_name VARCHAR(150) NOT NULL,
    set_number INT NOT NULL,
    weight_kg DECIMAL(6, 2) NOT NULL,
    reps INT NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.workout_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow full access for workout_logs" ON public.workout_logs FOR ALL USING (true);

-- =========================================================================
-- 12. PAR-Q HEALTH & INTAKE QUESTIONNAIRES
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.parq_intakes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id VARCHAR(50) NOT NULL UNIQUE,
    heart_condition BOOLEAN DEFAULT FALSE,
    chest_pain_activity BOOLEAN DEFAULT FALSE,
    dizziness BOOLEAN DEFAULT FALSE,
    bone_joint_problem BOOLEAN DEFAULT FALSE,
    blood_pressure_meds BOOLEAN DEFAULT FALSE,
    primary_goal TEXT,
    dietary_restrictions TEXT,
    physician_clearance_status VARCHAR(50) DEFAULT 'CLEARED',
    completed_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.parq_intakes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow full access for parq_intakes" ON public.parq_intakes FOR ALL USING (true);


