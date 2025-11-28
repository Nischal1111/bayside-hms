# MySQL Database Setup Guide

## Overview
The Bayside Hospital Management System uses MySQL as its database. This guide will help you set up and configure the database for local development and production hosting.

## Prerequisites
- MySQL 8.0 or higher
- Database client (MySQL Workbench, phpMyAdmin, or mysql command line)

## Local Development Setup

### 1. Install MySQL

**On Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
sudo mysql_secure_installation
```

**On macOS:**
```bash
brew install mysql
brew services start mysql
mysql_secure_installation
```

**On Windows:**
Download and install from [MySQL Official Website](https://dev.mysql.com/downloads/installer/)

### 2. Create Database

```bash
# Login to MySQL
sudo mysql -u root -p

# Create database
CREATE DATABASE bayside_hms CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Create user
CREATE USER 'bayside_admin'@'localhost' IDENTIFIED BY 'your_secure_password';

# Grant privileges
GRANT ALL PRIVILEGES ON bayside_hms.* TO 'bayside_admin'@'localhost';
FLUSH PRIVILEGES;

# Exit
EXIT;
```

### 3. Run Schema

```bash
# Run the schema file
mysql -u bayside_admin -p bayside_hms < database/schema-mysql.sql
```

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
DATABASE_URL=mysql://bayside_admin:your_secure_password@localhost:3306/bayside_hms
JWT_SECRET=your_very_secure_random_string_here
```

## Production Hosting Setup

### Option 1: Vercel + PlanetScale (Recommended)

**PlanetScale** is a serverless MySQL database platform that works perfectly with Next.js on Vercel.

