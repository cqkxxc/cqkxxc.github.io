# 相关文章功能实现计划

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在文章页面底部展示基于标签和分类的相关文章列表

**Architecture:** 纯 Hugo 模板实现，通过自定义算法计算文章相关性分数，在构建时生成静态 HTML

**Tech Stack:** Hugo 模板引擎、PaperMod 主题 CSS 变量

---

## 文件结构

| 文件 | 操作 | 职责 |
|------|------|------|
| `layouts/partials/related_posts.html` | 创建 | 相关文章计算与渲染 |
| `layouts/_default/single.html` | 修改 | 引入 related_posts partial |
| `assets/css/extended/related_posts.css` | 创建 | 相关文章样式 |
| `hugo.toml` | 修改 | 添加配置项 |

---

## Chunk 1: 核心模板实现

### Task 1: 创建 related_posts.html partial

**Files:**
- Create: `layouts/partials/related_posts.html`

- [ ] **Step 1: 创建相关文章计算模板**

创建文件 `layouts/partials/related_posts.html`：

```html
{{- $currentPage := . -}}
{{- $currentTags := .Params.tags | default (slice) -}}
{{- $currentCategories := .Params.categories | default (slice) -}}
{{- $oneYearAgo := now.AddDate -1 0 0 -}}

{{- $related := slice -}}

{{- range $page := where site.RegularPages "Section" "posts" -}}
  {{- if and (ne $page.Permalink $currentPage.Permalink) (not $page.Draft) -}}
    {{- $pageTags := $page.Params.tags | default (slice) -}}
    {{- $pageCategories := $page.Params.categories | default (slice) -}}
    
    {{- $tagScore := mul (len (intersect $currentTags $pageTags)) 10 -}}
    {{- $catScore := cond (gt (len (intersect $currentCategories $pageCategories)) 0) 5 0 -}}
    {{- $dateScore := cond (gt $page.Date $oneYearAgo) 2 0 -}}
    
    {{- $totalScore := add $tagScore $catScore $dateScore -}}
    
    {{- if gt $totalScore 0 -}}
      {{- $related = $related | append (dict "page" $page "score" $totalScore) -}}
    {{- end -}}
  {{- end -}}
{{- end -}}

{{- $related := sort $related "score" "desc" | first 5 -}}

{{- with $related -}}
<section class="related-posts">
  <h3 class="related-posts-title">相关文章</h3>
  <ul class="related-posts-list">
    {{- range . -}}
    <li class="related-posts-item">
      <a href="{{ .page.Permalink }}" class="related-posts-link">{{ .page.Title }}</a>
      <span class="related-posts-date">{{ .page.Date.Format "2006-01-02" }}</span>
    </li>
    {{- end -}}
  </ul>
</section>
{{- end -}}
```

- [ ] **Step 2: 验证模板语法**

Run: `hugo --templateMetrics`

Expected: 无模板错误，构建成功

- [ ] **Step 3: Commit**

```bash
git add layouts/partials/related_posts.html
git commit -m "feat: add related_posts partial template"
```

---

### Task 2: 修改 single.html 引入 partial

**Files:**
- Modify: `layouts/_default/single.html`

- [ ] **Step 1: 在 post-footer 中添加相关文章调用**

在 `layouts/_default/single.html` 中，找到 `post_nav_links.html` 调用位置，在其后添加：

```html
    {{- if (.Param "ShowRelatedPosts") }}
    {{- partial "related_posts.html" . }}
    {{- end }}
```

完整上下文（第 50-58 行附近）：

```html
  <footer class="post-footer">
    {{- $tags := .Language.Params.Taxonomies.tag | default "tags" }}
    <ul class="post-tags">
      {{- range ($.GetTerms $tags) }}
      <li><a href="{{ .Permalink }}">{{ .LinkTitle }}</a></li>
      {{- end }}
    </ul>
    {{- if (.Param "ShowPostNavLinks") }}
    {{- partial "post_nav_links.html" . }}
    {{- end }}
    {{- if (.Param "ShowRelatedPosts") }}
    {{- partial "related_posts.html" . }}
    {{- end }}
    {{- if (and site.Params.ShowShareButtons (ne .Params.disableShare true)) }}
    {{- partial "share_icons.html" . -}}
    {{- end }}
  </footer>
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

### Task 3: 创建样式文件

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

## Chunk 3: 配置与验证

### Task 4: 添加配置项

**Files:**
- Modify: `hugo.toml`

- [ ] **Step 1: 在 params 中添加配置**

在 `hugo.toml` 的 `[params]` 部分添加：

```toml
  ShowRelatedPosts = true
```

位置建议：在 `ShowRssButtonInSectionTermList` 之后

- [ ] **Step 2: 验证配置**

Run: `hugo config | grep ShowRelatedPosts`

Expected: `showrelatedposts = true`

- [ ] **Step 3: Commit**

```bash
git add hugo.toml
git commit -m "feat: add ShowRelatedPosts config option"
```

---

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
3. 确认草稿文章不在相关文章列表中

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
