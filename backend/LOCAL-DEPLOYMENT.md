# 🚀 Local Deployment Guide

This guide covers deploying the DOAXVV Handbook API locally without Docker.

## 📋 Prerequisites

Before starting, ensure you have:

- **Bun 1.0+** - [Download here](https://bun.sh)
- **MySQL 8.0+** - [Download here](https://dev.mysql.com/downloads/)
- **Git** (optional) - For version control

## 🏃‍♂️ Quick Start

### Step 1: Automated Setup

```bash
# Clone the repository (if not already done)
git clone <your-repo-url>
cd backend

# Run the automated setup script
chmod +x setup-local.sh
./setup-local.sh
```

### Step 2: Configure Environment

```bash
# Edit the .env file with your database credentials
nano .env
```

Required configuration:
```env
NODE_ENV=production
PORT=3001
DB_HOST=localhost
DB_PORT=3306
DB_NAME=doaxvv_handbook
DB_USER=your_db_user
DB_PASSWORD=your_db_password
```

### Step 3: Setup Database

```sql
-- Connect to MySQL as root
mysql -u root -p

-- Create database and user
CREATE DATABASE doaxvv_handbook;
CREATE USER 'doaxvv_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON doaxvv_handbook.* TO 'doaxvv_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

```bash
# Import database schema
mysql -u doaxvv_user -p doaxvv_handbook < src/database/migrations/001_enhanced_schema_mysql.sql
```

### Step 4: Start the Application

```bash
# Start with PM2 (recommended)
bun run pm2:start

# Or start in development mode
bun run dev
```

## 🔧 Manual Setup (Detailed)

### 1. Install Dependencies

```bash
# Install dependencies
bun install

# Install PM2 globally for process management
bun add -g pm2
```

### 2. Create Required Directories

```bash
mkdir -p logs backups uploads dist
```

### 3. Environment Configuration

```bash
# Copy environment template
cp .env.example .env

# Edit with your settings
vim .env
```

### 4. Build Application

```bash
# Build application
bun run build

# Verify build was successful
ls -la dist/
```

### 5. Database Setup

Create database and user in MySQL:

```sql
CREATE DATABASE doaxvv_handbook CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'doaxvv_user'@'localhost' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON doaxvv_handbook.* TO 'doaxvv_user'@'localhost';
FLUSH PRIVILEGES;
```

Import the database schema:

```bash
mysql -u doaxvv_user -p doaxvv_handbook < src/database/migrations/001_enhanced_schema_mysql.sql
```

## 🚀 Deployment Options

### Option 1: PM2 (Recommended)

**Advantages:**
- Process monitoring and restart
- Log management
- Zero-downtime deployments
- Cluster mode support
- Auto-start on system boot

**Commands:**
```bash
# Start
bun run pm2:start

# Monitor
bun run pm2:monit

# Logs
bun run pm2:logs

# Restart
bun run pm2:restart

# Stop
bun run pm2:stop
```

### Option 2: Direct Node.js

**Advantages:**
- Simple and direct
- No additional dependencies
- Good for development

**Commands:**
```bash
# Development
bun run dev

# Production
NODE_ENV=production bun start

# Background
nohup bun start > logs/app.log 2>&1 &
```

### Option 3: Using the Deployment Script

```bash
# Full deployment with backup
./deploy.sh

# Quick deployment
./deploy.sh --skip-backup

# Fresh start
./deploy.sh --fresh
```

## 📊 Monitoring & Logs

### PM2 Monitoring

```bash
# Real-time monitoring
bun run pm2:monit

# Process list
pm2 list

# Detailed info
pm2 show doaxvv-handbook-api

# Logs
bun run pm2:logs

# Error logs only
pm2 logs --err

# Log files location
ls -la logs/
```

### Health Checks

```bash
# Check application health
bun run health

# Or use curl directly
curl http://localhost:3001/api/health
```

### Log Files

- Application logs: `./logs/app.log`
- PM2 logs: `./logs/pm2-*.log`
- Error logs: `./logs/pm2-error.log`
- Deploy logs: `./logs/deploy.log`

## 🔄 Updates & Maintenance

### Updating the Application

```bash
# Using deployment script (recommended)
./deploy.sh

# Manual update
git pull
bun install
bun run build
bun run pm2:restart
```

### Database Migrations

```bash
# If you have migration scripts
bun run db:migrate

# Manual SQL updates
mysql -u doaxvv_user -p doaxvv_handbook < new_migration.sql
```

### Backup and Restore

**Backup:**
```bash
# Database backup
mysqldump -u doaxvv_user -p doaxvv_handbook > backup_$(date +%Y%m%d).sql

# Application backup (automatic with deploy.sh)
./deploy.sh  # Creates backup in ./backups/
```

**Restore:**
```bash
# Database restore
mysql -u doaxvv_user -p doaxvv_handbook < backup_20241201.sql

# Application restore
./deploy.sh --rollback
```

## 🎯 Performance Optimization

### PM2 Configuration

```bash
# Enable clustering (edit ecosystem.config.js)
# instances: 'max' or specific number

# Monitor memory usage
pm2 show doaxvv-handbook-api

# Memory optimization
pm2 restart doaxvv-handbook-api --max-memory-restart 1000M
```

### MySQL Optimization

```sql
-- Optimize database
OPTIMIZE TABLE characters, skills, swimsuits;

-- Add indexes if needed
CREATE INDEX idx_character_name ON characters(name);
```

## 🔧 Troubleshooting

### Common Issues

**1. Port already in use:**
```bash
# Find process using port 3001
lsof -i :3001

# Kill process
kill -9 <PID>
```

**2. Database connection failed:**
```bash
# Test database connection
mysql -u doaxvv_user -p -h localhost

# Check MySQL status
systemctl status mysql  # Linux
brew services list mysql  # macOS
```

**3. PM2 not starting:**
```bash
# Check PM2 logs
bun run pm2:logs

# Delete and restart
bun run pm2:delete
bun run pm2:start
```

**4. Build fails:**
```bash
# Clean and rebuild
rm -rf dist node_modules
bun install
bun run build
```

### Debug Mode

```bash
# Enable debug logging
DEBUG=* bun run dev

# Or set log level in .env
LOG_LEVEL=debug
```

## 🔐 Security Considerations

### Environment Variables

```bash
# Secure the .env file
chmod 600 .env
```

### Database Security

```sql
-- Create a limited user for production
CREATE USER 'doaxvv_prod'@'localhost' IDENTIFIED BY 'very_secure_password';
GRANT SELECT, INSERT, UPDATE, DELETE ON doaxvv_handbook.* TO 'doaxvv_prod'@'localhost';
```

### Firewall Configuration

```bash
# Allow only specific ports (Linux)
sudo ufw allow 3001
sudo ufw allow 3306/tcp from 127.0.0.1
```

## 📚 Additional Resources

- [PM2 Documentation](https://pm2.keymetrics.io/docs/)
- [Node.js Performance Best Practices](https://nodejs.org/en/docs/guides/simple-profiling/)
- [MySQL Performance Tuning](https://dev.mysql.com/doc/refman/8.0/en/optimization.html)

## 🆘 Support

If you encounter issues:

1. Check the logs: `bun run pm2:logs`
2. Verify health: `bun run health`
3. Review this guide
4. Check the main README.md for additional information 