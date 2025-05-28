# 🎯 Stinger - Sentiment Analysis Application

A modern full-stack sentiment analysis application that uses AI to analyze text sentiment with detailed explanations.

## 🏗️ Architecture

- **Frontend**: React 19 + TypeScript + Vite
- **Backend**: Node.js + Express + MongoDB
- **AI Service**: Python + FastAPI + Ollama (Llama3)
- **Database**: MongoDB
- **Deployment**: Docker + Docker Compose

## 🚀 Quick Start with Docker (Recommended)

### Prerequisites
- Docker Engine 20.10+
- Docker Compose 2.0+
- 4GB+ RAM available

### Deploy the Application

```bash
# Clone the repository
git clone <repository-url>
cd phase1huProject

# Make deployment script executable
chmod +x deploy.sh

# Deploy all services
./deploy.sh
```

The application will be available at:
- **Main App**: http://localhost (via Nginx)
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **AI Service**: http://localhost:8000

## 🛠️ Development Setup

### Using Docker (Recommended for Development)

```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up --build

# View logs
docker-compose -f docker-compose.dev.yml logs -f
```

### Local Development

#### Backend Setup
```bash
cd Backend
npm install
npm run dev
```

#### Frontend Setup
```bash
cd Fontend
npm install
npm run dev
```

#### AI Service Setup
```bash
cd llamaAi
pip install -r requirements.txt
uvicorn app:app --reload
```

## 📦 Services Overview

| Service | Port | Technology | Purpose |
|---------|------|------------|---------|
| Frontend | 3000 | React + Vite | User Interface |
| Backend | 8080 | Node.js + Express | API Server |
| AI Service | 8000 | FastAPI + Ollama | Sentiment Analysis |
| MongoDB | 27017 | MongoDB 7.0 | Database |
| Nginx | 80 | Nginx | Reverse Proxy |

## 🔧 Configuration

### Environment Variables

Create a `.env` file:

```env
# Database
MONGO_URI=mongodb://admin:password123@mongodb:27017/stinger?authSource=admin

# Backend
PORT=8080
JWT_SECRET=your-secret-key

# AI Service
AI_SERVICE_URL=http://ai-service:8000
```

## 📚 Documentation

- [Docker Deployment Guide](./DOCKER_DEPLOYMENT.md) - Comprehensive Docker setup
- [API Documentation](./docs/API.md) - Backend API reference
- [Frontend Guide](./docs/FRONTEND.md) - Frontend development guide

## 🔍 Monitoring

### Health Checks
- Backend: `http://localhost:8080/`
- AI Service: `http://localhost:8000/health`
- Nginx: `http://localhost/health`

### Logs
```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f ai-service
```

## 🛑 Stopping the Application

```bash
# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

## 🔒 Security Features

- JWT authentication
- Password hashing with bcrypt
- Rate limiting on API endpoints
- Security headers via Nginx
- Non-root container users
- Network isolation

## 🎯 Features

- **User Authentication**: Secure login/signup
- **Sentiment Analysis**: AI-powered text analysis
- **Real-time Results**: Instant sentiment classification
- **History Tracking**: View previous analyses
- **Responsive Design**: Mobile-friendly interface
- **Modern UI**: Clean and intuitive design

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with Docker
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
1. Check the [Docker Deployment Guide](./DOCKER_DEPLOYMENT.md)
2. Review container logs: `docker-compose logs -f`
3. Verify health checks: `./deploy.sh`

