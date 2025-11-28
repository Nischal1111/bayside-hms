# Bayside HMS - Complete User Guide

## Table of Contents

1. [Installation & Setup](#installation--setup)
2. [Creating Admin Account](#creating-admin-account)
3. [Login Instructions](#login-instructions)
4. [Admin Portal Guide](#admin-portal-guide)
5. [Doctor Portal Guide](#doctor-portal-guide)
6. [Patient Portal Guide](#patient-portal-guide)
7. [Common Tasks](#common-tasks)
8. [Troubleshooting](#troubleshooting)

---

## Installation & Setup

### Prerequisites
- Node.js 18+ installed
- MySQL 8.0+ database server
- Git (for cloning the repository)

### Step 1: Clone and Install Dependencies

```bash
# Clone the repository
cd bayside-hms

# Install dependencies
npm install
```

### Step 2: Database Setup

1. Create a MySQL database:
```sql
CREATE DATABASE bayside_hms CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. Import the schema:
```bash
mysql -u your_username -p bayside_hms < database/schema-mysql.sql
```

3. Import specializations data:
```bash
mysql -u your_username -p bayside_hms < database/seed-specializations.sql
```

### Step 3: Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
DATABASE_URL=mysql://username:password@localhost:3306/bayside_hms
JWT_SECRET=your_very_secure_32_character_secret_key_here
NODE_ENV=development
```

**IMPORTANT:** Replace `username` and `password` with your MySQL credentials.

### Step 4: Create Admin Account

Run the admin creation script:

```bash
npm run create-admin
```

You should see:
```
✅ Admin account created successfully!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📧 Email:     admin@bayside-hms.com
🔑 Password:  Admin@123456
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**⚠️ IMPORTANT:** Change this password after first login!

### Step 5: Start the Development Server

```bash
npm run dev
```

The application will be available at: **http://localhost:3000**

---

## Creating Admin Account

### Default Admin Credentials

After running `npm run create-admin`, you can login with:

- **Email:** admin@bayside-hms.com
- **Password:** Admin@123456

### Security Note

For production environments:
1. Change the default password immediately after first login
2. Create additional admin users with unique credentials
3. Delete or disable the default admin account

---

## Login Instructions

### How to Access Different Portals

#### **Admin Login**
1. Navigate to: **http://localhost:3000/admin**
   - OR click "Admin Portal" on the homepage
   - OR go to http://localhost:3000/login and use admin credentials

2. Enter credentials:
   - Email: `admin@bayside-hms.com`
   - Password: `Admin@123456`

3. Click "Sign In"

4. You'll be redirected to: `/dashboard/admin`

#### **Doctor Login**
1. **First-time doctors must register:**
   - Go to: **http://localhost:3000/register**
   - Select "Doctor" as role
   - Fill in all required fields:
     - First Name & Last Name
     - Email & Password
     - Phone Number
     - License Number
     - Specialization
   - Click "Register"
   - You'll see: "Registration successful. Awaiting admin approval"

2. **Wait for admin approval** (admins must approve your account)

3. **After approval, login at:** **http://localhost:3000/login**
   - Enter your email and password
   - Click "Sign In"
   - You'll be redirected to: `/dashboard/doctor`

#### **Patient Login**
1. **First-time patients must register:**
   - Go to: **http://localhost:3000/register**
   - Select "Patient" as role
   - Fill in all required fields:
     - First Name & Last Name
     - Email & Password
     - Phone Number
     - Address, Gender, Date of Birth
     - Blood Group
     - Emergency Contact
   - Click "Register"
   - Patients are activated immediately (no approval needed)

2. **Login at:** **http://localhost:3000/login**
   - Enter your email and password
   - Click "Sign In"
   - You'll be redirected to: `/dashboard/patient`

---

## Admin Portal Guide

### Admin Dashboard Overview

When you login as admin, you'll see:

#### **Navigation Sidebar**
- 🏠 **Dashboard** - Overview and statistics
- 👤 **Pending Approvals** - Approve new doctors
- 👨‍⚕️ **Manage Doctors** - View all active doctors
- 👥 **Manage Patients** - View all registered patients

#### **Dashboard Tab (Main View)**

**Statistics Cards:**
- **Total Patients** - Number of registered patients
- **Total Doctors** - Number of approved doctors
- **Appointments** - Total appointments in system
- **Pending Approvals** - Doctors waiting for approval

**Quick Actions:**
- Click "Pending Approvals" to approve new doctors
- Click "Manage Doctors" to view/manage all doctors
- Click "Manage Patients" to view all patients

### Admin Tasks

#### **1. Approve New Doctors**
1. Click "Pending Approvals" in sidebar
2. You'll see a list of doctors waiting for approval with:
   - Doctor's name
   - Specialization
   - License number
3. Click "Approve" button to activate the doctor
4. Doctor will receive access to their dashboard

#### **2. Manage Doctors**
1. Click "Manage Doctors" in sidebar
2. View list of all approved doctors with:
   - Name
   - Specialization
   - Phone number
   - Status badge (Active)

#### **3. Manage Patients**
1. Click "Manage Patients" in sidebar
2. View list of all registered patients with:
   - Name
   - Phone number
   - Email address

#### **4. Logout**
1. Click your avatar in the top-right corner
2. Click "Logout"

---

## Doctor Portal Guide

### Doctor Dashboard Overview

After admin approval and login, you'll see:

#### **Navigation Sidebar**
- 🏠 **Dashboard** - Overview and statistics
- 📅 **Appointments** - Manage patient appointments
- 📄 **Medical Records** - View records you've created
- 💬 **Patient Feedback** - View feedback from patients

#### **Dashboard Tab (Main View)**

**Statistics Cards:**
- **Total Appointments** - Number of patient appointments
- **Medical Records** - Records you've created
- **Patient Feedback** - Feedback received

**Quick Actions:**
- Click "View Appointments" to see all bookings
- Click "Medical Records" to see patient records
- Click "View Feedback" to read patient reviews

### Doctor Tasks

#### **1. View Patient Appointments**
1. Click "Appointments" in sidebar
2. You'll see all appointments with:
   - Patient name
   - Date and time
   - Reason for visit
   - Current status

#### **2. Confirm Appointments**
1. In Appointments tab, find the appointment
2. Click "Confirm" button
3. Status changes to "Confirmed"

#### **3. Complete Appointments**
1. After seeing the patient, click "Complete"
2. Status changes to "Completed"

#### **4. Add Medical Records**
1. In Appointments tab, click "Add Record" for a patient
2. Fill in the form:
   - **Symptoms** - What the patient reported
   - **Diagnosis** - Your medical diagnosis
   - **Prescription** - Medications prescribed
   - **Notes** - Additional notes
3. Click "Save Record"
4. Record is now viewable by the patient

#### **5. View Medical Records**
1. Click "Medical Records" in sidebar
2. See all records you've created with:
   - Patient name
   - Visit date
   - Diagnosis
   - Prescription
   - Notes

#### **6. View Patient Feedback**
1. Click "Patient Feedback" in sidebar
2. See feedback from patients with:
   - Patient name
   - Rating (out of 5 stars)
   - Comments
   - Date submitted

---

## Patient Portal Guide

### Patient Dashboard Overview

When you login as a patient, you'll see:

#### **Navigation Sidebar**
- 🏠 **Dashboard** - Overview and quick actions
- 📅 **Book Appointment** - Schedule with doctors
- 📄 **Medical Records** - View your health records
- 💬 **Give Feedback** - Rate your doctor
- 💳 **Billing & Invoices** - View medical bills

#### **Dashboard Tab (Main View)**

**Statistics Cards:**
- **Total Appointments** - Your scheduled appointments
- **Medical Records** - Your medical records
- **Invoices** - Total invoices

**Quick Actions:**
- Click "Book New Appointment" to schedule
- Click "View Medical Records" to see diagnoses
- Click "Give Feedback" to rate doctors
- Click "View Invoices" to see bills

### Patient Tasks

#### **1. Book an Appointment**

**Step-by-Step:**
1. Click "Book Appointment" in sidebar
2. **Select Doctor:**
   - Click the dropdown "Choose a doctor"
   - You'll see: "Dr. [Name] - [Specialization]"
   - Select your preferred doctor
3. **Select Date:**
   - Click on a date in the calendar
   - Only future dates are selectable
4. **Select Time:**
   - Click the time dropdown
   - Choose from available slots:
     - 09:00 AM, 10:00 AM, 11:00 AM
     - 02:00 PM, 03:00 PM, 04:00 PM
5. **Enter Reason:**
   - Type your symptoms or reason for visit
6. Click "Book Appointment"
7. You'll see: "Appointment booked successfully"

**View Your Appointments:**
- Right side shows "Your Appointments" card
- See all appointments with:
  - Doctor name
  - Date and time
  - Status badge (Pending/Confirmed/Completed)

#### **2. View Medical Records**
1. Click "Medical Records" in sidebar
2. See all your medical history:
   - Doctor who treated you
   - Visit date
   - Diagnosis
   - Prescription given
   - Doctor's notes

#### **3. Give Feedback to Doctor**
1. Click "Give Feedback" in sidebar
2. Fill in the form:
   - **Select Doctor** - Choose from doctors you've seen
   - **Rating** - Select 1-5 stars
   - **Your Feedback** - Write your experience
3. Click "Submit Feedback"
4. Doctor can now see your feedback

#### **4. View Billing & Invoices**
1. Click "Billing & Invoices" in sidebar
2. See all invoices with:
   - Invoice number
   - Date
   - Total amount
   - Payment status (Paid/Pending)

---

## Common Tasks

### **How to See All Appointments (As Admin)**

Currently, admins can see statistics on the dashboard showing total appointments. To see detailed appointment information:

1. Login as admin
2. Check the "Appointments" statistic card
3. For detailed view, you would need to:
   - View individual doctor's appointments
   - Or check patient profiles

### **How Doctors See Appointments**

1. Login as doctor
2. Click "Appointments" in sidebar
3. See all patient bookings chronologically
4. Each appointment shows:
   - Patient name
   - Scheduled date/time
   - Reason for visit
   - Current status
   - Action buttons (Confirm, Complete, Add Record)

### **Appointment Workflow**

**Complete Flow:**
1. **Patient** books appointment → Status: "Pending"
2. **Doctor** sees appointment in their list
3. **Doctor** clicks "Confirm" → Status: "Confirmed"
4. **Patient** comes for appointment
5. **Doctor** clicks "Add Record" → Creates medical record
6. **Doctor** clicks "Complete" → Status: "Completed"
7. **Patient** can now see medical record
8. **Patient** can give feedback

---

## Troubleshooting

### Common Issues

#### **1. "Failed to connect to database"**
- Check your `.env.local` file has correct `DATABASE_URL`
- Verify MySQL server is running: `mysql -u root -p`
- Test connection: `mysql -u username -p bayside_hms`

#### **2. "Admin already exists"**
- The admin account is already created
- Use credentials: admin@bayside-hms.com / Admin@123456
- Or check console output from previous run

#### **3. "Doctor registration pending"**
- Doctor accounts require admin approval
- Login as admin at http://localhost:3000/admin
- Go to "Pending Approvals" and approve the doctor

#### **4. "No doctors available"**
- Admins must approve doctors first
- Register as doctor at /register
- Login as admin and approve in "Pending Approvals"

#### **5. "Appointment slot not available"**
- Another patient booked that slot
- Choose a different time
- System prevents double-booking

#### **6. "Cannot login after registration"**
- **Doctors:** Wait for admin approval first
- **Patients:** Should work immediately
- Check email/password are correct

### Reset Admin Password

If you forget the admin password:

1. Delete the admin user from database:
```sql
DELETE FROM admins WHERE user_id = (SELECT id FROM users WHERE email = 'admin@bayside-hms.com');
DELETE FROM users WHERE email = 'admin@bayside-hms.com';
```

2. Run the creation script again:
```bash
npm run create-admin
```

---

## Quick Reference

### URLs
- **Homepage:** http://localhost:3000
- **Admin Portal:** http://localhost:3000/admin
- **Login Page:** http://localhost:3000/login
- **Register Page:** http://localhost:3000/register

### Default Credentials
- **Admin Email:** admin@bayside-hms.com
- **Admin Password:** Admin@123456

### User Roles
- **Admin:** Approve doctors, manage system
- **Doctor:** Manage appointments, create medical records
- **Patient:** Book appointments, view records, give feedback

### Navigation Summary

**Patient Sidebar:**
- Dashboard
- Book Appointment
- Medical Records
- Give Feedback
- Billing & Invoices

**Doctor Sidebar:**
- Dashboard
- Appointments
- Medical Records
- Patient Feedback

**Admin Sidebar:**
- Dashboard
- Pending Approvals
- Manage Doctors
- Manage Patients

---

## Need Help?

If you encounter issues:
1. Check this guide first
2. Review the error message carefully
3. Check browser console for errors (F12)
4. Verify database connection
5. Ensure all environment variables are set

For technical details, see:
- `DATABASE_SETUP_MYSQL.md` - Database setup
- `HOSTING_GUIDE.md` - Deployment instructions
- `FEATURES.md` - Complete feature list
- `README.md` - Project overview

---

**Version:** 1.0.0
**Last Updated:** 2025-01-28
**Status:** Production Ready 🚀
