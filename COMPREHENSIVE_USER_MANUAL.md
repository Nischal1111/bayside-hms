# BAYSIDE HOSPITAL MANAGEMENT SYSTEM
## COMPREHENSIVE USER MANUAL AND TECHNICAL DOCUMENTATION

**Project Title:** Bayside Hospital Management System (HMS)

**Group Members:**
- **Krischal Jung Thakuri** - Backend/Database Developer
- **Hillson** - Frontend Developer & UI/UX Designer
- **Niroj Shrestha** - Networking and Testing Specialist

**Submission Date:** December 7, 2025

---

## TABLE OF CONTENTS

1. [Introduction](#1-introduction)
2. [Hardware and Software Setup](#2-hardware-and-software-setup)
3. [System Configuration Guide](#3-system-configuration-guide)
4. [User Manual - Administrator](#4-user-manual-administrator)
5. [User Manual - Doctor](#5-user-manual-doctor)
6. [User Manual - Patient](#6-user-manual-patient)
7. [Networking Configuration](#7-networking-configuration)
8. [Security Testing and Implementation](#8-security-testing-and-implementation)
9. [System Usability and Functions](#9-system-usability-and-functions)
10. [Troubleshooting Guide](#10-troubleshooting-guide)

---

# 1. INTRODUCTION

## 1.1 Project Overview

The Bayside Hospital Management System (HMS) is a comprehensive, full-stack web application designed to modernize hospital operations. The system provides seamless interaction between patients, doctors, and administrators through a unified platform for appointment scheduling, electronic medical records (EMR) management, and administrative oversight.

**Key Objectives:**
- Streamline hospital workflow and reduce paperwork
- Enhance patient care through digital health records
- Improve appointment scheduling efficiency
- Provide role-based access control for security
- Enable real-time communication between stakeholders

## 1.2 System Architecture

**Technology Stack:**
- **Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS, Shadcn UI
- **Backend:** Next.js API Routes
- **Database:** MySQL 8.0+
- **Authentication:** JWT with bcrypt encryption
- **Deployment:** Vercel, Railway, or self-hosted VPS

---

# 2. HARDWARE AND SOFTWARE SETUP
**Prepared by: Krischal Jung Thakuri (Backend/Database Developer)**

## 2.1 Hardware Requirements

### Minimum Requirements (Development)
- **Processor:** Intel Core i3 / AMD Ryzen 3 or equivalent
- **RAM:** 4GB minimum (8GB recommended)
- **Storage:** 10GB free disk space
- **Network:** Stable internet connection

### Recommended Requirements (Production Server)
- **Processor:** Intel Core i5 / AMD Ryzen 5 or better (quad-core)
- **RAM:** 8GB minimum (16GB recommended for high traffic)
- **Storage:** 50GB SSD (for database and application files)
- **Network:** 100 Mbps internet connection with static IP
- **Backup Storage:** External or cloud backup solution

### Client Requirements (End Users)
- **Device:** Desktop, laptop, tablet, or smartphone
- **Browser:** Modern web browser (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- **Screen Resolution:** 1024x768 minimum (responsive design supports mobile)
- **Internet:** 5 Mbps minimum connection speed

## 2.2 Software Prerequisites

### Development Environment

**1. Operating System**
- Windows 10/11, macOS 10.15+, or Linux (Ubuntu 20.04+ recommended)

**2. Node.js and npm**
```bash
# Download and install Node.js 18+ from nodejs.org
# Verify installation:
node --version  # Should show v18.0.0 or higher
npm --version   # Should show 9.0.0 or higher
```

**3. MySQL Database Server**

**For Windows:**
- Download MySQL Installer from [mysql.com](https://dev.mysql.com/downloads/installer/)
- Run the installer and select "MySQL Server" and "MySQL Workbench"
- Set root password during installation
- Start MySQL service from Services panel

**For macOS:**
```bash
# Install using Homebrew
brew install mysql
brew services start mysql
mysql_secure_installation
```

**For Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
sudo mysql_secure_installation
```

**4. Git Version Control**
```bash
# Download from git-scm.com or install via package manager
# Verify:
git --version
```

**5. Code Editor (Optional but Recommended)**
- Visual Studio Code
- WebStorm
- Sublime Text

## 2.3 Installation Steps

### Step 1: Clone the Repository
```bash
git clone https://github.com/Nischal1111/bayside-hms.git
cd bayside-hms
```

### Step 2: Install Dependencies
```bash
npm install
```

This will install all required packages:
- Next.js framework
- React libraries
- Database drivers (mysql2)
- Authentication libraries (jose, bcrypt)
- UI components (Shadcn UI)
- Utility libraries (date-fns, lucide-react)

### Step 3: Database Setup

**Create MySQL Database:**
```bash
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE bayside_hms CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Create dedicated user
CREATE USER 'bayside_admin'@'localhost' IDENTIFIED BY 'YourSecurePassword123!';

# Grant privileges
GRANT ALL PRIVILEGES ON bayside_hms.* TO 'bayside_admin'@'localhost';
FLUSH PRIVILEGES;

# Exit MySQL
EXIT;
```

**Import Database Schema:**
```bash
mysql -u bayside_admin -p bayside_hms < database/schema-mysql.sql
```

**Verify Tables Created:**
```bash
mysql -u bayside_admin -p bayside_hms -e "SHOW TABLES;"
```

You should see 15+ tables including:
- users
- patients
- doctors
- admins
- appointments
- medical_records
- invoices
- feedback

### Step 4: Environment Configuration

Create `.env.local` file in the project root:

```env
# Database Configuration
DATABASE_URL=mysql://bayside_admin:YourSecurePassword123!@localhost:3306/bayside_hms

# JWT Secret (generate a random 32+ character string)
JWT_SECRET=your_very_secure_random_32_character_secret_key_here_12345

# Environment
NODE_ENV=development

# Optional: Port configuration
PORT=3000
```

**Generate Secure JWT Secret:**
```bash
# On Linux/macOS:
openssl rand -base64 32

# On Windows (PowerShell):
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

### Step 5: Create Admin Account
```bash
npm run create-admin
```

**Default Admin Credentials:**
- Email: `admin@bayside-hms.com`
- Password: `Admin@123456`

⚠️ **IMPORTANT:** Change this password immediately after first login!

### Step 6: Start the Development Server
```bash
npm run dev
```

The application will be available at: **http://localhost:3000**

### Step 7: Verify Installation

Open your browser and navigate to:
- **Homepage:** http://localhost:3000
- **Admin Login:** http://localhost:3000/admin
- **User Login:** http://localhost:3000/login
- **Registration:** http://localhost:3000/register

## 2.4 Production Deployment Setup

### Option 1: Vercel + PlanetScale (Recommended for Beginners)

**1. Install Vercel CLI:**
```bash
npm install -g vercel
```

**2. Deploy to Vercel:**
```bash
vercel
```

**3. Create PlanetScale Database:**
- Go to https://planetscale.com
- Create new database "bayside-hms"
- Get connection string

**4. Configure Environment Variables in Vercel:**
- Go to Vercel Dashboard → Settings → Environment Variables
- Add `DATABASE_URL` and `JWT_SECRET`

**5. Redeploy:**
```bash
vercel --prod
```

### Option 2: Self-Hosted VPS (Ubuntu Server)

**1. Initial Server Setup:**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install MySQL
sudo apt install mysql-server -y
sudo mysql_secure_installation

# Install PM2 (Process Manager)
sudo npm install -g pm2

# Install Nginx (Web Server)
sudo apt install nginx -y
```

**2. Deploy Application:**
```bash
# Clone repository
cd /var/www
sudo git clone https://github.com/Nischal1111/bayside-hms.git
cd bayside-hms

# Install dependencies
sudo npm install

# Create .env.local with production credentials

# Build application
sudo npm run build

# Start with PM2
sudo pm2 start npm --name "bayside-hms" -- start
sudo pm2 save
sudo pm2 startup
```

**3. Configure Nginx:**
```bash
sudo nano /etc/nginx/sites-available/bayside-hms
```

Add configuration:
```nginx
server {
    listen 80;
    server_name yourdomain.com;

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

**4. Enable Site and Restart Nginx:**
```bash
sudo ln -s /etc/nginx/sites-available/bayside-hms /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

**5. Setup SSL Certificate:**
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d yourdomain.com
```

## 2.5 Database Backup Configuration

**Create Backup Script:**
```bash
sudo nano /usr/local/bin/backup-bayside-db.sh
```

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/bayside-hms"
mkdir -p $BACKUP_DIR

mysqldump -u bayside_admin -p'YourPassword' bayside_hms > $BACKUP_DIR/backup_$DATE.sql

# Keep only last 7 days of backups
find $BACKUP_DIR -name "backup_*.sql" -mtime +7 -delete

echo "Backup completed: backup_$DATE.sql"
```

**Make Executable:**
```bash
sudo chmod +x /usr/local/bin/backup-bayside-db.sh
```

**Schedule Daily Backups:**
```bash
sudo crontab -e
# Add this line for daily backup at 2 AM:
0 2 * * * /usr/local/bin/backup-bayside-db.sh
```

---

# 3. SYSTEM CONFIGURATION GUIDE
**Prepared by: Krischal Jung Thakuri (Backend/Database Developer)**

## 3.1 Database Configuration

### Connection Pooling
The system uses connection pooling for optimal performance:

```javascript
// lib/db.ts configuration
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'bayside_admin',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'bayside_hms',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
```

### Database Optimization

**1. Create Indexes for Performance:**
```sql
-- Optimize appointment queries
CREATE INDEX idx_appointment_date ON appointments(appointment_date, appointment_time);
CREATE INDEX idx_appointment_doctor ON appointments(doctor_id);
CREATE INDEX idx_appointment_patient ON appointments(patient_id);

-- Optimize user lookups
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_user_role ON users(role);

-- Optimize medical records
CREATE INDEX idx_medical_record_patient ON medical_records(patient_id);
CREATE INDEX idx_medical_record_doctor ON medical_records(doctor_id);
```

**2. Regular Maintenance:**
```sql
-- Optimize tables monthly
OPTIMIZE TABLE users, patients, doctors, appointments, medical_records;

-- Analyze tables for query optimization
ANALYZE TABLE users, patients, doctors, appointments;
```

## 3.2 Security Configuration

### JWT Authentication Setup

**Token Expiration Settings:**
- Access Token: 24 hours
- Refresh Token: 7 days

**Modify in `lib/auth.ts`:**
```typescript
const token = await new SignJWT({ userId, role })
  .setProtectedHeader({ alg: 'HS256' })
  .setExpirationTime('24h')  // Adjust as needed
  .sign(secret);
```

### Password Policy

**Current Requirements:**
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

**Bcrypt Hash Rounds:**
- Development: 10 rounds
- Production: 12 rounds (more secure, slightly slower)

### CORS Configuration

**For production, update `next.config.ts`:**
```typescript
module.exports = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: 'https://yourdomain.com' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PATCH,DELETE' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ];
  },
};
```

---

# 4. USER MANUAL - ADMINISTRATOR
**Prepared by: Hillson (Frontend Developer & UI/UX Designer)**

## 4.1 Administrator Role Overview

Administrators are the system managers with the highest level of access. Their primary responsibilities include:
- Approving new doctor registrations
- Managing all users (patients and doctors)
- Monitoring system statistics and operations
- Overseeing appointment workflows
- Ensuring system integrity and security

## 4.2 Accessing the Admin Portal

### Login Process

**Step 1: Navigate to Admin Portal**
- Open browser and go to: `http://localhost:3000/admin`
- Or click "Admin Portal" button on the homepage

**Step 2: Enter Credentials**
- **Email:** `admin@bayside-hms.com`
- **Password:** `Admin@123456` (change after first login)

**Step 3: Click "Sign In"**
- You'll be redirected to the Admin Dashboard

### Password Change (First Login)

⚠️ **CRITICAL:** Change the default password immediately!

1. Click your profile icon in the top-right corner
2. Select "Settings" or "Profile"
3. Go to "Change Password"
4. Enter current password: `Admin@123456`
5. Enter new secure password (min 8 characters, include uppercase, lowercase, number, special character)
6. Confirm new password
7. Click "Update Password"

## 4.3 Admin Dashboard Overview

### Navigation Menu

The admin dashboard features a sidebar with the following sections:

**🏠 Dashboard** - Main overview with statistics
**👤 Pending Approvals** - New doctor registrations awaiting approval
**👨‍⚕️ Manage Doctors** - All approved doctors
**👥 Manage Patients** - All registered patients
**⚙️ Settings** - System configuration (future feature)

### Dashboard Statistics

The main dashboard displays key metrics:

**📊 Total Patients**
- Shows number of registered patients
- Click to view patient list

**👨‍⚕️ Total Doctors**
- Shows number of approved doctors
- Click to view doctor directory

**📅 Total Appointments**
- Shows all appointments in the system
- Includes pending, confirmed, and completed

**⏳ Pending Approvals**
- Shows doctors waiting for approval
- Red badge indicates action needed

## 4.4 Core Administrator Functions

### Function 1: Approve Doctor Registrations

**Purpose:** Verify and activate new doctor accounts

**Process:**

1. **Access Pending Approvals**
   - Click "Pending Approvals" in sidebar
   - System displays list of doctors waiting for approval

2. **Review Doctor Information**
   Each pending doctor shows:
   - Full name (First + Last)
   - Medical specialization
   - License number
   - Email address
   - Phone number
   - Registration date

3. **Verify Credentials**
   - Check license number validity
   - Verify specialization matches hospital needs
   - Confirm contact information

4. **Approve Doctor**
   - Click green "Approve" button next to doctor's name
   - Confirmation dialog appears: "Are you sure you want to approve Dr. [Name]?"
   - Click "Confirm"
   - Success message: "Doctor approved successfully"
   - Doctor receives activation notification
   - Doctor can now log in and access their dashboard

5. **Post-Approval**
   - Doctor appears in "Manage Doctors" section
   - Status changes to "Active"
   - Doctor can immediately start accepting appointments

**What Happens After Approval:**
- Doctor account status: `pending` → `approved`
- Doctor receives email notification (if configured)
- Doctor can log in at `/login`
- Doctor dashboard becomes accessible
- Patients can now book appointments with this doctor

### Function 2: Manage Doctors

**Purpose:** View and manage all active doctors

**Accessing Doctor Management:**
1. Click "Manage Doctors" in sidebar
2. System displays list of all approved doctors

**Doctor List Displays:**
- Doctor name
- Specialization (e.g., Cardiology, Pediatrics, Orthopedics)
- Phone number
- Email address
- Status badge (Active/Inactive)
- License number

**Available Actions:**

**View Doctor Details:**
- Click on doctor's row
- See complete profile information
- View appointment history
- See patient feedback ratings

**Search and Filter:**
- Search by name, specialization, or license number
- Filter by specialization
- Sort by name, date joined, or rating

**Doctor Statistics:**
- Total appointments handled
- Average patient rating
- Number of active patients
- Feedback count

### Function 3: Manage Patients

**Purpose:** View and manage all registered patients

**Accessing Patient Management:**
1. Click "Manage Patients" in sidebar
2. System displays list of all registered patients

**Patient List Displays:**
- Patient full name
- Email address
- Phone number
- Registration date
- Number of appointments
- Status (Active)

**Available Actions:**

**View Patient Details:**
- Click on patient's row
- See complete profile:
  - Personal information
  - Contact details
  - Emergency contact
  - Blood group
  - Date of birth
  - Address

**View Patient Medical History:**
- Appointment history
- Medical records
- Prescriptions received
- Invoices and billing

**Search and Filter:**
- Search by name, email, or phone
- Filter by registration date
- Sort by name or join date

### Function 4: Monitor System Statistics

**Real-Time Dashboard Metrics:**

**Patient Statistics:**
- Total registered patients
- New patients this month
- Active patients (had recent appointments)

**Doctor Statistics:**
- Total approved doctors
- Pending doctor approvals
- Doctors by specialization breakdown

**Appointment Statistics:**
- Total appointments (all time)
- Appointments today
- Pending appointments
- Completed appointments
- Cancelled appointments

**System Health:**
- Database connection status
- Last backup time
- System uptime

### Function 5: System Administration

**Access Control:**
- Only administrators can access `/dashboard/admin`
- Middleware automatically verifies admin role
- Unauthorized access redirects to login

**Audit Trail (Future Feature):**
- Track admin actions
- Log doctor approvals
- Monitor system changes

## 4.5 Admin Workflow Examples

### Scenario 1: New Doctor Joins Hospital

**Complete Workflow:**

1. **Doctor Registers**
   - Doctor goes to `/register`
   - Selects "Doctor" role
   - Fills in:
     - Name: Dr. Sarah Johnson
     - Email: sarah.johnson@hospital.com
     - Phone: +1-555-0123
     - License Number: MD-123456
     - Specialization: Cardiology
   - Clicks "Register"
   - Sees message: "Registration successful. Awaiting admin approval."

2. **Admin Receives Notification**
   - Admin dashboard shows "Pending Approvals: 1" (red badge)
   - Admin logs in to portal

3. **Admin Reviews Application**
   - Clicks "Pending Approvals"
   - Sees Dr. Sarah Johnson's application
   - Reviews:
     - License: MD-123456 ✓
     - Specialization: Cardiology ✓
     - Contact: +1-555-0123 ✓

4. **Admin Approves Doctor**
   - Clicks "Approve" button
   - Confirms approval
   - Success: "Dr. Sarah Johnson approved successfully"

5. **Doctor Can Now Work**
   - Dr. Johnson logs in at `/login`
   - Accesses doctor dashboard
   - Patients can book appointments
   - Can manage patient records

### Scenario 2: Monitoring Hospital Operations

**Daily Admin Tasks:**

**Morning (9:00 AM):**
1. Log in to admin dashboard
2. Check pending doctor approvals (if any)
3. Review today's appointment statistics
4. Monitor new patient registrations

**Midday (12:00 PM):**
1. Check appointment completion rates
2. Review any system alerts
3. Verify doctor availability

**Evening (5:00 PM):**
1. Review daily statistics
2. Check for pending issues
3. Prepare reports if needed

## 4.6 Admin Best Practices

**Security:**
- ✅ Change default password immediately
- ✅ Use strong, unique password
- ✅ Never share admin credentials
- ✅ Log out when finished
- ✅ Only approve verified doctors

**Data Management:**
- ✅ Regularly review user accounts
- ✅ Monitor system statistics
- ✅ Verify doctor credentials before approval
- ✅ Keep backup of critical data

**Efficiency:**
- ✅ Process doctor approvals promptly (within 24 hours)
- ✅ Respond to system issues quickly
- ✅ Monitor dashboard daily
- ✅ Keep patient and doctor lists organized

## 4.7 Admin Troubleshooting

**Issue 1: Cannot Approve Doctor**
- **Cause:** Database connection issue
- **Solution:**
  1. Refresh the page
  2. Check internet connection
  3. Contact technical support if persists

**Issue 2: Statistics Not Updating**
- **Cause:** Cache issue
- **Solution:**
  1. Hard refresh browser (Ctrl+F5 / Cmd+Shift+R)
  2. Clear browser cache
  3. Log out and log back in

**Issue 3: Cannot Access Admin Panel**
- **Cause:** Not logged in as admin or session expired
- **Solution:**
  1. Verify you're using admin credentials
  2. Log out completely
  3. Log back in with admin@bayside-hms.com

---

# 5. USER MANUAL - DOCTOR
**Prepared by: Hillson (Frontend Developer & UI/UX Designer)**

## 5.1 Doctor Role Overview

Doctors are medical professionals who use the system to:
- Manage patient appointments
- Create and maintain electronic medical records (EMR)
- View patient medical history
- Prescribe medications and treatments
- Receive patient feedback and ratings

## 5.2 Doctor Registration and Activation

### Step 1: Register for Account

**Navigate to Registration:**
- Go to `http://localhost:3000/register`
- Or click "Register" on homepage

**Fill Registration Form:**

1. **Personal Information**
   - First Name: [Your first name]
   - Last Name: [Your last name]
   - Email: [Your professional email]
   - Password: [Secure password with 8+ characters]
   - Confirm Password: [Same as above]

2. **Professional Information**
   - Phone Number: [Your contact number]
   - License Number: [Your medical license number]
   - Specialization: [Select from dropdown]
     - Cardiology
     - Dermatology
     - ENT
     - General Medicine
     - Gynecology
     - Neurology
     - Orthopedics
     - Pediatrics
     - Psychiatry
     - Radiology
     - Surgery

3. **Role Selection**
   - Select: **"Doctor"**

4. **Submit Registration**
   - Click "Register" button
   - You'll see: "Registration successful. Awaiting admin approval."

### Step 2: Wait for Admin Approval

⏳ **Approval Process:**
- Your application is sent to hospital administrators
- Admin will verify your credentials
- Typical approval time: 24-48 hours
- You'll receive notification when approved

### Step 3: Login After Approval

Once approved:
1. Go to `http://localhost:3000/login`
2. Enter your email and password
3. Click "Sign In"
4. You'll be redirected to: `/dashboard/doctor`

## 5.3 Doctor Dashboard Overview

### Navigation Menu

**🏠 Dashboard** - Overview and statistics
**📅 Appointments** - Manage patient appointments
**📄 Medical Records** - View records you've created
**💬 Patient Feedback** - View patient reviews and ratings

### Dashboard Statistics

**Total Appointments**
- Shows number of appointments scheduled with you
- Click to view appointment list

**Medical Records Created**
- Shows number of patient records you've created
- Click to view records

**Patient Feedback**
- Shows number of feedback received
- Displays average rating (out of 5 stars)

## 5.4 Core Doctor Functions

### Function 1: Manage Appointments

**Accessing Appointments:**
1. Click "Appointments" in sidebar
2. View list of all patient appointments

**Appointment Information Displayed:**
- Patient name
- Appointment date and time
- Reason for visit
- Current status (Pending/Confirmed/Completed/Cancelled)
- Patient contact information

**Appointment Actions:**

**A. Confirm Appointment**

When a patient books an appointment, it starts as "Pending."

1. Locate the pending appointment
2. Review:
   - Patient name
   - Scheduled time
   - Reason for visit
3. Click "Confirm" button
4. Status changes to "Confirmed"
5. Patient receives notification

**B. Complete Appointment**

After seeing the patient:

1. Find the confirmed appointment
2. Click "Complete" button
3. Status changes to "Completed"
4. Appointment moves to history

**C. Add Medical Record During/After Appointment**

This is a critical function:

1. In appointments list, find the patient
2. Click "Add Record" button
3. Medical Record form opens

4. **Fill Medical Record Form:**

   **Symptoms:**
   ```
   Example:
   - High fever (102°F)
   - Persistent cough for 5 days
   - Chest pain when breathing
   - Fatigue and weakness
   ```

   **Diagnosis:**
   ```
   Example:
   Acute Bronchitis
   Based on physical examination and patient-reported symptoms
   ```

   **Prescription:**
   ```
   Example:
   1. Amoxicillin 500mg - Take 3 times daily for 7 days
   2. Cough syrup (Dextromethorphan) - 10ml three times daily
   3. Paracetamol 500mg - As needed for fever (max 4 times daily)
   ```

   **Treatment Notes:**
   ```
   Example:
   - Advised complete bed rest for 3-4 days
   - Drink plenty of fluids (8-10 glasses water daily)
   - Avoid cold beverages
   - Follow-up after 7 days if symptoms persist
   - Emergency contact if fever exceeds 103°F
   ```

5. **Save Record**
   - Click "Save Medical Record"
   - Record is saved to database
   - Patient can immediately view it in their dashboard
   - Record is linked to this appointment

**D. View Appointment Details**

- Click on any appointment row
- See complete information:
  - Patient full profile
  - Medical history (previous records)
  - Previous appointments
  - Contact information
  - Emergency contact details

### Function 2: View and Manage Medical Records

**Accessing Medical Records:**
1. Click "Medical Records" in sidebar
2. View all records you've created

**Record List Displays:**
- Patient name
- Visit date
- Diagnosis summary
- Prescription given
- Treatment notes
- Record creation date

**Search and Filter:**
- Search by patient name
- Filter by date range
- Sort by recent/oldest

**View Full Record:**
- Click on any record
- See complete details:
  - Full symptoms
  - Complete diagnosis
  - All prescriptions
  - Treatment plan
  - Doctor notes

**Edit Record (if needed):**
1. Click "Edit" button
2. Modify information
3. Click "Update Record"
4. Changes are saved

### Function 3: View Patient Medical History

**Purpose:** Access complete patient health history before appointments

**How to Access:**

**Method 1: From Appointments**
1. Go to "Appointments"
2. Click on patient name
3. Click "View Medical History"
4. See all previous records for this patient

**Method 2: From Medical Records**
1. Go to "Medical Records"
2. Search for patient name
3. View all their records

**Medical History Shows:**
- All previous diagnoses
- All prescriptions received
- Treatment history
- Other doctors' notes (if any)
- Appointment timeline

**Benefits:**
- Make informed medical decisions
- Avoid prescription conflicts
- Track treatment progress
- Identify recurring issues

### Function 4: Review Patient Feedback

**Accessing Feedback:**
1. Click "Patient Feedback" in sidebar
2. View all feedback from patients you've treated

**Feedback Information:**
- Patient name
- Rating (1-5 stars) ⭐⭐⭐⭐⭐
- Written comments
- Feedback date
- Related appointment

**Feedback Example:**
```
⭐⭐⭐⭐⭐ 5/5 stars
Patient: John Doe
Date: December 5, 2025

"Dr. Smith was very professional and caring. Took time to explain
my condition clearly. The treatment worked perfectly. Highly
recommend!"
```

**Using Feedback:**
- Identify areas for improvement
- Understand patient satisfaction
- Track service quality
- Build professional reputation

## 5.5 Doctor Workflow Examples

### Scenario 1: Complete Patient Consultation

**Full Workflow from Appointment to Treatment:**

**Step 1: Patient Books Appointment**
- Patient: Jane Smith
- Date: December 7, 2025
- Time: 10:00 AM
- Reason: "Severe headache for 3 days"

**Step 2: Doctor Confirms (Morning of Appointment)**
1. Log in to doctor dashboard
2. Go to "Appointments"
3. See Jane Smith's appointment (Status: Pending)
4. Review reason: Severe headache
5. Click "Confirm"
6. Status: Confirmed

**Step 3: Consultation (10:00 AM)**
- Patient arrives
- Doctor conducts examination
- Takes notes during consultation

**Step 4: Create Medical Record**
1. In appointments, click "Add Record" for Jane Smith

2. **Enter Details:**

   **Symptoms:**
   ```
   - Severe frontal headache (pain level 8/10)
   - Sensitivity to light
   - Nausea
   - Headache worsens in the morning
   - No fever
   - No vision problems
   ```

   **Diagnosis:**
   ```
   Migraine with Aura
   Based on symptom pattern and physical examination.
   No signs of serious neurological issues.
   ```

   **Prescription:**
   ```
   1. Sumatriptan 50mg - Take 1 tablet at onset of headache (max 2 per day)
   2. Ibuprofen 400mg - Take every 6 hours if needed for pain
   3. Anti-nausea medication (Ondansetron 4mg) - As needed
   ```

   **Treatment Notes:**
   ```
   - Advised to maintain headache diary
   - Identify and avoid triggers (stress, certain foods, lack of sleep)
   - Stay hydrated (8 glasses water daily)
   - Avoid excessive screen time
   - Practice stress management techniques
   - Follow-up in 2 weeks if headaches persist
   - Return immediately if symptoms worsen or new symptoms appear
   ```

3. Click "Save Record"

**Step 5: Complete Appointment**
1. Click "Complete" for Jane Smith's appointment
2. Status: Completed

**Step 6: Patient Receives Access**
- Jane can now view her medical record
- Can see prescriptions
- Can download/print if needed

**Step 7: Patient Provides Feedback (Later)**
- Jane submits feedback:
  - Rating: 5 stars
  - Comment: "Very thorough examination. Medication is working great!"
- Doctor sees this in "Patient Feedback"

### Scenario 2: Managing Multiple Appointments

**Busy Day Schedule:**

**Morning - 9:00 AM to 12:00 PM**

1. **9:00 AM - First Appointment**
   - Patient: Mike Johnson
   - Reason: Annual checkup
   - Action: Confirm → Examine → Create record → Complete

2. **10:00 AM - Second Appointment**
   - Patient: Sarah Lee
   - Reason: Follow-up for diabetes
   - Action: Review previous records → Examine → Update treatment → Complete

3. **11:00 AM - Third Appointment**
   - Patient: David Brown
   - Reason: Persistent cough
   - Action: Confirm → Examine → Prescribe antibiotics → Complete

**Workflow:**
1. Start day: Check all appointments
2. Confirm all pending appointments
3. Review medical history for follow-ups
4. See patients
5. Create/update records
6. Complete appointments
7. End day: Review completed work

## 5.6 Doctor Best Practices

**Medical Record Documentation:**
- ✅ Be thorough and detailed
- ✅ Use clear, professional language
- ✅ Include all relevant symptoms
- ✅ Specify medication dosages precisely
- ✅ Provide clear treatment instructions
- ✅ Add follow-up recommendations

**Appointment Management:**
- ✅ Confirm appointments promptly
- ✅ Review patient history before appointments
- ✅ Complete appointments after patient visit
- ✅ Create medical records same day
- ✅ Keep appointments organized

**Patient Communication:**
- ✅ Provide clear prescriptions
- ✅ Explain treatment plans
- ✅ Add helpful notes for patients
- ✅ Specify when to return for follow-up
- ✅ Include emergency instructions

**Professional Standards:**
- ✅ Maintain patient confidentiality
- ✅ Keep accurate records
- ✅ Respond to feedback professionally
- ✅ Update medical records promptly
- ✅ Follow medical best practices

## 5.7 Doctor Troubleshooting

**Issue 1: Cannot Create Medical Record**
- **Possible Causes:**
  - Form validation error
  - Database connection issue
- **Solutions:**
  1. Check all required fields are filled
  2. Ensure symptoms, diagnosis, and prescription are not empty
  3. Refresh page and try again
  4. Contact admin if problem persists

**Issue 2: Appointments Not Showing**
- **Possible Causes:**
  - No appointments booked yet
  - Filter applied
- **Solutions:**
  1. Check if any patients have booked appointments
  2. Clear any date filters
  3. Refresh the page
  4. Verify you're logged in with correct account

**Issue 3: Cannot Access Patient Medical History**
- **Possible Causes:**
  - Patient has no previous records
  - Database query issue
- **Solutions:**
  1. Verify patient has previous appointments
  2. Check if other doctors created records
  3. Refresh and try again

---

# 6. USER MANUAL - PATIENT
**Prepared by: Hillson (Frontend Developer & UI/UX Designer)**

## 6.1 Patient Role Overview

Patients use the Bayside HMS to:
- Book appointments with doctors
- View their medical records and diagnoses
- Access prescriptions and treatment plans
- Provide feedback to doctors
- View and manage medical bills/invoices

## 6.2 Patient Registration

### Creating Your Account

**Step 1: Navigate to Registration Page**
- Go to `http://localhost:3000/register`
- Or click "Register" button on homepage

**Step 2: Fill Personal Information**

**Basic Details:**
- **First Name:** [Your first name]
- **Last Name:** [Your last name]
- **Email:** [Your email address] (used for login)
- **Password:** [Create secure password]
  - Minimum 8 characters
  - Include uppercase, lowercase, number, special character
- **Confirm Password:** [Re-enter same password]

**Contact Information:**
- **Phone Number:** [Your phone number]
  - Format: +1-555-0123 or 5550123
- **Address:** [Your complete address]
  - Example: "123 Main Street, Apt 4B, New York, NY 10001"

**Personal Details:**
- **Gender:** [Select from dropdown]
  - Male
  - Female
  - Other
- **Date of Birth:** [Select date]
  - Use calendar picker
  - Format: MM/DD/YYYY
- **Blood Group:** [Select from dropdown]
  - A+, A-, B+, B-, AB+, AB-, O+, O-

**Emergency Contact:**
- **Emergency Contact Name:** [Name of person to contact]
- **Emergency Contact Phone:** [Their phone number]

**Step 3: Select Role**
- Choose: **"Patient"**

**Step 4: Register**
- Review all information
- Click "Register" button
- You'll see: "Registration successful!"
- Patient accounts are **activated immediately** (no admin approval needed)

**Step 5: Login**
- Automatically redirected to login page
- Or go to `http://localhost:3000/login`
- Enter your email and password
- Click "Sign In"
- Redirected to: `/dashboard/patient`

## 6.3 Patient Dashboard Overview

### Navigation Menu

**🏠 Dashboard** - Overview and quick actions
**📅 Book Appointment** - Schedule doctor visits
**📄 Medical Records** - View your health records
**💬 Give Feedback** - Rate your doctors
**💳 Billing & Invoices** - View medical bills

### Dashboard Statistics

**Your Appointments**
- Total scheduled appointments
- Upcoming appointments
- Past appointments

**Medical Records**
- Total medical records
- Recent diagnoses
- Active prescriptions

**Invoices**
- Total invoices
- Pending payments
- Paid invoices

## 6.4 Core Patient Functions

### Function 1: Book an Appointment

**Purpose:** Schedule a consultation with a doctor

**Complete Booking Process:**

**Step 1: Access Booking Page**
1. Click "Book Appointment" in sidebar
2. Booking form appears

**Step 2: Select Doctor**
1. Click "Choose a doctor" dropdown
2. List shows all available doctors:
   ```
   Dr. Sarah Johnson - Cardiology
   Dr. Michael Chen - Pediatrics
   Dr. Emily Davis - Dermatology
   Dr. James Wilson - Orthopedics
   ```
3. Click on your preferred doctor
4. Doctor's name appears in the field

**Step 3: Select Appointment Date**
1. Calendar widget displays
2. **Rules:**
   - Can only select future dates (past dates are disabled)
   - Cannot select today if it's after working hours
   - Weekends may be disabled (depends on doctor availability)
3. Click on desired date
4. Date is highlighted

**Step 4: Select Appointment Time**
1. Click "Select time" dropdown
2. Available time slots appear:
   ```
   Morning Slots:
   - 09:00 AM
   - 10:00 AM
   - 11:00 AM

   Afternoon Slots:
   - 02:00 PM
   - 03:00 PM
   - 04:00 PM
   ```
3. **Notes:**
   - Booked slots are disabled or not shown
   - System prevents double-booking
4. Click on your preferred time

**Step 5: Enter Reason for Visit**
1. In "Reason for visit" text box, type your symptoms or reason
2. **Be specific and detailed:**
   ```
   Good examples:
   - "Persistent headache for 3 days, pain level 7/10"
   - "Annual checkup and blood pressure monitoring"
   - "Follow-up for diabetes treatment"
   - "Skin rash on arms, itching for 1 week"
   - "Chest pain and shortness of breath"
   ```

   ```
   Avoid vague reasons:
   - "Not feeling well"
   - "Checkup"
   - "Need to see doctor"
   ```

**Step 6: Review and Book**
1. Double-check all details:
   - Doctor: Dr. Sarah Johnson - Cardiology
   - Date: December 10, 2025
   - Time: 10:00 AM
   - Reason: Persistent headache for 3 days
2. Click "Book Appointment" button
3. System processes booking
4. Success message: "Appointment booked successfully!"
5. Appointment appears in "Your Appointments" list

**Step 7: View Your Booked Appointments**

On the right side of the booking page, you'll see "Your Appointments" card:

**Upcoming Appointments:**
```
┌─────────────────────────────────────┐
│ Dr. Sarah Johnson - Cardiology      │
│ December 10, 2025 at 10:00 AM      │
│ Status: Pending ⏳                  │
│ Reason: Persistent headache         │
└─────────────────────────────────────┘
```

**Appointment Status Legend:**
- 🟡 **Pending** - Doctor hasn't confirmed yet
- 🟢 **Confirmed** - Doctor confirmed, appointment scheduled
- ✅ **Completed** - Appointment finished
- 🔴 **Cancelled** - Appointment cancelled

### Function 2: View Medical Records

**Purpose:** Access your complete medical history

**Accessing Medical Records:**
1. Click "Medical Records" in sidebar
2. List of all your medical records appears

**Medical Record Information:**

Each record shows:
- **Doctor Name:** Who treated you
- **Visit Date:** When you were examined
- **Diagnosis:** What condition was identified
- **Prescription:** Medications prescribed
- **Treatment Notes:** Doctor's instructions

**Example Medical Record:**

```
┌──────────────────────────────────────────────────────┐
│ Medical Record #MR-2025-001234                       │
├──────────────────────────────────────────────────────┤
│ Doctor: Dr. Sarah Johnson (Cardiology)               │
│ Date: December 5, 2025                               │
│                                                      │
│ SYMPTOMS:                                            │
│ - Severe frontal headache (pain level 8/10)         │
│ - Sensitivity to light                               │
│ - Nausea                                             │
│ - Headache worsens in the morning                    │
│                                                      │
│ DIAGNOSIS:                                           │
│ Migraine with Aura                                   │
│ Based on symptom pattern and physical examination.   │
│                                                      │
│ PRESCRIPTION:                                        │
│ 1. Sumatriptan 50mg - Take 1 at onset of headache   │
│ 2. Ibuprofen 400mg - Every 6 hours as needed        │
│ 3. Ondansetron 4mg - For nausea as needed           │
│                                                      │
│ TREATMENT NOTES:                                     │
│ - Maintain headache diary                            │
│ - Avoid triggers (stress, certain foods)             │
│ - Stay hydrated (8 glasses water daily)              │
│ - Follow-up in 2 weeks if symptoms persist           │
└──────────────────────────────────────────────────────┘
```

**Actions You Can Take:**

**View Full Details:**
- Click on any record to expand
- See complete information

**Print Record:**
- Click "Print" button
- Record formatted for printing
- Save as PDF or print directly

**Download Record:**
- Click "Download" button
- Saves as PDF file
- Useful for sharing with other doctors

**Search Records:**
- Search by doctor name
- Search by diagnosis
- Filter by date range
- Sort by recent/oldest

**Benefits of Viewing Medical Records:**
- Track your health history
- Remember prescriptions
- Share with other healthcare providers
- Monitor treatment progress
- Keep personal health records

### Function 3: Give Feedback to Doctor

**Purpose:** Rate and review your doctor after appointment

**When to Give Feedback:**
- After appointment is completed
- After receiving treatment
- After reviewing your medical record

**Providing Feedback:**

**Step 1: Access Feedback Page**
1. Click "Give Feedback" in sidebar
2. Feedback form appears

**Step 2: Select Doctor**
1. Click "Select doctor" dropdown
2. List shows doctors you've had appointments with
3. Select the doctor you want to review

**Step 3: Rate the Doctor**
1. Star rating system appears (1-5 stars)
2. Click on stars to select rating:
   - ⭐ 1 star = Poor
   - ⭐⭐ 2 stars = Fair
   - ⭐⭐⭐ 3 stars = Good
   - ⭐⭐⭐⭐ 4 stars = Very Good
   - ⭐⭐⭐⭐⭐ 5 stars = Excellent

**Step 4: Write Your Feedback**
1. In "Your Feedback" text area, write your review
2. **Be honest and constructive:**

   **Good Feedback Examples:**
   ```
   5 Stars:
   "Dr. Johnson was exceptional! She took time to listen to all my
   concerns, explained my condition clearly, and the treatment is
   working perfectly. Very professional and caring. Highly recommend!"

   4 Stars:
   "Dr. Chen was very knowledgeable and professional. The wait time
   was a bit long, but the consultation was thorough and helpful."

   3 Stars:
   "The treatment was effective, but I felt the doctor was a bit rushed.
   Would appreciate more time for questions."
   ```

3. **Be specific:**
   - Mention what you liked
   - Mention areas for improvement
   - Keep it professional and respectful

**Step 5: Submit Feedback**
1. Review your rating and comments
2. Click "Submit Feedback" button
3. Success message: "Feedback submitted successfully!"
4. Doctor can now see your feedback
5. Helps improve service quality

**Feedback Guidelines:**
- ✅ Be honest and fair
- ✅ Be specific about your experience
- ✅ Keep it professional
- ✅ Mention both positives and negatives
- ❌ Don't include personal attacks
- ❌ Don't share confidential medical details publicly
- ❌ Don't use offensive language

### Function 4: View Billing and Invoices

**Purpose:** Track medical bills and payments

**Accessing Billing:**
1. Click "Billing & Invoices" in sidebar
2. List of all invoices appears

**Invoice Information:**

Each invoice shows:
- **Invoice Number:** Unique identifier (e.g., INV-2025-001234)
- **Date:** When invoice was generated
- **Doctor:** Who provided service
- **Service Description:** What service was provided
- **Amount:** Total amount due
- **Payment Status:** Paid/Pending/Overdue
- **Payment Method:** Cash/Card/Insurance

**Example Invoice:**

```
┌──────────────────────────────────────────────────────┐
│ INVOICE #INV-2025-001234                             │
├──────────────────────────────────────────────────────┤
│ Date: December 5, 2025                               │
│ Patient: John Doe                                    │
│ Doctor: Dr. Sarah Johnson (Cardiology)               │
│                                                      │
│ SERVICES:                                            │
│ - Consultation Fee                        $75.00    │
│ - Physical Examination                    $50.00    │
│ - Prescription                            $25.00    │
│                                                      │
│ Subtotal:                                $150.00    │
│ Tax (10%):                               $15.00     │
│ ─────────────────────────────────────────────────   │
│ TOTAL:                                   $165.00    │
│                                                      │
│ Payment Status: PAID ✅                              │
│ Payment Method: Credit Card                          │
│ Payment Date: December 5, 2025                       │
└──────────────────────────────────────────────────────┘
```

**Invoice Actions:**

**View Details:**
- Click on invoice to expand
- See itemized breakdown

**Download Invoice:**
- Click "Download" button
- Saves as PDF
- For your records or insurance

**Print Invoice:**
- Click "Print" button
- Printer-friendly format

**Payment Status:**
- 🟢 **Paid** - Payment received
- 🟡 **Pending** - Payment not yet made
- 🔴 **Overdue** - Payment past due date
- 🔵 **Partially Paid** - Partial payment received

## 6.5 Patient Workflow Examples

### Scenario 1: Complete Healthcare Journey

**From Booking to Treatment**

**Day 1: Book Appointment**
1. Patient: John Doe
2. Symptom: Persistent cough for 5 days
3. Log in to patient dashboard
4. Click "Book Appointment"
5. Select:
   - Doctor: Dr. Michael Chen (General Medicine)
   - Date: December 10, 2025
   - Time: 10:00 AM
   - Reason: "Persistent dry cough for 5 days, worse at night"
6. Click "Book Appointment"
7. Status: Pending

**Day 2: Doctor Confirms**
- Doctor reviews appointment
- Status changes to: Confirmed
- Patient sees update in dashboard

**Day 10: Appointment Day (10:00 AM)**
1. Patient arrives at hospital
2. Checks in
3. Doctor examines patient
4. Doctor creates medical record:
   - Diagnosis: Acute Bronchitis
   - Prescription: Antibiotics, cough syrup
   - Treatment notes: Rest, fluids, follow-up in 1 week
5. Appointment status: Completed

**Day 10: After Appointment (11:00 AM)**
1. Patient logs in to dashboard
2. Clicks "Medical Records"
3. Sees new record from Dr. Chen
4. Views diagnosis and prescription
5. Downloads record for reference

**Day 10: Later (3:00 PM)**
1. Patient clicks "Billing & Invoices"
2. Sees new invoice:
   - Consultation: $75
   - Examination: $50
   - Total: $125
3. Payment status: Pending
4. Makes payment (if applicable)

**Day 11: Provide Feedback**
1. Patient clicks "Give Feedback"
2. Selects Dr. Michael Chen
3. Rating: 5 stars ⭐⭐⭐⭐⭐
4. Comment: "Dr. Chen was very thorough and caring. The medication is working well. Thank you!"
5. Submits feedback

**Day 17: Follow-up (if needed)**
- If symptoms persist, book another appointment
- If recovered, healthcare journey complete

### Scenario 2: Managing Multiple Appointments

**Patient with Ongoing Treatment:**

**Weekly Schedule:**

**Week 1:**
- Book appointment with Dr. Johnson (Cardiology)
- Attend appointment
- Receive diagnosis: High blood pressure
- Get prescription and treatment plan

**Week 2:**
- Book follow-up with Dr. Johnson
- Check blood pressure results
- Adjust medication if needed

**Week 4:**
- Book appointment with Dr. Davis (Dermatology) for unrelated skin issue
- Attend appointment
- Receive separate treatment

**Managing Multiple Records:**
1. All records organized in "Medical Records"
2. Filter by doctor or date
3. Track different treatments separately
4. Monitor overall health

## 6.6 Patient Best Practices

**Appointment Booking:**
- ✅ Book appointments in advance
- ✅ Be specific about your symptoms
- ✅ Choose appropriate specialization
- ✅ Arrive on time for appointments
- ✅ Cancel if you can't make it (future feature)

**Medical Records:**
- ✅ Review records after each visit
- ✅ Download and save important records
- ✅ Keep personal health journal
- ✅ Share records with other doctors when needed
- ✅ Track medication adherence

**Communication:**
- ✅ Provide honest feedback
- ✅ Be clear about symptoms when booking
- ✅ Follow doctor's instructions
- ✅ Contact hospital for emergencies
- ✅ Keep contact information updated

**Privacy and Security:**
- ✅ Keep login credentials secure
- ✅ Log out after using public computers
- ✅ Don't share your account
- ✅ Update password regularly
- ✅ Verify you're on the correct website

## 6.7 Patient Troubleshooting

**Issue 1: Cannot Book Appointment**
- **Possible Causes:**
  - Selected past date
  - Time slot already booked
  - Doctor not available
- **Solutions:**
  1. Choose a future date
  2. Select different time slot
  3. Try different doctor
  4. Refresh page and try again

**Issue 2: Medical Records Not Showing**
- **Possible Causes:**
  - Doctor hasn't created record yet
  - Appointment not completed
  - Browser cache issue
- **Solutions:**
  1. Wait for doctor to create record (usually same day)
  2. Refresh the page
  3. Clear browser cache
  4. Contact hospital if records missing after 24 hours

**Issue 3: Forgot Password**
- **Solutions:**
  1. Click "Forgot Password" on login page (if feature available)
  2. Or contact hospital administration
  3. Verify your identity
  4. Reset password

**Issue 4: Invoice Not Showing**
- **Possible Causes:**
  - Invoice not generated yet
  - Billing processed separately
- **Solutions:**
  1. Check back after 24 hours
  2. Contact billing department
  3. Verify appointment was completed

---

# 7. NETWORKING CONFIGURATION
**Prepared by: Niroj Shrestha (Networking and Testing Specialist)**

## 7.1 Network Architecture Overview

The Bayside HMS is deployed using a standard 3-tier web architecture:

```
┌─────────────────────────────────────────┐
│         USER DEVICES (Clients)          │
│  Browsers, Mobile Apps, Desktops        │
└─────────────┬───────────────────────────┘
              │ HTTPS (Port 443)
              │ HTTP (Port 80)
              ▼
┌─────────────────────────────────────────┐
│      WEB SERVER / LOAD BALANCER         │
│  Nginx / Apache / Vercel Edge Network   │
└─────────────┬───────────────────────────┘
              │ Port 3000 (Internal)
              ▼
┌─────────────────────────────────────────┐
│       APPLICATION SERVER                │
│  Next.js Application (Node.js)          │
└─────────────┬───────────────────────────┘
              │ Port 3306 (MySQL)
              ▼
┌─────────────────────────────────────────┐
│       DATABASE SERVER                   │
│  MySQL 8.0+ Database                    │
└─────────────────────────────────────────┘
```

## 7.2 Network Configuration

### Port Configuration

**Required Open Ports:**

**Production Server:**
- **Port 80** - HTTP traffic (auto-redirect to HTTPS)
- **Port 443** - HTTPS encrypted traffic (primary)
- **Port 3000** - Next.js application (internal only)
- **Port 3306** - MySQL database (internal only, restrict external access)
- **Port 22** - SSH access (admin only, use key-based auth)

**Development:**
- **Port 3000** - Next.js development server
- **Port 3306** - MySQL local database

### Firewall Rules (Ubuntu UFW)

```bash
# Enable firewall
sudo ufw enable

# Allow SSH (admin access only)
sudo ufw allow 22/tcp

# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Deny external MySQL access (only allow local)
sudo ufw deny 3306/tcp

# Allow from specific IP if needed (e.g., backup server)
sudo ufw allow from 192.168.1.100 to any port 3306

# Check status
sudo ufw status verbose
```

### Windows Firewall Rules

```powershell
# Allow Next.js application
netsh advfirewall firewall add rule name="Bayside HMS - Next.js" dir=in action=allow protocol=TCP localport=3000

# Allow HTTP
netsh advfirewall firewall add rule name="Bayside HMS - HTTP" dir=in action=allow protocol=TCP localport=80

# Allow HTTPS
netsh advfirewall firewall add rule name="Bayside HMS - HTTPS" dir=in action=allow protocol=TCP localport=443

# Block external MySQL
netsh advfirewall firewall add rule name="Block MySQL External" dir=in action=block protocol=TCP localport=3306 remoteip=!127.0.0.1
```

## 7.3 Network Security Configuration

### SSL/TLS Certificate Setup (Let's Encrypt)

**Install Certbot:**
```bash
sudo apt install certbot python3-certbot-nginx -y
```

**Obtain Certificate:**
```bash
# For Nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# For Apache
sudo certbot --apache -d yourdomain.com
```

**Auto-renewal:**
```bash
# Test renewal
sudo certbot renew --dry-run

# Certbot automatically sets up cron job for renewal
# Verify:
sudo systemctl status certbot.timer
```

**Manual Certificate Renewal:**
```bash
sudo certbot renew
sudo systemctl reload nginx
```

### Nginx Configuration for Production

```nginx
# /etc/nginx/sites-available/bayside-hms

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name bayside-hms.com www.bayside-hms.com;
    return 301 https://$server_name$request_uri;
}

# HTTPS Server
server {
    listen 443 ssl http2;
    server_name bayside-hms.com www.bayside-hms.com;

    # SSL Certificates
    ssl_certificate /etc/letsencrypt/live/bayside-hms.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/bayside-hms.com/privkey.pem;

    # SSL Configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256';
    ssl_prefer_server_ciphers off;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Proxy to Next.js Application
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Static Files Caching
    location /_next/static {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 200 60m;
        proxy_cache_key "$scheme$request_method$host$request_uri";
        add_header Cache-Control "public, immutable, max-age=31536000";
    }

    # File Upload Size Limit
    client_max_body_size 10M;

    # Logging
    access_log /var/log/nginx/bayside-hms-access.log;
    error_log /var/log/nginx/bayside-hms-error.log;
}
```

### Database Network Security

**MySQL Configuration (`/etc/mysql/mysql.conf.d/mysqld.cnf`):**

```ini
[mysqld]
# Bind to localhost only (prevent external access)
bind-address = 127.0.0.1

# Or bind to specific internal IP
# bind-address = 192.168.1.10

# Skip external networking (maximum security)
# skip-networking

# Connection limits
max_connections = 100
connect_timeout = 10

# SSL Configuration (optional but recommended)
# ssl-ca=/etc/mysql/ssl/ca-cert.pem
# ssl-cert=/etc/mysql/ssl/server-cert.pem
# ssl-key=/etc/mysql/ssl/server-key.pem
```

**Restart MySQL:**
```bash
sudo systemctl restart mysql
```

## 7.4 Load Balancing Configuration (Optional - High Traffic)

### Nginx as Load Balancer

```nginx
# Define upstream servers
upstream bayside_backend {
    least_conn;  # Load balancing method
    server 192.168.1.10:3000 weight=3;
    server 192.168.1.11:3000 weight=2;
    server 192.168.1.12:3000 backup;
}

server {
    listen 443 ssl http2;
    server_name bayside-hms.com;

    # SSL configuration...

    location / {
        proxy_pass http://bayside_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;

        # Health check parameters
        proxy_next_upstream error timeout invalid_header http_500;
        proxy_connect_timeout 2s;
    }
}
```

## 7.5 Network Monitoring

### Monitor Network Traffic

**Install iftop:**
```bash
sudo apt install iftop
sudo iftop -i eth0
```

**Monitor Active Connections:**
```bash
# View current connections
sudo netstat -tuln

# Monitor MySQL connections
sudo netstat -an | grep 3306

# Monitor web traffic
sudo netstat -an | grep :80
sudo netstat -an | grep :443
```

### Log Monitoring

**Nginx Access Logs:**
```bash
# Real-time monitoring
sudo tail -f /var/log/nginx/bayside-hms-access.log

# Check for errors
sudo tail -f /var/log/nginx/bayside-hms-error.log

# Analyze traffic patterns
sudo cat /var/log/nginx/bayside-hms-access.log | awk '{print $1}' | sort | uniq -c | sort -rn | head -20
```

**Application Logs:**
```bash
# PM2 logs
pm2 logs bayside-hms

# System logs
sudo journalctl -u nginx -f
sudo journalctl -u mysql -f
```

## 7.6 Network Performance Optimization

### Enable Gzip Compression (Nginx)

```nginx
# Add to nginx.conf or server block
gzip on;
gzip_vary on;
gzip_proxied any;
gzip_comp_level 6;
gzip_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml+rss application/rss+xml font/truetype font/opentype application/vnd.ms-fontobject image/svg+xml;
gzip_disable "msie6";
```

### Connection Keepalive

```nginx
# In http block
keepalive_timeout 65;
keepalive_requests 100;
```

### Database Connection Pooling

Already configured in `lib/db.ts`:
```javascript
const pool = mysql.createPool({
  connectionLimit: 10,  // Adjust based on traffic
  queueLimit: 0,
  waitForConnections: true
});
```

## 7.7 Network Troubleshooting

### Test Network Connectivity

**1. Test Application Availability:**
```bash
# Check if Next.js is running
curl http://localhost:3000

# Check via domain
curl https://bayside-hms.com

# Test with headers
curl -I https://bayside-hms.com
```

**2. Test Database Connection:**
```bash
# From application server
mysql -h localhost -u bayside_admin -p -e "SELECT 1;"

# Test from different server (should fail if configured correctly)
mysql -h your-server-ip -u bayside_admin -p
```

**3. Check Port Accessibility:**
```bash
# Check if port is listening
sudo netstat -tuln | grep :3000
sudo netstat -tuln | grep :3306
sudo netstat -tuln | grep :443

# Test port from external
telnet your-server-ip 80
telnet your-server-ip 443
```

**4. DNS Resolution:**
```bash
# Check DNS
nslookup bayside-hms.com
dig bayside-hms.com

# Test SSL certificate
openssl s_client -connect bayside-hms.com:443 -showcerts
```

### Common Network Issues

**Issue 1: Cannot Connect to Application**
```bash
# Check if Next.js is running
pm2 list

# Check if port 3000 is listening
sudo lsof -i :3000

# Check Nginx status
sudo systemctl status nginx

# Check firewall
sudo ufw status
```

**Issue 2: Database Connection Timeout**
```bash
# Check MySQL status
sudo systemctl status mysql

# Check MySQL connections
mysql -u root -p -e "SHOW PROCESSLIST;"

# Check connection limits
mysql -u root -p -e "SHOW VARIABLES LIKE 'max_connections';"
```

**Issue 3: SSL Certificate Errors**
```bash
# Test certificate
sudo certbot certificates

# Renew certificate
sudo certbot renew --force-renewal

# Check certificate expiry
openssl x509 -in /etc/letsencrypt/live/bayside-hms.com/fullchain.pem -text -noout | grep "Not After"
```

---

# 8. SECURITY TESTING AND IMPLEMENTATION
**Prepared by: Niroj Shrestha (Networking and Testing Specialist)**

## 8.1 Security Architecture Overview

The Bayside HMS implements multiple layers of security:

```
┌─────────────────────────────────────────────┐
│      Layer 1: Network Security               │
│  - Firewall rules                            │
│  - SSL/TLS encryption                        │
│  - DDoS protection                           │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│      Layer 2: Application Security           │
│  - HTTPS enforcement                         │
│  - Security headers                          │
│  - Input validation                          │
│  - CSRF protection                           │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│      Layer 3: Authentication & Authorization │
│  - JWT tokens                                │
│  - Role-Based Access Control (RBAC)          │
│  - Password hashing (bcrypt)                 │
│  - Session management                        │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│      Layer 4: Database Security              │
│  - Parameterized queries                     │
│  - SQL injection prevention                  │
│  - Encrypted connections                     │
│  - Least privilege access                    │
└─────────────────────────────────────────────┘
```

## 8.2 Authentication Security

### Password Security Implementation

**Bcrypt Hashing:**

The system uses bcrypt with 10 salt rounds for password hashing:

```typescript
// When user registers
import bcrypt from 'bcrypt';

// Hash password
const saltRounds = 10;
const passwordHash = await bcrypt.hash(password, saltRounds);

// Store passwordHash in database (never store plain password)
```

**Login Verification:**

```typescript
// When user logs in
const isValid = await bcrypt.compare(password, storedPasswordHash);

if (isValid) {
  // Generate JWT token
  // Allow login
} else {
  // Reject login attempt
}
```

**Password Requirements:**

```typescript
// Validation regex
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-z\d@$!%*?&]{8,}$/;

// Requirements:
// - Minimum 8 characters
// - At least one uppercase letter
// - At least one lowercase letter
// - At least one digit
// - At least one special character (@$!%*?&)
```

### JWT Token Security

**Token Generation:**

```typescript
import { SignJWT } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

const token = await new SignJWT({
  userId: user.id,
  role: user.role
})
  .setProtectedHeader({ alg: 'HS256' })
  .setIssuedAt()
  .setExpirationTime('24h')  // Token expires in 24 hours
  .sign(secret);
```

**Token Storage:**

- Stored in HTTP-only cookies (not accessible via JavaScript)
- Secure flag enabled in production (HTTPS only)
- SameSite attribute prevents CSRF attacks

```typescript
// Set cookie with security flags
cookies().set('token', token, {
  httpOnly: true,        // Prevents XSS attacks
  secure: process.env.NODE_ENV === 'production',  // HTTPS only
  sameSite: 'strict',    // CSRF protection
  maxAge: 86400          // 24 hours
});
```

**Token Verification:**

```typescript
import { jwtVerify } from 'jose';

try {
  const { payload } = await jwtVerify(token, secret);
  // Token is valid, user is authenticated
  const userId = payload.userId;
  const role = payload.role;
} catch (error) {
  // Token is invalid or expired
  // Redirect to login
}
```

### Role-Based Access Control (RBAC)

**Middleware Protection:**

```typescript
// middleware.ts
export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const { payload } = await jwtVerify(token, secret);

    // Check role-based access
    const pathname = request.nextUrl.pathname;
    const role = payload.role;

    // Admin-only routes
    if (pathname.startsWith('/dashboard/admin') && role !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    // Doctor-only routes
    if (pathname.startsWith('/dashboard/doctor') && role !== 'doctor') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    // Patient-only routes
    if (pathname.startsWith('/dashboard/patient') && role !== 'patient') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}
```

**API Route Protection:**

```typescript
// Example: /api/admin/approve-doctor
export async function POST(request: Request) {
  // Verify user is admin
  const user = await getAuthUser(request);

  if (!user || user.role !== 'admin') {
    return NextResponse.json(
      { error: 'Unauthorized. Admin access required.' },
      { status: 403 }
    );
  }

  // Proceed with admin-only operation
}
```

## 8.3 SQL Injection Prevention

### Parameterized Queries

**NEVER use string concatenation:**

```typescript
// ❌ VULNERABLE - DON'T DO THIS
const email = request.body.email;
const query = `SELECT * FROM users WHERE email = '${email}'`;
// Attacker could input: admin'--
// Query becomes: SELECT * FROM users WHERE email = 'admin'--'
```

**✅ ALWAYS use parameterized queries:**

```typescript
// ✅ SAFE - DO THIS
const email = request.body.email;
const query = 'SELECT * FROM users WHERE email = ?';
const [rows] = await pool.execute(query, [email]);

// Even if attacker inputs: admin'--
// It's treated as literal string, not SQL code
```

### Input Validation and Sanitization

**Email Validation:**

```typescript
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Before database query
if (!isValidEmail(email)) {
  return NextResponse.json(
    { error: 'Invalid email format' },
    { status: 400 }
  );
}
```

**Phone Number Validation:**

```typescript
function isValidPhone(phone: string): boolean {
  // Remove spaces, dashes, parentheses
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');

  // Check if it's 10-15 digits
  return /^\d{10,15}$/.test(cleaned);
}
```

**SQL Injection Test Cases:**

```typescript
// Test inputs that should be safely handled:
const testCases = [
  "admin'--",
  "' OR '1'='1",
  "'; DROP TABLE users;--",
  "<script>alert('XSS')</script>",
  "../../etc/passwd",
  "1; DELETE FROM users WHERE 1=1--"
];

// All should be treated as literal strings, not executed
```

## 8.4 Cross-Site Scripting (XSS) Prevention

### Output Encoding

React automatically escapes output, but be careful with:

```typescript
// ❌ DANGEROUS - Can execute scripts
<div dangerouslySetInnerHTML={{__html: userInput}} />

// ✅ SAFE - React automatically escapes
<div>{userInput}</div>

// ✅ SAFE - Use DOMPurify for HTML content if needed
import DOMPurify from 'dompurify';
const clean = DOMPurify.sanitize(userInput);
<div dangerouslySetInnerHTML={{__html: clean}} />
```

### Content Security Policy (CSP)

**Add to Nginx configuration:**

```nginx
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;" always;
```

**Or in Next.js headers:**

```javascript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline'"
          }
        ]
      }
    ];
  }
};
```

## 8.5 Cross-Site Request Forgery (CSRF) Prevention

### SameSite Cookie Attribute

```typescript
// Already implemented in cookie setting
cookies().set('token', token, {
  sameSite: 'strict',  // Prevents CSRF
  // ...other options
});
```

### CSRF Token (Additional Layer)

```typescript
// Generate CSRF token
import crypto from 'crypto';

const csrfToken = crypto.randomBytes(32).toString('hex');

// Store in session
cookies().set('csrf-token', csrfToken, {
  httpOnly: true,
  sameSite: 'strict'
});

// Verify on form submission
const submittedToken = request.body.csrfToken;
const sessionToken = request.cookies.get('csrf-token')?.value;

if (submittedToken !== sessionToken) {
  return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 });
}
```

## 8.6 Security Headers

### Comprehensive Security Headers (Nginx)

```nginx
# Prevent clickjacking
add_header X-Frame-Options "SAMEORIGIN" always;

# Prevent MIME-type sniffing
add_header X-Content-Type-Options "nosniff" always;

# Enable XSS filter
add_header X-XSS-Protection "1; mode=block" always;

# HTTP Strict Transport Security (force HTTPS)
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;

# Content Security Policy
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';" always;

# Referrer Policy
add_header Referrer-Policy "strict-origin-when-cross-origin" always;

# Permissions Policy
add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;
```

### Verify Headers

```bash
# Test security headers
curl -I https://bayside-hms.com

# Use online tools
# https://securityheaders.com
# https://observatory.mozilla.org
```

## 8.7 Security Testing

### Test 1: SQL Injection Testing

**Automated Testing:**

```bash
# Install sqlmap
sudo apt install sqlmap

# Test login endpoint
sqlmap -u "http://localhost:3000/api/auth/login" \
  --data="email=test@test.com&password=test" \
  --method=POST \
  --risk=3 \
  --level=5
```

**Manual Testing:**

```bash
# Test login with SQL injection attempts
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin'\''--","password":"anything"}'

# Expected: Should return error, not bypass authentication
```

**Test Cases:**

| Input | Expected Result |
|-------|----------------|
| `admin'--` | Treated as literal string, login fails |
| `' OR '1'='1` | Treated as literal, login fails |
| `'; DROP TABLE users;--` | No tables dropped, login fails |

### Test 2: XSS Testing

**Test Input Fields:**

```bash
# Test appointment reason field
<script>alert('XSS')</script>

# Test feedback comments
<img src=x onerror="alert('XSS')">

# Test medical notes
<iframe src="javascript:alert('XSS')"></iframe>
```

**Expected Results:**
- All script tags should be escaped: `&lt;script&gt;`
- No JavaScript execution
- Content displayed as plain text

### Test 3: Authentication Bypass Testing

**Test Cases:**

```bash
# 1. Access protected route without token
curl http://localhost:3000/dashboard/admin

# Expected: Redirect to /login

# 2. Access admin route with patient token
# Login as patient, copy token
curl http://localhost:3000/dashboard/admin \
  -H "Cookie: token=patient_token_here"

# Expected: Redirect to /unauthorized or /login

# 3. Expired token
# Use old/expired token
curl http://localhost:3000/dashboard/patient \
  -H "Cookie: token=expired_token"

# Expected: Redirect to /login

# 4. Tampered token
curl http://localhost:3000/dashboard/patient \
  -H "Cookie: token=invalid_signature"

# Expected: Redirect to /login
```

### Test 4: Password Security Testing

**Password Strength Testing:**

```typescript
const testPasswords = [
  { password: '12345678', valid: false },           // No uppercase, special
  { password: 'password', valid: false },           // No uppercase, digit, special
  { password: 'Password', valid: false },           // No digit, special
  { password: 'Password1', valid: false },          // No special character
  { password: 'Password1!', valid: true },          // Valid
  { password: 'P@ssw0rd!', valid: true },           // Valid
  { password: 'MyP@ss123', valid: true },           // Valid
];

// Test each password
testPasswords.forEach(test => {
  const isValid = passwordRegex.test(test.password);
  console.assert(isValid === test.valid, `Password test failed: ${test.password}`);
});
```

**Password Hashing Verification:**

```typescript
// Test that passwords are never stored in plain text
const result = await pool.execute(
  'SELECT password_hash FROM users WHERE email = ?',
  ['test@test.com']
);

const storedHash = result[0].password_hash;

// Verify it's a bcrypt hash (starts with $2b$)
console.assert(storedHash.startsWith('$2b$'), 'Password must be hashed');

// Verify it's different from original password
console.assert(storedHash !== 'original_password', 'Password must not be plain text');
```

### Test 5: CSRF Protection Testing

```bash
# Attempt CSRF attack
# Create malicious HTML page:
cat > csrf_attack.html << 'EOF'
<html>
<body>
<form action="http://localhost:3000/api/appointments" method="POST">
  <input type="hidden" name="doctor_id" value="malicious_id">
  <input type="hidden" name="date" value="2025-12-10">
</form>
<script>document.forms[0].submit();</script>
</body>
</html>
EOF

# Open in browser while logged in
# Expected: Request should be blocked due to SameSite cookie
```

### Test 6: Rate Limiting (Optional Enhancement)

**Implement Rate Limiting:**

```typescript
// Install: npm install express-rate-limit

import rateLimit from 'express-rate-limit';

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 5,                     // Max 5 login attempts
  message: 'Too many login attempts. Please try again after 15 minutes.'
});

// Apply to login route
app.post('/api/auth/login', loginLimiter, async (req, res) => {
  // Login logic
});
```

**Test Rate Limiting:**

```bash
# Attempt multiple logins
for i in {1..10}; do
  curl -X POST http://localhost:3000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"wrong"}'
  echo "Attempt $i"
done

# Expected: After 5 attempts, receive "Too many login attempts" error
```

## 8.8 Security Audit Checklist

### Pre-Deployment Security Checklist

- [ ] **Authentication**
  - [ ] Passwords hashed with bcrypt (10+ rounds)
  - [ ] JWT tokens properly signed and verified
  - [ ] Token expiration implemented (24 hours)
  - [ ] HTTP-only, Secure, SameSite cookies
  - [ ] Password complexity requirements enforced

- [ ] **Authorization**
  - [ ] Role-based access control (RBAC) implemented
  - [ ] Middleware protects all protected routes
  - [ ] API routes verify user roles
  - [ ] Admin routes accessible only to admins
  - [ ] Doctor routes accessible only to doctors
  - [ ] Patient routes accessible only to patients

- [ ] **SQL Injection Prevention**
  - [ ] All queries use parameterized statements
  - [ ] No string concatenation in SQL queries
  - [ ] Input validation on all user inputs
  - [ ] Special characters properly escaped

- [ ] **XSS Prevention**
  - [ ] Output properly encoded
  - [ ] React's automatic escaping utilized
  - [ ] No dangerouslySetInnerHTML without sanitization
  - [ ] Content Security Policy headers configured

- [ ] **CSRF Prevention**
  - [ ] SameSite cookie attribute set to 'strict'
  - [ ] CSRF tokens implemented (if needed)
  - [ ] State-changing requests use POST/PATCH/DELETE

- [ ] **Network Security**
  - [ ] HTTPS enforced (SSL/TLS configured)
  - [ ] HTTP redirects to HTTPS
  - [ ] Security headers configured
  - [ ] Firewall rules properly set
  - [ ] Database not accessible externally

- [ ] **Database Security**
  - [ ] Database user has limited privileges
  - [ ] Root account not used for application
  - [ ] Database bound to localhost only
  - [ ] Regular backups configured
  - [ ] Sensitive data encrypted at rest (if required)

- [ ] **Session Management**
  - [ ] Session timeout implemented
  - [ ] Logout properly clears session
  - [ ] Concurrent session handling
  - [ ] Token refresh mechanism (if needed)

- [ ] **Error Handling**
  - [ ] No sensitive information in error messages
  - [ ] Generic error messages for authentication failures
  - [ ] Detailed errors logged server-side only
  - [ ] Stack traces not exposed to users

- [ ] **Data Validation**
  - [ ] Client-side validation implemented
  - [ ] Server-side validation enforced
  - [ ] Email format validated
  - [ ] Phone number format validated
  - [ ] Date/time inputs validated
  - [ ] File upload restrictions (if applicable)

## 8.9 Incident Response Plan

### In Case of Security Breach

**Immediate Actions:**

1. **Isolate the System**
   ```bash
   # Stop application
   pm2 stop bayside-hms

   # Block all incoming traffic temporarily
   sudo ufw deny incoming
   ```

2. **Assess the Damage**
   - Check access logs
   - Identify compromised accounts
   - Determine data breach scope

3. **Preserve Evidence**
   ```bash
   # Backup all logs
   sudo cp -r /var/log /backup/incident-logs-$(date +%Y%m%d)

   # Database snapshot
   mysqldump -u root -p bayside_hms > /backup/incident-db-$(date +%Y%m%d).sql
   ```

4. **Notify Stakeholders**
   - Inform hospital administration
   - Notify affected users (if personal data compromised)
   - Report to authorities (if required by law)

5. **Remediation**
   - Patch vulnerabilities
   - Reset all passwords
   - Revoke all active sessions
   - Update security measures

6. **Recovery**
   - Restore from clean backup if needed
   - Re-enable system with enhanced security
   - Monitor closely for 48-72 hours

7. **Post-Incident Review**
   - Document the incident
   - Identify root cause
   - Update security procedures
   - Implement additional safeguards

### Security Monitoring

**Daily:**
- Review access logs
- Check for failed login attempts
- Monitor unusual database queries

**Weekly:**
- Review security headers
- Check SSL certificate validity
- Verify backup integrity

**Monthly:**
- Run vulnerability scans
- Update dependencies
- Review user access permissions
- Audit system logs

---

# 9. SYSTEM USABILITY AND FUNCTIONS
**Prepared by: Hillson (Frontend Developer & UI/UX Designer)**

## 9.1 User Interface Design Principles

The Bayside HMS interface is designed following modern UI/UX principles:

### Design Philosophy

**1. Consistency**
- Uniform color scheme (Jade green theme)
- Consistent button styles and interactions
- Standardized form layouts
- Predictable navigation patterns

**2. Simplicity**
- Clean, uncluttered interfaces
- Clear call-to-action buttons
- Minimal cognitive load
- Progressive disclosure of information

**3. Accessibility**
- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader compatibility
- High contrast color scheme
- Clear, readable fonts

**4. Responsiveness**
- Mobile-first design approach
- Responsive breakpoints:
  - Mobile: 320px - 767px
  - Tablet: 768px - 1023px
  - Desktop: 1024px+
- Touch-friendly interface elements

## 9.2 Color Scheme and Visual Design

### Jade Green Theme

**Primary Colors:**
```css
--primary: HSL(160, 45%, 48%)      /* Jade Green */
--primary-foreground: HSL(0, 0%, 100%)  /* White text on primary */
```

**Background Colors:**
```css
--background: Gradient (Emerald/Teal/Cyan)
--card: HSL(160, 50%, 98%)         /* Light green for cards */
--muted: HSL(150, 25%, 95%)        /* Subtle background */
```

**Semantic Colors:**
```css
--success: HSL(142, 71%, 45%)      /* Green for success */
--warning: HSL(48, 96%, 53%)       /* Yellow for warnings */
--error: HSL(0, 84%, 60%)          /* Red for errors */
--info: HSL(199, 89%, 48%)         /* Blue for information */
```

### Status Badge Colors

**Appointment Status:**
- 🟡 Pending: Yellow (`bg-yellow-100 text-yellow-800`)
- 🟢 Confirmed: Green (`bg-green-100 text-green-800`)
- ✅ Completed: Blue (`bg-blue-100 text-blue-800`)
- 🔴 Cancelled: Red (`bg-red-100 text-red-800`)

### Typography

**Font Stack:**
```css
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
             "Helvetica Neue", Arial, sans-serif;
```

**Font Sizes:**
- Headings: 24px - 32px (bold)
- Body text: 16px (regular)
- Small text: 14px
- Captions: 12px

## 9.3 Navigation and User Flow

### Homepage Flow

```
Homepage
  ├─> Login (existing users)
  │    ├─> Admin Dashboard
  │    ├─> Doctor Dashboard
  │    └─> Patient Dashboard
  │
  └─> Register (new users)
       ├─> Patient Registration → Immediate Access
       └─> Doctor Registration → Pending Approval
```

### Dashboard Navigation

**Admin Dashboard Flow:**
```
Admin Dashboard
  ├─> Pending Approvals → Approve Doctor → Success
  ├─> Manage Doctors → View Doctor Details
  ├─> Manage Patients → View Patient Details
  └─> Logout
```

**Doctor Dashboard Flow:**
```
Doctor Dashboard
  ├─> Appointments
  │    ├─> Confirm Appointment
  │    ├─> Add Medical Record
  │    └─> Complete Appointment
  ├─> Medical Records → View All Records
  ├─> Patient Feedback → View Ratings
  └─> Logout
```

**Patient Dashboard Flow:**
```
Patient Dashboard
  ├─> Book Appointment
  │    ├─> Select Doctor
  │    ├─> Choose Date/Time
  │    └─> Confirm Booking
  ├─> Medical Records → View History
  ├─> Give Feedback → Rate Doctor
  ├─> Billing & Invoices → View Bills
  └─> Logout
```

## 9.4 Component Library

### Buttons

**Primary Button:**
```jsx
<button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
  Click Me
</button>
```

**Variants:**
- Primary (Jade green) - Main actions
- Secondary (Gray) - Cancel actions
- Destructive (Red) - Delete actions
- Outline (Border only) - Secondary actions

### Forms

**Input Field:**
```jsx
<div className="space-y-2">
  <label className="text-sm font-medium">Email</label>
  <input
    type="email"
    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary"
    placeholder="Enter email"
  />
</div>
```

**Select Dropdown:**
```jsx
<select className="w-full px-3 py-2 border rounded-md">
  <option>Choose an option</option>
  <option value="1">Option 1</option>
  <option value="2">Option 2</option>
</select>
```

### Cards

**Dashboard Card:**
```jsx
<div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
  <h3 className="text-lg font-semibold">Total Patients</h3>
  <p className="text-3xl font-bold text-primary">150</p>
  <p className="text-sm text-gray-500">+12 this month</p>
</div>
```

### Tables

**Data Table:**
```jsx
<table className="w-full">
  <thead className="bg-gray-50">
    <tr>
      <th className="px-4 py-3 text-left">Name</th>
      <th className="px-4 py-3 text-left">Email</th>
      <th className="px-4 py-3 text-left">Status</th>
    </tr>
  </thead>
  <tbody>
    <tr className="border-b hover:bg-gray-50">
      <td className="px-4 py-3">John Doe</td>
      <td className="px-4 py-3">john@example.com</td>
      <td className="px-4 py-3">
        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
          Active
        </span>
      </td>
    </tr>
  </tbody>
</table>
```

## 9.5 Interactive Elements

### Calendar Widget (Appointment Booking)

**Features:**
- Month/Year navigation
- Disabled past dates
- Visual feedback for selected date
- Highlights today's date
- Shows available/unavailable slots

**User Interaction:**
1. Click calendar icon to open
2. Navigate months with arrows
3. Click on available date
4. Date highlights and populates field
5. Time slots update based on selection

### Time Slot Picker

**Features:**
- Dropdown list of time slots
- Disabled unavailable slots
- Clear visual distinction
- Easy selection

**Time Slots:**
```
Morning:
- 09:00 AM ✓
- 10:00 AM ✗ (booked)
- 11:00 AM ✓

Afternoon:
- 02:00 PM ✓
- 03:00 PM ✓
- 04:00 PM ✗ (booked)
```

### Star Rating Component

**Features:**
- Interactive 5-star rating
- Hover effects
- Click to select
- Visual feedback

```jsx
<div className="flex gap-1">
  {[1, 2, 3, 4, 5].map(star => (
    <Star
      key={star}
      className={`cursor-pointer ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      onClick={() => setRating(star)}
    />
  ))}
</div>
```

## 9.6 Responsive Design Implementation

### Mobile View (320px - 767px)

**Navigation:**
- Hamburger menu (collapsed sidebar)
- Bottom navigation bar
- Full-width cards
- Single column layout

**Optimizations:**
- Larger tap targets (minimum 44x44px)
- Simplified forms (one field per row)
- Collapsible sections
- Touch-friendly buttons

### Tablet View (768px - 1023px)

**Layout:**
- Two-column grid for cards
- Sidebar remains visible
- Responsive tables (horizontal scroll if needed)
- Optimized spacing

### Desktop View (1024px+)

**Layout:**
- Three-column grid for cards
- Full sidebar navigation
- Wide tables with all columns
- Hover interactions
- Multi-column forms

## 9.7 Loading States and Feedback

### Loading Indicators

**Button Loading State:**
```jsx
<button disabled={isLoading} className="flex items-center gap-2">
  {isLoading && <Spinner />}
  {isLoading ? 'Processing...' : 'Submit'}
</button>
```

**Page Loading:**
```jsx
{isLoading ? (
  <div className="flex justify-center items-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
) : (
  <PageContent />
)}
```

### Success/Error Messages

**Toast Notifications:**
```jsx
// Success
<div className="bg-green-50 border-l-4 border-green-500 p-4">
  <p className="text-green-800">✓ Appointment booked successfully!</p>
</div>

// Error
<div className="bg-red-50 border-l-4 border-red-500 p-4">
  <p className="text-red-800">✗ Failed to book appointment. Please try again.</p>
</div>
```

### Form Validation Feedback

**Real-time Validation:**
```jsx
<input
  className={`border ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
/>
{errors.email && (
  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
)}
```

## 9.8 Accessibility Features

### Keyboard Navigation

**Tab Order:**
- Logical tab sequence
- Skip to main content link
- Visible focus indicators
- Escape key to close modals

**Shortcuts:**
- `Tab` - Next element
- `Shift + Tab` - Previous element
- `Enter` - Submit/Select
- `Esc` - Close modal/Cancel

### Screen Reader Support

**ARIA Labels:**
```jsx
<button aria-label="Close modal">
  <X className="h-4 w-4" />
</button>

<input
  type="email"
  aria-required="true"
  aria-invalid={!!errors.email}
  aria-describedby="email-error"
/>
{errors.email && (
  <span id="email-error" role="alert">{errors.email}</span>
)}
```

**Semantic HTML:**
```jsx
<nav aria-label="Main navigation">
  <ul>
    <li><a href="/dashboard">Dashboard</a></li>
    <li><a href="/appointments">Appointments</a></li>
  </ul>
</nav>

<main aria-label="Main content">
  {/* Page content */}
</main>
```

### Color Contrast

All text meets WCAG 2.1 AA standards:
- Normal text: 4.5:1 contrast ratio
- Large text (18pt+): 3:1 contrast ratio
- Interactive elements: 3:1 contrast ratio

## 9.9 Performance Optimization

### Code Splitting

Next.js automatically splits code by page:
```javascript
// Each page is a separate chunk
app/dashboard/patient/page.tsx
app/dashboard/doctor/page.tsx
app/dashboard/admin/page.tsx
```

### Image Optimization

```jsx
import Image from 'next/image';

<Image
  src="/logo.png"
  width={200}
  height={100}
  alt="Bayside HMS Logo"
  loading="lazy"  // Lazy load images
/>
```

### Lazy Loading Components

```jsx
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Spinner />,
  ssr: false  // Client-side only if needed
});
```

---

# 10. TROUBLESHOOTING GUIDE

## 10.1 Common Installation Issues

### Issue: npm install fails

**Symptoms:**
- Error messages during `npm install`
- Missing dependencies

**Solutions:**

```bash
# 1. Clear npm cache
npm cache clean --force

# 2. Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# 3. Reinstall
npm install

# 4. If still failing, try with legacy peer deps
npm install --legacy-peer-deps
```

### Issue: Database connection failed

**Symptoms:**
- Error: "Failed to connect to database"
- Application won't start

**Solutions:**

```bash
# 1. Check if MySQL is running
sudo systemctl status mysql  # Linux
brew services list           # macOS

# 2. Start MySQL if not running
sudo systemctl start mysql   # Linux
brew services start mysql    # macOS

# 3. Test connection
mysql -u bayside_admin -p -e "SELECT 1;"

# 4. Verify .env.local
cat .env.local

# 5. Check DATABASE_URL format
# Correct: mysql://user:password@localhost:3306/database
# Wrong: mysql://user:password@localhost/database (missing port)
```

### Issue: Port 3000 already in use

**Symptoms:**
- Error: "Port 3000 is already in use"

**Solutions:**

```bash
# 1. Find process using port 3000
# Linux/macOS:
lsof -i :3000

# Windows:
netstat -ano | findstr :3000

# 2. Kill the process
# Linux/macOS:
kill -9 <PID>

# Windows:
taskkill /PID <PID> /F

# 3. Or use different port
PORT=3001 npm run dev
```

## 10.2 Runtime Errors

### Issue: JWT verification failed

**Symptoms:**
- Redirected to login repeatedly
- Error: "Invalid token"

**Solutions:**

```bash
# 1. Clear browser cookies
# In browser: Settings → Privacy → Clear browsing data → Cookies

# 2. Verify JWT_SECRET in .env.local
cat .env.local | grep JWT_SECRET

# 3. Ensure JWT_SECRET is at least 32 characters

# 4. Restart application
pm2 restart bayside-hms
# or
npm run dev
```

### Issue: 403 Forbidden / Unauthorized

**Symptoms:**
- Cannot access certain pages
- Error: "Unauthorized access"

**Solutions:**

1. Verify you're logged in with correct role:
   - Admin pages require admin account
   - Doctor pages require doctor account
   - Patient pages require patient account

2. Log out and log back in:
   - Click profile icon → Logout
   - Log in with correct credentials

3. Check middleware.ts for proper role checks

## 10.3 Database Issues

### Issue: Tables not created

**Symptoms:**
- Error: "Table 'users' doesn't exist"

**Solutions:**

```bash
# 1. Check if schema was imported
mysql -u bayside_admin -p bayside_hms -e "SHOW TABLES;"

# 2. If empty, import schema
mysql -u bayside_admin -p bayside_hms < database/schema-mysql.sql

# 3. Verify tables created
mysql -u bayside_admin -p bayside_hms -e "SHOW TABLES;"
```

### Issue: Foreign key constraint fails

**Symptoms:**
- Error: "Cannot add or update a child row: a foreign key constraint fails"

**Solutions:**

```bash
# 1. Check referenced data exists
mysql -u bayside_admin -p bayside_hms

# 2. For appointments, ensure doctor and patient exist
SELECT * FROM doctors WHERE id = 'doctor-id-here';
SELECT * FROM patients WHERE id = 'patient-id-here';

# 3. Fix by creating missing records or correcting IDs
```

## 10.4 Frontend Issues

### Issue: Blank page / White screen

**Symptoms:**
- Page loads but shows nothing
- No content displayed

**Solutions:**

```bash
# 1. Check browser console for errors
# Press F12 → Console tab

# 2. Check if JavaScript is enabled

# 3. Clear cache and hard reload
# Ctrl+Shift+R (Windows/Linux)
# Cmd+Shift+R (macOS)

# 4. Check if API is returning data
# F12 → Network tab → Reload page → Check XHR requests
```

### Issue: Styles not loading

**Symptoms:**
- Page has no styling
- Looks plain HTML

**Solutions:**

```bash
# 1. Rebuild application
npm run build

# 2. Clear .next folder
rm -rf .next
npm run dev

# 3. Check if Tailwind is configured
# Verify tailwind.config.ts exists

# 4. Check globals.css is imported in layout.tsx
```

## 10.5 Deployment Issues

### Issue: Application crashes on production

**Symptoms:**
- Works locally but fails in production
- 500 Internal Server Error

**Solutions:**

```bash
# 1. Check PM2 logs
pm2 logs bayside-hms

# 2. Verify environment variables
cat .env.local

# 3. Ensure NODE_ENV is set to production
echo 'NODE_ENV=production' >> .env.local

# 4. Check file permissions
sudo chown -R $USER:$USER /var/www/bayside-hms

# 5. Rebuild application
npm run build
pm2 restart bayside-hms
```

### Issue: SSL certificate errors

**Symptoms:**
- "Your connection is not private"
- Certificate expired

**Solutions:**

```bash
# 1. Check certificate status
sudo certbot certificates

# 2. Renew certificate
sudo certbot renew

# 3. Restart Nginx
sudo systemctl restart nginx

# 4. Test SSL
curl -I https://your-domain.com
```

## 10.6 Performance Issues

### Issue: Slow page load

**Symptoms:**
- Pages take long to load
- Laggy interface

**Solutions:**

```bash
# 1. Optimize database queries
# Add indexes to frequently queried columns

# 2. Check database performance
mysql -u bayside_admin -p -e "SHOW PROCESSLIST;"

# 3. Increase database connection pool
# Edit lib/db.ts
connectionLimit: 20  # Increase from 10

# 4. Enable Nginx caching (see networking section)

# 5. Optimize images
# Use next/image component for automatic optimization
```

## 10.7 Security Issues

### Issue: Account locked after multiple failed logins

**Solutions:**

If rate limiting is implemented:
```bash
# Wait 15 minutes and try again
# Or contact administrator to reset account
```

### Issue: Suspicious activity detected

**Immediate Actions:**

```bash
# 1. Change password immediately

# 2. Log out from all devices
# Currently: Manually clear cookies
# Future: Implement "Log out all sessions" feature

# 3. Check recent activity
# Admin: Review access logs
sudo cat /var/log/nginx/bayside-hms-access.log | tail -100

# 4. Report to administrator
```

## 10.8 Getting Additional Help

### Log Collection for Support

```bash
# Collect all relevant logs
mkdir ~/bayside-hms-logs
cp /var/log/nginx/bayside-hms-*.log ~/bayside-hms-logs/
pm2 logs bayside-hms --lines 100 > ~/bayside-hms-logs/pm2.log
mysql -u bayside_admin -p bayside_hms -e "SHOW PROCESSLIST;" > ~/bayside-hms-logs/mysql.log
tar -czf bayside-hms-logs.tar.gz ~/bayside-hms-logs/

# Send bayside-hms-logs.tar.gz to support
```

### Contact Information

For technical support:
- **System Administrator:** [admin@bayside-hms.com]
- **Technical Support:** [support@bayside-hms.com]
- **Emergency Hotline:** [24/7 Support Number]

### Documentation References

- **Database Setup:** See `DATABASE_SETUP_MYSQL.md`
- **Hosting Guide:** See `HOSTING_GUIDE.md`
- **Feature Documentation:** See `FEATURES.md`
- **User Guide:** See `USER_GUIDE.md`

---

## APPENDIX A: Glossary

**API (Application Programming Interface)** - Interface for communication between frontend and backend

**bcrypt** - Password hashing algorithm used for secure password storage

**CORS (Cross-Origin Resource Sharing)** - Security feature that controls which domains can access the API

**CSRF (Cross-Site Request Forgery)** - Attack that tricks users into performing unwanted actions

**EMR (Electronic Medical Records)** - Digital version of patient medical charts

**JWT (JSON Web Token)** - Secure method of transmitting information between parties

**MySQL** - Relational database management system

**Next.js** - React framework for building full-stack web applications

**RBAC (Role-Based Access Control)** - Method of restricting access based on user roles

**SQL Injection** - Code injection technique targeting databases

**SSL/TLS** - Protocols for encrypting internet traffic

**XSS (Cross-Site Scripting)** - Security vulnerability allowing injection of malicious scripts

---

## APPENDIX B: Student Contributions

### Krischal Jung Thakuri - Backend/Database Developer

**Responsibilities:**
- Database schema design and implementation
- MySQL configuration and optimization
- Backend API development
- Database security implementation
- Backup and recovery procedures
- Server-side validation
- Connection pooling configuration

**Sections Authored:**
- Section 2: Hardware and Software Setup
- Section 3: System Configuration Guide
- Database architecture in Introduction
- Database backup procedures

### Hillson - Frontend Developer & UI/UX Designer

**Responsibilities:**
- User interface design and implementation
- React component development
- Responsive design implementation
- User experience optimization
- Admin, Doctor, and Patient dashboard development
- Form design and validation
- Accessibility implementation

**Sections Authored:**
- Section 4: User Manual - Administrator
- Section 5: User Manual - Doctor
- Section 6: User Manual - Patient
- Section 9: System Usability and Functions
- UI/UX design documentation

### Niroj Shrestha - Networking and Testing Specialist

**Responsibilities:**
- Network architecture design
- Security testing and implementation
- Firewall configuration
- SSL/TLS setup
- Load balancing configuration
- Performance testing
- Security vulnerability assessment
- Penetration testing

**Sections Authored:**
- Section 7: Networking Configuration
- Section 8: Security Testing and Implementation
- Section 10: Troubleshooting Guide (Network/Security portions)
- Network monitoring procedures

---

## APPENDIX C: System Requirements Summary

### Development Environment
- **OS:** Windows 10+, macOS 10.15+, Ubuntu 20.04+
- **Node.js:** 18.0.0+
- **MySQL:** 8.0+
- **RAM:** 4GB minimum, 8GB recommended
- **Storage:** 10GB free space

### Production Server
- **CPU:** Quad-core processor
- **RAM:** 8GB minimum, 16GB recommended
- **Storage:** 50GB SSD
- **Network:** 100 Mbps, static IP
- **OS:** Ubuntu Server 20.04 LTS or later

### Client Requirements
- **Browser:** Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Screen:** 1024x768 minimum resolution
- **Internet:** 5 Mbps minimum connection speed

---

## APPENDIX D: Quick Reference Commands

### Development
```bash
npm install              # Install dependencies
npm run dev             # Start development server
npm run build           # Build for production
npm start               # Start production server
npm run create-admin    # Create admin account
```

### Database
```bash
mysql -u bayside_admin -p bayside_hms < database/schema-mysql.sql  # Import schema
mysql -u bayside_admin -p bayside_hms -e "SHOW TABLES;"            # List tables
mysqldump -u bayside_admin -p bayside_hms > backup.sql             # Backup database
```

### Production Management
```bash
pm2 start npm --name "bayside-hms" -- start  # Start with PM2
pm2 stop bayside-hms                         # Stop application
pm2 restart bayside-hms                      # Restart application
pm2 logs bayside-hms                         # View logs
pm2 status                                   # Check status
```

### Security
```bash
sudo ufw status                              # Check firewall
sudo certbot renew                           # Renew SSL certificate
sudo nginx -t                                # Test Nginx configuration
sudo systemctl restart nginx                 # Restart Nginx
```

---

**END OF COMPREHENSIVE USER MANUAL**

**Document Version:** 1.0
**Last Updated:** December 7, 2025
**Status:** Complete and Ready for Submission

---

This comprehensive manual covers all aspects of the Bayside Hospital Management System, from installation to security, providing detailed guidance for administrators, doctors, patients, and technical staff. Each section has been carefully prepared by the designated team member to ensure accuracy and completeness.
