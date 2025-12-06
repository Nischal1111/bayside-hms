-- ========================================
-- DATABASE CONSTRAINT TEST QUERIES
-- Bayside Hospital Management System
-- ========================================

-- ========================================
-- TEST 1: FOREIGN KEY CONSTRAINTS
-- ========================================
-- Purpose: To ensure that there are no orphaned records in the database.
-- Test: Add a patient record with an invalid user_id
-- Expected: Database should refuse the insertion and produce an error

-- Step 1: Verify the constraint exists
SELECT
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_name = 'patients'
  AND kcu.column_name = 'user_id';

-- Step 2: Attempt to insert a patient with invalid user_id
-- This should FAIL with a foreign key violation error
INSERT INTO patients (
    user_id,
    first_name,
    last_name,
    phone_number,
    gender,
    date_of_birth
) VALUES (
    '00000000-0000-0000-0000-000000000000', -- Invalid/non-existent user_id
    'John',
    'Doe',
    '+1234567890',
    'male',
    '1990-01-01'
);
-- Expected Error: insert or update on table "patients" violates foreign key constraint

-- Step 3: Verify no orphaned patient records exist
SELECT p.*
FROM patients p
LEFT JOIN users u ON p.user_id = u.id
WHERE u.id IS NULL;
-- Expected Result: Should return 0 rows


-- ========================================
-- TEST 2: CASCADE DELETE BEHAVIOR
-- ========================================
-- Purpose: To guarantee that corresponding records are automatically deleted with a parent record
-- Test: Delete a user account and verify that related patient/doctor records are also deleted

-- Step 1: Create a test user and patient record
INSERT INTO users (email, password_hash, role, status)
VALUES ('test.cascade@example.com', 'hashed_password_123', 'patient', 'active')
RETURNING id;
-- Note the returned user_id for the next steps

-- Use the returned user_id in the next insert
-- Replace 'USER_ID_HERE' with the actual UUID from the previous query
DO $$
DECLARE
    test_user_id UUID;
    test_patient_id UUID;
BEGIN
    -- Create test user
    INSERT INTO users (email, password_hash, role, status)
    VALUES ('test.cascade.delete@example.com', 'hashed_password_123', 'patient', 'active')
    RETURNING id INTO test_user_id;

    -- Create test patient
    INSERT INTO patients (user_id, first_name, last_name, phone_number)
    VALUES (test_user_id, 'Test', 'Patient', '+1234567890')
    RETURNING id INTO test_patient_id;

    -- Verify records exist
    RAISE NOTICE 'User ID: %', test_user_id;
    RAISE NOTICE 'Patient ID: %', test_patient_id;

    -- Count records before deletion
    RAISE NOTICE 'Patients before delete: %', (SELECT COUNT(*) FROM patients WHERE id = test_patient_id);

    -- Delete the user (should cascade to patient)
    DELETE FROM users WHERE id = test_user_id;

    -- Verify cascade deletion worked
    RAISE NOTICE 'Patients after delete: %', (SELECT COUNT(*) FROM patients WHERE id = test_patient_id);
END $$;
-- Expected Result: Patient count should be 0 after user deletion

-- Step 2: Alternative test query - Create and immediately verify cascade
WITH
    inserted_user AS (
        INSERT INTO users (email, password_hash, role, status)
        VALUES ('cascade.test2@example.com', 'password_hash', 'doctor', 'active')
        RETURNING id
    ),
    inserted_doctor AS (
        INSERT INTO doctors (user_id, first_name, last_name, phone_number, license_number)
        SELECT id, 'Dr. Test', 'Cascade', '+9876543210', 'LIC123456'
        FROM inserted_user
        RETURNING id, user_id
    ),
    deleted_user AS (
        DELETE FROM users WHERE id IN (SELECT user_id FROM inserted_doctor)
        RETURNING id
    )
SELECT
    (SELECT COUNT(*) FROM doctors WHERE user_id IN (SELECT id FROM deleted_user)) as remaining_doctors;
-- Expected Result: remaining_doctors = 0


