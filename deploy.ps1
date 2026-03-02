@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo ========================================
echo    Hugo 博客一键部署脚本
echo ========================================
echo.

set HUGO_PATH=C:\Users\chuax\AppData\Local\Microsoft\WinGet\Packages\Hugo.Hugo.Extended_Microsoft.Winget.Source_8wekyb3d8bbwe\hugo.exe

echo [1/4] 检查Git状态...
git status --porcelain >nul 2>&1
if errorlevel 1 (
    echo 错误: 当前目录不是Git仓库，请先运行 git init
    pause
    exit /b 1
)

echo [2/4] 构建Hugo站点...
if exist "public" rmdir /s /q public
%HUGO_PATH% --gc --minify
if errorlevel 1 (
    echo 错误: Hugo构建失败
    pause
    exit /b 1
)
echo 构建完成！

echo [3/4] 提交更改...
git add -A
git status --porcelain >nul
if errorlevel 1 (
    echo 没有需要提交的更改
) else (
    set /p commit_msg="请输入提交信息 (默认: Update blog): "
    if "!commit_msg!"=="" set commit_msg=Update blog
    git commit -m "!commit_msg!"
    echo 提交完成！
)

echo [4/4] 推送到GitHub...
git push origin main
if errorlevel 1 (
    echo 错误: 推送失败，请检查网络连接或Git配置
    pause
    exit /b 1
)

echo.
echo ========================================
echo    部署完成！
echo    GitHub Actions将自动构建和部署
echo ========================================
echo.
pause
