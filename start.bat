@echo off
set "PATH=%~dp0node-portable\node-v20.19.2-win-x64;%PATH%"
echo Starting Development Server...
npm run dev
pause
