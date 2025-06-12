# SQL Server Migration Guide

This document provides a comprehensive guide for migrating the DOAXVV Handbook backend from PostgreSQL to SQL Server.

## Overview

The migration includes:
- Database configuration updates
- Schema conversion from PostgreSQL to SQL Server
- Query syntax updates for SQL Server compatibility
- Data migration utilities
- Error handling updates

## Prerequisites

### SQL Server Setup
1. **Install SQL Server** (2019 or later recommended)
   - SQL Server Express (free) or full version
   - SQL Server Management Studio (SSMS) for management

2. **Create Database and User**
   ```sql
   CREATE DATABASE doaxvv_handbook;
   CREATE LOGIN doaxvv_user WITH PASSWORD = 'your_secure_password';
   USE doaxvv_handbook;
   CREATE USER doaxvv_user FOR LOGIN doaxvv_user;
   ALTER ROLE db_owner ADD MEMBER doaxvv_user;
   ```

### Node.js Dependencies
The migration replaces PostgreSQL dependencies with SQL Server ones:
- `pg` → `mssql`
- `@types/pg` → `@types/mssql`

## Migration Steps

### 1. Install Dependencies
```bash
bun install
```

### 2. Environment Configuration
Copy the SQL Server environment template:
```bash
cp .env.sqlserver.example .env
```

Update `.env` with your SQL Server connection details:
```env
DB_HOST=localhost
DB_PORT=1433
DB_NAME=doaxvv_handbook
DB_USER=doaxvv_user
DB_PASSWORD=your_secure_password
```

### 3. Create SQL Server Schema
Run the SQL Server schema migration:
```bash
# Using sqlcmd (if available)
bun run db:migrate:sqlserver

# Or manually execute the schema file in SSMS
# File: backend/migrations/001_enhanced_schema_sqlserver.sql
```

### 4. Data Migration (Optional)
If you have existing PostgreSQL data to migrate:

1. **Configure PostgreSQL connection** in `.env`:
   ```env
   PG_HOST=localhost
   PG_PORT=5432
   PG_NAME=doaxvv_handbook
   PG_USER=doaxvv_user
   PG_PASSWORD=pg_password
   ```

2. **Run data migration**:
   ```bash
   bun run db:migrate:data
   ```

### 5. Seed Database
Populate with sample data:
```bash
bun run db:seed
```

### 6. Start Application
```bash
# Development
bun run dev:full

# API only
bun run dev:api
```

## Key Changes Made

### Database Configuration
- **File**: `backend/config/database.ts`
- **Changes**: 
  - Replaced `pg.Pool` with `mssql.ConnectionPool`
  - Updated connection parameters for SQL Server
  - Added connection pool initialization

### Schema Conversion
- **File**: `backend/migrations/001_enhanced_schema_sqlserver.sql`
- **Key Changes**:
  - `VARCHAR` → `NVARCHAR` (Unicode support)
  - `TEXT` → `NVARCHAR(MAX)`
  - `SERIAL` → `IDENTITY(1,1)`
  - `TIMESTAMP` → `DATETIME2`
  - `BOOLEAN` → `BIT`
  - `JSONB` → `NVARCHAR(MAX)` (JSON as string)

### Query Syntax Updates
- **Parameter Placeholders**: `$1, $2` → `@param1, @param2`
- **Functions**: `NOW()` → `GETDATE()`, `CURRENT_TIMESTAMP` → `GETDATE()`
- **Returning Clause**: `RETURNING *` → `OUTPUT INSERTED.*`
- **Pagination**: `LIMIT/OFFSET` → `OFFSET/FETCH NEXT`
- **Row Count**: `result.rowCount` → `result.rowsAffected[0]`
- **Result Set**: `result.rows` → `result.recordset`

### Error Handling
- **PostgreSQL Error Codes** → **SQL Server Error Numbers**:
  - `23505` (Unique violation) → `2627`
  - `23503` (Foreign key violation) → `547`

## Database Service Updates

### Connection Management
```typescript
// Old (PostgreSQL)
const client = await pool.connect();
const result = await client.query('SELECT * FROM table WHERE id = $1', [id]);
client.release();

// New (SQL Server)
const request = getRequest();
request.input('id', sql.NVarChar(255), id);
const result = await request.query('SELECT * FROM table WHERE id = @id');
```

### Pagination
```typescript
// Old (PostgreSQL)
const query = `${baseQuery} ORDER BY ${sortBy} ${sortOrder} LIMIT $1 OFFSET $2`;

// New (SQL Server)
const query = `${baseQuery} ORDER BY ${sortBy} ${sortOrder} OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY`;
```

## Testing

### Health Check
Verify the database connection:
```bash
curl http://localhost:3001/api/health
```

### API Endpoints
Test CRUD operations:
```bash
# Get characters
curl http://localhost:3001/api/characters

# Get skills
curl http://localhost:3001/api/skills

# Get swimsuits
curl http://localhost:3001/api/swimsuits
```

## Troubleshooting

### Common Issues

1. **Connection Timeout**
   - Increase `connectionTimeout` in database config
   - Check SQL Server is running and accessible

2. **Authentication Failed**
   - Verify SQL Server authentication mode (mixed mode)
   - Check user permissions

3. **Schema Errors**
   - Ensure SQL Server version supports used features
   - Check for reserved keyword conflicts

4. **Full-text Search Issues**
   - Verify full-text search is enabled on SQL Server
   - Check catalog and index creation

### Performance Optimization

1. **Connection Pooling**
   - Adjust pool size based on load
   - Monitor connection usage

2. **Indexing**
   - All indexes from PostgreSQL schema are converted
   - Monitor query performance and add indexes as needed

3. **Query Optimization**
   - Use SQL Server execution plans
   - Consider stored procedures for complex operations

## Migration Verification

### Data Integrity
1. **Row Counts**: Verify all tables have expected row counts
2. **Relationships**: Check foreign key constraints
3. **Data Types**: Ensure proper data type conversion

### Functionality Testing
1. **CRUD Operations**: Test all create, read, update, delete operations
2. **Pagination**: Verify pagination works correctly
3. **Search**: Test full-text search functionality
4. **Transactions**: Verify transaction handling

## Rollback Plan

If issues occur, you can rollback by:
1. Reverting to PostgreSQL dependencies in `package.json`
2. Restoring original database configuration
3. Using PostgreSQL schema and data

## Support

For issues or questions:
1. Check SQL Server error logs
2. Review application logs in `logs/` directory
3. Verify environment configuration
4. Test database connectivity independently

## Next Steps

After successful migration:
1. **Performance Monitoring**: Set up monitoring for SQL Server
2. **Backup Strategy**: Implement regular database backups
3. **Security Review**: Review security settings and permissions
4. **Documentation**: Update team documentation with new procedures
