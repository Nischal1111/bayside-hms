-- ========================================
-- ADDITIONAL DATABASE CONSTRAINT TEST QUERIES
-- Bayside Hospital Management System
-- ========================================

-- ========================================
-- TEST 2: DATE CONSTRAINTS
-- ========================================
-- Purpose: Appointments dates have to be after current date
-- Test: Attempt to create an appointment with a past date
-- Expected: Database should refuse the insertion

-- Step 1: Add date constraint if not exists (schema modification)
-- This constraint ensures appointments cannot be made for past dates
ALTER TABLE appointments
DROP CONSTRAINT IF EXISTS chk_appointment_date_future;

ALTER TABLE appointments
ADD CONSTRAINT chk_appointment_date_future
CHECK (appointment_date >= CURRENT_DATE);

-- Step 2: Verify the constraint exists
SELECT
    tc.constraint_name,
    tc.table_name,
    cc.check_clause
FROM information_schema.table_constraints tc
JOIN information_schema.check_constraints cc
    ON tc.constraint_name = cc.constraint_name
WHERE tc.table_name = 'appointments'
    AND tc.constraint_type = 'CHECK'
    AND cc.check_clause LIKE '%appointment_date%';

-- Step 3: Test with valid future date (should SUCCEED)
DO $$
DECLARE
    test_patient_id UUID;
    test_doctor_id UUID;
BEGIN
    -- Get any existing patient and doctor for testing
    SELECT id INTO test_patient_id FROM patients LIMIT 1;
    SELECT id INTO test_doctor_id FROM doctors LIMIT 1;

    IF test_patient_id IS NOT NULL AND test_doctor_id IS NOT NULL THEN
        -- Try to insert appointment with future date (should succeed)
        INSERT INTO appointments (
            patient_id,
            doctor_id,
            appointment_date,
            appointment_time,
            reason_for_visit
        ) VALUES (
            test_patient_id,
            test_doctor_id,
            CURRENT_DATE + INTERVAL '7 days', -- Future date
            '10:00:00',
            'Test: Valid future appointment'
        );
        RAISE NOTICE 'SUCCESS: Future appointment was created';

        -- Clean up
        DELETE FROM appointments WHERE reason_for_visit = 'Test: Valid future appointment';
    ELSE
        RAISE NOTICE 'SKIP: No test data available (need patient and doctor)';
    END IF;
END $$;

-- Step 4: Test with past date (should FAIL)
DO $$
DECLARE
    test_patient_id UUID;
    test_doctor_id UUID;
BEGIN
    -- Get any existing patient and doctor for testing
    SELECT id INTO test_patient_id FROM patients LIMIT 1;
    SELECT id INTO test_doctor_id FROM doctors LIMIT 1;

    IF test_patient_id IS NOT NULL AND test_doctor_id IS NOT NULL THEN
        BEGIN
            -- Try to insert appointment with past date (should fail)
            INSERT INTO appointments (
                patient_id,
                doctor_id,
                appointment_date,
                appointment_time,
                reason_for_visit
            ) VALUES (
                test_patient_id,
                test_doctor_id,
                CURRENT_DATE - INTERVAL '7 days', -- Past date
                '10:00:00',
                'Test: Invalid past appointment'
            );
            RAISE NOTICE 'ERROR: Past appointment was incorrectly allowed!';
        EXCEPTION WHEN check_violation THEN
            RAISE NOTICE 'SUCCESS: Past appointment was correctly rejected';
        END;
    ELSE
        RAISE NOTICE 'SKIP: No test data available (need patient and doctor)';
    END IF;
END $$;

-- Step 5: Test with today's date (should SUCCEED as it equals CURRENT_DATE)
DO $$
DECLARE
    test_patient_id UUID;
    test_doctor_id UUID;
BEGIN
    SELECT id INTO test_patient_id FROM patients LIMIT 1;
    SELECT id INTO test_doctor_id FROM doctors LIMIT 1;

    IF test_patient_id IS NOT NULL AND test_doctor_id IS NOT NULL THEN
        INSERT INTO appointments (
            patient_id,
            doctor_id,
            appointment_date,
            appointment_time,
            reason_for_visit
        ) VALUES (
            test_patient_id,
            test_doctor_id,
            CURRENT_DATE, -- Today's date
            '15:00:00',
            'Test: Today appointment'
        );
        RAISE NOTICE 'SUCCESS: Today appointment was created';

        -- Clean up
        DELETE FROM appointments WHERE reason_for_visit = 'Test: Today appointment';
    END IF;
END $$;


-- ========================================
-- TEST 3: ENUM VALIDATION
-- ========================================
-- Purpose: Status, role, and gender fields can only have predefined accepted values
-- Test: Attempt to insert records with invalid enum values
-- Expected: Database should refuse the insertion

