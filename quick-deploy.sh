#!/bin/bash

# 🚀 Stinger Quick Deploy - Get your app online in minutes!

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}"
echo "🚀 Welcome to Stinger Quick Deploy!"
echo "Let's get your sentiment analysis app online in minutes!"
echo -e "${NC}"

# Check if git repo is initialized
if [ ! -d ".git" ]; then
    echo -e "${YELLOW}⚠️  Initializing git repository...${NC}"
    git init
    git add .
    git commit -m "Initial commit - Stinger app ready for deployment"
fi

echo ""
echo -e "${BLUE}Choose your deployment platform:${NC}"
echo "1. 🚂 Railway (Recommended - Free tier, easy setup)"
echo "2. 🎨 Render (Free tier, good for beginners)"
echo "3. ⚡ Vercel (Frontend only, super fast)"
echo "4. 🌊 DigitalOcean (Professional, paid)"
echo "5. 🐙 GitHub Pages (Static frontend only)"
echo "6. 📦 All platforms (Advanced)"
echo ""

read -p "Enter your choice (1-6): " choice

case $choice in
    1)
        echo -e "${GREEN}🚂 Deploying to Railway...${NC}"
        echo ""
        echo "📋 Steps to complete:"
        echo "1. Go to https://railway.app"
        echo "2. Sign up with GitHub"
        echo "3. Click 'New Project' → 'Deploy from GitHub repo'"
        echo "4. Select this repository"
        echo "5. Railway will auto-deploy your app!"
        echo ""
        echo "🔧 Environment variables to set in Railway:"
        echo "   MONGO_URI=<your-mongodb-connection-string>"
        echo "   JWT_SECRET=<your-secret-key>"
        echo ""
        echo "💡 Tip: Railway provides a free MongoDB database!"
        ;;
    2)
        echo -e "${GREEN}🎨 Deploying to Render...${NC}"
        echo ""
        echo "📋 Steps to complete:"
        echo "1. Go to https://render.com"
        echo "2. Sign up with GitHub"
        echo "3. Click 'New' → 'Blueprint'"
        echo "4. Connect this repository"
        echo "5. Render will deploy using render.yaml!"
        echo ""
        echo "🔧 The render.yaml file is already configured!"
        ;;
    3)
        echo -e "${GREEN}⚡ Deploying to Vercel...${NC}"
        echo ""
        if command -v npm &> /dev/null; then
            echo "Installing Vercel CLI..."
            npm install -g vercel
            echo ""
            echo "🚀 Starting Vercel deployment..."
            cd Fontend
            vercel --prod
        else
            echo "📋 Steps to complete:"
            echo "1. Install Node.js from https://nodejs.org"
            echo "2. Run: npm install -g vercel"
            echo "3. Run: cd Fontend && vercel --prod"
            echo "4. Follow the prompts!"
        fi
        ;;
    4)
        echo -e "${GREEN}🌊 Deploying to DigitalOcean...${NC}"
        echo ""
        echo "📋 Steps to complete:"
        echo "1. Go to https://cloud.digitalocean.com"
        echo "2. Create an account"
        echo "3. Go to Apps → Create App"
        echo "4. Connect your GitHub repository"
        echo "5. DigitalOcean will use the .do/app.yaml config!"
        echo ""
        echo "💰 Note: DigitalOcean is a paid service (~$5-10/month)"
        ;;
    5)
        echo -e "${GREEN}🐙 Deploying to GitHub Pages...${NC}"
        echo ""
        echo "📋 Steps to complete:"
        echo "1. Push this code to a GitHub repository"
        echo "2. Go to repository Settings → Pages"
        echo "3. Select 'GitHub Actions' as source"
        echo "4. The workflow will deploy your frontend!"
        echo ""
        echo "⚠️  Note: This only deploys the frontend. You'll need a separate backend."
        ;;
    6)
        echo -e "${GREEN}📦 Deploying to all platforms...${NC}"
        echo ""
        echo "This will deploy to multiple platforms. Make sure you have:"
        echo "- GitHub repository set up"
        echo "- API tokens for each platform"
        echo ""
        read -p "Continue? (y/n): " confirm
        if [ "$confirm" = "y" ]; then
            ./deploy-cloud.sh all
        fi
        ;;
    *)
        echo -e "${RED}❌ Invalid choice. Please run the script again.${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}🎉 Deployment initiated!${NC}"
echo ""
echo "📱 What's next?"
echo "• Your app will be live in 5-10 minutes"
echo "• Check the platform dashboard for deployment status"
echo "• Test your app once it's deployed"
echo "• Set up custom domain (optional)"
echo ""
echo "🔗 Useful links:"
echo "• Documentation: ./WEB_DEPLOYMENT_GUIDE.md"
echo "• Troubleshooting: ./DEPLOYMENT_GUIDE.md"
echo "• GitHub Actions: .github/workflows/ci-cd.yml"
echo ""
echo -e "${BLUE}Happy deploying! 🚀${NC}" 