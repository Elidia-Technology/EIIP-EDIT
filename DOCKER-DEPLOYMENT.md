# Docker Deployment Guide - EIIP Editor

This guide explains how to deploy the EIIP Image Editor using Docker and Docker Compose.

## 📋 Prerequisites

- **Docker** (v20.10+)
- **Docker Compose** (v2.0+)
- At least 2GB RAM available
- 1GB free disk space

### Install Docker

**macOS:**
```bash
brew install docker docker-compose
# Or download Docker Desktop from https://www.docker.com/products/docker-desktop
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get update
sudo apt-get install docker.io docker-compose
sudo systemctl start docker
sudo systemctl enable docker
```

**Windows:**
Download Docker Desktop from https://www.docker.com/products/docker-desktop

---

## 🚀 Quick Start (Production)

### 1. Build and Start Services

```bash
cd /Users/mac/WorkSpace/EIIP_EDIT
docker-compose up -d --build
```

This command will:
- Build the frontend Docker image (with Nginx)
- Build the backend Docker image (Node.js)
- Start both services in detached mode
- Create a Docker network for inter-service communication

### 2. Access the Application

Open your browser and navigate to:
- **Frontend**: http://localhost
- **Backend API**: http://localhost:5001/api/health

### 3. Check Service Status

```bash
docker-compose ps
```

Expected output:
```
NAME              COMMAND                  SERVICE    STATUS         PORTS
eiip-backend      "docker-entrypoint.s…"   backend    Up (healthy)   0.0.0.0:5001->5001/tcp
eiip-frontend     "/docker-entrypoint.…"   frontend   Up (healthy)   0.0.0.0:80->80/tcp
```

---

## 🛠️ Docker Commands Reference

### Start Services
```bash
# Start in foreground (see logs)
docker-compose up

# Start in background (detached mode)
docker-compose up -d

# Rebuild and start
docker-compose up -d --build
```

### Stop Services
```bash
# Stop services (keeps containers)
docker-compose stop

# Stop and remove containers
docker-compose down

# Stop and remove containers + volumes
docker-compose down -v
```

### View Logs
```bash
# All services
docker-compose logs

# Follow logs in real-time
docker-compose logs -f

# Specific service
docker-compose logs frontend
docker-compose logs backend

# Last 100 lines
docker-compose logs --tail=100 -f
```

### Restart Services
```bash
# Restart all services
docker-compose restart

# Restart specific service
docker-compose restart frontend
docker-compose restart backend
```

### Execute Commands in Container
```bash
# Access frontend container shell
docker-compose exec frontend sh

# Access backend container shell
docker-compose exec backend sh

# Run command in backend
docker-compose exec backend npm list
```

### Health Checks
```bash
# Check container health
docker ps --format "table {{.Names}}\t{{.Status}}"

# Frontend health
curl http://localhost/

# Backend health
curl http://localhost:5001/api/health
```

---

## 📦 Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Docker Deployment                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  Frontend Container (eiip-frontend)                │    │
│  │  ├─ Nginx Alpine                                   │    │
│  │  ├─ React Build (static files)                     │    │
│  │  ├─ Port: 80                                       │    │
│  │  └─ Health Check: wget http://localhost/          │    │
│  └────────────────────────────────────────────────────┘    │
│           ↓                                                  │
│  ┌────────────────────────────────────────────────────┐    │
│  │  Backend Container (eiip-backend)                  │    │
│  │  ├─ Node.js 18 Alpine                             │    │
│  │  ├─ Express.js API                                │    │
│  │  ├─ Port: 5001                                    │    │
│  │  └─ Health Check: /api/health                     │    │
│  └────────────────────────────────────────────────────┘    │
│           ↓                                                  │
│  ┌────────────────────────────────────────────────────┐    │
│  │  Docker Network (eiip-network)                     │    │
│  │  └─ Bridge network for inter-service communication │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Backend
NODE_ENV=production
BACKEND_PORT=5001

# Frontend
REACT_APP_API_URL=http://localhost:5001
```

### Custom Ports

Edit `docker-compose.yml` to change ports:

```yaml
services:
  frontend:
    ports:
      - "8080:80"  # Change 8080 to your desired port
  
  backend:
    ports:
      - "5001:5001"  # Change first 5001 to your desired port
```

Then restart:
```bash
docker-compose down
docker-compose up -d
```

---

## 🔒 Security Best Practices

### 1. Non-Root User
Both containers run as non-root users:
- Frontend: nginx user
- Backend: nodejs user (UID 1001)

### 2. Security Headers
Nginx configuration includes:
- X-Frame-Options: SAMEORIGIN
- X-Content-Type-Options: nosniff
- X-XSS-Protection: 1; mode=block

### 3. Resource Limits

Add resource limits in `docker-compose.yml`:

```yaml
services:
  frontend:
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
        reservations:
          memory: 256M
  
  backend:
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
        reservations:
          memory: 256M
