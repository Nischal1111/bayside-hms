# Complete Hosting Guide for Bayside HMS

This guide covers the easiest and most affordable ways to host your MySQL-based Hospital Management System.

## Quick Start - Recommended Setup (Free/Low Cost)

### Option 1: Vercel + PlanetScale (Best for Beginners)

**Cost**: Free tier available, then ~$5-10/month
**Setup Time**: 15 minutes
**Difficulty**: Easy

#### Steps:

1. **Deploy to Vercel**
   ```bash
   # Install Vercel CLI
   npm install -g vercel

   # Deploy
   vercel

   # Follow prompts to deploy
   ```

2. **Create PlanetScale Database**
   - Go to https://planetscale.com
   - Sign up for free account
   - Create new database "bayside-hms"
   - Get connection string

3. **Import Database Schema**
   ```bash
   # Install PlanetScale CLI
   brew install planetscale/tap/pscale

   # Connect to database
   pscale connect bayside-hms main --port 3309

   # In another terminal, import
   mysql -h 127.0.0.1 -P 3309 -u root bayside_hms < database/schema-mysql.sql
   ```

4. **Configure Environment Variables in Vercel**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add:
     ```
     DATABASE_URL=mysql://[username]:[password]@[host]/bayside_hms?sslaccept=strict
     JWT_SECRET=your_random_32_character_secret_key
     ```

5. **Redeploy**
   ```bash
   vercel --prod
   ```

Your app is now live! 🎉

---

### Option 2: Railway (Easiest All-in-One)

**Cost**: $5/month (includes hosting + database)
**Setup Time**: 10 minutes
**Difficulty**: Very Easy

#### Steps:

1. **Sign Up & Create Project**
   - Go to https://railway.app
   - Sign up with GitHub
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Connect your repository

2. **Add MySQL Database**
   - In your project, click "New"
   - Select "Database" → "MySQL"
   - Database will be created automatically

3. **Get Database URL**
   - Click on MySQL service
   - Copy the `DATABASE_URL`

4. **Import Schema**
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli

   # Login
   railway login

   # Link to project
   railway link

   # Connect to database and import
   railway run mysql -h [host] -u [user] -p [database] < database/schema-mysql.sql
   ```

5. **Set Environment Variables**
   - In Railway dashboard, go to your app service
   - Click "Variables"
   - Add:
     ```
     DATABASE_URL=[automatically set by Railway]
     JWT_SECRET=your_random_32_character_secret_key
     ```

6. **Deploy**
   - Railway auto-deploys from GitHub
   - Every push to your branch triggers a deployment

Your app is live on Railway! 🚂

---

### Option 3: cPanel Hosting (Traditional Shared Hosting)

**Cost**: $3-10/month
**Setup Time**: 30 minutes
**Difficulty**: Medium
**Good for**: Existing cPanel hosting users

#### Steps:

1. **Create MySQL Database in cPanel**
   - Login to cPanel
   - Go to "MySQL Databases"
   - Create database: `bayside_hms`
   - Create user: `bayside_admin` with strong password
   - Add user to database with ALL PRIVILEGES

2. **Import Schema**
   - Go to phpMyAdmin
   - Select `bayside_hms` database
   - Click "Import" tab
   - Upload `database/schema-mysql.sql`
   - Click "Go"

3. **Upload Application Files**
   - Build the application locally:
     ```bash
     npm install
     npm run build
     ```
   - Upload these files via FTP:
     - `.next` folder
     - `public` folder
     - `package.json`
     - `package-lock.json`
     - `next.config.ts`

4. **Set Up Node.js Application (if supported)**
   - In cPanel, find "Setup Node.js App"
   - Set:
     - Node.js version: 18+
     - Application root: `/home/username/public_html`
     - Application URL: your domain
     - Application startup file: `node_modules/next/dist/bin/next`
     - Arguments: `start`

5. **Create .env.local**
   - In cPanel File Manager, create `.env.local`:
     ```env
     DATABASE_URL=mysql://bayside_admin:your_password@localhost:3306/bayside_hms
     JWT_SECRET=your_random_32_character_secret_key
     ```

6. **Install Dependencies**
   - SSH into your server (or use Terminal in cPanel)
   - Navigate to your app directory
   - Run: `npm install --production`

7. **Start Application**
   - Click "Start App" in Node.js App manager

Your site is now live on your cPanel domain! 🌐

---

## Advanced Hosting Options

### Option 4: DigitalOcean App Platform

**Cost**: $12+/month
**Best for**: Production applications

1. **Create DigitalOcean Account**
2. **Create App**
   - Apps → Create App
   - Connect GitHub repository
   - Select branch

3. **Add Managed Database**
   - Databases → Create Database
   - Choose MySQL
   - Select size and region

4. **Configure Environment Variables**
   ```env
   DATABASE_URL=${db.DATABASE_URL}
   JWT_SECRET=your_secret
   ```

5. **Deploy**

---

### Option 5: AWS (Elastic Beanstalk + RDS)

**Cost**: ~$15-30/month
**Best for**: Scalable applications

1. **Create RDS MySQL Instance**
   ```bash
   aws rds create-db-instance \
     --db-instance-identifier bayside-hms \
     --db-instance-class db.t3.micro \
     --engine mysql \
     --master-username admin \
     --master-user-password YourPassword \
     --allocated-storage 20
   ```

2. **Create Elastic Beanstalk App**
   ```bash
   eb init -p node.js bayside-hms
   eb create production-env
   ```

3. **Set Environment Variables**
   ```bash
   eb setenv DATABASE_URL=mysql://admin:password@endpoint/bayside_hms
   eb setenv JWT_SECRET=your_secret
   ```

4. **Deploy**
   ```bash
   eb deploy
   ```

---

## Self-Hosted (VPS) - Complete Guide

**Cost**: $5-20/month
**Best for**: Full control

### Ubuntu Server Setup:

1. **Get a VPS**
   - DigitalOcean Droplet ($6/month)
   - Linode ($5/month)
   - Vultr ($5/month)
   - AWS Lightsail ($5/month)

2. **Initial Server Setup**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y

   # Install MySQL
   sudo apt install mysql-server -y

   # Secure MySQL
   sudo mysql_secure_installation

   # Install Node.js 20
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt install -y nodejs

   # Install PM2
   sudo npm install -g pm2

   # Install Nginx
   sudo apt install nginx -y

   # Install Certbot (for SSL)
   sudo apt install certbot python3-certbot-nginx -y
   ```

