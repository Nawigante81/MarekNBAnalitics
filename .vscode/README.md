# VS Code Configuration

This directory contains workspace configuration files for Visual Studio Code.

## Files

### extensions.json
Recommended extensions for this project. VS Code will prompt you to install these when you open the project.

### settings.json
Workspace-specific settings including:
- Python interpreter path (configured for Windows by default)
- Code formatting preferences (Prettier for TypeScript/JavaScript, Black for Python)
- Terminal profiles for Windows
- Auto-save and linting configurations

**Note for macOS/Linux users:** The Python interpreter path is set for Windows (`Scripts/python.exe`). On macOS/Linux, Python uses `bin/python` instead. VS Code will usually detect this automatically, but you may need to manually select the correct interpreter using the Command Palette (`Ctrl+Shift+P` → "Python: Select Interpreter").

### launch.json
Debug configurations for:
- FastAPI backend server
- Current Python file

Use F5 to start debugging.

### tasks.json
Predefined tasks that can be run via:
- Command Palette: `Ctrl+Shift+P` → "Tasks: Run Task"
- Terminal menu: Terminal → Run Task

Available tasks:
- Start Frontend Dev Server
- Start Backend Server  
- Start Frontend & Backend (runs both)
- Install Frontend Dependencies
- Install Backend Dependencies
- Build Frontend
- Run Tests
- Lint

## Platform Compatibility

These configurations are optimized for Windows 11 but will work on other platforms with minor adjustments:
- Terminal profiles in settings.json are Windows-specific
- Python path uses Windows format (`Scripts` instead of `bin`)
- VS Code will usually auto-detect the correct paths on other platforms

## Customization

These are recommended settings for the project. You can override them by:
1. Creating a `.vscode/settings.local.json` file (not tracked by git)
2. Modifying your User Settings (doesn't affect other users)

See the [VS Code documentation](https://code.visualstudio.com/docs/getstarted/settings) for more information.
