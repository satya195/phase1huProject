#!/bin/bash

# 🚀 Stinger Cloud Deployment Script
# Supports multiple cloud platforms and deployment strategies

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="stinger"
DOCKER_REGISTRY="ghcr.io"
GITHUB_USERNAME="${GITHUB_USERNAME:-your-username}"
REPO_NAME="${REPO_NAME:-stinger-app}"

# Functions
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

check_dependencies() {
    log_info "Checking dependencies..."
    
    local deps=("docker" "git")
    for dep in "${deps[@]}"; do
        if ! command -v "$dep" &> /dev/null; then
            log_error "$dep is not installed"
            exit 1
        fi
    done
    
    log_success "All dependencies are installed"
}

build_images() {
    log_info "Building Docker images..."
    
    # Build all images
    docker build -t "${DOCKER_REGISTRY}/${GITHUB_USERNAME}/${REPO_NAME}-frontend:latest" ./Fontend
    docker build -t "${DOCKER_REGISTRY}/${GITHUB_USERNAME}/${REPO_NAME}-backend:latest" ./Backend
    docker build -t "${DOCKER_REGISTRY}/${GITHUB_USERNAME}/${REPO_NAME}-ai-service:latest" ./llamaAi
    
    log_success "Docker images built successfully"
}

push_images() {
    log_info "Pushing images to registry..."
    
    # Login to registry (requires GITHUB_TOKEN)
    if [ -n "$GITHUB_TOKEN" ]; then
        echo "$GITHUB_TOKEN" | docker login "$DOCKER_REGISTRY" -u "$GITHUB_USERNAME" --password-stdin
    else
        log_warning "GITHUB_TOKEN not set, skipping image push"
        return
    fi
    
    # Push images
    docker push "${DOCKER_REGISTRY}/${GITHUB_USERNAME}/${REPO_NAME}-frontend:latest"
    docker push "${DOCKER_REGISTRY}/${GITHUB_USERNAME}/${REPO_NAME}-backend:latest"
    docker push "${DOCKER_REGISTRY}/${GITHUB_USERNAME}/${REPO_NAME}-ai-service:latest"
    
    log_success "Images pushed to registry"
}

deploy_railway() {
    log_info "Deploying to Railway..."
    
    if ! command -v railway &> /dev/null; then
        log_info "Installing Railway CLI..."
        npm install -g @railway/cli
    fi
    
    if [ -z "$RAILWAY_TOKEN" ]; then
        log_error "RAILWAY_TOKEN environment variable is required"
        return 1
    fi
    
    railway login --token "$RAILWAY_TOKEN"
    
    # Deploy each service
    log_info "Deploying frontend to Railway..."
    cd Fontend && railway up --service frontend && cd ..
    
    log_info "Deploying backend to Railway..."
    cd Backend && railway up --service backend && cd ..
    
    log_info "Deploying AI service to Railway..."
    cd llamaAi && railway up --service ai-service && cd ..
    
    log_success "Deployed to Railway successfully"
}

deploy_render() {
    log_info "Deploying to Render..."
    
    if [ -z "$RENDER_API_KEY" ]; then
        log_error "RENDER_API_KEY environment variable is required"
        return 1
    fi
    
    # Deploy using Render API
    curl -X POST "https://api.render.com/v1/services" \
        -H "Authorization: Bearer $RENDER_API_KEY" \
        -H "Content-Type: application/json" \
        -d @render.yaml
    
    log_success "Deployed to Render successfully"
}

deploy_digitalocean() {
    log_info "Deploying to DigitalOcean App Platform..."
    
    if ! command -v doctl &> /dev/null; then
        log_info "Installing doctl..."
        # Install doctl based on OS
        if [[ "$OSTYPE" == "darwin"* ]]; then
            brew install doctl
        else
            wget https://github.com/digitalocean/doctl/releases/download/v1.92.0/doctl-1.92.0-linux-amd64.tar.gz
            tar xf doctl-1.92.0-linux-amd64.tar.gz
            sudo mv doctl /usr/local/bin
        fi
    fi
    
    if [ -z "$DIGITALOCEAN_ACCESS_TOKEN" ]; then
        log_error "DIGITALOCEAN_ACCESS_TOKEN environment variable is required"
        return 1
    fi
    
    doctl auth init --access-token "$DIGITALOCEAN_ACCESS_TOKEN"
    
    # Create or update app
    if [ -n "$DO_APP_ID" ]; then
        doctl apps update "$DO_APP_ID" --spec .do/app.yaml
    else
        doctl apps create --spec .do/app.yaml
    fi
    
    log_success "Deployed to DigitalOcean successfully"
}

deploy_vercel() {
    log_info "Deploying frontend to Vercel..."
    
    if ! command -v vercel &> /dev/null; then
        log_info "Installing Vercel CLI..."
        npm install -g vercel
    fi
    
    if [ -z "$VERCEL_TOKEN" ]; then
        log_error "VERCEL_TOKEN environment variable is required"
        return 1
    fi
    
    cd Fontend
    vercel --token "$VERCEL_TOKEN" --prod
    cd ..
    
    log_success "Deployed frontend to Vercel successfully"
}

