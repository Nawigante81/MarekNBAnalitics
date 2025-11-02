@echo off
echo 🏀 NBA Analysis ^& Betting System - Windows Setup
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python is not installed. Please install Python first.
    pause
    exit /b 1
)

echo ✅ Prerequisites check passed
echo.

REM Setup Frontend
echo 📦 Installing frontend dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install frontend dependencies
    pause
    exit /b 1
)

REM Setup Backend
echo 🐍 Setting up Python backend...
cd backend

REM Create virtual environment if it doesn't exist  
if not exist "venv" (
    echo 🔧 Creating Python virtual environment...
    python -m venv venv
)

REM Activate virtual environment and install dependencies
echo 📦 Installing Python dependencies...
call venv\Scripts\activate.bat
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo ❌ Failed to install Python dependencies
    pause
    exit /b 1
)

cd ..

echo.
echo 🎯 Setup completed successfully!
echo.
echo 📋 Next Steps:
echo 1. Configure your .env file with Supabase and API keys
echo 2. Run 'npm run dev' to start the frontend
echo 3. Run 'cd backend ^&^& python main.py' to start the backend
echo.
echo 🚀 Happy betting and may the odds be ever in your favor!
echo.
pause