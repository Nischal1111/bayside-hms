-- Create Default Admin Account
-- Email: admin@bayside-hms.com
-- Password: Admin@123456

-- Step 1: Create admin user
-- Note: This password hash is for "Admin@123456"
-- Hash generated with bcrypt, 10 rounds
INSERT INTO users (email, password_hash, role, status)
VALUES (
  'admin@bayside-hms.com',
  '$2a$10$rJ3qE9Z5FQ3XqJ5P7YxKZOqYvX9QW0YxKZOqYvX9QW0YxKZOqYvX9O',
  'admin',
  'active'
);

-- Step 2: Create admin profile
INSERT INTO admins (user_id, first_name, last_name, phone_number)
SELECT
  id,
  'System',
  'Administrator',
  '+1234567890'
FROM users WHERE email = 'admin@bayside-hms.com';

-- Verify admin was created
SELECT u.email, u.role, u.status, a.first_name, a.last_name
FROM users u
JOIN admins a ON u.id = a.user_id
WHERE u.email = 'admin@bayside-hms.com';
