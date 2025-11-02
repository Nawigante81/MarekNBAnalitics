#!/bin/bash

# NBA Analysis & Betting System - Setup Script
# This script sets up the development environment

echo "🏀 NBA Analysis & Betting System - Setup Starting..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if Python is installed
if ! command -v python &> /dev/null && ! command -v python3 &> /dev/null; then
    echo "❌ Python is not installed. Please install Python first."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Setup Frontend
echo "📦 Installing frontend dependencies..."
npm install

# Setup Backend
echo "🐍 Setting up Python backend..."
cd backend

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "🔧 Creating Python virtual environment..."
    python -m venv venv
fi

# Activate virtual environment and install dependencies
echo "📦 Installing Python dependencies..."
source venv/bin/activate
pip install -r requirements.txt

cd ..

echo "🎯 Setup completed successfully!"
echo ""
echo "📋 Next Steps:"
echo "1. Configure your .env file with Supabase and API keys"
echo "2. Run 'npm run dev' to start the frontend"
echo "3. Run 'cd backend && python main.py' to start the backend"
echo ""
echo "🚀 Happy betting and may the odds be ever in your favor!"