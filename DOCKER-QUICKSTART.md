# 🐳 Docker Deployment - Quick Start Guide

## ✨ One-Command Deployment

Deploy EIIP Editor with Docker in 3 simple steps:

### Step 1: Clone the Repository
```bash
git clone git@github.com:SaleemLww/EIIP_EDIT.git
cd EIIP_EDIT
```

### Step 2: Run the Deployment Script
```bash
./docker-deploy.sh
```

### Step 3: Choose Option 1
```
What would you like to do?
1) Build and start services  ← Select this
```

**That's it!** 🎉

---

## 🌐 Access Your Application

Once deployed, access the application at:

- **Frontend (Image Editor)**: http://localhost
- **Backend API**: http://localhost:5001/api/health

---

## 🚀 Quick Commands

### Start Services
```bash
docker-compose up -d
```

### Stop Services
```bash
docker-compose down
```

### View Logs
```bash
docker-compose logs -f
```

### Check Status
```bash
docker-compose ps
```

### Rebuild Everything
```bash
docker-compose up -d --build --force-recreate
```

---

## 📊 What Gets Deployed?

### Frontend Container (eiip-frontend)
- **Image**: Nginx Alpine
- **Size**: ~50MB
- **Port**: 80
- **Features**:
  - Static React build
  - Gzip compression
  - Security headers
  - Caching for static assets
  - API proxy to backend

### Backend Container (eiip-backend)
- **Image**: Node.js 18 Alpine
- **Size**: ~120MB
- **Port**: 5001
- **Features**:
  - Express.js API
  - Health check endpoint
  - Non-root user security
  - Production optimized

---

## 🔧 Customization

### Change Ports

Edit `docker-compose.yml`:

```yaml
services:
  frontend:
    ports:
      - "8080:80"  # Frontend on port 8080
  backend:
    ports:
      - "3001:5001"  # Backend on port 3001
```

### Add Environment Variables

Create `.env` file:

```env
NODE_ENV=production
BACKEND_PORT=5001
```

---

## 🎯 Production Checklist

- [x] Multi-stage Docker builds for smaller images
- [x] Alpine Linux for minimal footprint
- [x] Non-root user security
- [x] Health checks enabled
- [x] Nginx with compression and caching
- [x] Security headers configured
- [x] Docker network isolation
- [x] Graceful shutdown handling

---

## 📚 Full Documentation

See **[DOCKER-DEPLOYMENT.md](./DOCKER-DEPLOYMENT.md)** for:
- Detailed configuration
- Security best practices
- Monitoring & maintenance
- Troubleshooting guide
- CI/CD integration
- Production deployment strategies

---

## 🆘 Need Help?

### Container Won't Start?
```bash
docker-compose logs
docker-compose ps
```

### Port Already in Use?
```bash
# Find what's using port 80
sudo lsof -i :80

# Or change the port in docker-compose.yml
```

### Clean Everything?
```bash
docker-compose down -v
docker system prune -a
```

---

## 🌟 Features Available

All 13 EIIP Editor tools work perfectly in Docker:
- ✂️ Interactive crop with drag-to-select
- 🎨 Color adjustments (brightness, contrast, saturation)
- ✨ 7 filters (grayscale, sepia, vintage, warm, cool, sharpen)
- 💫 Blur effects
- 📝 Text overlay with positioning
- ©️ Watermarking
- ⚡ Image optimization
- 🗜️ Compression
- 💾 Format conversion (PNG, JPEG, WebP)

---

**Made with ❤️ by Saleem Ahmad (Elite India)**  
**Version 1.0.0** | October 12, 2025
