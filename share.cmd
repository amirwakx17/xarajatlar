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
  echo Paketlar o'rnatilmoqda...
  call npm install
)

if not exist "client\dist\index.html" (
  echo Frontend yig'ilmoqda...
  call npm run build
)

echo Server ishga tushmoqda...
start "Xarajatlar server" /min cmd /c "node server\src\index.js"
timeout /t 3 /nobreak >nul

echo.
echo ================================================================
echo  Ommaviy havola tayyorlanmoqda...
echo  Quyida chiqqan  https://....lhr.life  manzilni nusxalab oling.
echo  Bu oyna ochiq turishi kerak. To'xtatish uchun Ctrl+C.
echo ================================================================
echo.

"%SystemRoot%\System32\OpenSSH\ssh.exe" -o StrictHostKeyChecking=no -o UserKnownHostsFile=NUL -o ServerAliveInterval=30 -R 80:localhost:4000 nokey@localhost.run

pause
