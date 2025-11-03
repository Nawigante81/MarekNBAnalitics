@echo off
REM NBA Analysis & Betting System - Windows Start Script
REM This script starts both frontend and backend servers

echo 🏀 NBA Analysis ^& Betting System
echo ======================================
echo.
echo Starting application...
echo.

REM Check if setup was run
if not exist "node_modules" (
    echo ❌ Dependencies not installed. Please run setup.bat first.
    pause
    exit /b 1
)

if not exist "backend\venv" (
    echo ❌ Python virtual environment not found. Please run setup.bat first.
    pause
    exit /b 1
)

REM Check if .env exists
if not exist ".env" (
    echo ⚠️  Warning: .env file not found!
    echo Creating from .env.example...
    if exist ".env.example" (
        copy .env.example .env
        echo.
        echo ⚠️  IMPORTANT: Please edit .env with your API keys before continuing!
        echo Press any key to open .env in Notepad...
        pause > nul
        notepad .env
    ) else (
        echo ❌ .env.example not found. Cannot create .env file.
        pause
        exit /b 1
    )
)

echo.
echo 🚀 Starting Frontend (React + Vite)...
echo    Frontend will be available at: http://localhost:5173
echo.
REM Note: /k keeps window open so you can see logs and stop with Ctrl+C
start "NBA Analytics - Frontend" cmd /k "npm run dev || (echo ❌ Failed to start frontend && pause)"

timeout /t 2 /nobreak > nul

echo.
echo 🐍 Starting Backend (FastAPI)...
echo    Backend API will be available at: http://localhost:8000
echo    API Documentation: http://localhost:8000/docs
echo.
REM Note: /k keeps window open so you can see logs and stop with Ctrl+C
start "NBA Analytics - Backend" cmd /k "cd backend && if exist venv\Scripts\activate.bat (venv\Scripts\activate && python main.py) else (echo ❌ Virtual environment not found! && pause)"

timeout /t 3 /nobreak > nul

echo.
echo ✅ Both servers are starting...
echo.
echo 📌 Frontend: http://localhost:5173
echo 📌 Backend API: http://localhost:8000
echo 📌 API Docs: http://localhost:8000/docs
echo.
echo To stop the servers, close the terminal windows or press Ctrl+C in each window.
echo.
echo Opening frontend in your default browser...
timeout /t 5 /nobreak > nul
start http://localhost:5173

echo.
echo ✅ Application started successfully!
echo.
pause