1. **Create PlanetScale Account:**
   - Go to [planetscale.com](https://planetscale.com)
   - Create a new database
   - Get the connection string

2. **Import Schema:**
   ```bash
   # Install PlanetScale CLI
   brew install planetscale/tap/pscale

   # Connect to your database
   pscale connect bayside-hms main --port 3309

   # In another terminal, import schema
   mysql -h 127.0.0.1 -P 3309 -u root bayside_hms < database/schema-mysql.sql
   ```

3. **Deploy to Vercel:**
   ```bash
   # Install Vercel CLI
   npm install -g vercel

   # Deploy
   vercel

   # Add environment variables in Vercel Dashboard:
   DATABASE_URL=mysql://username:password@host/database?sslaccept=strict
   JWT_SECRET=your_secure_jwt_secret
   ```

### Option 2: Railway

Railway provides both hosting and MySQL database.

1. **Create Railway Account:**
   - Go to [railway.app](https://railway.app)
   - Create new project
   - Add MySQL service

2. **Get Connection String:**
   - Click on MySQL service
   - Copy the connection string
   - Format: `mysql://user:password@host:port/database`

3. **Deploy Application:**
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli

   # Login
   railway login

   # Link project
   railway link

   # Add environment variables
   railway variables set DATABASE_URL=mysql://...
   railway variables set JWT_SECRET=your_secret

   # Deploy
   railway up
   ```

4. **Import Schema:**
   ```bash
   # Using Railway CLI
   railway run mysql -h host -u user -p database < database/schema-mysql.sql
   ```

### Option 3: DigitalOcean App Platform + Managed MySQL

1. **Create DigitalOcean Account:**
   - Go to [digitalocean.com](https://digitalocean.com)
   - Create new App
   - Connect your GitHub repository

2. **Add Managed MySQL Database:**
   - In DigitalOcean dashboard, create Managed Database
   - Choose MySQL
   - Select plan and region
   - Get connection details

3. **Import Schema:**
   ```bash
   mysql -h your-db-host -u doadmin -p -P 25060 bayside_hms < database/schema-mysql.sql
   ```

4. **Configure App:**
   - Add environment variables in App settings:
   ```
   DATABASE_URL=mysql://doadmin:password@host:25060/bayside_hms?ssl-mode=REQUIRED
   JWT_SECRET=your_secure_secret
   ```

### Option 4: AWS (Elastic Beanstalk + RDS MySQL)

1. **Create RDS MySQL Instance:**
   ```bash
   # Using AWS CLI
   aws rds create-db-instance \
     --db-instance-identifier bayside-hms-db \
     --db-instance-class db.t3.micro \
     --engine mysql \
     --master-username admin \
     --master-user-password YourPassword123 \
     --allocated-storage 20
   ```

2. **Create Elastic Beanstalk Application:**
   ```bash
   eb init -p node.js bayside-hms
   eb create bayside-hms-env
   ```

3. **Set Environment Variables:**
   ```bash
   eb setenv DATABASE_URL=mysql://admin:password@endpoint:3306/bayside_hms
   eb setenv JWT_SECRET=your_secret
   ```

4. **Import Schema:**
   ```bash
   mysql -h your-rds-endpoint.rds.amazonaws.com -u admin -p bayside_hms < database/schema-mysql.sql
   ```

### Option 5: cPanel Hosting (Shared Hosting)

Perfect for budget-friendly hosting with traditional shared hosting providers.

1. **Create MySQL Database in cPanel:**
   - Login to cPanel
   - Go to "MySQL Databases"
   - Create database: `bayside_hms`
   - Create user: `bayside_admin`
   - Add user to database with ALL PRIVILEGES

2. **Import Schema:**
   - Go to phpMyAdmin in cPanel
   - Select your database
   - Click "Import"
   - Upload `database/schema-mysql.sql`
   - Click "Go"

3. **Deploy Application:**
   - Upload files via FTP or File Manager
   - Create `.env.local` file:
   ```env
   DATABASE_URL=mysql://bayside_admin:password@localhost:3306/bayside_hms
   JWT_SECRET=your_secret
   ```

4. **Install Node.js (if available):**
   - Some cPanel hosts support Node.js
   - Use "Setup Node.js App" in cPanel
   - Set document root and run `npm install && npm run build`

### Option 6: Self-Hosted (VPS/Cloud - Ubuntu)

1. **Install MySQL:**
   ```bash
   sudo apt update
   sudo apt install mysql-server
   sudo mysql_secure_installation
   ```

2. **Configure MySQL for Remote Access (if needed):**
   ```bash
   # Edit MySQL config
   sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf

   # Change bind-address to:
   bind-address = 0.0.0.0

   # Restart MySQL
   sudo systemctl restart mysql
   ```

3. **Create Database and User:**
   ```bash
   sudo mysql
   CREATE DATABASE bayside_hms;
   CREATE USER 'bayside_admin'@'%' IDENTIFIED BY 'secure_password';
   GRANT ALL PRIVILEGES ON bayside_hms.* TO 'bayside_admin'@'%';
   FLUSH PRIVILEGES;
   EXIT;
   ```

4. **Import Schema:**
   ```bash
   mysql -u bayside_admin -p bayside_hms < database/schema-mysql.sql
   ```

5. **Install Node.js and PM2:**
   ```bash
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt install -y nodejs

   # Install PM2
   sudo npm install -g pm2
   ```

6. **Deploy Application:**
   ```bash
   # Clone repository
   git clone your-repo-url
   cd bayside-hms

   # Install dependencies
   npm install

   # Create .env.local
   nano .env.local
   # Add your DATABASE_URL and JWT_SECRET

   # Build application
   npm run build

   # Start with PM2
   pm2 start npm --name "bayside-hms" -- start
   pm2 save
   pm2 startup
   ```

7. **Setup Nginx (Optional but recommended):**
   ```bash
   sudo apt install nginx

   # Create Nginx config
   sudo nano /etc/nginx/sites-available/bayside-hms
   ```

   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   ```bash
   # Enable site
   sudo ln -s /etc/nginx/sites-available/bayside-hms /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

8. **Setup SSL with Let's Encrypt:**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

## Database Connection String Formats

### Standard Format
```
mysql://username:password@host:port/database
```

### With SSL
```
mysql://username:password@host:port/database?ssl=true
```

### PlanetScale Format
```
mysql://username:password@host/database?ssl={"rejectUnauthorized":true}
```

### Local Development
```
mysql://bayside_admin:password@localhost:3306/bayside_hms
```

## Environment Variables

Required environment variables:

```env
# Database (MySQL)
DATABASE_URL=mysql://username:password@host:port/database

# Authentication
JWT_SECRET=your_secure_secret_minimum_32_characters

# Optional
NODE_ENV=production
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

- **UUID Primary Keys** - Using VARCHAR(36) for compatibility
- **Enums** - For type safety (roles, status, etc.)
- **Indexes** - For query performance optimization
- **Auto-update Timestamps** - ON UPDATE CURRENT_TIMESTAMP
- **Foreign Keys** - Data integrity and relationships
- **Cascading Deletes** - Automatic cleanup of related records
- **UTF8MB4 Encoding** - Full Unicode support including emojis

## Backup and Restore

### Create Backup:
```bash
mysqldump -u bayside_admin -p bayside_hms > backup_$(date +%Y%m%d).sql
```

### Restore from Backup:
```bash
mysql -u bayside_admin -p bayside_hms < backup_20250127.sql
```

### Automated Daily Backups (Cron):
```bash
# Edit crontab
crontab -e

# Add daily backup at 2 AM
0 2 * * * mysqldump -u bayside_admin -pYOUR_PASSWORD bayside_hms > /backups/bayside_$(date +\%Y\%m\%d).sql
```

## Security Best Practices

1. **Never commit** `.env` files to version control
2. **Use strong passwords** for database users
3. **Rotate JWT secrets** periodically
4. **Enable SSL** for production database connections
5. **Regular backups** - Set up automated daily backups
6. **Limit permissions** - Use separate users for read/write operations
7. **Monitor logs** - Enable query logging for security audits
8. **Firewall rules** - Restrict database access to application servers only
9. **Use prepared statements** - Already implemented in the code
10. **Keep MySQL updated** - Regular security patches

## Troubleshooting

### Connection Issues:
```bash
# Test connection
mysql -h localhost -u bayside_admin -p bayside_hms

# Check if MySQL is running
sudo systemctl status mysql
```

### Permission Issues:
```sql
-- Grant all permissions
GRANT ALL PRIVILEGES ON bayside_hms.* TO 'bayside_admin'@'localhost';
FLUSH PRIVILEGES;
```

### Reset Database:
```bash
# Drop and recreate
mysql -u root -p
DROP DATABASE bayside_hms;
CREATE DATABASE bayside_hms CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;

# Reimport schema
mysql -u bayside_admin -p bayside_hms < database/schema-mysql.sql
```

### Port Already in Use:
```bash
# Check what's using port 3306
sudo lsof -i :3306

# Change MySQL port (edit my.cnf)
sudo nano /etc/mysql/my.cnf
# Add: port = 3307
```

### Slow Queries:
```sql
-- Enable slow query log
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 2;

-- Check slow queries
SHOW VARIABLES LIKE 'slow_query%';
```

## Performance Optimization

### Enable Query Cache (MySQL < 8.0):
```sql
SET GLOBAL query_cache_type = ON;
SET GLOBAL query_cache_size = 67108864; -- 64MB
```

### Optimize Tables:
```sql
OPTIMIZE TABLE users, patients, doctors, appointments, medical_records;
```

### Add Indexes (if needed):
```sql
-- Example: Add index for frequently searched fields
CREATE INDEX idx_patient_name ON patients(first_name, last_name);
CREATE INDEX idx_appointment_date_range ON appointments(appointment_date, appointment_time);
```

## Need Help?

For database-related issues:
1. Check MySQL error logs: `/var/log/mysql/error.log`
2. Verify environment variables are correctly set
3. Ensure MySQL service is running
4. Check firewall settings for remote connections
5. Review connection string format

## Recommended MySQL Hosting Providers

1. **PlanetScale** - Serverless MySQL, free tier available, great for Next.js
2. **Railway** - Simple deployment, good free tier
3. **DigitalOcean** - Managed databases, reliable, affordable
4. **AWS RDS** - Highly scalable, enterprise-grade
5. **Aiven** - Managed MySQL with good free tier
6. **Clever Cloud** - European hosting with MySQL support
