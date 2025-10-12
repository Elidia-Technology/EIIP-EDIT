#!/bin/bash

# EIIP Editor - Docker Deployment Script
# This script helps you deploy EIIP Editor using Docker

set -e

echo "🐳 EIIP Editor - Docker Deployment"
echo "===================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed${NC}"
    echo "Please install Docker from: https://www.docker.com/products/docker-desktop"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose is not installed${NC}"
    echo "Please install Docker Compose"
    exit 1
fi

echo -e "${GREEN}✅ Docker is installed: $(docker --version)${NC}"
echo -e "${GREEN}✅ Docker Compose is installed: $(docker-compose --version)${NC}"
echo ""

# Main menu
echo "What would you like to do?"
echo "1) Build and start services"
echo "2) Start services (already built)"
echo "3) Stop services"
echo "4) View logs"
echo "5) Check status"
echo "6) Rebuild and restart"
echo "7) Clean up (remove containers and images)"
echo "8) Exit"
echo ""
read -p "Enter your choice [1-8]: " choice

case $choice in
    1)
        echo -e "${BLUE}📦 Building and starting services...${NC}"
        docker-compose up -d --build
        echo ""
        echo -e "${GREEN}✅ Services started successfully!${NC}"
        echo ""
        echo "🌐 Access the application at:"
        echo "   Frontend: http://localhost"
        echo "   Backend:  http://localhost:5001/api/health"
        echo ""
        echo "📊 Check status with: docker-compose ps"
        ;;
    2)
        echo -e "${BLUE}🚀 Starting services...${NC}"
        docker-compose up -d
        echo -e "${GREEN}✅ Services started!${NC}"
        ;;
    3)
        echo -e "${BLUE}🛑 Stopping services...${NC}"
        docker-compose down
        echo -e "${GREEN}✅ Services stopped!${NC}"
        ;;
    4)
        echo -e "${BLUE}📋 Showing logs (Ctrl+C to exit)...${NC}"
        docker-compose logs -f
        ;;
    5)
        echo -e "${BLUE}📊 Service Status:${NC}"
        docker-compose ps
        echo ""
        echo -e "${BLUE}🏥 Health Checks:${NC}"
        echo -n "Frontend: "
        if curl -sf http://localhost/ > /dev/null 2>&1; then
            echo -e "${GREEN}✅ Healthy${NC}"
        else
            echo -e "${RED}❌ Unhealthy${NC}"
        fi
        echo -n "Backend:  "
        if curl -sf http://localhost:5001/api/health > /dev/null 2>&1; then
            echo -e "${GREEN}✅ Healthy${NC}"
        else
            echo -e "${RED}❌ Unhealthy${NC}"
        fi
        ;;
    6)
        echo -e "${BLUE}🔄 Rebuilding and restarting...${NC}"
        docker-compose down
        docker-compose up -d --build --force-recreate
        echo -e "${GREEN}✅ Services rebuilt and restarted!${NC}"
        ;;
    7)
        echo -e "${YELLOW}⚠️  This will remove all containers, images, and volumes${NC}"
        read -p "Are you sure? (yes/no): " confirm
        if [ "$confirm" = "yes" ]; then
            echo -e "${BLUE}🧹 Cleaning up...${NC}"
            docker-compose down -v
            docker rmi eiip_edit-frontend eiip_edit-backend 2>/dev/null || true
            echo -e "${GREEN}✅ Cleanup complete!${NC}"
        else
            echo "Cleanup cancelled"
        fi
        ;;
    8)
        echo "👋 Goodbye!"
        exit 0
        ;;
    *)
        echo -e "${RED}❌ Invalid choice${NC}"
        exit 1
        ;;
esac

echo ""
echo "Run this script again for more options: ./docker-deploy.sh"
