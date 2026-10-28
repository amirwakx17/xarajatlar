@echo off
setlocal
cd /d "%~dp0"

if exist "%~dp0.runtime\node.exe" set "PATH=%~dp0.runtime;%PATH%"

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js topilmadi. Tizimga Node.js 24 o'rnating: https://nodejs.org
  pause
  exit /b 1
)

if not exist "node_modules" (
  echo Kerakli paketlar o'rnatilmoqda, biroz kuting...
  call npm install
)

echo.
echo Ilova ishga tushmoqda: http://localhost:5173
echo To'xtatish uchun bu oynada Ctrl+C bosing.
echo.

call npm run dev
pause