3. **Create Database**
   ```bash
   sudo mysql
   CREATE DATABASE bayside_hms CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   CREATE USER 'bayside_admin'@'localhost' IDENTIFIED BY 'secure_password';
   GRANT ALL PRIVILEGES ON bayside_hms.* TO 'bayside_admin'@'localhost';
   FLUSH PRIVILEGES;
   EXIT;
   ```

4. **Import Schema**
   ```bash
   mysql -u bayside_admin -p bayside_hms < database/schema-mysql.sql
   ```

5. **Deploy Application**
   ```bash
   # Clone repository
   cd /var/www
   sudo git clone your-repo-url bayside-hms
   cd bayside-hms

   # Install dependencies
   sudo npm install

   # Create .env.local
   sudo nano .env.local
   # Add DATABASE_URL and JWT_SECRET

   # Build application
   sudo npm run build

   # Start with PM2
   sudo pm2 start npm --name "bayside-hms" -- start
   sudo pm2 save
   sudo pm2 startup
   ```

6. **Configure Nginx**
   ```bash
   sudo nano /etc/nginx/sites-available/bayside-hms
   ```

   Add:
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

7. **Setup SSL (Free with Let's Encrypt)**
   ```bash
   sudo certbot --nginx -d your-domain.com
   ```

8. **Setup Automatic Backups**
   ```bash
   # Create backup script
   sudo nano /usr/local/bin/backup-db.sh
   ```

   Add:
   ```bash
   #!/bin/bash
   DATE=$(date +%Y%m%d_%H%M%S)
   mysqldump -u bayside_admin -p'your_password' bayside_hms > /backups/bayside_$DATE.sql
   # Keep only last 7 days of backups
   find /backups -name "bayside_*.sql" -mtime +7 -delete
   ```

   ```bash
   # Make executable
   sudo chmod +x /usr/local/bin/backup-db.sh

   # Create backups directory
   sudo mkdir -p /backups

   # Add to crontab (daily at 2 AM)
   sudo crontab -e
   # Add: 0 2 * * * /usr/local/bin/backup-db.sh
   ```

---

## Choosing the Right Option

| Option | Best For | Monthly Cost | Difficulty |
|--------|----------|--------------|------------|
| **Vercel + PlanetScale** | Beginners, fast deployment | Free - $10 | ⭐ Easy |
| **Railway** | Quick setup, all-in-one | $5 | ⭐ Very Easy |
| **cPanel** | Existing hosting users | $3-10 | ⭐⭐ Medium |
| **DigitalOcean** | Production apps | $12+ | ⭐⭐⭐ Medium |
| **AWS** | Enterprise, scalable | $15-30+ | ⭐⭐⭐⭐ Hard |
| **VPS (Self-hosted)** | Full control, learning | $5-20 | ⭐⭐⭐⭐ Hard |

## Testing Your Deployment

After deploying, test these features:

1. **Homepage** - Should load without errors
2. **Registration** - Create a patient account
3. **Login** - Login with the account you created
4. **Appointment Booking** - Try to book an appointment
5. **Database Connection** - Check if data is saving

## Troubleshooting

### Common Issues:

**1. Database Connection Errors**
- Verify DATABASE_URL format
- Check if database server is running
- Ensure credentials are correct
- For SSL errors, add `?ssl=true` to connection string

**2. Build Errors**
- Run `npm install` again
- Clear `.next` folder and rebuild
- Check Node.js version (requires 18+)

**3. Environment Variables Not Working**
- Ensure `.env.local` is in root directory
- Restart application after changes
- For production, set in hosting dashboard

**4. Port Issues**
- Default port is 3000
- Change in your hosting settings if needed
- Ensure firewall allows the port

## Need Help?

- Check DATABASE_SETUP_MYSQL.md for detailed MySQL setup
- See README.md for application structure
- Review your hosting provider's documentation

---

**Recommendation for Beginners**: Start with **Railway** - it's the easiest and cheapest option that handles everything for you!