deploy_aws_ecs() {
    log_info "Deploying to AWS ECS..."
    
    if ! command -v aws &> /dev/null; then
        log_error "AWS CLI is not installed"
        return 1
    fi
    
    # Create ECS task definitions and services
    aws ecs register-task-definition --cli-input-json file://aws/task-definition.json
    aws ecs update-service --cluster stinger-cluster --service stinger-service --task-definition stinger-task
    
    log_success "Deployed to AWS ECS successfully"
}

deploy_gcp_run() {
    log_info "Deploying to Google Cloud Run..."
    
    if ! command -v gcloud &> /dev/null; then
        log_error "Google Cloud SDK is not installed"
        return 1
    fi
    
    # Deploy each service to Cloud Run
    gcloud run deploy stinger-frontend --image "${DOCKER_REGISTRY}/${GITHUB_USERNAME}/${REPO_NAME}-frontend:latest" --platform managed
    gcloud run deploy stinger-backend --image "${DOCKER_REGISTRY}/${GITHUB_USERNAME}/${REPO_NAME}-backend:latest" --platform managed
    gcloud run deploy stinger-ai-service --image "${DOCKER_REGISTRY}/${GITHUB_USERNAME}/${REPO_NAME}-ai-service:latest" --platform managed
    
    log_success "Deployed to Google Cloud Run successfully"
}

deploy_azure() {
    log_info "Deploying to Azure Container Instances..."
    
    if ! command -v az &> /dev/null; then
        log_error "Azure CLI is not installed"
        return 1
    fi
    
    # Create container group
    az container create --resource-group stinger-rg --file azure/container-group.yaml
    
    log_success "Deployed to Azure successfully"
}

setup_monitoring() {
    log_info "Setting up monitoring..."
    
    # Deploy monitoring stack
    docker-compose -f docker-compose.monitoring.yml up -d
    
    log_success "Monitoring setup complete"
}

setup_ssl() {
    log_info "Setting up SSL certificates..."
    
    # Generate self-signed certificates for development
    mkdir -p nginx/ssl
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout nginx/ssl/key.pem \
        -out nginx/ssl/cert.pem \
        -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"
    
    log_success "SSL certificates generated"
}

cleanup() {
    log_info "Cleaning up..."
    
    # Remove temporary files
    rm -f *.tmp
    
    log_success "Cleanup complete"
}

show_help() {
    echo "🚀 Stinger Cloud Deployment Script"
    echo ""
    echo "Usage: $0 [COMMAND] [OPTIONS]"
    echo ""
    echo "Commands:"
    echo "  build           Build Docker images"
    echo "  push            Push images to registry"
    echo "  railway         Deploy to Railway"
    echo "  render          Deploy to Render"
    echo "  digitalocean    Deploy to DigitalOcean"
    echo "  vercel          Deploy frontend to Vercel"
    echo "  aws             Deploy to AWS ECS"
    echo "  gcp             Deploy to Google Cloud Run"
    echo "  azure           Deploy to Azure"
    echo "  monitoring      Setup monitoring stack"
    echo "  ssl             Generate SSL certificates"
    echo "  all             Build, push, and deploy to all platforms"
    echo "  help            Show this help message"
    echo ""
    echo "Environment Variables:"
    echo "  GITHUB_TOKEN              GitHub token for registry access"
    echo "  RAILWAY_TOKEN             Railway authentication token"
    echo "  RENDER_API_KEY            Render API key"
    echo "  DIGITALOCEAN_ACCESS_TOKEN DigitalOcean access token"
    echo "  VERCEL_TOKEN              Vercel authentication token"
    echo "  AWS_ACCESS_KEY_ID         AWS access key"
    echo "  AWS_SECRET_ACCESS_KEY     AWS secret key"
    echo "  GOOGLE_APPLICATION_CREDENTIALS GCP service account key"
    echo ""
    echo "Examples:"
    echo "  $0 build                  # Build all Docker images"
    echo "  $0 railway                # Deploy to Railway"
    echo "  $0 all                    # Full deployment to all platforms"
}

main() {
    case "${1:-help}" in
        "build")
            check_dependencies
            build_images
            ;;
        "push")
            check_dependencies
            push_images
            ;;
        "railway")
            check_dependencies
            deploy_railway
            ;;
        "render")
            check_dependencies
            deploy_render
            ;;
        "digitalocean")
            check_dependencies
            deploy_digitalocean
            ;;
        "vercel")
            check_dependencies
            deploy_vercel
            ;;
        "aws")
            check_dependencies
            deploy_aws_ecs
            ;;
        "gcp")
            check_dependencies
            deploy_gcp_run
            ;;
        "azure")
            check_dependencies
            deploy_azure
            ;;
        "monitoring")
            setup_monitoring
            ;;
        "ssl")
            setup_ssl
            ;;
        "all")
            check_dependencies
            build_images
            push_images
            deploy_railway
            deploy_render
            deploy_digitalocean
            deploy_vercel
            setup_monitoring
            ;;
        "help"|*)
            show_help
            ;;
    esac
    
    cleanup
}

# Trap to ensure cleanup on exit
trap cleanup EXIT

# Run main function
main "$@" 