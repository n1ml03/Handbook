# MySQL Database Setup Guide

This guide will help you set up MySQL for the DOAXVV Handbook application.

## Prerequisites

- MySQL 8.0 or higher
- Node.js 18+ with Bun runtime
- Basic knowledge of SQL and command line

## Installation

### macOS (using Homebrew)
```bash
brew install mysql
brew services start mysql
```

### Ubuntu/Debian
```bash
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
sudo systemctl enable mysql
```

### Windows
1. Download MySQL installer from [MySQL official website](https://dev.mysql.com/downloads/installer/)
2. Run the installer and follow the setup wizard
3. Choose "Developer Default" setup type
4. Set a root password when prompted

## Database Setup

### 1. Secure MySQL Installation (Linux/macOS)
```bash
sudo mysql_secure_installation
```

### 2. Create Database and User
```sql
-- Connect to MySQL as root
mysql -u root -p

-- Create database
CREATE DATABASE doaxvv_handbook CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create user
CREATE USER 'doaxvv_user'@'localhost' IDENTIFIED BY 'doaxvv_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON doaxvv_handbook.* TO 'doaxvv_user'@'localhost';
FLUSH PRIVILEGES;

-- Exit MySQL
EXIT;
```

### 3. Test Connection
```bash
mysql -u doaxvv_user -p doaxvv_handbook
```

## Application Configuration

### 1. Environment Variables
Copy the example environment file and configure it:
```bash
cp .env.example .env
```

Edit `.env` file:
```env
# MySQL Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=doaxvv_handbook
DB_USER=doaxvv_user
DB_PASSWORD=doaxvv_password
```

### 2. Install Dependencies
```bash
bun install
```

### 3. Run Database Migration
```bash
# Run the MySQL schema migration
bun run db:migrate:mysql

# Or manually run the SQL file
mysql -u doaxvv_user -p doaxvv_handbook < backend/migrations/001_enhanced_schema_mysql.sql
```

### 4. Seed Database (Optional)
```bash
bun run db:seed
```

### 5. Test the Setup
```bash
bun run test:migration
```

## Migration from PostgreSQL/SQL Server

If you're migrating from PostgreSQL or SQL Server:

### 1. Export Data from Source Database
```bash
# For PostgreSQL
pg_dump -U username -h localhost database_name > backup.sql

# For SQL Server
# Use SQL Server Management Studio or sqlcmd to export data
```

### 2. Run Migration Script
```bash
# Make sure both source and target databases are running
bun run db:migrate:data
```

## Performance Optimization

### 1. MySQL Configuration
Add these settings to your MySQL configuration file (`my.cnf` or `my.ini`):

```ini
[mysqld]
# InnoDB settings
innodb_buffer_pool_size = 1G
innodb_log_file_size = 256M
innodb_flush_log_at_trx_commit = 2

# Query cache (for MySQL 5.7 and earlier)
query_cache_type = 1
query_cache_size = 256M

# Connection settings
max_connections = 200
wait_timeout = 28800

# Character set
character-set-server = utf8mb4
collation-server = utf8mb4_unicode_ci
```

### 2. Index Optimization
The schema includes optimized indexes for common queries. Monitor slow queries:

```sql
-- Enable slow query log
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 2;

-- Check slow queries
SELECT * FROM mysql.slow_log ORDER BY start_time DESC LIMIT 10;
```

## Backup and Restore

### Backup
```bash
# Full backup
mysqldump -u doaxvv_user -p doaxvv_handbook > backup_$(date +%Y%m%d_%H%M%S).sql

# Schema only
mysqldump -u doaxvv_user -p --no-data doaxvv_handbook > schema_backup.sql

# Data only
mysqldump -u doaxvv_user -p --no-create-info doaxvv_handbook > data_backup.sql
```

### Restore
```bash
mysql -u doaxvv_user -p doaxvv_handbook < backup_file.sql
```

## Troubleshooting

### Common Issues

1. **Connection Refused**
   - Check if MySQL service is running: `sudo systemctl status mysql`
   - Verify port 3306 is not blocked by firewall

2. **Authentication Failed**
   - Verify username and password
   - Check user privileges: `SHOW GRANTS FOR 'doaxvv_user'@'localhost';`

3. **Character Set Issues**
   - Ensure database uses utf8mb4 charset
   - Check connection charset in application

4. **Performance Issues**
   - Monitor slow queries
   - Check index usage with `EXPLAIN` statements
   - Optimize MySQL configuration

### Useful Commands

```sql
-- Check database status
SHOW STATUS;

-- View current connections
SHOW PROCESSLIST;

-- Check table sizes
SELECT 
    table_name AS 'Table',
    ROUND(((data_length + index_length) / 1024 / 1024), 2) AS 'Size (MB)'
FROM information_schema.TABLES 
WHERE table_schema = 'doaxvv_handbook'
ORDER BY (data_length + index_length) DESC;

-- Optimize tables
OPTIMIZE TABLE table_name;
```

## Security Considerations

1. **Use Strong Passwords**: Ensure database user has a strong password
2. **Limit Privileges**: Grant only necessary privileges to application user
3. **Network Security**: Use SSL connections in production
4. **Regular Updates**: Keep MySQL updated to latest stable version
5. **Backup Encryption**: Encrypt sensitive backup files

## Production Deployment

For production environments:

1. **SSL Configuration**:
```env
DB_SSL=true
```

2. **Connection Pooling**: Already configured in the application
3. **Monitoring**: Set up MySQL monitoring and alerting
4. **Backup Strategy**: Implement automated daily backups
5. **High Availability**: Consider MySQL replication or clustering

## Support

If you encounter issues:
1. Check the application logs: `logs/app.log`
2. Review MySQL error log: `/var/log/mysql/error.log`
3. Test database connection independently
4. Verify all environment variables are set correctly