-- ================
-- TEST 3.1: User Role Validation
-- ================

-- Step 1: List valid enum values for user_role
SELECT
    t.typname as enum_name,
    e.enumlabel as enum_value,
    e.enumsortorder as sort_order
FROM pg_type t
JOIN pg_enum e ON t.oid = e.enumtypid
WHERE t.typname = 'user_role'
ORDER BY e.enumsortorder;
-- Expected values: 'admin', 'doctor', 'patient'

-- Step 2: Test with valid role (should SUCCEED)
DO $$
BEGIN
    BEGIN
        INSERT INTO users (email, password_hash, role, status)
        VALUES ('test.valid.role@example.com', 'password', 'patient', 'active');

        RAISE NOTICE 'SUCCESS: Valid role accepted';

        -- Clean up
        DELETE FROM users WHERE email = 'test.valid.role@example.com';
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'ERROR: Valid role was rejected: %', SQLERRM;
    END;
END $$;

-- Step 3: Test with invalid role (should FAIL)
DO $$
BEGIN
    BEGIN
        INSERT INTO users (email, password_hash, role, status)
        VALUES ('test.invalid.role@example.com', 'password', 'invalid_role', 'active');

        RAISE NOTICE 'ERROR: Invalid role was incorrectly accepted!';
    EXCEPTION WHEN invalid_text_representation THEN
        RAISE NOTICE 'SUCCESS: Invalid role was correctly rejected';
    END;
END $$;

-- ================
-- TEST 3.2: User Status Validation
-- ================

-- Step 1: List valid enum values for user_status
SELECT
    t.typname as enum_name,
    e.enumlabel as enum_value
FROM pg_type t
JOIN pg_enum e ON t.oid = e.enumtypid
WHERE t.typname = 'user_status'
ORDER BY e.enumsortorder;
-- Expected values: 'active', 'inactive', 'pending'

-- Step 2: Test with invalid status (should FAIL)
DO $$
BEGIN
    BEGIN
        INSERT INTO users (email, password_hash, role, status)
        VALUES ('test.invalid.status@example.com', 'password', 'patient', 'suspended');

        RAISE NOTICE 'ERROR: Invalid status was incorrectly accepted!';
    EXCEPTION WHEN invalid_text_representation THEN
        RAISE NOTICE 'SUCCESS: Invalid status was correctly rejected';
    END;
END $$;

-- ================
-- TEST 3.3: Gender Type Validation
-- ================

-- Step 1: List valid enum values for gender_type
SELECT
    t.typname as enum_name,
    e.enumlabel as enum_value
FROM pg_type t
JOIN pg_enum e ON t.oid = e.enumtypid
WHERE t.typname = 'gender_type'
ORDER BY e.enumsortorder;
-- Expected values: 'male', 'female', 'other'

-- Step 2: Create test user first
DO $$
DECLARE
    test_user_id UUID;
BEGIN
    INSERT INTO users (email, password_hash, role, status)
    VALUES ('test.gender@example.com', 'password', 'patient', 'active')
    RETURNING id INTO test_user_id;

    -- Test with valid gender (should SUCCEED)
    BEGIN
        INSERT INTO patients (user_id, first_name, last_name, phone_number, gender)
        VALUES (test_user_id, 'Test', 'Patient', '+1234567890', 'other');

        RAISE NOTICE 'SUCCESS: Valid gender accepted';
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'ERROR: Valid gender was rejected: %', SQLERRM;
    END;

    -- Clean up
    DELETE FROM users WHERE id = test_user_id;
END $$;

-- Step 3: Test with invalid gender (should FAIL)
DO $$
DECLARE
    test_user_id UUID;
BEGIN
    INSERT INTO users (email, password_hash, role, status)
    VALUES ('test.invalid.gender@example.com', 'password', 'patient', 'active')
    RETURNING id INTO test_user_id;

    BEGIN
        INSERT INTO patients (user_id, first_name, last_name, phone_number, gender)
        VALUES (test_user_id, 'Test', 'Patient', '+9999999999', 'unknown');

        RAISE NOTICE 'ERROR: Invalid gender was incorrectly accepted!';
        DELETE FROM users WHERE id = test_user_id;
    EXCEPTION WHEN invalid_text_representation THEN
        RAISE NOTICE 'SUCCESS: Invalid gender was correctly rejected';
        DELETE FROM users WHERE id = test_user_id;
    END;
END $$;

-- ================
-- TEST 3.4: Appointment Status Validation
-- ================

-- Step 1: List valid enum values for appointment_status
SELECT
    t.typname as enum_name,
    e.enumlabel as enum_value
FROM pg_type t
JOIN pg_enum e ON t.oid = e.enumtypid
WHERE t.typname = 'appointment_status'
ORDER BY e.enumsortorder;
-- Expected values: 'pending', 'confirmed', 'completed', 'cancelled', 'rescheduled'

