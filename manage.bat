@echo off
setlocal enabledelayedexpansion

echo ================================
echo   Ronghua Heritage Platform
echo ================================
echo.
echo [1] Deploy Project
echo [2] Start All Services  
echo [3] Start Backend Only
echo [4] Start Frontend Only
echo [5] Stop All Services
echo [6] Monitor Services
echo [0] Exit
echo.

set /p choice="Select option (0-6): "

if "%choice%"=="1" goto deploy
if "%choice%"=="2" goto start_all
if "%choice%"=="3" goto start_backend
if "%choice%"=="4" goto start_frontend
if "%choice%"=="5" goto stop_all
if "%choice%"=="6" goto monitor
if "%choice%"=="0" goto exit
echo Invalid choice, please try again.
pause
goto main_menu

:deploy
echo ================================
echo   Deploying Project...
echo ================================
echo.

python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python not found. Please install Python 3.8+
    pause
    goto main_menu
)

if not exist "venv" (
    echo [STEP 1] Creating virtual environment...
    python -m venv venv
    echo [DONE] Virtual environment created
) else (
    echo [SKIP] Virtual environment already exists
)

echo [STEP 2] Installing backend dependencies...
call venv\Scripts\activate.bat
cd backend
pip install -r requirements.txt
cd ..

echo [STEP 3] Initializing database...
cd backend
python scripts\init_db.py
cd ..

if not exist "backend\.env" (
    echo DATABASE_URL=sqlite:///./data/database.db > backend\.env
    echo SECRET_KEY=your-secret-key-here >> backend\.env
    echo ADMIN_USERNAME=admin >> backend\.env
    echo ADMIN_PASSWORD=admin123 >> backend\.env
    echo DEBUG=True >> backend\.env
)

if not exist "backend\data" mkdir backend\data
if not exist "backend\static\uploads" (
    mkdir backend\static\uploads
    mkdir backend\static\uploads\avatars
    mkdir backend\static\uploads\content
    mkdir backend\static\uploads\products
)

echo.
echo [SUCCESS] Project deployed successfully!
echo.
echo Access URLs:
echo   Frontend: http://localhost:8080
echo   Backend API: http://localhost:8000
echo   Admin Panel: http://localhost:8000/admin
echo.
echo Default Admin Account:
echo   Username: admin
echo   Password: admin123
echo.
pause
goto main_menu

:start_all
echo Starting all services...
call :stop_all_silent
call :start_backend_service
timeout /t 3 /nobreak >nul
call :start_frontend_service
echo.
echo [SUCCESS] All services started!
echo Frontend: http://localhost:8080
echo Backend: http://localhost:8000
echo Admin Panel: http://localhost:8000/admin
pause
goto main_menu

:start_backend
echo Starting backend service...
call :start_backend_service
echo [SUCCESS] Backend service started!
echo Backend: http://localhost:8000
echo Admin Panel: http://localhost:8000/admin
pause
goto main_menu

:start_frontend
echo Starting frontend service...
call :start_frontend_service
echo [SUCCESS] Frontend service started!
echo Frontend: http://localhost:8080
pause
goto main_menu

:stop_all
echo Stopping all services...
call :stop_all_silent
echo [DONE] All services stopped
pause
goto main_menu

:monitor
:monitor_loop
cls
echo ================================
echo   Service Monitor
echo ================================
echo [%date% %time%]
echo.

netstat -an | findstr :8000 >nul
if %errorlevel% equ 0 (
    echo [RUNNING] Backend Service - http://localhost:8000
) else (
    echo [STOPPED] Backend Service
)

netstat -an | findstr :8080 >nul
if %errorlevel% equ 0 (
    echo [RUNNING] Frontend Service - http://localhost:8080
) else (
    echo [STOPPED] Frontend Service
)

echo.
echo ================================
echo [1] Start All  [2] Stop All  [3] Restart
echo [4] View Logs  [R] Refresh   [Q] Back to Menu
echo ================================
echo.

choice /c 1234RQ /n /m "Select action: "
if errorlevel 6 goto main_menu
if errorlevel 5 goto monitor_loop
if errorlevel 4 goto show_logs
if errorlevel 3 call :restart_silent && goto monitor_loop
if errorlevel 2 call :stop_all_silent && goto monitor_loop
if errorlevel 1 call :start_all_silent && goto monitor_loop
goto monitor_loop

:show_logs
cls
echo ================================
echo   System Logs
echo ================================
echo.

if exist "backend.log" (
    echo [Backend Log - Last 10 lines]
    echo --------------------------------
    powershell "Get-Content 'backend.log' -Tail 10"
    echo.
) else (
    echo No backend log file found
)

if exist "frontend.log" (
    echo [Frontend Log - Last 10 lines]
    echo --------------------------------
    powershell "Get-Content 'frontend.log' -Tail 10"
    echo.
) else (
    echo No frontend log file found
)

pause
goto monitor_loop

REM ================================
REM Internal Functions
REM ================================

:start_backend_service
if not exist "venv" (
    echo [ERROR] Please run deployment first
    exit /b 1
)
call venv\Scripts\activate.bat
start "Ronghua Backend" cmd /c "cd backend && python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload > ..\backend.log 2>&1"
exit /b 0

:start_frontend_service
start "Ronghua Frontend" cmd /c "cd frontend && python -m http.server 8080 > ..\frontend.log 2>&1"
exit /b 0

:start_all_silent
call :start_backend_service
timeout /t 2 /nobreak >nul
call :start_frontend_service
exit /b 0

:stop_all_silent
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8000') do taskkill /f /pid %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8080') do taskkill /f /pid %%a >nul 2>&1
taskkill /f /fi "WindowTitle eq Ronghua Backend*" >nul 2>&1
taskkill /f /fi "WindowTitle eq Ronghua Frontend*" >nul 2>&1
exit /b 0

:restart_silent
call :stop_all_silent
timeout /t 2 /nobreak >nul
call :start_all_silent
exit /b 0

:exit
echo Thank you for using Ronghua Heritage Platform!
exit /b 0

:main_menu
goto main_menu
