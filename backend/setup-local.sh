#!/bin/bash

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 DOAXVV Handbook API - Local Setup${NC}"
echo "================================================"

# Check if Bun is installed
if ! command -v bun &> /dev/null; then
    echo -e "${RED}❌ Bun is not installed. Please install Bun first: https://bun.sh${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Bun is installed${NC}"

# Create necessary directories
echo -e "${BLUE}📁 Creating directories...${NC}"
mkdir -p logs backups uploads dist

# Install dependencies
echo -e "${BLUE}📦 Installing dependencies...${NC}"
bun install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo -e "${BLUE}⚙️  Creating .env file...${NC}"
    cp .env.example .env
    echo -e "${YELLOW}⚠️  Please edit .env file with your database credentials${NC}"
else
    echo -e "${GREEN}✅ .env file already exists${NC}"
fi

# Build the application
echo -e "${BLUE}🔨 Building application...${NC}"
bun run build

echo ""
echo -e "${GREEN}🎉 Setup completed successfully!${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "1. Edit .env file with your database credentials"
echo "2. Make sure MySQL is running and create the database"
echo "3. Start development: bun run dev"
echo "4. Start production:  NODE_ENV=production bun start"
echo "5. Health check:      bun run health or curl http://localhost:3001/api/health" 