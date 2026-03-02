#!/usr/bin/env pwsh
# Hugo 博客一键部署脚本 (PowerShell版本)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Hugo 博客一键部署脚本" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$ErrorActionPreference = "Stop"

Write-Host "[1/4] 检查Git状态..." -ForegroundColor Yellow
$gitStatus = git status --porcelain 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "错误: 当前目录不是Git仓库，请先运行 git init" -ForegroundColor Red
    Read-Host "按回车键退出"
    exit 1
}

Write-Host "[2/4] 构建Hugo站点..." -ForegroundColor Yellow
if (Test-Path "public") {
    Remove-Item -Recurse -Force "public"
}
hugo --gc --minify
if ($LASTEXITCODE -ne 0) {
    Write-Host "错误: Hugo构建失败" -ForegroundColor Red
    Read-Host "按回车键退出"
    exit 1
}
Write-Host "构建完成！" -ForegroundColor Green

Write-Host "[3/4] 提交更改..." -ForegroundColor Yellow
git add -A
$status = git status --porcelain
if ([string]::IsNullOrWhiteSpace($status)) {
    Write-Host "没有需要提交的更改" -ForegroundColor Gray
} else {
    $commit_msg = Read-Host "请输入提交信息 (默认: Update blog)"
    if ([string]::IsNullOrWhiteSpace($commit_msg)) {
        $commit_msg = "Update blog"
    }
    git commit -m $commit_msg
    Write-Host "提交完成！" -ForegroundColor Green
}

Write-Host "[4/4] 推送到GitHub..." -ForegroundColor Yellow
git push origin main
if ($LASTEXITCODE -ne 0) {
    Write-Host "错误: 推送失败，请检查网络连接或Git配置" -ForegroundColor Red
    Read-Host "按回车键退出"
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   部署完成！" -ForegroundColor Green
Write-Host "   GitHub Actions将自动构建和部署" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Read-Host "按回车键退出"
