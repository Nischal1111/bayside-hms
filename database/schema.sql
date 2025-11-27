-- Bayside Hospital Management System Database Schema
-- PostgreSQL Database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================
-- USERS AND AUTHENTICATION
-- ========================================

-- User roles enum
CREATE TYPE user_role AS ENUM ('admin', 'doctor', 'patient');

-- User status enum
CREATE TYPE user_status AS ENUM ('active', 'inactive', 'pending');

-- Gender enum
CREATE TYPE gender_type AS ENUM ('male', 'female', 'other');

-- Users table (base authentication)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL,
    status user_status DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- PATIENT MANAGEMENT
-- ========================================

-- Patients table
CREATE TABLE patients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    address TEXT,
    gender gender_type,
    date_of_birth DATE,
    blood_group VARCHAR(5),
    emergency_contact_name VARCHAR(200),
    emergency_contact_phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- DOCTOR MANAGEMENT
-- ========================================

-- Specialization types
CREATE TABLE specializations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT
);

-- Doctors table
CREATE TABLE doctors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    specialization_id INTEGER REFERENCES specializations(id),
    license_number VARCHAR(50) UNIQUE,
    years_of_experience INTEGER,
    consultation_fee DECIMAL(10, 2),
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- APPOINTMENT MANAGEMENT
-- ========================================

-- Appointment status enum
CREATE TYPE appointment_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled', 'rescheduled');

-- Appointments table
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    status appointment_status DEFAULT 'pending',
    reason_for_visit TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(doctor_id, appointment_date, appointment_time)
);

-- ========================================
-- ELECTRONIC MEDICAL RECORDS (EMR)
-- ========================================

-- Medical records table
CREATE TABLE medical_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES doctors(id) ON DELETE SET NULL,
    appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
    diagnosis TEXT NOT NULL,
    prescription TEXT,
    symptoms TEXT,
    treatment_plan TEXT,
    notes TEXT,
    visit_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Medical reports/files table
CREATE TABLE medical_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    medical_record_id UUID REFERENCES medical_records(id) ON DELETE CASCADE,
    report_type VARCHAR(100) NOT NULL, -- X-Ray, Blood Test, MRI, etc.
    file_url TEXT,
    file_name VARCHAR(255),
    description TEXT,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Allergies table
CREATE TABLE patient_allergies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    allergy_name VARCHAR(200) NOT NULL,
    severity VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Medications history
CREATE TABLE medications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    medical_record_id UUID REFERENCES medical_records(id) ON DELETE CASCADE,
    medication_name VARCHAR(200) NOT NULL,
    dosage VARCHAR(100),
    frequency VARCHAR(100),
    duration VARCHAR(100),
    instructions TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- FEEDBACK SYSTEM
-- ========================================

-- Feedback table
CREATE TABLE feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- BILLING AND FINANCIAL MANAGEMENT
-- ========================================

-- Payment status enum
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'partially_paid', 'overdue', 'cancelled');

-- Payment method enum
CREATE TYPE payment_method AS ENUM ('cash', 'credit_card', 'debit_card', 'bank_transfer', 'insurance');

-- Invoices table
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    paid_amount DECIMAL(10, 2) DEFAULT 0,
    discount_amount DECIMAL(10, 2) DEFAULT 0,
    tax_amount DECIMAL(10, 2) DEFAULT 0,
    status payment_status DEFAULT 'pending',
    due_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Invoice line items
CREATE TABLE invoice_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
    description VARCHAR(255) NOT NULL,
    quantity INTEGER DEFAULT 1,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payments table
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    payment_method payment_method NOT NULL,
    transaction_id VARCHAR(100),
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- EMAIL AND NOTIFICATIONS
-- ========================================

-- Notification types
CREATE TYPE notification_type AS ENUM ('appointment', 'payment', 'report', 'general');

-- Notifications table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type notification_type NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Email messages table
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
    recipient_id UUID REFERENCES users(id) ON DELETE CASCADE,
    subject VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- ADMIN MANAGEMENT
-- ========================================

-- Admin profiles table
CREATE TABLE admins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- INDEXES FOR PERFORMANCE
-- ========================================

-- User indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Patient indexes
CREATE INDEX idx_patients_user_id ON patients(user_id);
CREATE INDEX idx_patients_phone ON patients(phone_number);

-- Doctor indexes
CREATE INDEX idx_doctors_user_id ON doctors(user_id);
CREATE INDEX idx_doctors_specialization ON doctors(specialization_id);

-- Appointment indexes
CREATE INDEX idx_appointments_patient ON appointments(patient_id);
CREATE INDEX idx_appointments_doctor ON appointments(doctor_id);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_status ON appointments(status);

-- Medical records indexes
CREATE INDEX idx_medical_records_patient ON medical_records(patient_id);
CREATE INDEX idx_medical_records_doctor ON medical_records(doctor_id);
CREATE INDEX idx_medical_records_date ON medical_records(visit_date);

-- Invoice indexes
CREATE INDEX idx_invoices_patient ON invoices(patient_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_number ON invoices(invoice_number);

-- Notification indexes
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);

-- Message indexes
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_recipient ON messages(recipient_id);

-- ========================================
-- SAMPLE DATA FOR SPECIALIZATIONS
-- ========================================

INSERT INTO specializations (name, description) VALUES
('General Medicine', 'General medical practice'),
('Cardiology', 'Heart and cardiovascular system'),
('Dermatology', 'Skin, hair, and nails'),
('Orthopedics', 'Bones, joints, and muscles'),
('Pediatrics', 'Medical care of infants, children, and adolescents'),
('Neurology', 'Nervous system disorders'),
('Psychiatry', 'Mental health and disorders'),
('Ophthalmology', 'Eye and vision care'),
('ENT', 'Ear, nose, and throat'),
('Gynecology', 'Women''s reproductive health');

-- ========================================
-- TRIGGERS FOR UPDATED_AT
-- ========================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON patients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_doctors_updated_at BEFORE UPDATE ON doctors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_medical_records_updated_at BEFORE UPDATE ON medical_records FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_admins_updated_at BEFORE UPDATE ON admins FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
