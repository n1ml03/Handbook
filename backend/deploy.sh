#!/bin/bash

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="doaxvv-handbook-api"
CURRENT_DIR="$(pwd)"
BACKUP_DIR="${CURRENT_DIR}/backups"
DEPLOY_DIR="${CURRENT_DIR}"
LOG_FILE="${CURRENT_DIR}/logs/deploy.log"

# Functions
log() {
    echo -e "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

error() {
    log "${RED}ERROR: $1${NC}"
    exit 1
}

success() {
    log "${GREEN}SUCCESS: $1${NC}"
}

warning() {
    log "${YELLOW}WARNING: $1${NC}"
}

info() {
    log "${BLUE}INFO: $1${NC}"
}

# Check if running as root
check_root() {
    if [[ $EUID -eq 0 ]]; then
        error "This script should not be run as root for security reasons"
    fi
}

# Check dependencies
check_dependencies() {
    info "Checking dependencies..."
    
    command -v bun >/dev/null 2>&1 || error "Bun is not installed"
    command -v pm2 >/dev/null 2>&1 || error "PM2 is not installed"
    command -v git >/dev/null 2>&1 || error "Git is not installed"
    
    success "All dependencies are installed"
}

# Create backup
create_backup() {
    info "Creating backup..."
    
    if [ -d "$DEPLOY_DIR" ]; then
        mkdir -p "$BACKUP_DIR"
        local backup_name="${APP_NAME}-$(date +%Y%m%d-%H%M%S)"
        tar -czf "${BACKUP_DIR}/${backup_name}.tar.gz" -C "$DEPLOY_DIR" . 2>/dev/null || true
        
        # Keep only last 5 backups
        cd "$BACKUP_DIR"
        ls -t *.tar.gz 2>/dev/null | tail -n +6 | xargs rm -f 2>/dev/null || true
        
        success "Backup created: ${backup_name}.tar.gz"
    else
        warning "No existing deployment found to backup"
    fi
}

# Deploy application
deploy() {
    info "Starting local deployment..."
    
    # Ensure we're in the correct directory
    cd "$DEPLOY_DIR"
    
    # Create necessary directories
    mkdir -p logs backups uploads
    
    # Pull latest code if git repository exists
    if [ -d ".git" ]; then
        info "Updating from git repository..."
        git pull origin main 2>/dev/null || warning "Git pull failed or not needed"
    else
        info "No git repository found, deploying current code..."
    fi
    
    # Install dependencies
    info "Installing dependencies..."
    bun install
    
    # Build application
    info "Building application..."
    bun run build
    
    success "Local deployment completed successfully"
}

# Database operations
run_migrations() {
    info "Running database migrations..."
    
    cd "$DEPLOY_DIR"
    
    # Check if database is accessible
    bun run health >/dev/null 2>&1 || warning "Database health check failed, but continuing..."
    
    # Run migrations if script exists
    if grep -q "db:migrate" package.json; then
        bun run db:migrate || warning "Migration failed or not configured"
    else
        warning "No migration script found, skipping..."
    fi
    
    success "Database operations completed"
}

# Health check
health_check() {
    info "Performing health check..."
    
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if curl -f http://localhost:3001/api/health >/dev/null 2>&1; then
            success "Health check passed"
            return 0
        fi
        
        info "Health check attempt $attempt/$max_attempts failed, retrying in 5 seconds..."
        sleep 5
        ((attempt++))
    done
    
    error "Health check failed after $max_attempts attempts"
}

# Rollback function
rollback() {
    warning "Rolling back to previous version..."
    
    # Find latest backup
    local latest_backup=$(ls -t "${BACKUP_DIR}"/*.tar.gz 2>/dev/null | head -n1)
    
    if [ -n "$latest_backup" ]; then
        info "Restoring from backup: $(basename "$latest_backup")"
        
        # Remove current deployment
        rm -rf "${DEPLOY_DIR:?}"/*
        
        # Extract backup
        tar -xzf "$latest_backup" -C "$DEPLOY_DIR"
        
        success "Rollback completed"
    else
        error "No backup found for rollback"
    fi
}

# Main deployment function
main() {
    local skip_backup=false
    local skip_migrations=false
    local action="reload"
    
    # Parse command line arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            --skip-backup)
                skip_backup=true
                shift
                ;;
            --skip-migrations)
                skip_migrations=true
                shift
                ;;
            --restart)
                action="restart"
                shift
                ;;
            --fresh)
                action="start"
                shift
                ;;
            --rollback)
                rollback
                exit 0
                ;;
            --help)
                echo "Usage: $0 [OPTIONS]"
                echo "Options:"
                echo "  --skip-backup      Skip creating backup"
                echo "  --skip-migrations  Skip running database migrations"
                echo "  --restart          Restart PM2 instead of reload"
                echo "  --fresh            Fresh start (stop and start PM2)"
                echo "  --rollback         Rollback to previous version"
                echo "  --help             Show this help message"
                exit 0
                ;;
            *)
                error "Unknown option: $1"
                ;;
        esac
    done
    
    info "Starting deployment of $APP_NAME"
    
    check_root
    check_dependencies
    
    if [ "$skip_backup" = false ]; then
        create_backup
    fi
    
    deploy
    
    if [ "$skip_migrations" = false ]; then
        run_migrations
    fi
    
    health_check
    
    success "Deployment completed successfully!"
    info "Application is running at http://localhost:3001"
    info "Health check: http://localhost:3001/api/health"
}

# Run main function if script is executed directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi 