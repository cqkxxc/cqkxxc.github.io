---
title: Hugo博客搭建指南
date: 2026-03-02
draft: false
tags:
  - Hugo
  - 博客
description: 详细介绍如何使用Hugo搭建个人博客并部署到GitHub Pages。
---

## 为什么选择Hugo

Hugo 是一个用 Go 语言编写的静态网站生成器，具有以下优点：

- ⚡ 极速构建 - 毫秒级生成速度
- 📦 单一二进制文件 - 无需复杂依赖
- 🔧 灵活配置 - 支持多种主题和自定义
- 📝 Markdown支持 - 专注内容创作

## 安装Hugo

### Windows

使用 winget 安装：

```powershell
winget install Hugo.Hugo.Extended
```

### macOS

使用 Homebrew 安装：

```bash
brew install hugo
```

### Linux

使用 Snap 安装：

```bash
sudo snap install hugo
```

## 创建新站点

```bash
hugo new site my-blog
cd my-blog
```

## 添加主题

以 PaperMod 为例：

```bash
git init
git submodule add --depth=1 https://github.com/adityatelange/hugo-PaperMod.git themes/PaperMod
```

## 配置文件

创建 `hugo.toml` 配置文件：

```toml
baseURL = 'https://yourusername.github.io/'
languageCode = 'zh-cn'
title = '我的博客'
theme = 'PaperMod'
```

## 创建文章

```bash
hugo new posts/my-first-post.md
```

## 本地预览

```bash
hugo server -D
```

访问 `http://localhost:1313` 预览博客。

## 部署到GitHub Pages

1. 创建 GitHub 仓库
2. 推送代码
3. 配置 GitHub Actions 自动部署

## 总结

Hugo 是一个优秀的静态博客生成器，配合 GitHub Pages 可以免费搭建个人博客。后续文章会详细介绍部署流程。
