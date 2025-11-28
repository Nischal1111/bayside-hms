/**
 * Create Admin Account Script
 * Run with: node scripts/create-admin.js
 */

const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

const ADMIN_EMAIL = 'admin@bayside-hms.com';
const ADMIN_PASSWORD = 'Admin@123456';
const ADMIN_FIRST_NAME = 'System';
const ADMIN_LAST_NAME = 'Administrator';
const ADMIN_PHONE = '+1234567890';

async function createAdmin() {
  let connection;

  try {
    // Create database connection
    connection = await mysql.createConnection(process.env.DATABASE_URL);

    console.log('Connected to database...');

    // Check if admin already exists
    const [existing] = await connection.execute(
      'SELECT id FROM users WHERE email = ?',
      [ADMIN_EMAIL]
    );

    if (existing.length > 0) {
      console.log('❌ Admin user already exists with email:', ADMIN_EMAIL);
      console.log('   Use password:', ADMIN_PASSWORD);
      process.exit(0);
    }

    // Hash password
    console.log('Hashing password...');
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);

    // Create admin user
    console.log('Creating admin user...');
    const [userResult] = await connection.execute(
      'INSERT INTO users (email, password_hash, role, status) VALUES (?, ?, ?, ?)',
      [ADMIN_EMAIL, passwordHash, 'admin', 'active']
    );

    const userId = userResult.insertId;

    // Create admin profile
    console.log('Creating admin profile...');
    await connection.execute(
      'INSERT INTO admins (user_id, first_name, last_name, phone_number) VALUES (?, ?, ?, ?)',
      [userId, ADMIN_FIRST_NAME, ADMIN_LAST_NAME, ADMIN_PHONE]
    );

    console.log('\n✅ Admin account created successfully!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:    ', ADMIN_EMAIL);
    console.log('🔑 Password: ', ADMIN_PASSWORD);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n🚀 You can now login at: http://localhost:3000/admin');
    console.log('\n⚠️  IMPORTANT: Change the password after first login!\n');

  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

createAdmin();
