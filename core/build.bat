@echo off
SETLOCAL EnableDelayedExpansion

echo ========================================
echo   SENTINEL-CORE BUILD SYSTEM (Windows)
echo ========================================

:: Проверка наличия компилятора
where gcc >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] GCC compiler not found! Please install MinGW.
    pause
    exit /b 1
)

:menu
echo.
echo 1. Build Project (sentinel.exe)
echo 2. Run Unit Tests (make test)
echo 3. Clean Artifacts (.o, .exe)
echo 4. Full Cycle (Clean + Build + Test)
echo 5. Exit
echo.
set /p choice="Choose an option (1-5): "

if "%choice%"=="1" goto build
if "%choice%"=="2" goto test
if "%choice%"=="3" goto clean
if "%choice%"=="4" goto full
if "%choice%"=="5" exit /b 0
goto menu

:build
echo [INFO] Compiling Sentinel-Core...
gcc -Wall -Wextra -Werror -std=c11 main.c vitals.c -o sentinel.exe
if %errorlevel% equ 0 (echo [SUCCESS] sentinel.exe created.) else (echo [FAIL] Compilation error.)
if "%choice%"=="4" goto test
goto menu

:test
echo [INFO] Compiling and Running Tests...
gcc -Wall -Wextra -Werror -std=c11 tests.c vitals.c -o runner_tests.exe
if %errorlevel% equ 0 (
    echo [INFO] Running tests...
    ./runner_tests.exe
) else (
    echo [FAIL] Test compilation error.
)
goto menu

:clean
echo [INFO] Cleaning up...
del /f /q *.o *.exe 2>nul
echo [SUCCESS] Cleaned.
goto menu

:full
goto clean