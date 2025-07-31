@echo off
echo.
echo ========================================
echo   Dr. Tanees Raana Website Deployment
echo ========================================
echo.

cd /d "C:\Users\Administrator\source\repos\Websites\MK\TaneesRaana"

echo 1. Updating version...
node update-version.js patch

echo.
echo 2. Deploying to production...
powershell -ExecutionPolicy Bypass -File "deploy.ps1" patch

echo.
echo Deployment completed!
echo Website: http://taneesraana.mk313.com
echo.
pause
