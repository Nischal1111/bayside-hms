# Database Setup Guide

## Overview
The Bayside Hospital Management System uses PostgreSQL as its database. This guide will help you set up and configure the database for local development and production hosting.

## Prerequisites
- PostgreSQL 12 or higher
- Database client (pgAdmin, DBeaver, or psql command line)

## Local Development Setup

### 1. Install PostgreSQL

**On Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```

**On macOS:**
```bash
brew install postgresql
brew services start postgresql
```

**On Windows:**
Download and install from [PostgreSQL Official Website](https://www.postgresql.org/download/windows/)

### 2. Create Database

```bash
# Login to PostgreSQL
sudo -u postgres psql

# Create database
CREATE DATABASE bayside_hms;

# Create user
CREATE USER bayside_admin WITH ENCRYPTED PASSWORD 'your_secure_password';

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE bayside_hms TO bayside_admin;

# Exit
\q
```

### 3. Run Schema

```bash
# Run the schema file
psql -U bayside_admin -d bayside_hms -f database/schema.sql
```

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
DATABASE_URL=postgresql://bayside_admin:your_secure_password@localhost:5432/bayside_hms
JWT_SECRET=your_very_secure_random_string_here
```

## Production Hosting Setup

### Option 1: Vercel + Supabase (Recommended for Next.js)

1. **Create Supabase Project:**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Copy the connection string

2. **Run Schema:**
   - In Supabase Dashboard, go to SQL Editor
   - Paste the contents of `database/schema.sql`
   - Click "Run"

3. **Configure Environment Variables in Vercel:**
   ```env
   DATABASE_URL=your_supabase_connection_string
   JWT_SECRET=your_secure_jwt_secret
   ```

### Option 2: Railway

1. **Create Railway Account:**
   - Go to [railway.app](https://railway.app)
   - Create new project
   - Add PostgreSQL service

2. **Get Connection String:**
   - Click on PostgreSQL service
   - Copy the connection string

3. **Connect and Run Schema:**
   ```bash
   psql your_railway_connection_string -f database/schema.sql
   ```

### Option 3: Heroku Postgres

1. **Create Heroku App:**
   ```bash
   heroku create your-app-name
   ```

2. **Add PostgreSQL:**
   ```bash
   heroku addons:create heroku-postgresql:hobby-dev
   ```

3. **Run Schema:**
   ```bash
   heroku pg:psql < database/schema.sql
   ```

### Option 4: Self-Hosted (VPS/Cloud)

1. **Install PostgreSQL on Server:**
   ```bash
   sudo apt update
   sudo apt install postgresql postgresql-contrib
   ```

2. **Configure PostgreSQL for Remote Access:**

   Edit `/etc/postgresql/[version]/main/postgresql.conf`:
   ```
   listen_addresses = '*'
   ```

   Edit `/etc/postgresql/[version]/main/pg_hba.conf`:
   ```
   host    all             all             0.0.0.0/0               md5
   ```

3. **Restart PostgreSQL:**
   ```bash
   sudo systemctl restart postgresql
   ```

4. **Create Database and User:**
   ```bash
   sudo -u postgres psql
   CREATE DATABASE bayside_hms;
   CREATE USER bayside_admin WITH ENCRYPTED PASSWORD 'secure_password';
   GRANT ALL PRIVILEGES ON DATABASE bayside_hms TO bayside_admin;
   \q
   ```

5. **Run Schema:**
   ```bash
   psql -U bayside_admin -d bayside_hms -h your_server_ip -f database/schema.sql
   ```

## Database Schema Overview

### Core Tables:

1. **users** - Authentication and user management
2. **patients** - Patient information and profiles
3. **doctors** - Doctor information and profiles
4. **admins** - Admin user profiles
5. **appointments** - Appointment scheduling
6. **medical_records** - Patient medical history
7. **medical_reports** - Medical test results and reports
8. **medications** - Prescription medications
9. **feedback** - Patient feedback for doctors
10. **invoices** - Billing information
11. **invoice_items** - Detailed invoice line items
12. **payments** - Payment transactions
13. **notifications** - System notifications
14. **messages** - Internal messaging

### Key Features:

- **UUID Primary Keys** - For better scalability and security
- **Enums** - For type safety (roles, status, etc.)
- **Indexes** - For query performance optimization
- **Triggers** - Auto-update timestamps
- **Foreign Keys** - Data integrity and relationships
- **Cascading Deletes** - Automatic cleanup of related records

## Environment Variables

Required environment variables for the application:

```env
# Database
DATABASE_URL=postgresql://username:password@host:port/database

# Authentication
JWT_SECRET=your_jwt_secret_key_minimum_32_characters

# Optional: For email functionality
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
```

## Backup and Restore

### Create Backup:
```bash
pg_dump -U bayside_admin bayside_hms > backup_$(date +%Y%m%d).sql
```

### Restore from Backup:
```bash
psql -U bayside_admin bayside_hms < backup_20250127.sql
```

## Security Best Practices

1. **Never commit** `.env` files to version control
2. **Use strong passwords** for database users
3. **Rotate JWT secrets** periodically
4. **Enable SSL** for production database connections
5. **Regular backups** - Set up automated daily backups
6. **Limit permissions** - Use separate users for read/write operations
7. **Monitor logs** - Enable query logging for security audits

## Troubleshooting

### Connection Issues:
```bash
# Test connection
psql -U bayside_admin -d bayside_hms -h localhost

# Check if PostgreSQL is running
sudo systemctl status postgresql
```

### Permission Issues:
```sql
-- Grant all permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO bayside_admin;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO bayside_admin;
```

### Reset Database:
```bash
# Drop and recreate
psql -U postgres
DROP DATABASE bayside_hms;
CREATE DATABASE bayside_hms;
\q

# Rerun schema
psql -U bayside_admin -d bayside_hms -f database/schema.sql
```

## Need Help?

For database-related issues:
1. Check PostgreSQL logs: `/var/log/postgresql/`
2. Verify environment variables are correctly set
3. Ensure database service is running
4. Check firewall settings for remote connections
