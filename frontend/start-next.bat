@echo off
echo Starting Next.js dev server...
start "" cmd /k "npm run start"
timeout /t 3 /nobreak >nul
start http://localhost:3000
pause