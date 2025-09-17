@echo off
echo 🎭 Local Images Setup
echo ====================
echo.

echo Starting image download and setup process...
echo This will download 139 images and update your profiles.
echo.

cd /d "%~dp0"
node setup_local_images.js

echo.
echo Setup completed! Press any key to exit.
pause >nul
