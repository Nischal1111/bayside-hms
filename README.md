# Bayside Hospital Management System (HMS)

A comprehensive, full-stack hospital management system built with Next.js, TypeScript, MySQL, Tailwind CSS, and Shadcn UI.

## Features

### For Patients
- **User Registration & Login** - Secure authentication with role-based access
- **Appointment Scheduling** - Book appointments with doctors using an interactive calendar
- **Medical Records** - View diagnosis, prescriptions, and treatment history
- **Feedback System** - Rate and provide feedback to doctors
- **Billing & Invoices** - View and manage medical bills

### For Doctors
- **Appointment Management** - View and manage patient appointments
- **Electronic Medical Records (EMR)** - Create and maintain patient medical records
- **Patient Diagnosis** - Add diagnosis, prescriptions, and treatment plans
- **Feedback Review** - View patient feedback and ratings
- **Patient History** - Access complete patient medical history

### For Administrators
- **Doctor Approval** - Review and approve new doctor registrations
- **Patient Management** - View and manage all registered patients
- **Doctor Management** - Manage active doctors and their profiles
- **Dashboard Analytics** - View statistics on patients, doctors, and appointments
- **System Overview** - Monitor overall hospital operations

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Shadcn UI
- **Backend**: Next.js API Routes
- **Database**: MySQL 8.0+
- **Authentication**: JWT with bcrypt
- **Date Handling**: date-fns
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- MySQL 8.0+
- Git

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd bayside-hms
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up the database**

Follow the instructions in [DATABASE_SETUP_MYSQL.md](./DATABASE_SETUP_MYSQL.md) to:
- Install and configure MySQL
- Create the database
- Run the schema migrations
- Set up environment variables

4. **Configure environment variables**

Create a `.env.local` file in the root directory:

```env
DATABASE_URL=mysql://username:password@localhost:3306/bayside_hms
JWT_SECRET=your_very_secure_random_string_at_least_32_characters_long
```

5. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Setup

### Quick Setup

1. **Create MySQL database:**
```bash
sudo mysql -u root -p
CREATE DATABASE bayside_hms CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'bayside_admin'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON bayside_hms.* TO 'bayside_admin'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

2. **Run schema:**
```bash
mysql -u bayside_admin -p bayside_hms < database/schema-mysql.sql
```

For detailed setup instructions including production hosting options, see [DATABASE_SETUP_MYSQL.md](./DATABASE_SETUP_MYSQL.md).

## Project Structure

```
bayside-hms/
├── app/                          # Next.js app directory
│   ├── api/                      # API routes
│   │   ├── auth/                 # Authentication endpoints
│   │   ├── appointments/         # Appointment management
│   │   ├── medical-records/      # Medical records
│   │   ├── feedback/             # Feedback system
│   │   ├── invoices/             # Billing
│   │   ├── admin/                # Admin endpoints
│   │   └── doctor/               # Doctor endpoints
│   ├── dashboard/                # Dashboard pages
│   │   ├── patient/              # Patient dashboard
│   │   ├── doctor/               # Doctor dashboard
│   │   └── admin/                # Admin dashboard
│   ├── login/                    # Login page
│   ├── register/                 # Registration page
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Landing page
│   └── globals.css               # Global styles
├── components/                   # React components
│   ├── ui/                       # Shadcn UI components
│   └── dashboard-layout.tsx      # Shared dashboard layout
├── lib/                          # Utility functions
│   ├── db.ts                     # Database connection
│   ├── auth.ts                   # Authentication utilities
│   └── utils.ts                  # Helper functions
├── database/                     # Database files
│   ├── schema-mysql.sql          # MySQL schema
│   └── schema.sql                # PostgreSQL schema (legacy)
├── middleware.ts                 # Next.js middleware
├── DATABASE_SETUP_MYSQL.md       # MySQL database setup guide
├── DATABASE_SETUP.md             # PostgreSQL setup guide (legacy)
└── README.md                     # This file
```

## User Roles

### Patient
- Register with personal information
- Book and manage appointments
- View medical records and diagnosis
- Submit feedback to doctors
- View billing and invoices

### Doctor
- Register with license number (requires admin approval)
- Manage appointment schedule
- Create and update medical records
- View patient history
- Receive patient feedback

### Administrator
- Approve doctor registrations
- Manage patients and doctors
- View system statistics
- Monitor appointments
- Oversee hospital operations

## Key Features

### Authentication & Security
- JWT-based authentication
- Bcrypt password hashing
- Role-based access control (RBAC)
- Secure HTTP-only cookies
- Protected API routes
- Middleware-based route protection

### Appointment System
- Interactive calendar interface
- Real-time slot availability
- Doctor-patient matching
- Status management (pending, confirmed, completed, cancelled)
- Notification system

### Electronic Medical Records (EMR)
- Comprehensive patient history
- Diagnosis and prescription tracking
- Medical report storage
- Doctor notes and observations
- Symptoms tracking
- Treatment plans

### Billing & Financial Management
- Invoice generation
- Payment tracking
- Multiple payment methods
- Payment history
- Outstanding balance tracking

### Feedback System
- 5-star rating system
- Written feedback
- Doctor-specific feedback
- Timestamp tracking

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Appointments
- `GET /api/appointments` - Get appointments (role-based)
- `POST /api/appointments` - Book appointment (patient)
- `PATCH /api/appointments/[id]` - Update appointment status

### Medical Records
- `GET /api/medical-records` - Get medical records (role-based)
- `POST /api/medical-records` - Create medical record (doctor)

### Feedback
- `POST /api/feedback` - Submit feedback (patient)
- `GET /api/doctor/feedback` - Get doctor's feedback

### Admin
- `GET /api/admin/stats` - Get system statistics
- `GET /api/admin/patients` - Get all patients
- `GET /api/admin/doctors` - Get all doctors
- `POST /api/admin/approve-doctor` - Approve doctor registration

## Development

### Running Tests
```bash
npm run test
```

### Building for Production
```bash
npm run build
npm run start
```

### Linting
```bash
npm run lint
```

## Deployment

### Recommended Hosting Options

1. **Vercel (Frontend) + Supabase (Database)**
   - Deploy Next.js app to Vercel
   - Use Supabase for PostgreSQL
   - Environment variables in Vercel dashboard

2. **Railway (Full Stack)**
   - Deploy entire application on Railway
   - Integrated PostgreSQL service
   - Automatic deployments from Git

3. **Self-Hosted**
   - VPS with Node.js and PostgreSQL
   - Nginx reverse proxy
   - PM2 for process management

See [DATABASE_SETUP.md](./DATABASE_SETUP.md) for detailed deployment instructions.

## Environment Variables

Required environment variables:

```env
# Database
DATABASE_URL=postgresql://username:password@host:port/database

# Authentication
JWT_SECRET=your_secure_secret_minimum_32_characters

# Optional
NODE_ENV=production
```

## Security Considerations

- Never commit `.env` files
- Use strong passwords for database
- Rotate JWT secrets regularly
- Enable SSL in production
- Regular database backups
- Input validation and sanitization
- SQL injection prevention
- XSS protection

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
- Create an issue on GitHub
- Check [DATABASE_SETUP.md](./DATABASE_SETUP.md) for database issues
- Review the code comments for implementation details

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [Shadcn UI](https://ui.shadcn.com/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons by [Lucide](https://lucide.dev/)

---

**Note**: This is a comprehensive hospital management system. Ensure proper security measures and compliance with healthcare regulations (HIPAA, GDPR, etc.) before deploying in a production environment.
