@echo off
echo ================================================
echo 🏀 NBA Analysis ^& Betting System - Windows Setup
echo ================================================
echo.

echo [1/5] Sprawdzanie wymagań...
echo.

REM Check if Node.js is installed
echo Sprawdzanie Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js nie jest zainstalowany!
    echo.
    echo Pobierz i zainstaluj Node.js z:
    echo https://nodejs.org/
    echo.
    pause
    exit /b 1
)
node --version
echo ✅ Node.js jest zainstalowany
echo.

REM Check if Python is installed
echo Sprawdzanie Python...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python nie jest zainstalowany!
    echo.
    echo Pobierz i zainstaluj Python 3.11+ z:
    echo https://www.python.org/downloads/
    echo UWAGA: Zaznacz "Add Python to PATH" podczas instalacji!
    echo.
    pause
    exit /b 1
)
python --version
echo ✅ Python jest zainstalowany
echo.

echo ✅ Wszystkie wymagania spełnione!
echo.

REM Setup Frontend
echo [2/5] Instalowanie zależności frontend...
echo.
call npm install
if %errorlevel% neq 0 (
    echo ❌ Błąd podczas instalacji zależności frontend
    echo.
    echo Spróbuj ręcznie:
    echo   npm cache clean --force
    echo   npm install
    echo.
    pause
    exit /b 1
)
echo ✅ Zależności frontend zainstalowane
echo.

REM Setup Backend
echo [3/5] Konfiguracja backendu Python...
echo.
cd backend

REM Create virtual environment if it doesn't exist  
if not exist "venv" (
    echo 🔧 Tworzenie środowiska wirtualnego Python...
    python -m venv venv
    if %errorlevel% neq 0 (
        echo ❌ Błąd podczas tworzenia venv
        echo.
        echo Spróbuj ręcznie:
        echo   python -m pip install --upgrade pip
        echo   python -m venv venv
        echo.
        cd ..
        pause
        exit /b 1
    )
    echo ✅ Środowisko wirtualne utworzone
) else (
    echo ℹ️  Środowisko wirtualne już istnieje
)
echo.

REM Activate virtual environment and install dependencies
echo [4/5] Instalowanie zależności Python...
echo.
call venv\Scripts\activate.bat
python -m pip install --upgrade pip
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo ❌ Błąd podczas instalacji zależności Python
    echo.
    echo Spróbuj ręcznie:
    echo   cd backend
    echo   venv\Scripts\activate
    echo   pip install -r requirements.txt
    echo.
    cd ..
    pause
    exit /b 1
)
echo ✅ Zależności Python zainstalowane
echo.

cd ..


echo [5/5] Sprawdzanie konfiguracji...
echo.

REM Check if .env file exists
if not exist ".env" (
    echo ⚠️  Plik .env nie istnieje!
    echo.
    if exist ".env.example" (
        echo Tworzenie .env z .env.example...
        copy .env.example .env >nul
        echo ✅ Plik .env utworzony
        echo.
        echo ⚠️  UWAGA: Musisz uzupełnić plik .env swoimi kluczami API!
    ) else (
        echo ⚠️  Brak pliku .env.example - musisz utworzyć .env ręcznie
    )
) else (
    echo ✅ Plik .env istnieje
)
echo.

echo ================================================
echo 🎉 Instalacja zakończona pomyślnie!
echo ================================================
echo.
echo 📋 Następne kroki:
echo.
echo 1. Skonfiguruj plik .env z kluczami API:
echo    - VITE_SUPABASE_URL (z https://supabase.com/)
echo    - VITE_SUPABASE_ANON_KEY
echo    - SUPABASE_SERVICE_KEY
echo    - ODDS_API_KEY (z https://the-odds-api.com/)
echo.
echo 2. Uruchom backend (w nowym terminalu):
echo    cd backend
echo    venv\Scripts\activate
echo    python main.py
echo.
echo 3. Uruchom frontend (w nowym terminalu):
echo    npm run dev
echo.
echo 4. Otwórz przeglądarkę:
echo    Frontend: http://localhost:5173
echo    API Docs: http://localhost:8000/docs
echo.
echo 📖 Więcej informacji: WINDOWS_SETUP.md
echo.
echo 🚀 Powodzenia w analizie NBA!
echo ================================================
echo.
pause
