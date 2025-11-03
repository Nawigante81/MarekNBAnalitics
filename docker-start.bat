@echo off
echo ================================================
echo 🐳 NBA Analytics - Docker Setup
echo ================================================
echo.

REM Check if Docker is installed
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker nie jest zainstalowany!
    echo.
    echo Pobierz i zainstaluj Docker Desktop z:
    echo https://www.docker.com/products/docker-desktop/
    echo.
    pause
    exit /b 1
)

REM Check if Docker is running
docker ps >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker nie jest uruchomiony!
    echo.
    echo Uruchom Docker Desktop i spróbuj ponownie.
    echo.
    pause
    exit /b 1
)

echo ✅ Docker jest gotowy
docker --version
echo.

REM Check if .env.production exists
if not exist ".env.production" (
    echo ⚠️  Plik .env.production nie istnieje!
    echo.
    echo Skopiuj .env.example do .env.production i uzupełnij klucze API:
    echo - VITE_SUPABASE_URL
    echo - VITE_SUPABASE_ANON_KEY  
    echo - ODDS_API_KEY
    echo.
    pause
    exit /b 1
)

echo ✅ Plik .env.production istnieje
echo.

echo 🔧 Uruchamiam aplikację w Docker...
echo.
echo ⚠️  To może potrwać kilka minut przy pierwszym uruchomieniu
echo    (Docker musi pobrać i zbudować obrazy)
echo.
pause

REM Start Docker Compose
echo 📦 Budowanie i uruchamianie kontenerów...
docker-compose up -d

if %errorlevel% neq 0 (
    echo ❌ Błąd podczas uruchamiania Docker Compose
    echo.
    echo Sprawdź logi: docker-compose logs
    echo.
    pause
    exit /b 1
)

echo.
echo ✅ Aplikacja uruchomiona w Docker!
echo.
echo 🌐 Dostęp do aplikacji:
echo.
echo Frontend:  http://localhost
echo Backend:   http://localhost:8000
echo API Docs:  http://localhost:8000/docs
echo.
echo 📊 Sprawdź status kontenerów:
docker-compose ps
echo.
echo 📝 Aby zobaczyć logi:
echo    docker-compose logs -f
echo.
echo 🛑 Aby zatrzymać:
echo    docker-compose down
echo.
echo 🚀 Otwieranie aplikacji w przeglądarce...
start http://localhost
echo.
pause