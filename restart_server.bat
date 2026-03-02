@echo off
echo Stopping existing Node processes...
taskkill /im node.exe /f 2>nul
timeout /t 3 /nobreak >nul
echo Starting server on port 5000...
cd /d "c:\Users\ADMIN\Desktop\Vehicle Parking Management\Server"
set PORT=5000
node app.js
pause