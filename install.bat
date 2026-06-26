@echo off
set "PATH=%~dp0node-portable\node-v20.19.2-win-x64;%PATH%"
echo Installing dependencies...
npm install
echo.
echo Installation complete! You can now close this window and run start.bat
pause
