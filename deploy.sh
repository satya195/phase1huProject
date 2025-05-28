#!/bin/bash

# Stinger Application Deployment Script
echo "🚀 Starting Stinger Application Deployment..."

# Check if Docker and Docker Compose are installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Stop any existing containers
echo "🛑 Stopping existing containers..."
docker-compose down

# Remove old images (optional - uncomment if you want to rebuild from scratch)
# echo "🗑️  Removing old images..."
# docker-compose down --rmi all

# Build and start all services
echo "🔨 Building and starting all services..."
docker-compose up --build -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 30

# Check service health
echo "🔍 Checking service health..."

# Check MongoDB
if docker-compose exec mongodb mongosh --eval "db.runCommand('ping')" > /dev/null 2>&1; then
    echo "✅ MongoDB is healthy"
else
    echo "❌ MongoDB is not responding"
fi

# Check Backend
if curl -f http://localhost:8080/ > /dev/null 2>&1; then
    echo "✅ Backend is healthy"
else
    echo "❌ Backend is not responding"
fi

# Check AI Service
if curl -f http://localhost:8000/health > /dev/null 2>&1; then
    echo "✅ AI Service is healthy"
else
    echo "❌ AI Service is not responding"
fi

# Check Frontend
if curl -f http://localhost:3000/ > /dev/null 2>&1; then
    echo "✅ Frontend is healthy"
else
    echo "❌ Frontend is not responding"
fi

# Check Nginx
if curl -f http://localhost/ > /dev/null 2>&1; then
    echo "✅ Nginx is healthy"
else
    echo "❌ Nginx is not responding"
fi

echo ""
echo "🎉 Deployment completed!"
echo ""
echo "📱 Application URLs:"
echo "   Frontend: http://localhost (via Nginx)"
echo "   Frontend Direct: http://localhost:3000"
echo "   Backend API: http://localhost:8080"
echo "   AI Service: http://localhost:8000"
echo "   MongoDB: mongodb://localhost:27017"
echo ""
echo "📊 To view logs:"
echo "   docker-compose logs -f [service-name]"
echo ""
echo "🛑 To stop all services:"
echo "   docker-compose down" 