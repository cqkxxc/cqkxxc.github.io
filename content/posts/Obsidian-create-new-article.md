---
title: Obsidian新建笔记的方法
date: 2026-03-02
draft: true
categories:
  - 教程
tags:
  - 博客
description: 文章简介
---
### 用Obsidian写文章
1. 用Obsidian打开项目目录 R:\TraeProject\GithubPages
2. 在 content/posts/ 下创建新markdown文件
3. 文件开头添加front matter ：
```
---
title: "文章标题"
date: 2024-03-02
draft: false
categories: ["技术笔记"]
tags: ["标签1", "标签2"]
description: "文章简介"
---

## 正文开始...
```
4. 保存后执行部署脚本 ：
5. ```
   .\deploy.ps1
   ```