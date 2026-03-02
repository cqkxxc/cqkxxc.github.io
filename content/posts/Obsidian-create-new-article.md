---
title: Obsidian新建笔记的注意事项
date: 2026-03-02
tags:
  - 博客
  - obisdian
description: 如何在Obsidian新建笔记并上传到githubpage
categories: obisdian使用指南
---
## 用Obsidian写文章

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

```
.\deploy.ps1
```

## 注：

只有 --- 包围的front matter区块是必须的，内容可以为空：

```
---
---
```
这样也能正常构建，只是文章没有标题、日期等信息。

### 推荐的最简配置

```
---
title: "文章标题"
---
```

只有标题就够了，其他都是可选的。