-- Step 2: Test with invalid appointment status (should FAIL)
DO $$
DECLARE
    test_patient_id UUID;
    test_doctor_id UUID;
BEGIN
    SELECT id INTO test_patient_id FROM patients LIMIT 1;
    SELECT id INTO test_doctor_id FROM doctors LIMIT 1;

    IF test_patient_id IS NOT NULL AND test_doctor_id IS NOT NULL THEN
        BEGIN
            INSERT INTO appointments (
                patient_id,
                doctor_id,
                appointment_date,
                appointment_time,
                status,
                reason_for_visit
            ) VALUES (
                test_patient_id,
                test_doctor_id,
                CURRENT_DATE + 1,
                '10:00:00',
                'approved', -- Invalid status
                'Test appointment'
            );

            RAISE NOTICE 'ERROR: Invalid appointment status was incorrectly accepted!';
        EXCEPTION WHEN invalid_text_representation THEN
            RAISE NOTICE 'SUCCESS: Invalid appointment status was correctly rejected';
        END;
    END IF;
END $$;

-- ================
-- TEST 3.5: Payment Status and Method Validation
-- ================

-- Step 1: List valid payment_status values
SELECT
    t.typname as enum_name,
    e.enumlabel as enum_value
FROM pg_type t
JOIN pg_enum e ON t.oid = e.enumtypid
WHERE t.typname = 'payment_status'
ORDER BY e.enumsortorder;
-- Expected: 'pending', 'paid', 'partially_paid', 'overdue', 'cancelled'

-- Step 2: List valid payment_method values
SELECT
    t.typname as enum_name,
    e.enumlabel as enum_value
FROM pg_type t
JOIN pg_enum e ON t.oid = e.enumtypid
WHERE t.typname = 'payment_method'
ORDER BY e.enumsortorder;
-- Expected: 'cash', 'credit_card', 'debit_card', 'bank_transfer', 'insurance'

-- Step 3: Test invalid payment status
DO $$
DECLARE
    test_patient_id UUID;
BEGIN
    SELECT id INTO test_patient_id FROM patients LIMIT 1;

    IF test_patient_id IS NOT NULL THEN
        BEGIN
            INSERT INTO invoices (patient_id, invoice_number, total_amount, status)
            VALUES (test_patient_id, 'INV-TEST-001', 100.00, 'refunded');

            RAISE NOTICE 'ERROR: Invalid payment status was incorrectly accepted!';
        EXCEPTION WHEN invalid_text_representation THEN
            RAISE NOTICE 'SUCCESS: Invalid payment status was correctly rejected';
        END;
    END IF;
END $$;


-- ========================================
-- TEST 4: RATING RANGE
-- ========================================
-- Purpose: Feedback ratings constrained by CHECK to 1-5
-- Test: Attempt to insert ratings outside the valid range
-- Expected: Database should refuse invalid ratings

-- Step 1: Verify the CHECK constraint exists
SELECT
    tc.constraint_name,
    tc.table_name,
    cc.check_clause
FROM information_schema.table_constraints tc
JOIN information_schema.check_constraints cc
    ON tc.constraint_name = cc.constraint_name
WHERE tc.table_name = 'feedback'
    AND tc.constraint_type = 'CHECK';

-- Step 2: Test with valid ratings (1-5) - should all SUCCEED
DO $$
DECLARE
    test_patient_id UUID;
    test_doctor_id UUID;
    test_rating INTEGER;
BEGIN
    SELECT id INTO test_patient_id FROM patients LIMIT 1;
    SELECT id INTO test_doctor_id FROM doctors LIMIT 1;

    IF test_patient_id IS NOT NULL AND test_doctor_id IS NOT NULL THEN
        -- Test all valid ratings
        FOR test_rating IN 1..5 LOOP
            BEGIN
                INSERT INTO feedback (patient_id, doctor_id, rating, comment)
                VALUES (test_patient_id, test_doctor_id, test_rating,
                        'Test rating: ' || test_rating);

                RAISE NOTICE 'SUCCESS: Rating % was accepted', test_rating;
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'ERROR: Valid rating % was rejected: %', test_rating, SQLERRM;
            END;
        END LOOP;

        -- Clean up
        DELETE FROM feedback WHERE comment LIKE 'Test rating:%';
    ELSE
        RAISE NOTICE 'SKIP: No test data available (need patient and doctor)';
    END IF;
END $$;

-- Step 3: Test with rating = 0 (should FAIL)
DO $$
DECLARE
    test_patient_id UUID;
    test_doctor_id UUID;
