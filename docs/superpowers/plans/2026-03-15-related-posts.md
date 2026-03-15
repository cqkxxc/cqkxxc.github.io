# 相关文章功能实现计划

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在文章页面底部展示基于 Hugo 原生 Related Content 的相关文章列表

**Architecture:** 使用 Hugo 内置 Related Content 功能，通过 TOML 配置相关性权重，构建时自动生成相关文章索引

**Tech Stack:** Hugo Related Content API、PaperMod 主题 CSS 变量

---

## 文件结构

| 文件 | 操作 | 职责 |
|------|------|------|
| `hugo.toml` | 修改 | 添加 Related Content 配置和 ShowRelatedPosts 参数 |
| `layouts/partials/related_posts.html` | 创建 | 相关文章渲染模板 |
| `layouts/_default/single.html` | 修改 | 引入 related_posts partial |
| `assets/css/extended/related_posts.css` | 创建 | 相关文章样式 |

---

## Chunk 1: 配置与核心模板

### Task 1: 添加 Hugo Related Content 配置

**Files:**
- Modify: `hugo.toml`

- [ ] **Step 1: 在 params 中添加 ShowRelatedPosts 配置**

在 `hugo.toml` 的 `[params]` 部分，在 `ShowRssButtonInSectionTermList` 之后添加：

```toml
  ShowRelatedPosts = true
```

- [ ] **Step 2: 在文件末尾添加 [related] 配置**

在 `hugo.toml` 文件末尾添加：

```toml
[related]
  includeNewer = true
  threshold = 60
  toLower = true
  
  [[related.indices]]
    name = "tags"
    weight = 100
    
  [[related.indices]]
    name = "categories"
    weight = 50
    
  [[related.indices]]
    name = "date"
    weight = 10
```

- [ ] **Step 3: 验证配置语法**

Run: `hugo config | grep -A 10 "related"`

Expected: 显示 related 配置信息

- [ ] **Step 4: Commit**

```bash
git add hugo.toml
git commit -m "feat: add Hugo Related Content configuration"
```

---

### Task 2: 创建 related_posts.html partial

**Files:**
- Create: `layouts/partials/related_posts.html`

- [ ] **Step 1: 创建相关文章渲染模板**

创建文件 `layouts/partials/related_posts.html`：

```html
{{- if and (.Param "ShowRelatedPosts") (eq .Section "posts") -}}
{{- $related := .Site.RegularPages.Related . | first 5 -}}
{{- with $related -}}
<section class="related-posts">
  <h3 class="related-posts-title">相关文章</h3>
  <ul class="related-posts-list">
    {{- range . -}}
    <li class="related-posts-item">
      <a href="{{ .Permalink }}" class="related-posts-link">{{ .Title }}</a>
      <span class="related-posts-date">{{ .Date.Format "2006-01-02" }}</span>
    </li>
    {{- end -}}
  </ul>
</section>
{{- end -}}
{{- end -}}
```

- [ ] **Step 2: 验证模板语法**

Run: `hugo --templateMetrics`

Expected: 无模板错误，构建成功

- [ ] **Step 3: Commit**

```bash
git add layouts/partials/related_posts.html
git commit -m "feat: add related_posts partial using Hugo Related Content"
```

---

### Task 3: 修改 single.html 引入 partial

**Files:**
- Modify: `layouts/_default/single.html`

- [ ] **Step 1: 在 post-footer 中添加相关文章调用**

在 `layouts/_default/single.html` 中，找到 `post_nav_links.html` 调用位置（约第 52 行），在其后添加：

```html
    {{- if (.Param "ShowRelatedPosts") }}
    {{- partial "related_posts.html" . }}
    {{- end }}
```

完整上下文：

```html
    {{- if (.Param "ShowPostNavLinks") }}
    {{- partial "post_nav_links.html" . }}
    {{- end }}
    {{- if (.Param "ShowRelatedPosts") }}
    {{- partial "related_posts.html" . }}
    {{- end }}
    {{- if (and site.Params.ShowShareButtons (ne .Params.disableShare true)) }}
```

- [ ] **Step 2: 验证构建**

Run: `hugo --templateMetrics`

Expected: 无错误

- [ ] **Step 3: Commit**

```bash
git add layouts/_default/single.html
git commit -m "feat: integrate related_posts into single layout"
```

---

## Chunk 2: 样式实现

### Task 4: 创建样式文件

**Files:**
- Create: `assets/css/extended/related_posts.css`

- [ ] **Step 1: 创建 CSS 文件**

创建文件 `assets/css/extended/related_posts.css`：

```css
.related-posts {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border);
}

.related-posts-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.related-posts-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.related-posts-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px dashed var(--border);
}

.related-posts-item:last-child {
  border-bottom: none;
}

.related-posts-link {
  color: var(--link-color);
  text-decoration: none;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.related-posts-link:hover {
  text-decoration: underline;
}

.related-posts-date {
  font-size: 0.85rem;
  color: var(--secondary);
  flex-shrink: 0;
  margin-left: 1rem;
}

@media (max-width: 480px) {
  .related-posts-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }
  
  .related-posts-date {
    margin-left: 0;
    font-size: 0.8rem;
  }
}
```

- [ ] **Step 2: 验证构建**

Run: `hugo --templateMetrics`

Expected: 无错误，CSS 被正确打包

- [ ] **Step 3: Commit**

```bash
git add assets/css/extended/related_posts.css
git commit -m "feat: add related_posts styles"
```

---

## Chunk 3: 测试与部署

### Task 5: 本地测试验证

**Files:**
- None (测试验证)

- [ ] **Step 1: 启动本地服务器**

Run: `hugo server -D`

Expected: 服务器启动成功

- [ ] **Step 2: 验证功能**

打开浏览器访问 `http://localhost:1313/posts/`，进入任意文章页面：

1. 确认文章底部显示"相关文章"区块
2. 确认相关文章与当前文章有相同标签或分类
3. 确认最多显示 5 篇
4. 确认样式正确（亮色/暗色主题切换）

- [ ] **Step 3: 验证边界情况**

1. 访问无标签的文章，确认不崩溃
2. 确认当前文章不在相关文章列表中
3. 确认无相关文章时不显示区块

---

### Task 6: 最终提交与部署

**Files:**
- None (部署)

- [ ] **Step 1: 推送代码**

```bash
git push origin main
```

Expected: 推送成功，GitHub Actions 触发部署

- [ ] **Step 2: 验证线上效果**

访问 `https://cqkxxc.github.io/posts/`，确认相关文章功能正常工作。

---

## 验收标准

- [ ] 文章页面底部显示相关文章区块
- [ ] 相关文章基于标签和分类正确匹配
- [ ] 最多显示 5 篇相关文章
- [ ] 无相关文章时不显示区块
- [ ] 样式在亮色/暗色主题下正确
- [ ] 移动端响应式布局正确
- [ ] 配置开关生效

---

## 效果监控

上线后需持续监控以下指标：

| 指标 | 目标值 | 数据来源 |
|------|-------|---------|
| 点击率 (CTR) | > 3% | Umami |
| 相关性准确度 | > 80% | 人工抽检 |

若 1 个月后未达标，考虑迁移到自定义算法（方案二）。