-- ========================================
-- TEST 3: UNIQUE CONSTRAINTS
-- ========================================
-- Purpose: To ensure the database does not allow duplicate entries in unique columns
-- Test: Attempt to register two users with the same email address

-- Step 1: Verify unique constraint exists
SELECT
    tc.constraint_name,
    tc.table_name,
    kcu.column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
    ON tc.constraint_name = kcu.constraint_name
WHERE tc.constraint_type = 'UNIQUE'
    AND tc.table_name = 'users'
    AND kcu.column_name = 'email';

-- Step 2: Create first user with a specific email
INSERT INTO users (email, password_hash, role, status)
VALUES ('duplicate.test@example.com', 'password_hash_1', 'patient', 'active');
-- This should succeed

-- Step 3: Attempt to create second user with the same email
INSERT INTO users (email, password_hash, role, status)
VALUES ('duplicate.test@example.com', 'password_hash_2', 'patient', 'active');
-- Expected Error: duplicate key value violates unique constraint "users_email_key"

-- Step 4: Verify only one record exists
SELECT email, COUNT(*) as count
FROM users
WHERE email = 'duplicate.test@example.com'
GROUP BY email;
-- Expected Result: count = 1

-- Additional test for doctor license_number uniqueness
INSERT INTO users (email, password_hash, role, status)
VALUES ('doctor1@example.com', 'pass1', 'doctor', 'active')
RETURNING id;

-- Insert first doctor with license
INSERT INTO doctors (user_id, first_name, last_name, phone_number, license_number)
VALUES ((SELECT id FROM users WHERE email = 'doctor1@example.com'),
        'Dr. First', 'Doctor', '+1111111111', 'LICENSE-001');

-- Create second doctor user
INSERT INTO users (email, password_hash, role, status)
VALUES ('doctor2@example.com', 'pass2', 'doctor', 'active');

-- Attempt to insert second doctor with same license number
INSERT INTO doctors (user_id, first_name, last_name, phone_number, license_number)
VALUES ((SELECT id FROM users WHERE email = 'doctor2@example.com'),
        'Dr. Second', 'Doctor', '+2222222222', 'LICENSE-001');
-- Expected Error: duplicate key value violates unique constraint "doctors_license_number_key"


-- ========================================
-- TEST 4: PREVENTION OF CONFLICT IN APPOINTMENTS
-- ========================================
-- Purpose: To confirm that the composite unique constraint prevents scheduling conflicts
-- Test: Attempt to book the same doctor at the same date and time twice

-- Step 1: Verify the composite unique constraint exists
SELECT
    tc.constraint_name,
    tc.table_name,
    STRING_AGG(kcu.column_name, ', ' ORDER BY kcu.ordinal_position) as columns
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
    ON tc.constraint_name = kcu.constraint_name
WHERE tc.constraint_type = 'UNIQUE'
    AND tc.table_name = 'appointments'
GROUP BY tc.constraint_name, tc.table_name;

-- Step 2: Setup test data (doctor and two patients)
DO $$
DECLARE
    doctor_user_id UUID;
    doctor_id UUID;
    patient1_user_id UUID;
    patient1_id UUID;
    patient2_user_id UUID;
    patient2_id UUID;
    appointment1_id UUID;
