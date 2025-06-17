# Handbook API

A robust, production-ready backend API server for the DOAXVV Handbook application, built with Node.js, Express, TypeScript, and MySQL.

## 🚀 Features

- **RESTful API** - Complete CRUD operations for game entities
- **Type Safety** - Full TypeScript implementation
- **Production Ready** - Optimized for deployment with Bun
- **Health Monitoring** - Comprehensive health checks and monitoring
- **Security** - CORS and input validation
- **Logging** - Structured logging with Winston
- **Database** - MySQL with connection pooling and transactions
- **Scalable Architecture** - Modular design with services and models

## 📁 Project Structure

```
backend/
├── src/                          # Source code
│   ├── config/                   # Configuration files
│   │   ├── database.ts           # Database configuration
│   │   └── logger.ts             # Logging configuration
│   ├── middleware/               # Express middleware
│   │   ├── errorHandler.ts       # Error handling
│   │   ├── validation.ts         # Request validation
│   │   └── validateRequest.ts    # Request validation middleware
│   ├── models/                   # Data models
│   ├── routes/                   # API route handlers
│   ├── services/                 # Business logic layer
│   ├── types/                    # TypeScript type definitions
│   ├── database/                 # Database related files
│   └── server.ts                 # Application entry point
├── dist/                         # Compiled JavaScript (generated)
├── logs/                         # Application logs
├── uploads/                      # File uploads
├── .env.example                  # Environment variables template
├── Dockerfile                    # Docker container configuration
├── docker-compose.yml            # Docker composition for full stack
├── deploy.sh                     # Automated deployment script
├── package.json                  # Node.js dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
└── README.md                     # This file
```

## 🛠️ Setup & Local Deployment

### Prerequisites

- Bun 1.0+
- MySQL 8.0+

### Quick Setup (Recommended)

**Use the automated setup script:**

```bash
chmod +x setup-local.sh
./setup-local.sh
```

This script will:
- Install all dependencies
- Create necessary directories
- Build the application
- Create .env file from template

### Manual Setup

1. **Install dependencies:**
   ```bash
   bun install
   ```
2. **Environment setup:**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```
3. **Build application:**
   ```bash
   bun run build
   ```
4. **Database setup:**
   ```bash
   # Create database and user in MySQL
   mysql -u root -p < src/database/migrations/001_enhanced_schema_mysql.sql
   ```

### Running the Application

**Development mode:**
```bash
bun run dev
```

**Production mode:**
```bash
NODE_ENV=production bun start
```

**Background execution (Linux/macOS):**
```bash
nohup bun start > logs/app.log 2>&1 &
```

The API will be available at `http://localhost:3001`

### Available Scripts

**Development:**
- `bun run dev` - Start development server with hot reload
- `bun run build` - Build production bundle
- `bun run setup` - Install dependencies and build

**Production:**
- `bun start` - Start production server directly
- `bun run deploy:local` - Build and restart (quick deploy)

**Utilities:**
- `bun run health` - Check application health

## ⚙️ Local Production Deployment

For simple deployments without process management:

```bash
# Development
bun run dev

# Production (direct)
NODE_ENV=production bun start

# Background execution
nohup bun start > logs/app.log 2>&1 &
```

## 🏥 Health Monitoring

### Health Check Endpoint

```bash
curl http://localhost:3001/api/health
```

## 🔧 Configuration

### Environment Variables

See `.env.example` for all available configuration options.

Key variables:
- `NODE_ENV` - Environment (development/staging/production)
- `PORT` - Server port (default: 3001)
- `DB_HOST`, `DB_USER`, `DB_PASSWORD` - Database connection
- `JWT_SECRET` - Secret key for JWT tokens
- `LOG_LEVEL` - Logging level (error/warn/info/debug)

### Database Configuration

The application uses MySQL with connection pooling:
- Connection pool size: 20 connections
- Acquire timeout: 15 seconds
- Query timeout: 30 seconds
- Auto-reconnect enabled

## 📊 API Documentation

### Base URL
```
Production: https://api.yourdomain.com
Development: http://localhost:3001
```

### Common Headers
```
Content-Type: application/json
Accept: application/json
```

### Main Endpoints

- `GET /api/health` - Health check
- `GET /api/characters` - List characters with pagination
- `GET /api/characters/:id` - Get specific character
- `POST /api/characters` - Create new character
- `PUT /api/characters/:id` - Update character
- `DELETE /api/characters/:id` - Delete character

### Pagination

All list endpoints support pagination:
```
GET /api/characters?page=1&limit=10&sortBy=name&sortOrder=asc
```

Response format:
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   ```bash
   systemctl status mysql
   mysql -h $DB_HOST -u $DB_USER -p
   ```
2. **Port Already in Use**
   ```bash
   lsof -i :3001
   kill -9 <PID>
   ```
3. **Build fails:**
   ```bash
   rm -rf dist node_modules
   bun install
   bun run build
   ```

### Log Locations

- Application logs: `./logs/app.log`
- System logs: `/var/log/doaxvv-api-deploy.log`

## 🔒 Security Considerations

- CORS configured for specific origins
- Input validation with Zod
- SQL injection prevention with parameterized queries
- No root user execution in Docker

## 📈 Performance Optimization

- Connection pooling for database
- Static file caching (if served)
- Memory usage monitoring and limits

## 🤝 Contributing

1. Follow the existing code structure
2. Add tests for new features
3. Update documentation
4. Use semantic commit messages
5. Ensure all health checks pass

## 📄 License

This project is licensed under the MIT License. 