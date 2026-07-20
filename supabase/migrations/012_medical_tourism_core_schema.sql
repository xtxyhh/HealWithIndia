-- Migration: 012_medical_tourism_core_schema.sql
-- Description: Core schema for Medical Tourism SaaS (Hospitals, Doctors, Treatments, CRM Leads, Quotes, Invoices, Payments, Travel, Visa, Hotels, Journey Stages, Audit Logs)

-- 1. HOSPITALS
CREATE TABLE IF NOT EXISTS hospitals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  city TEXT NOT NULL,
  state TEXT DEFAULT 'India',
  country TEXT DEFAULT 'India',
  accreditation TEXT DEFAULT 'JCI & NABH Accredited',
  rating NUMERIC(3,2) DEFAULT 4.9,
  image_url TEXT,
  description TEXT,
  specialties TEXT[],
  contact_phone TEXT,
  contact_email TEXT,
  established_year INTEGER,
  bed_count INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. DOCTORS
CREATE TABLE IF NOT EXISTS doctors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hospital_id UUID REFERENCES hospitals(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  specialty TEXT NOT NULL,
  qualification TEXT,
  experience_years INTEGER,
  bio TEXT,
  avatar_url TEXT,
  rating NUMERIC(3,2) DEFAULT 4.9,
  consultation_fee_usd NUMERIC DEFAULT 50,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. TREATMENTS
CREATE TABLE IF NOT EXISTS treatments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL, -- e.g. Cardiology, Orthopedics, IVF, Oncology, Dental, Cosmetic, Neurology
  department TEXT,
  description TEXT,
  duration_days INTEGER DEFAULT 7,
  recovery_days INTEGER DEFAULT 14,
  cost_usd_min NUMERIC NOT NULL,
  cost_usd_max NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. TREATMENT PACKAGES
CREATE TABLE IF NOT EXISTS treatment_packages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  treatment_id UUID REFERENCES treatments(id) ON DELETE CASCADE,
  hospital_id UUID REFERENCES hospitals(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  included_services TEXT[],
  price_usd NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. CRM LEADS
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  country TEXT NOT NULL,
  treatment_requested TEXT,
  status TEXT CHECK (status IN ('inquiry', 'new', 'contacted', 'reviewing', 'converted', 'closed', 'junk')) DEFAULT 'inquiry',
  source TEXT DEFAULT 'website',
  notes TEXT,
  assigned_coordinator_id UUID REFERENCES official_coordinators(id) ON DELETE SET NULL,
  converted_patient_id BIGINT REFERENCES patients(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. MEDICAL REPORTS
CREATE TABLE IF NOT EXISTS medical_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id BIGINT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  file_url TEXT NOT NULL,
  report_type TEXT DEFAULT 'general_lab',
  status TEXT CHECK (status IN ('uploaded', 'under_review', 'verified', 'rejected')) DEFAULT 'uploaded',
  doctor_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. QUOTES
CREATE TABLE IF NOT EXISTS quotes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id BIGINT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  treatment_id UUID REFERENCES treatments(id) ON DELETE SET NULL,
  hospital_id UUID REFERENCES hospitals(id) ON DELETE SET NULL,
  amount_usd NUMERIC NOT NULL,
  breakdown_json JSONB DEFAULT '{}'::jsonb,
  status TEXT CHECK (status IN ('draft', 'sent', 'accepted', 'declined', 'expired')) DEFAULT 'draft',
  validity_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. INVOICES
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id BIGINT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  quote_id UUID REFERENCES quotes(id) ON DELETE SET NULL,
  invoice_number TEXT UNIQUE NOT NULL,
  amount_usd NUMERIC NOT NULL,
  tax_usd NUMERIC DEFAULT 0,
  total_usd NUMERIC NOT NULL,
  due_date DATE NOT NULL,
  status TEXT CHECK (status IN ('unpaid', 'partially_paid', 'paid', 'overdue', 'cancelled')) DEFAULT 'unpaid',
  pdf_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. PAYMENTS
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  patient_id BIGINT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  amount_usd NUMERIC NOT NULL,
  payment_method TEXT CHECK (payment_method IN ('card', 'wire_transfer', 'stripe', 'paypal', 'cash')) DEFAULT 'card',
  transaction_ref TEXT UNIQUE NOT NULL,
  status TEXT CHECK (status IN ('pending', 'completed', 'failed', 'refunded')) DEFAULT 'completed',
  paid_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. VISA DETAILS
CREATE TABLE IF NOT EXISTS visa_details (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id BIGINT NOT NULL UNIQUE REFERENCES patients(id) ON DELETE CASCADE,
  passport_number TEXT,
  visa_type TEXT DEFAULT 'Medical Visa (MED)',
  application_status TEXT CHECK (application_status IN ('not_applied', 'invitation_issued', 'applied', 'approved', 'rejected')) DEFAULT 'not_applied',
  invitation_letter_url TEXT,
  embassy_contact TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. TRAVEL DETAILS
CREATE TABLE IF NOT EXISTS travel_details (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id BIGINT NOT NULL UNIQUE REFERENCES patients(id) ON DELETE CASCADE,
  flight_number TEXT,
  airline TEXT,
  departure_city TEXT,
  arrival_city TEXT DEFAULT 'New Delhi (DEL)',
  arrival_time TIMESTAMP WITH TIME ZONE,
  airport_pickup_status TEXT CHECK (airport_pickup_status IN ('pending', 'scheduled', 'assigned', 'completed', 'cancelled')) DEFAULT 'pending',
  driver_name TEXT,
  driver_contact TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. HOTEL BOOKINGS
CREATE TABLE IF NOT EXISTS hotel_bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id BIGINT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  hotel_name TEXT NOT NULL,
  address TEXT,
  check_in_date DATE,
  check_out_date DATE,
  room_type TEXT DEFAULT 'Deluxe Suite',
  booking_ref TEXT,
  status TEXT CHECK (status IN ('pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 13. PATIENT JOURNEY STAGES (The 17-stage Patient Lifecycle)
CREATE TABLE IF NOT EXISTS patient_journey_stages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id BIGINT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  stage TEXT NOT NULL CHECK (stage IN (
    'Inquiry', 'Lead', 'Review', 'Coordinator Assigned', 'Medical Reports',
    'Hospital', 'Doctor', 'Treatment Plan', 'Quote', 'Invoice',
    'Payment', 'Visa', 'Travel', 'Arrival', 'Treatment',
    'Recovery', 'Follow-up', 'Completed'
  )),
  status TEXT CHECK (status IN ('pending', 'in_progress', 'completed', 'skipped')) DEFAULT 'pending',
  notes TEXT,
  updated_by TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(patient_id, stage)
);

-- 14. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info',
  is_read BOOLEAN DEFAULT FALSE,
  link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 15. SYSTEM AUDIT LOGS
CREATE TABLE IF NOT EXISTS system_audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID,
  action TEXT NOT NULL,
  resource TEXT NOT NULL,
  details JSONB DEFAULT '{}'::jsonb,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_hospitals_slug ON hospitals(slug);
CREATE INDEX IF NOT EXISTS idx_doctors_hospital_id ON doctors(hospital_id);
CREATE INDEX IF NOT EXISTS idx_treatments_slug ON treatments(slug);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_medical_reports_patient_id ON medical_reports(patient_id);
CREATE INDEX IF NOT EXISTS idx_quotes_patient_id ON quotes(patient_id);
CREATE INDEX IF NOT EXISTS idx_invoices_patient_id ON invoices(patient_id);
CREATE INDEX IF NOT EXISTS idx_payments_invoice_id ON payments(invoice_id);
CREATE INDEX IF NOT EXISTS idx_patient_journey_stages_patient ON patient_journey_stages(patient_id);

-- ENABLE ROW LEVEL SECURITY
ALTER TABLE hospitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE treatments ENABLE ROW LEVEL SECURITY;
ALTER TABLE treatment_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE visa_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE travel_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE hotel_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_journey_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_audit_logs ENABLE ROW LEVEL SECURITY;

-- POLICIES FOR PUBLIC READ ACCESS (Hospitals, Doctors, Treatments)
CREATE POLICY "Public read hospitals" ON hospitals FOR SELECT USING (true);
CREATE POLICY "Public read doctors" ON doctors FOR SELECT USING (true);
CREATE POLICY "Public read treatments" ON treatments FOR SELECT USING (true);
CREATE POLICY "Public read treatment packages" ON treatment_packages FOR SELECT USING (true);

-- POLICIES FOR SERVICE ROLE / ADMIN FULL ACCESS
CREATE POLICY "Service role full access hospitals" ON hospitals FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access doctors" ON doctors FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access treatments" ON treatments FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access treatment packages" ON treatment_packages FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access leads" ON leads FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access medical_reports" ON medical_reports FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access quotes" ON quotes FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access invoices" ON invoices FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access payments" ON payments FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access visa_details" ON visa_details FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access travel_details" ON travel_details FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access hotel_bookings" ON hotel_bookings FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access journey_stages" ON patient_journey_stages FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access notifications" ON notifications FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access audit_logs" ON system_audit_logs FOR ALL USING (auth.role() = 'service_role');

-- PATIENT OWNERSHIP POLICIES
CREATE POLICY "Patients view own medical reports" ON medical_reports FOR SELECT USING (verify_patient_ownership(patient_id));
CREATE POLICY "Patients insert own medical reports" ON medical_reports FOR INSERT WITH CHECK (verify_patient_ownership(patient_id));
CREATE POLICY "Patients view own quotes" ON quotes FOR SELECT USING (verify_patient_ownership(patient_id));
CREATE POLICY "Patients view own invoices" ON invoices FOR SELECT USING (verify_patient_ownership(patient_id));
CREATE POLICY "Patients view own payments" ON payments FOR SELECT USING (verify_patient_ownership(patient_id));
CREATE POLICY "Patients insert own payments" ON payments FOR INSERT WITH CHECK (verify_patient_ownership(patient_id));
CREATE POLICY "Patients view own visa details" ON visa_details FOR SELECT USING (verify_patient_ownership(patient_id));
CREATE POLICY "Patients view own travel details" ON travel_details FOR SELECT USING (verify_patient_ownership(patient_id));
CREATE POLICY "Patients view own hotel bookings" ON hotel_bookings FOR SELECT USING (verify_patient_ownership(patient_id));
CREATE POLICY "Patients view own journey stages" ON patient_journey_stages FOR SELECT USING (verify_patient_ownership(patient_id));
CREATE POLICY "Users view own notifications" ON notifications FOR SELECT USING (user_id = auth.uid());
