# 🌐 Stinger Web Deployment & CI/CD Guide

This comprehensive guide covers deploying the Stinger Sentiment Analysis application to the web with automated CI/CD pipelines.

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Cloud Platform Options](#cloud-platform-options)
3. [CI/CD Pipeline Setup](#cicd-pipeline-setup)
4. [Environment Configuration](#environment-configuration)
5. [Deployment Strategies](#deployment-strategies)
6. [Monitoring & Maintenance](#monitoring--maintenance)
7. [Troubleshooting](#troubleshooting)

## 🚀 Quick Start

### Option 1: One-Click Deployment

Choose your preferred platform and click to deploy:

[![Deploy to Railway](https://railway.app/button.svg)](https://railway.app/new/template/stinger)
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/your-username/stinger-app)
[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/stinger-app)

### Option 2: Automated Script

```bash
# Make deployment script executable
chmod +x deploy-cloud.sh

# Deploy to Railway
./deploy-cloud.sh railway

# Deploy to all platforms
./deploy-cloud.sh all
```

### Option 3: Manual GitHub Actions

1. Fork the repository
2. Set up environment secrets
3. Push to `main` branch to trigger deployment

## 🌍 Cloud Platform Options

### 1. Railway (Recommended for Beginners)

**Pros:**
- ✅ Simple setup and deployment
- ✅ Automatic HTTPS
- ✅ Built-in database
- ✅ Free tier available
- ✅ Git-based deployments

**Cons:**
- ❌ Limited customization
- ❌ Pricing can scale quickly

**Setup:**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway up
```

**Environment Variables:**
```env
MONGO_URI=mongodb://...
JWT_SECRET=your-secret-key
AI_SERVICE_URL=https://your-ai-service.railway.app
```

### 2. Render

**Pros:**
- ✅ Free tier with good limits
- ✅ Automatic SSL
- ✅ Easy database setup
- ✅ Docker support
- ✅ Auto-deploy from Git

**Cons:**
- ❌ Cold starts on free tier
- ❌ Limited regions

**Setup:**
1. Connect GitHub repository
2. Configure `render.yaml`
3. Set environment variables
4. Deploy automatically

### 3. Vercel (Frontend Only)

**Pros:**
- ✅ Excellent for React apps
- ✅ Global CDN
- ✅ Automatic deployments
- ✅ Great performance
- ✅ Free tier

**Cons:**
- ❌ Frontend only (need separate backend)
- ❌ Serverless limitations

**Setup:**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy frontend
cd Fontend
vercel --prod
```

### 4. DigitalOcean App Platform

**Pros:**
- ✅ Full-stack support
- ✅ Managed databases
- ✅ Predictable pricing
- ✅ Good performance
- ✅ Multiple regions

**Cons:**
- ❌ More complex setup
- ❌ No free tier

**Setup:**
```bash
# Install doctl
brew install doctl  # macOS
# or download from GitHub releases

# Authenticate
doctl auth init

# Deploy
doctl apps create --spec .do/app.yaml
```

### 5. AWS ECS

**Pros:**
- ✅ Highly scalable
- ✅ Enterprise-grade
- ✅ Full AWS ecosystem
- ✅ Fine-grained control

**Cons:**
- ❌ Complex setup
- ❌ Steep learning curve
- ❌ Can be expensive

### 6. Google Cloud Run

**Pros:**
- ✅ Serverless containers
- ✅ Pay-per-use
- ✅ Auto-scaling
- ✅ Good integration

**Cons:**
- ❌ Cold starts
- ❌ Complex networking

### 7. Azure Container Instances

**Pros:**
- ✅ Simple container deployment
- ✅ Pay-per-second billing
- ✅ Quick startup

**Cons:**
- ❌ Limited features
- ❌ No load balancing

## 🔄 CI/CD Pipeline Setup

### GitHub Actions (Included)

The repository includes a comprehensive GitHub Actions workflow that:

1. **Tests** all services
2. **Builds** Docker images
3. **Scans** for security vulnerabilities
4. **Deploys** to multiple platforms
5. **Notifies** on success/failure

#### Required Secrets

Set these in your GitHub repository settings:

```
# Container Registry
GITHUB_TOKEN (automatic)

# Railway
RAILWAY_TOKEN

# Render
RENDER_API_KEY
RENDER_SERVICE_ID

# DigitalOcean
DIGITALOCEAN_ACCESS_TOKEN
DO_APP_ID

# Vercel
VERCEL_TOKEN

# AWS
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY

# Google Cloud
GOOGLE_APPLICATION_CREDENTIALS

# Notifications
SLACK_WEBHOOK_URL
```

#### Workflow Triggers

- **Push to `main`**: Production deployment
- **Push to `develop`**: Staging deployment
- **Pull Requests**: Testing and validation

### GitLab CI/CD

Create `.gitlab-ci.yml`:

```yaml
stages:
  - test
  - build
  - deploy

variables:
  DOCKER_DRIVER: overlay2

test:
  stage: test
  script:
    - npm test

build:
  stage: build
  script:
    - docker build -t $CI_REGISTRY_IMAGE .
    - docker push $CI_REGISTRY_IMAGE

deploy:
  stage: deploy
  script:
    - ./deploy-cloud.sh railway
  only:
    - main
```

### Jenkins Pipeline

Create `Jenkinsfile`:

```groovy
pipeline {
    agent any
    
    stages {
        stage('Test') {
            steps {
                sh 'npm test'
            }
        }
        
        stage('Build') {
            steps {
                sh 'docker build -t stinger .'
            }
        }
        
        stage('Deploy') {
            steps {
                sh './deploy-cloud.sh railway'
            }
        }
    }
}
```

## ⚙️ Environment Configuration

### Production Environment Variables

Create `.env.production`:

```env
# Database
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/stinger
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=secure-password

# Authentication
JWT_SECRET=super-secure-jwt-secret-key-256-bits

# Services
AI_SERVICE_URL=https://stinger-ai.your-domain.com
FRONTEND_URL=https://stinger.your-domain.com
BACKEND_URL=https://api.stinger.your-domain.com

# Security
CORS_ORIGIN=https://stinger.your-domain.com
ALLOWED_HOSTS=stinger.your-domain.com,api.stinger.your-domain.com

# Monitoring
GRAFANA_PASSWORD=secure-grafana-password
PROMETHEUS_RETENTION=30d

# AI Configuration
AI_MODEL_NAME=llama3
OLLAMA_HOST=0.0.0.0
OLLAMA_PORT=11434
```

### Staging Environment

Create `.env.staging`:

```env
# Use staging database and services
MONGO_URI=mongodb+srv://staging-user:pass@staging-cluster.mongodb.net/stinger_staging
AI_SERVICE_URL=https://stinger-ai-staging.your-domain.com
FRONTEND_URL=https://stinger-staging.your-domain.com
```

### Development Environment

Create `.env.development`:

```env
# Local development settings
MONGO_URI=mongodb://localhost:27017/stinger_dev
AI_SERVICE_URL=http://localhost:8000
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:8080
```

## 🎯 Deployment Strategies

### 1. Blue-Green Deployment

```bash
# Deploy to green environment
./deploy-cloud.sh railway --env green

# Test green environment
curl https://stinger-green.railway.app/health

# Switch traffic to green
railway env set ENVIRONMENT=green

# Cleanup blue environment
railway env unset BLUE_DEPLOYMENT
```

### 2. Rolling Deployment

```yaml
# docker-compose.prod.yml
services:
  backend:
    deploy:
      replicas: 3
      update_config:
        parallelism: 1
        delay: 10s
        order: start-first
```

### 3. Canary Deployment

```nginx
# nginx configuration for canary
upstream backend_stable {
    server backend-v1:8080 weight=90;
}

upstream backend_canary {
    server backend-v2:8080 weight=10;
}
```

### 4. Feature Flag Deployment

```javascript
// Feature flags in frontend
const features = {
  newSentimentAnalysis: process.env.VITE_FEATURE_NEW_SENTIMENT === 'true',
  advancedDashboard: process.env.VITE_FEATURE_DASHBOARD === 'true'
};
```

## 📊 Monitoring & Maintenance

### Health Checks

All services include health check endpoints:

- **Frontend**: `GET /`
- **Backend**: `GET /health`
- **AI Service**: `GET /health`
- **Nginx**: `GET /health`

### Monitoring Stack

The production setup includes:

1. **Prometheus** - Metrics collection
2. **Grafana** - Dashboards and visualization
3. **AlertManager** - Alert routing
4. **Loki** - Log aggregation

Access monitoring:
- Grafana: `https://your-domain.com:3001`
- Prometheus: `https://your-domain.com:9090`

### Log Management

```bash
# View application logs
docker-compose logs -f backend

# View nginx access logs
docker-compose exec nginx tail -f /var/log/nginx/access.log

# View all logs with timestamps
docker-compose logs -f --timestamps
```

### Performance Monitoring

```javascript
// Backend performance monitoring
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} - ${duration}ms`);
  });
  next();
});
```

### Backup Strategy

```bash
# Database backup
docker-compose exec mongodb mongodump --out /backup

# Copy backup from container
docker cp stinger-mongodb:/backup ./mongodb-backup-$(date +%Y%m%d)

# Automated backup script
#!/bin/bash
BACKUP_DIR="/backups/$(date +%Y%m%d)"
mkdir -p $BACKUP_DIR
docker-compose exec mongodb mongodump --out $BACKUP_DIR
```

## 🔧 Troubleshooting

### Common Issues

#### 1. Build Failures

```bash
# Check build logs
docker-compose logs --no-log-prefix build

# Rebuild with no cache
docker-compose build --no-cache

# Check disk space
df -h
```

#### 2. Database Connection Issues

```bash
# Test MongoDB connection
docker-compose exec backend node -e "
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected'))
  .catch(err => console.error('Error:', err));
"
```

#### 3. AI Service Not Responding

```bash
# Check AI service logs
docker-compose logs ai-service

# Test AI service directly
curl http://localhost:8000/health

# Restart AI service
docker-compose restart ai-service
```

#### 4. Frontend Not Loading

```bash
# Check frontend build
docker-compose exec frontend ls -la /usr/share/nginx/html

# Test nginx configuration
docker-compose exec nginx nginx -t

# Check frontend logs
docker-compose logs frontend
```

#### 5. SSL Certificate Issues

```bash
# Generate new certificates
./deploy-cloud.sh ssl

# Check certificate validity
openssl x509 -in nginx/ssl/cert.pem -text -noout

# Test SSL connection
openssl s_client -connect your-domain.com:443
```

### Performance Issues

#### 1. High Memory Usage

```bash
# Check container memory usage
docker stats

# Limit container memory
# Add to docker-compose.yml:
deploy:
  resources:
    limits:
      memory: 512M
```

#### 2. Slow Response Times

```bash
# Check response times
curl -w "@curl-format.txt" -o /dev/null -s https://your-domain.com/api/health

# Enable nginx caching
# Add to nginx.conf:
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=my_cache:10m;
```

#### 3. Database Performance

```bash
# Check MongoDB performance
docker-compose exec mongodb mongostat

# Add database indexes
db.users.createIndex({ email: 1 })
db.prompts.createIndex({ userId: 1, createdAt: -1 })
```

### Debugging Commands

```bash
# Enter container shell
docker-compose exec backend sh
docker-compose exec frontend sh

# Check environment variables
docker-compose exec backend env

# Test network connectivity
docker-compose exec backend ping ai-service

# Check file permissions
docker-compose exec backend ls -la /app

# View container details
docker inspect stinger-backend
```

## 🎉 Success Checklist

After deployment, verify:

- [ ] All services are running and healthy
- [ ] Frontend loads correctly
- [ ] User registration/login works
- [ ] Sentiment analysis functions
- [ ] Database connections are stable
- [ ] SSL certificates are valid
- [ ] Monitoring is collecting metrics
- [ ] Logs are being generated
- [ ] Backups are configured
- [ ] CI/CD pipeline is working

## 📞 Support & Resources

### Documentation Links
- [Railway Docs](https://docs.railway.app/)
- [Render Docs](https://render.com/docs)
- [Vercel Docs](https://vercel.com/docs)
- [DigitalOcean Docs](https://docs.digitalocean.com/)

### Community Support
- [GitHub Issues](https://github.com/your-username/stinger-app/issues)
- [Discord Community](https://discord.gg/your-server)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/stinger-app)

### Professional Support
- Email: support@your-domain.com
- Slack: #stinger-support

---

🎯 **Ready to deploy?** Choose your platform and follow the guide above. The Stinger application will be live on the web in minutes! 