BEGIN
    -- Create doctor user and profile
    INSERT INTO users (email, password_hash, role, status)
    VALUES ('dr.appointment.test@example.com', 'password', 'doctor', 'active')
    RETURNING id INTO doctor_user_id;

    INSERT INTO doctors (user_id, first_name, last_name, phone_number, license_number)
    VALUES (doctor_user_id, 'Dr. Appointment', 'Test', '+5555555555', 'LIC-APPT-001')
    RETURNING id INTO doctor_id;

    -- Create first patient
    INSERT INTO users (email, password_hash, role, status)
    VALUES ('patient1.appt@example.com', 'password', 'patient', 'active')
    RETURNING id INTO patient1_user_id;

    INSERT INTO patients (user_id, first_name, last_name, phone_number)
    VALUES (patient1_user_id, 'Patient', 'One', '+6666666666')
    RETURNING id INTO patient1_id;

    -- Create second patient
    INSERT INTO users (email, password_hash, role, status)
    VALUES ('patient2.appt@example.com', 'password', 'patient', 'active')
    RETURNING id INTO patient2_user_id;

    INSERT INTO patients (user_id, first_name, last_name, phone_number)
    VALUES (patient2_user_id, 'Patient', 'Two', '+7777777777')
    RETURNING id INTO patient2_id;

    -- Create first appointment
    INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, reason_for_visit)
    VALUES (patient1_id, doctor_id, '2025-12-15', '10:00:00', 'Regular checkup')
    RETURNING id INTO appointment1_id;

    RAISE NOTICE 'First appointment created: %', appointment1_id;

    -- Attempt to create conflicting appointment (same doctor, same date, same time)
    BEGIN
        INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, reason_for_visit)
        VALUES (patient2_id, doctor_id, '2025-12-15', '10:00:00', 'Different reason');

        RAISE NOTICE 'ERROR: Duplicate appointment was allowed!';
    EXCEPTION WHEN unique_violation THEN
        RAISE NOTICE 'SUCCESS: Duplicate appointment was correctly rejected';
    END;

    -- Verify only one appointment exists for that time slot
    RAISE NOTICE 'Appointments at 2025-12-15 10:00:00 for this doctor: %',
        (SELECT COUNT(*) FROM appointments
         WHERE doctor_id = doctor_id
         AND appointment_date = '2025-12-15'
         AND appointment_time = '10:00:00');
END $$;
-- Expected Result: Should raise "SUCCESS: Duplicate appointment was correctly rejected"

-- Step 3: Alternative simple test
-- First, ensure you have at least one doctor and two patients in the database
-- Then run these queries:

-- Create first appointment (this should succeed)
INSERT INTO appointments (
    patient_id,
    doctor_id,
    appointment_date,
    appointment_time,
    status,
    reason_for_visit
)
SELECT
    p.id as patient_id,
    d.id as doctor_id,
    '2025-12-20'::DATE as appointment_date,
    '14:00:00'::TIME as appointment_time,
    'confirmed'::appointment_status,
    'First appointment'
FROM patients p
CROSS JOIN doctors d
LIMIT 1;

-- Attempt to create conflicting appointment (this should FAIL)
INSERT INTO appointments (
    patient_id,
    doctor_id,
    appointment_date,
    appointment_time,
    status,
    reason_for_visit
)
SELECT
    p2.id as patient_id,
    a.doctor_id,
    a.appointment_date,
    a.appointment_time,
    'confirmed'::appointment_status,
    'Conflicting appointment'
FROM appointments a
CROSS JOIN patients p2
WHERE a.appointment_date = '2025-12-20'
    AND a.appointment_time = '14:00:00'
    AND p2.id != a.patient_id
LIMIT 1;
-- Expected Error: duplicate key value violates unique constraint "appointments_doctor_id_appointment_date_appointment_time_key"


-- ========================================
-- CLEANUP QUERIES (Optional - use after testing)
-- ========================================

-- Clean up test data
DELETE FROM appointments WHERE reason_for_visit LIKE '%test%' OR reason_for_visit LIKE '%Test%';
DELETE FROM patients WHERE phone_number IN ('+1234567890', '+6666666666', '+7777777777');
DELETE FROM doctors WHERE phone_number IN ('+5555555555', '+9876543210', '+1111111111', '+2222222222');
DELETE FROM users WHERE email LIKE '%test%' OR email LIKE '%example.com%';

-- Verify cleanup
SELECT 'users' as table_name, COUNT(*) FROM users WHERE email LIKE '%test%'
UNION ALL
SELECT 'patients', COUNT(*) FROM patients WHERE phone_number LIKE '+1234567890'
UNION ALL
SELECT 'doctors', COUNT(*) FROM doctors WHERE license_number LIKE 'LIC%'
UNION ALL
SELECT 'appointments', COUNT(*) FROM appointments WHERE reason_for_visit LIKE '%test%';
