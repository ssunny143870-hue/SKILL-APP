@echo off
title SUN Skills Hub - Local Server
color 0B

echo.
echo  ============================================
echo     SUN SKILLS HUB - LOCAL SERVER
echo  ============================================
echo.

:: Check if node is available
where node >nul 2>&1
if %errorlevel% equ 0 (
    echo  [OK] Node.js found in system PATH
    set "NODE=node"
    goto :install
)

:: Check local node
if exist ".vercel-tmp\nodejs\node.exe" (
    echo  [OK] Node.js found in local .vercel-tmp
    set "NODE=.vercel-tmp\nodejs\node.exe"
    goto :install
)

echo  [!!] Node.js not found!
echo  Please install Node.js from https://nodejs.org
pause
exit /b 1

:install
echo  Installing server dependencies...
cd server
if not exist "node_modules" (
    "%NODE%" -e "const{execSync}=require('child_process');try{execSync('npm install',{stdio:'inherit',cwd:process.cwd()})}catch(e){}"
    if %errorlevel% neq 0 (
        echo  Running npm install via npx...
        cd ..
        "%NODE%" .vercel-tmp
odejs
ode_modules
pm\bin
pm-cli.js install --prefix server
        cd server
    )
)
cd ..

echo.
echo  Starting SUN Skills Hub server...
echo.
echo  ============================================
echo     Open your browser and go to:
echo.
echo     http://localhost:4000
echo  ============================================
echo.
echo  Press Ctrl+C to stop the server.
echo.

"%NODE%" server\index.js

pause
