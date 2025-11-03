# 🪟 Uruchamianie projektu na Windows 11 z Visual Studio Code

## 📋 Spis treści
1. [Wymagania wstępne](#wymagania-wstępne)
2. [Instalacja Visual Studio Code](#instalacja-visual-studio-code)
3. [Konfiguracja projektu](#konfiguracja-projektu)
4. [Uruchamianie aplikacji](#uruchamianie-aplikacji)
5. [Rozwiązywanie problemów](#rozwiązywanie-problemów)

## Wymagania wstępne

### 1. Instalacja Node.js
1. Pobierz Node.js z oficjalnej strony: https://nodejs.org/
2. Wybierz wersję **LTS** (Long Term Support) - zalecana dla stabilności
3. Uruchom instalator i postępuj zgodnie z instrukcjami
4. Zaznacz opcję "Automatically install necessary tools" podczas instalacji
5. Po instalacji, otwórz Command Prompt (cmd) i sprawdź:
   ```cmd
   node --version
   npm --version
   ```

### 2. Instalacja Python
1. Pobierz Python 3.11+ z oficjalnej strony: https://www.python.org/downloads/
2. **WAŻNE**: Podczas instalacji zaznacz opcję "Add Python to PATH"
3. Wybierz "Install Now" lub "Customize installation"
4. Po instalacji, otwórz Command Prompt i sprawdź:
   ```cmd
   python --version
   pip --version
   ```

### 3. Instalacja Git (opcjonalnie)
1. Pobierz Git z: https://git-scm.com/download/win
2. Uruchom instalator i użyj domyślnych ustawień
3. Sprawdź instalację:
   ```cmd
   git --version
   ```

## Instalacja Visual Studio Code

### Pobieranie i instalacja
1. Pobierz VS Code z oficjalnej strony: https://code.visualstudio.com/
2. Uruchom instalator (`VSCodeUserSetup-{version}.exe`)
3. Podczas instalacji zaznacz następujące opcje:
   - ✅ Add "Open with Code" action to Windows Explorer file context menu
   - ✅ Add "Open with Code" action to Windows Explorer directory context menu
   - ✅ Register Code as an editor for supported file types
   - ✅ Add to PATH

### Zalecane rozszerzenia VS Code

Po instalacji VS Code, zainstaluj następujące rozszerzenia:

#### Niezbędne rozszerzenia:
1. **Python** (Microsoft)
   - Obsługa języka Python, debugowanie, linting
   - Instalacja: Ctrl+Shift+X → wyszukaj "Python" → Install

2. **Pylance** (Microsoft)
   - Zaawansowane wsparcie dla języka Python
   - Instalacja: Ctrl+Shift+X → wyszukaj "Pylance" → Install

3. **ES7+ React/Redux/React-Native snippets**
   - Snippety dla React i TypeScript
   - Instalacja: Ctrl+Shift+X → wyszukaj "ES7 React" → Install

4. **ESLint** (Microsoft)
   - Linting dla JavaScript/TypeScript
   - Instalacja: Ctrl+Shift+X → wyszukaj "ESLint" → Install

5. **Prettier - Code formatter**
   - Automatyczne formatowanie kodu
   - Instalacja: Ctrl+Shift+X → wyszukaj "Prettier" → Install

#### Dodatkowe użyteczne rozszerzenia:
- **GitLens**: Zaawansowane funkcje Git
- **Thunder Client**: Testowanie API (alternatywa dla Postman)
- **Error Lens**: Wyświetlanie błędów inline
- **Path Intellisense**: Autouzupełnianie ścieżek plików
- **Auto Rename Tag**: Automatyczne zmiany tagów HTML

## Konfiguracja projektu

### 1. Pobranie projektu

#### Opcja A: Przy użyciu Git
```cmd
cd C:\Users\TwojeImię\Documents
git clone https://github.com/Nawigante81/MarekNBAnalitics.git
cd MarekNBAnalitics
```

#### Opcja B: Pobranie ZIP
1. Pobierz projekt jako ZIP z GitHub
2. Rozpakuj do wybranego folderu (np. `C:\Users\TwojeImię\Documents\MarekNBAnalitics`)

### 2. Otwórz projekt w VS Code

Możesz to zrobić na kilka sposobów:

#### Sposób 1: Z menu VS Code
1. Otwórz Visual Studio Code
2. Kliknij **File** → **Open Folder**
3. Wybierz folder projektu `MarekNBAnalitics`
4. Kliknij **Select Folder**

#### Sposób 2: Z Command Prompt
```cmd
cd C:\Users\TwojeImię\Documents\MarekNBAnalitics
code .
```

#### Sposób 3: Z Eksploratora Windows
1. Przejdź do folderu projektu w Eksploratorze
2. Kliknij prawym przyciskiem myszy w pustym miejscu
3. Wybierz **Open with Code**

### 3. Automatyczna konfiguracja

Po otwarciu projektu w VS Code:
1. Otwórz Terminal w VS Code: **Terminal** → **New Terminal** (lub Ctrl+Shift+`)
2. Uruchom skrypt konfiguracyjny:
   ```cmd
   setup.bat
   ```

Skrypt automatycznie:
- ✅ Sprawdzi, czy Node.js i Python są zainstalowane
- ✅ Zainstaluje zależności frontend (npm packages)
- ✅ Stworzy środowisko wirtualne Python (venv)
- ✅ Zainstaluje zależności backend (pip packages)

### 4. Konfiguracja zmiennych środowiskowych

1. Skopiuj plik przykładowy:
   ```cmd
   copy .env.example .env
   ```

2. Otwórz plik `.env` w VS Code:
   - Naciśnij **Ctrl+P**
   - Wpisz `.env`
   - Naciśnij **Enter**

3. Uzupełnij swoje dane:
   ```env
   VITE_SUPABASE_URL=https://twoj-projekt.supabase.co
   VITE_SUPABASE_ANON_KEY=twoj_klucz_anon_tutaj
   ODDS_API_KEY=twoj_klucz_odds_api_tutaj
   ```

4. Zapisz plik: **Ctrl+S**

## Uruchamianie aplikacji

### Metoda 1: Dwa osobne terminale w VS Code (ZALECANA)

#### Terminal 1 - Frontend (React)
1. Otwórz nowy terminal: **Terminal** → **New Terminal**
2. Uruchom frontend:
   ```cmd
   npm run dev
   ```
3. Frontend będzie dostępny na: http://localhost:5173

#### Terminal 2 - Backend (FastAPI)
1. Kliknij ikonę **+** w panelu terminala (obok aktywnego terminala)
2. Przejdź do folderu backend i uruchom:
   ```cmd
   cd backend
   venv\Scripts\activate
   python main.py
   ```
3. Backend będzie dostępny na: http://localhost:8000
4. Dokumentacja API: http://localhost:8000/docs

### Metoda 2: Użycie VS Code Tasks

VS Code umożliwia uruchamianie obu serwerów jednocześnie:

1. Naciśnij **Ctrl+Shift+P**
2. Wpisz "Tasks: Run Task"
3. Wybierz "Start Frontend & Backend"

### Zatrzymywanie aplikacji

W każdym terminalu naciśnij **Ctrl+C**, aby zatrzymać serwer.

## Przydatne skróty klawiszowe w VS Code

| Skrót | Funkcja |
|-------|---------|
| `Ctrl+Shift+P` | Paleta poleceń |
| `Ctrl+P` | Szybkie otwieranie plików |
| `Ctrl+`` ` | Otwórz/zamknij terminal |
| `Ctrl+Shift+`` ` | Nowy terminal |
| `Ctrl+B` | Pokaż/ukryj panel boczny |
| `Ctrl+Shift+E` | Eksplorator plików |
| `Ctrl+Shift+F` | Wyszukiwanie w plikach |
| `Ctrl+Shift+G` | Kontrola źródła (Git) |
| `Ctrl+Shift+D` | Debugowanie |
| `F5` | Uruchom debugowanie |
| `Ctrl+Shift+B` | Uruchom zadanie Build |
| `Alt+Shift+F` | Formatuj dokument |
| `Ctrl+/` | Przełącz komentarz wiersza |

## Struktura projektu w VS Code

```
MarekNBAnalitics/
├── 📁 backend/                 # Aplikacja FastAPI (Python)
│   ├── main.py                # Główny plik aplikacji
│   ├── scrapers.py            # Skrypty do pobierania danych
│   ├── reports.py             # Generowanie raportów
│   ├── requirements.txt       # Zależności Python
│   └── venv/                  # Środowisko wirtualne Python
├── 📁 src/                     # Kod źródłowy frontend (React/TypeScript)
│   ├── components/            # Komponenty React
│   ├── lib/                   # Biblioteki i utils
│   └── main.tsx              # Punkt wejścia aplikacji
├── 📁 supabase/               # Konfiguracja bazy danych
├── 📄 .env                    # Zmienne środowiskowe (NIE COMMITUJ!)
├── 📄 .env.example            # Przykład zmiennych środowiskowych
├── 📄 package.json            # Zależności Node.js
├── 📄 vite.config.ts          # Konfiguracja Vite
└── 📄 README.md               # Dokumentacja projektu
```

## Rozwiązywanie problemów

### Problem: "node is not recognized"
**Rozwiązanie:**
1. Sprawdź, czy Node.js jest zainstalowany: otwórz nowy terminal
2. Jeśli problem nadal występuje, dodaj Node.js do PATH:
   - Wyszukaj "Environment Variables" w Windows
   - Dodaj `C:\Program Files\nodejs\` do PATH
   - Zrestartuj VS Code

### Problem: "python is not recognized"
**Rozwiązanie:**
1. Uruchom ponownie instalator Python
2. Wybierz "Modify" i zaznacz "Add Python to environment variables"
3. Zrestartuj VS Code

### Problem: "npm install" zawiesza się
**Rozwiązanie:**
```cmd
# Wyczyść cache npm
npm cache clean --force

# Usuń node_modules i package-lock.json
rmdir /s /q node_modules
del package-lock.json

# Zainstaluj ponownie
npm install
```

### Problem: Backend nie uruchamia się
**Rozwiązanie:**
```cmd
# Sprawdź, czy środowisko wirtualne jest aktywne
cd backend
venv\Scripts\activate

# Sprawdź instalację zależności
pip install -r requirements.txt

# Sprawdź plik .env
# Upewnij się, że wszystkie klucze API są poprawne
```

### Problem: Port 5173 lub 8000 jest zajęty
**Rozwiązanie:**
```cmd
# Znajdź proces używający portu
netstat -ano | findstr :5173
netstat -ano | findstr :8000

# Zakończ proces (użyj PID z powyższego polecenia)
taskkill /PID <numer_pid> /F

# Lub zmień port w konfiguracji
# Frontend: vite.config.ts
# Backend: main.py (uvicorn)
```

### Problem: VS Code nie widzi rozszerzeń Python
**Rozwiązanie:**
1. Naciśnij **Ctrl+Shift+P**
2. Wpisz "Python: Select Interpreter"
3. Wybierz interpreter z `backend\venv\Scripts\python.exe`

### Problem: Błędy ESLint/Prettier
**Rozwiązanie:**
```cmd
# Zainstaluj ponownie zależności
npm install

# Napraw błędy ESLint automatycznie
npm run lint -- --fix
```

## Debugowanie w VS Code

### Debugowanie Frontend (React)

1. Zainstaluj rozszerzenie "Debugger for Chrome" lub użyj Edge
2. Uruchom frontend (`npm run dev`)
3. W przeglądarce, otwórz DevTools (F12)
4. Użyj `console.log()` lub breakpointów w DevTools

### Debugowanie Backend (Python)

1. Ustaw breakpoint w kodzie Python (kliknij na lewo od numeru linii)
2. Naciśnij **F5** lub przejdź do **Run and Debug** (Ctrl+Shift+D)
3. Wybierz "Python: FastAPI"
4. Program zatrzyma się na breakpoint

Możesz również dodać konfigurację debugowania w `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Python: FastAPI",
      "type": "python",
      "request": "launch",
      "module": "uvicorn",
      "args": [
        "main:app",
        "--reload",
        "--host",
        "0.0.0.0",
        "--port",
        "8000"
      ],
      "jinja": true,
      "justMyCode": true,
      "cwd": "${workspaceFolder}/backend"
    }
  ]
}
```

## Dodatkowe wskazówki

### Praca z Git w VS Code

1. **Panel Source Control**: Ctrl+Shift+G
2. **Stage Changes**: Kliknij "+" obok pliku
3. **Commit**: Wpisz wiadomość i naciśnij Ctrl+Enter
4. **Push**: Kliknij "..." → Push

### Wyszukiwanie w projekcie

1. **Wyszukaj w plikach**: Ctrl+Shift+F
2. **Wyszukaj i zastąp**: Ctrl+Shift+H
3. **Przejdź do definicji**: F12
4. **Przejdź do symbolu**: Ctrl+Shift+O

### Praca z terminalem

1. **Podziel terminal**: Kliknij ikonę podziału
2. **Zmień nazwę terminala**: Kliknij prawym przyciskiem → Rename
3. **Koloruj terminale**: Kliknij prawym przyciskiem → Change Icon

## Podsumowanie - Szybki start

```cmd
# 1. Otwórz VS Code w folderze projektu
cd C:\ścieżka\do\MarekNBAnalitics
code .

# 2. W terminalu VS Code uruchom setup
setup.bat

# 3. Skonfiguruj .env z kluczami API
copy .env.example .env
# Edytuj .env w VS Code

# 4. Uruchom frontend (Terminal 1)
npm run dev

# 5. Uruchom backend (Terminal 2)
cd backend
venv\Scripts\activate
python main.py

# 6. Otwórz w przeglądarce
# Frontend: http://localhost:5173
# Backend API: http://localhost:8000/docs
```

## Dodatkowe zasoby

- **Dokumentacja VS Code**: https://code.visualstudio.com/docs
- **Python w VS Code**: https://code.visualstudio.com/docs/python/python-tutorial
- **Node.js**: https://nodejs.org/docs
- **React**: https://react.dev/
- **FastAPI**: https://fastapi.tiangolo.com/
- **Vite**: https://vitejs.dev/

---

**Powodzenia z projektem! 🏀💰**

Jeśli masz pytania lub problemy, sprawdź pełną dokumentację w pliku `README.md` lub otwórz issue na GitHub.
