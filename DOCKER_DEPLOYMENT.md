# 🐳 Stinger Application - Docker Deployment Guide

This guide provides comprehensive instructions for deploying the Stinger Sentiment Analysis application using Docker containers.

## 📋 Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- At least 4GB RAM available for containers
- 10GB free disk space

## 🏗️ Architecture Overview

The application consists of 5 containerized services:

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│    Nginx    │    │  Frontend   │    │   Backend   │
│   (Proxy)   │◄──►│   (React)   │◄──►│  (Node.js)  │
│    :80      │    │    :3000    │    │    :8080    │
└─────────────┘    └─────────────┘    └─────────────┘
                                              │
                   ┌─────────────┐    ┌─────────────┐
                   │ AI Service  │◄───┤   MongoDB   │
                   │  (FastAPI)  │    │ (Database)  │
                   │    :8000    │    │    :27017   │
                   └─────────────┘    └─────────────┘
```

## 🚀 Quick Start

### Option 1: Using the Deployment Script (Recommended)

```bash
# Make the script executable
chmod +x deploy.sh

# Run the deployment
./deploy.sh
```

### Option 2: Manual Docker Compose

```bash
# Build and start all services
docker-compose up --build -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

## 📦 Service Details

### 1. Frontend (React + Vite)
- **Port**: 3000
- **Technology**: React 19, TypeScript, Vite
- **Features**: 
  - Multi-stage build for optimization
  - Nginx serving static files
  - Hot reload in development

### 2. Backend (Node.js + Express)
- **Port**: 8080
- **Technology**: Node.js 18, Express, MongoDB
- **Features**:
  - JWT authentication
  - RESTful API
  - Health checks
  - Non-root user for security

### 3. AI Service (Python + FastAPI)
- **Port**: 8000
- **Technology**: FastAPI, Ollama, scikit-learn
- **Features**:
  - Sentiment analysis using Llama3
  - TF-IDF keyword extraction
  - Health monitoring

### 4. MongoDB Database
- **Port**: 27017
- **Technology**: MongoDB 7.0
- **Features**:
  - Persistent data storage
  - Authentication enabled
  - Automatic initialization

### 5. Nginx Reverse Proxy
- **Port**: 80
- **Features**:
  - Load balancing
  - Rate limiting
  - Security headers
  - SSL termination ready

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Database Configuration
MONGO_URI=mongodb://admin:password123@mongodb:27017/stinger?authSource=admin

# Backend Configuration
PORT=8080
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key

# AI Service Configuration
AI_SERVICE_URL=http://ai-service:8000

# MongoDB Credentials
MONGO_INITDB_ROOT_USERNAME=admin
MONGO_INITDB_ROOT_PASSWORD=password123
```

### Custom Configuration

#### Backend Configuration
Edit `Backend/src/index.js` for custom backend settings.

#### Frontend Configuration
Edit `Fontend/vite.config.ts` for custom frontend settings.

#### AI Service Configuration
Edit `llamaAi/app.py` for custom AI model settings.

## 🔍 Monitoring & Health Checks

### Health Check Endpoints

- **Backend**: `http://localhost:8080/`
- **AI Service**: `http://localhost:8000/health`
- **Nginx**: `http://localhost/health`

### Container Health Status

```bash
# Check all container status
docker-compose ps

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f ai-service
docker-compose logs -f frontend

# Monitor resource usage
docker stats
```

## 🛠️ Development Mode

For development with hot reload:

```bash
# Start only database and AI service
docker-compose up mongodb ai-service -d

# Run backend locally
cd Backend
npm install
npm run dev

# Run frontend locally
cd Fontend
npm install
npm run dev
```

## 🔒 Security Features

- **Non-root containers**: All services run as non-root users
- **Network isolation**: Services communicate through internal Docker network
- **Rate limiting**: API endpoints have rate limiting configured
- **Security headers**: Nginx adds security headers
- **Environment isolation**: Sensitive data in environment variables

## 📊 Performance Optimization

### Production Optimizations

1. **Frontend**: Multi-stage build with optimized assets
2. **Backend**: Production dependencies only
3. **Database**: Persistent volumes for data
4. **Caching**: Nginx caches static assets
5. **Compression**: Gzip compression enabled

### Resource Limits

Add resource limits to `docker-compose.yml`:

```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
```

## 🐛 Troubleshooting

### Common Issues

#### 1. Port Already in Use
```bash
# Check what's using the port
lsof -i :80
lsof -i :8080

# Kill the process or change ports in docker-compose.yml
```

#### 2. AI Service Not Starting
```bash
# Check AI service logs
docker-compose logs ai-service

# Restart AI service
docker-compose restart ai-service
```

#### 3. Database Connection Issues
```bash
# Check MongoDB logs
docker-compose logs mongodb

# Verify connection string in backend
docker-compose exec backend env | grep MONGO_URI
```

#### 4. Frontend Build Failures
```bash
# Check frontend logs
docker-compose logs frontend

# Rebuild frontend
docker-compose up --build frontend
```

### Debug Commands

```bash
# Enter container shell
docker-compose exec backend sh
docker-compose exec frontend sh

# View container details
docker inspect stinger-backend

# Check network connectivity
docker-compose exec backend ping ai-service
```

## 🔄 Updates & Maintenance

### Updating the Application

```bash
# Pull latest changes
git pull

# Rebuild and restart
docker-compose down
docker-compose up --build -d
```

### Database Backup

```bash
# Backup MongoDB
docker-compose exec mongodb mongodump --out /backup

# Copy backup from container
docker cp stinger-mongodb:/backup ./mongodb-backup
```

### Log Rotation

```bash
# Clear logs
docker-compose logs --no-log-prefix > app.log
docker system prune -f
```

## 🌐 Production Deployment

### SSL/HTTPS Setup

1. Add SSL certificates to `nginx/ssl/`
2. Update `nginx/nginx.conf` for HTTPS
3. Update environment variables for production URLs

### Scaling

```bash
# Scale specific services
docker-compose up --scale backend=3 -d
```

### Monitoring

Consider adding:
- Prometheus for metrics
- Grafana for dashboards
- ELK stack for logging

## 📞 Support

For issues and questions:
1. Check the logs: `docker-compose logs -f`
2. Verify health checks: `./deploy.sh`
3. Review this documentation
4. Check Docker and system resources

## 🎯 Next Steps

- Set up CI/CD pipeline
- Add monitoring and alerting
- Implement backup strategies
- Configure SSL certificates
- Set up production environment 