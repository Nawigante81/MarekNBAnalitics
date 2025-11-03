@echo off
echo ================================================
echo 🏀 NBA Analysis System - Quick Start
echo ================================================
echo.

REM Check if venv exists
if not exist "backend\venv" (
    echo ❌ Środowisko Python nie zostało utworzone!
    echo.
    echo Uruchom najpierw: setup.bat
    echo.
    pause
    exit /b 1
)

REM Check if node_modules exists
if not exist "node_modules" (
    echo ❌ Zależności frontend nie zostały zainstalowane!
    echo.
    echo Uruchom najpierw: setup.bat
    echo.
    pause
    exit /b 1
)

REM Check if .env exists
if not exist ".env" (
    echo ❌ Plik .env nie istnieje!
    echo.
    echo Skopiuj .env.example do .env i uzupełnij klucze API
    echo.
    pause
    exit /b 1
)

echo Wszystko gotowe! Uruchamiam aplikację...
echo.
echo ⚠️  Otworzy się 2 okna terminala:
echo    1. Backend (Python/FastAPI)
echo    2. Frontend (React/Vite)
echo.
echo Nie zamykaj tych okien podczas korzystania z aplikacji!
echo.
pause

REM Start backend in new window
echo Uruchamiam backend...
start "NBA Backend" cmd /k "cd backend && venv\Scripts\activate && python main.py"

REM Wait a bit for backend to start
timeout /t 3 /nobreak >nul

REM Start frontend in new window
echo Uruchamiam frontend...
start "NBA Frontend" cmd /k "npm run dev"

echo.
echo ✅ Aplikacja uruchomiona!
echo.
echo Frontend: http://localhost:5173
echo Backend API: http://localhost:8000
echo API Docs: http://localhost:8000/docs
echo.
echo Aby zatrzymać aplikację, zamknij oba okna terminala.
echo.
pause
