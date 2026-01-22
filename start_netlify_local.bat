@echo off
title Netlify Local Dev Server
echo Starting Portfolio with Netlify Functions...
echo --------------------------------------------

:: Check for Node Environment
if not exist "node_modules" (
    echo [INFO] Installing dependencies...
    call npm install
)

:: Start Netlify Dev
:: We use 'call' to ensure batch script doesn't exit immediately
echo [INFO] Server starting... 
echo [INFO] Please open http://localhost:8888 in your browser.
call npm start

pause
