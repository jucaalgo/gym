@echo off
echo ===================================================
echo ANTIGRAVITY - GITHUB EXPORT WIZARD
echo ===================================================
echo.
echo 1. Initializing Git Repository...
git init
git add .
git commit -m "feat: Complete Antigravity 2.0 Release"

echo.
echo 2. Repository Ready!
echo.
set /p REPO_URL="Pegue la URL su nuevo repositorio de GitHub aqui: "

echo.
echo 3. Linking to GitHub...
git remote add origin %REPO_URL%
git branch -M main
git push -u origin main

echo.
echo ===================================================
echo SUCCESS! Antigravity is now on GitHub.
echo ===================================================
pause
