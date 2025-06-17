# Handbook

A comprehensive game guide and data management system for Dead or Alive Xtreme Venus Vacation, built with modern web technologies.

## 🏗️ Project Structure

This is a monorepo containing two separate applications:

```
├── frontend/          # React TypeScript frontend application
├── backend/           # Node.js Express backend API
├── .env              # Environment configuration
├── .gitignore        # Git exclusions
└── package.json      # Workspace configuration
```

## 🚀 Quick Start

### Prerequisites

- Bun >= 1.0

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd handbook
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```

3. **Environment setup**
   ```bash
   cp .env .env.local
   # Edit .env.local with your configuration
   ```

4. **Start development servers**
   ```bash
   npm run dev:full
   ```

   This will start:
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:3001`

## 📁 Applications

### Frontend
- **Technology**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS + Radix UI
- **Features**: Rich text editor, responsive design, accessibility
- **Location**: `./frontend/`
- **Documentation**: See [frontend/README.md](./frontend/README.md)

### Backend
- **Technology**: Node.js + Express + TypeScript
- **Database**: MySQL
- **Features**: RESTful API, authentication, data validation
- **Location**: `./backend/`
- **Documentation**: See [backend/README.md](./backend/README.md)

## 🛠️ Development Commands

### Workspace Commands
```bash
# Development
npm run dev:frontend      # Start frontend only
npm run dev:backend       # Start backend only
npm run dev:full         # Start both applications

# Building
npm run build:frontend   # Build frontend
npm run build:backend    # Build backend
npm run build:all        # Build both applications

# Maintenance
npm run install:all      # Install all dependencies
npm run clean:all        # Clean all build artifacts
npm run lint:all         # Lint all code
```

### Individual Application Commands
```bash
# Frontend commands
cd frontend
npm run dev
npm run build
npm run lint

# Backend commands
cd backend
npm run dev
npm run build
npm run lint
```

## 🔧 Configuration

### Environment Variables
Copy `.env` to `.env.local` and configure:

```env
# Database
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_NAME=doaxvv_handbook
DATABASE_USER=your_user
DATABASE_PASSWORD=your_password

# API
API_PORT=3001
JWT_SECRET=your_jwt_secret

# Frontend
VITE_API_URL=http://localhost:3001/api
```

## 🏃‍♂️ Deployment

### Frontend
The frontend builds to static files and can be deployed to any static hosting service:
- Vercel
- Netlify
- AWS S3 + CloudFront
- GitHub Pages

### Backend
The backend is a Node.js application that can be deployed to:
- Railway
- Heroku
- DigitalOcean App Platform
- AWS EC2

## 🤝 Contributing

1. Each application has its own development workflow
2. Follow the coding standards defined in each application
3. Test your changes thoroughly
4. Update documentation as needed

## 📦 Technologies Used

### Frontend
- React 19 with TypeScript
- Vite for building and development
- Tailwind CSS for styling
- Radix UI for components
- TipTap for rich text editing

### Backend
- Node.js with Express
- TypeScript for type safety
- MySQL for database
- Joi for validation
- Winston for logging

## 📄 License

This project is private and confidential.

## 🔗 Links

- [Frontend Documentation](./frontend/README.md)
- [Backend Documentation](./backend/README.md)
- [Database Setup Guide](./backend/README-MYSQL-SETUP.md)