BEGIN
    SELECT id INTO test_patient_id FROM patients LIMIT 1;
    SELECT id INTO test_doctor_id FROM doctors LIMIT 1;

    IF test_patient_id IS NOT NULL AND test_doctor_id IS NOT NULL THEN
        BEGIN
            INSERT INTO feedback (patient_id, doctor_id, rating, comment)
            VALUES (test_patient_id, test_doctor_id, 0, 'Invalid rating: 0');

            RAISE NOTICE 'ERROR: Rating 0 was incorrectly accepted!';
        EXCEPTION WHEN check_violation THEN
            RAISE NOTICE 'SUCCESS: Rating 0 was correctly rejected';
        END;
    END IF;
END $$;

-- Step 4: Test with rating = 6 (should FAIL)
DO $$
DECLARE
    test_patient_id UUID;
    test_doctor_id UUID;
BEGIN
    SELECT id INTO test_patient_id FROM patients LIMIT 1;
    SELECT id INTO test_doctor_id FROM doctors LIMIT 1;

    IF test_patient_id IS NOT NULL AND test_doctor_id IS NOT NULL THEN
        BEGIN
            INSERT INTO feedback (patient_id, doctor_id, rating, comment)
            VALUES (test_patient_id, test_doctor_id, 6, 'Invalid rating: 6');

            RAISE NOTICE 'ERROR: Rating 6 was incorrectly accepted!';
        EXCEPTION WHEN check_violation THEN
            RAISE NOTICE 'SUCCESS: Rating 6 was correctly rejected';
        END;
    END IF;
END $$;

-- Step 5: Test with negative rating (should FAIL)
DO $$
DECLARE
    test_patient_id UUID;
    test_doctor_id UUID;
BEGIN
    SELECT id INTO test_patient_id FROM patients LIMIT 1;
    SELECT id INTO test_doctor_id FROM doctors LIMIT 1;

    IF test_patient_id IS NOT NULL AND test_doctor_id IS NOT NULL THEN
        BEGIN
            INSERT INTO feedback (patient_id, doctor_id, rating, comment)
            VALUES (test_patient_id, test_doctor_id, -5, 'Invalid rating: negative');

            RAISE NOTICE 'ERROR: Negative rating was incorrectly accepted!';
        EXCEPTION WHEN check_violation THEN
            RAISE NOTICE 'SUCCESS: Negative rating was correctly rejected';
        END;
    END IF;
END $$;

-- Step 6: Test with NULL rating (should SUCCEED as rating is nullable)
DO $$
DECLARE
    test_patient_id UUID;
    test_doctor_id UUID;
BEGIN
    SELECT id INTO test_patient_id FROM patients LIMIT 1;
    SELECT id INTO test_doctor_id FROM doctors LIMIT 1;

    IF test_patient_id IS NOT NULL AND test_doctor_id IS NOT NULL THEN
        BEGIN
            INSERT INTO feedback (patient_id, doctor_id, rating, comment)
            VALUES (test_patient_id, test_doctor_id, NULL, 'Test: NULL rating');

            RAISE NOTICE 'SUCCESS: NULL rating was accepted (as column is nullable)';

            -- Clean up
            DELETE FROM feedback WHERE comment = 'Test: NULL rating';
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'INFO: NULL rating handling: %', SQLERRM;
        END;
    END IF;
END $$;


-- ========================================
-- COMPREHENSIVE ENUM VALIDATION SUMMARY
-- ========================================
-- Query to list all enum types and their valid values in the database

SELECT
    t.typname as enum_type,
    STRING_AGG(e.enumlabel, ', ' ORDER BY e.enumsortorder) as valid_values
FROM pg_type t
JOIN pg_enum e ON t.oid = e.enumtypid
WHERE t.typname IN (
    'user_role',
    'user_status',
    'gender_type',
    'appointment_status',
    'payment_status',
    'payment_method',
    'notification_type'
)
GROUP BY t.typname
ORDER BY t.typname;


-- ========================================
-- CLEANUP QUERIES
-- ========================================

-- Remove all test feedback entries
DELETE FROM feedback WHERE comment LIKE 'Test%' OR comment LIKE 'Invalid%';

-- Verify all constraints are working
SELECT
    'Date Constraint' as test_type,
    COUNT(*) as active_constraints
FROM information_schema.check_constraints
WHERE check_clause LIKE '%appointment_date%'
UNION ALL
SELECT
    'Enum Types',
    COUNT(DISTINCT typname)
FROM pg_type
WHERE typname IN ('user_role', 'user_status', 'gender_type', 'appointment_status', 'payment_status', 'payment_method')
UNION ALL
SELECT
    'Rating Check',
    COUNT(*)
FROM information_schema.check_constraints cc
JOIN information_schema.table_constraints tc ON cc.constraint_name = tc.constraint_name
WHERE tc.table_name = 'feedback' AND cc.check_clause LIKE '%rating%';
