#!/bin/bash

# Quick start script for NBA Analytics
set -e

echo "🏀 Quick Start - NBA Analytics"

# Check if Docker is available
if command -v docker &> /dev/null && command -v docker-compose &> /dev/null; then
    echo "🐳 Using Docker Compose..."
    
    # Create logs directory
    mkdir -p logs
    
    # Start services
    docker-compose up -d
    
    echo "⏳ Waiting for services to start..."
    sleep 15
    
    # Check health
    if curl -f http://localhost/health &>/dev/null; then
        echo "✅ Services are running!"
        echo ""
        echo "🌐 Frontend: http://localhost"
        echo "🚀 Backend: http://localhost:8000"
        echo "📊 API Docs: http://localhost:8000/docs"
    else
        echo "❌ Services failed to start. Checking logs..."
        docker-compose logs --tail=20
    fi
    
elif command -v pm2 &> /dev/null; then
    echo "⚙️ Using PM2..."
    
    # Create logs directory
    mkdir -p logs
    
    # Build frontend if needed
    if [ ! -d "dist" ]; then
        echo "📦 Building frontend..."
        npm run build
    fi
    
    # Start with PM2
    pm2 start ecosystem.config.json --env production
    
    echo "✅ Services started with PM2!"
    echo ""
    echo "📊 Status: pm2 status"
    echo "📝 Logs: pm2 logs"
    
else
    echo "⚡ Using development mode..."
    
    # Start backend
    cd backend
    python -m uvicorn main:app --host 0.0.0.0 --port 8000 &
    BACKEND_PID=$!
    cd ..
    
    # Start frontend
    npm run dev -- --host 0.0.0.0 --port 5173 &
    FRONTEND_PID=$!
    
    echo "✅ Services started in development mode!"
    echo ""
    echo "🌐 Frontend: http://localhost:5173"
    echo "🚀 Backend: http://localhost:8000"
    echo ""
    echo "Press Ctrl+C to stop services"
    
    # Wait for user interrupt
    trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT
    wait
fi