```

---

## 📊 Monitoring & Maintenance

### View Resource Usage
```bash
# CPU and memory usage
docker stats

# Disk usage
docker system df

# Detailed info
docker system df -v
```

### Clean Up Old Images
```bash
# Remove unused images
docker image prune -a

# Remove unused volumes
docker volume prune

# Remove everything unused
docker system prune -a --volumes
```

### Backup Data
```bash
# Export container filesystem
docker export eiip-backend > backend-backup.tar
docker export eiip-frontend > frontend-backup.tar

# Save images
docker save eiip_edit-backend:latest | gzip > backend-image.tar.gz
docker save eiip_edit-frontend:latest | gzip > frontend-image.tar.gz
```

---

## 🐛 Troubleshooting

### Container Won't Start

```bash
# Check logs
docker-compose logs backend
docker-compose logs frontend

# Check container status
docker-compose ps

# Rebuild from scratch
docker-compose down -v
docker-compose up -d --build --force-recreate
```

### Port Already in Use

```bash
# Find process using port 80
sudo lsof -i :80

# Find process using port 5001
sudo lsof -i :5001

# Kill process (replace PID)
sudo kill -9 <PID>

# Or use different ports in docker-compose.yml
```

### Permission Denied

```bash
# Add your user to docker group (Linux)
sudo usermod -aG docker $USER
newgrp docker

# Or run with sudo
sudo docker-compose up -d
```

### Frontend Can't Reach Backend

```bash
# Check network
docker network ls
docker network inspect eiip-network

# Test connectivity
docker-compose exec frontend wget -O- http://backend:5001/api/health

# Recreate network
docker-compose down
docker network rm eiip-network
docker-compose up -d
```

### Health Check Failing

```bash
# Check health status
docker inspect eiip-backend | grep -A 10 Health
docker inspect eiip-frontend | grep -A 10 Health

# Manual health check
curl http://localhost/
curl http://localhost:5001/api/health

# View health check logs
docker-compose logs | grep health
```

---

## 🚢 Production Deployment

### Using Docker Swarm

```bash
# Initialize swarm
docker swarm init

# Deploy stack
docker stack deploy -c docker-compose.yml eiip-stack

# Check services
docker service ls

# Scale services
docker service scale eiip-stack_frontend=3
docker service scale eiip-stack_backend=3

# Remove stack
docker stack rm eiip-stack
```

### Using Kubernetes

Convert docker-compose to Kubernetes manifests:

```bash
# Install kompose
brew install kompose

# Convert
kompose convert -f docker-compose.yml

# Deploy to Kubernetes
kubectl apply -f .
```

### Using Docker Hub

```bash
# Tag images
docker tag eiip_edit-frontend:latest yourusername/eiip-frontend:latest
docker tag eiip_edit-backend:latest yourusername/eiip-backend:latest

# Push to Docker Hub
docker login
docker push yourusername/eiip-frontend:latest
docker push yourusername/eiip-backend:latest

# Pull and run on another machine
docker pull yourusername/eiip-frontend:latest
docker pull yourusername/eiip-backend:latest
docker-compose up -d
```

---

## 📈 Performance Optimization

### 1. Build Cache
Use multi-stage builds (already implemented) to reduce image size.

### 2. Nginx Compression
Gzip is enabled in `frontend/nginx.conf` for:
- text/plain, text/css, text/xml
- application/javascript
- application/json

### 3. Static Asset Caching
Cache headers set for 1 year on static assets (images, fonts, etc.)

### 4. Image Optimization
Both containers use Alpine Linux for minimal size:
- Frontend: ~50MB
- Backend: ~120MB

---

## 🔄 CI/CD Integration

### GitHub Actions Example

Create `.github/workflows/docker-deploy.yml`:

```yaml
name: Docker Build and Deploy

on:
  push:
    branches: [ master ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build images
        run: docker-compose build
      
      - name: Run tests
        run: |
          docker-compose up -d
          sleep 10
          curl -f http://localhost/ || exit 1
          curl -f http://localhost:5001/api/health || exit 1
          docker-compose down
      
      - name: Push to Docker Hub
        run: |
          echo "${{ secrets.DOCKER_PASSWORD }}" | docker login -u "${{ secrets.DOCKER_USERNAME }}" --password-stdin
          docker-compose push
```

---

## 📝 Files Structure

```
EIIP_EDIT/
├── docker-compose.yml          # Multi-container orchestration
├── .dockerignore               # Files to exclude from Docker build
├── frontend/
│   ├── Dockerfile             # Frontend container definition
│   ├── nginx.conf             # Nginx web server configuration
│   └── ...
└── backend/
    ├── Dockerfile             # Backend container definition
    └── ...
```

---

## 🆘 Support

For issues related to:
- **Docker deployment**: Check this guide
- **Application features**: See FEATURES.md
- **Development setup**: See README.md

---

## 📄 License

MIT License - See LICENSE file

---

**Made with ❤️ by Saleem Ahmad (Elite India)**  
**Last Updated**: October 12, 2025
