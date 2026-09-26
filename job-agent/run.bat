@echo off
setlocal enabledelayedexpansion
cd /d "%~dp0"

echo.
echo   JobFinder - private LinkedIn job search
echo   -------------------------------------
echo.

where node >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js was not found on your PATH.
    echo         Install Node.js 22 or newer from https://nodejs.org
    echo         and reopen this window.
    echo.
    pause
    exit /b 1
)

for /f "tokens=*" %%v in ('node -v') do set NODE_VERSION=%%v
for /f "tokens=*" %%v in ('npm -v')  do set NPM_VERSION=%%v
echo   Node %NODE_VERSION%   npm %NPM_VERSION%
echo.

if not exist "node_modules" (
    echo   Installing dependencies, this only happens once...
    echo.
    call npm install
    if errorlevel 1 (
        echo.
        echo [ERROR] npm install failed. Read the output above.
        echo.
        pause
        exit /b 1
    )
    echo.
)

echo   Starting the dev server at http://localhost:3000
echo   Press Ctrl+C to stop it.
echo.

call npm run dev

endlocal
