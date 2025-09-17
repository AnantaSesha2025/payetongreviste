@echo off
echo ========================================
echo   Gist Image Updater
echo ========================================
echo.

REM Check if GITHUB_TOKEN is set
if "%GITHUB_TOKEN%"=="" (
    echo ERROR: GITHUB_TOKEN environment variable is not set!
    echo.
    echo Please set your GitHub personal access token:
    echo   set GITHUB_TOKEN=your_token_here
    echo.
    echo Or run: setx GITHUB_TOKEN "your_token_here"
    echo.
    pause
    exit /b 1
)

echo GitHub token found: %GITHUB_TOKEN:~0,8%...
echo.

REM Run the update script
node update_gist_with_local_images.js

echo.
echo ========================================
echo   Update completed!
echo ========================================
pause
