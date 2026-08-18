@echo off
chcp 65001 >nul
title 礼物设计师作品集服务器
echo ==========================================
echo   礼物设计师作品集 - 服务器启动
echo ==========================================
echo.

cd /d "%~dp0"

echo [1/2] 启动服务器...
start /b node server.js > server.log 2>&1
timeout /t 2 /nobreak >nul

echo [2/2] 启动公网隧道...
set NODE_PATH=%USERPROFILE%\.workbuddy\binaries\node\workspace\node_modules
start /b node "%USERPROFILE%\.workbuddy\binaries\node\workspace\_tunnel2.js" > tunnel.log 2>&1
timeout /t 5 /nobreak >nul

echo.
echo ==========================================
echo   服务器已启动！
echo.
echo   本地访问:  http://localhost:3000
echo   公网访问:  见 tunnel_url.txt 文件
echo.
echo   手机扫码或输入公网地址即可访问
echo   上传内容自动同步到所有设备
echo.
echo   关闭此窗口将停止服务器
echo ==========================================
echo.

:: 读取并显示隧道URL
if exist "%USERPROFILE%\.workbuddy\binaries\node\workspace\tunnel_url.txt" (
    set /p TUNNEL_URL=<"%USERPROFILE%\.workbuddy\binaries\node\workspace\tunnel_url.txt"
    echo   公网地址: %TUNNEL_URL%
    echo.
)

pause
