# 相关文章功能设计文档

## 1. 概述

### 1.1 目标

在文章页面底部展示相关文章列表，提升用户阅读深度和站内内容发现能力。

### 1.2 范围

- 仅在文章页面 (single.html) 显示
- 仅针对 `posts` section 的文章
- 纯模板实现，无 JavaScript 依赖

---

## 2. 功能规格

### 2.1 显示规则

| 项目 | 规格 |
|------|------|
| 显示位置 | 文章底部，post-footer 区块内，评论区之前 |
| 显示数量 | 最多 5 篇 |
| 显示内容 | 文章标题、发布日期 |
| 触发条件 | 至少有 1 篇相关文章时显示 |
| 配置开关 | `params.ShowRelatedPosts`，默认 true |

### 2.2 交互行为

- 点击文章标题跳转到对应文章
- 无相关文章时不显示任何内容

---

## 3. 相关性算法

### 3.1 计算公式

```
总分 = 标签匹配分 + 分类匹配分 + 时间衰减分
```

### 3.2 分数权重

| 维度 | 计算方式 | 权重 |
|------|---------|------|
| 标签匹配 | 标签交集数量 × 10 | 高 |
| 分类匹配 | 分类相同 ? 5 : 0 | 中 |
| 时间衰减 | 发布时间在 1 年内 ? 2 : 0 | 低 |

### 3.3 过滤与排序

- 过滤条件：总分 > 0
- 排序规则：总分降序，同分按日期降序
- 结果限制：取前 5 篇

### 3.4 排除规则

- 排除当前文章
- 排除草稿文章 (`.Draft` 为 true)
- 仅包含 `posts` section 的文章

---

## 4. 技术实现

### 4.1 文件结构

```
layouts/
├── partials/
│   └── related_posts.html    # 相关文章计算与渲染
└── _default/
    └── single.html           # 引入 partial (已存在，需修改)
```

### 4.2 模板逻辑

```html
{{- if and (.Param "ShowRelatedPosts") (eq .Section "posts") -}}
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
{{- end -}}
```

### 4.3 single.html 修改

在 `post-footer` 区块内，`post_nav_links.html` 之后添加：

```html
{{- if (.Param "ShowRelatedPosts") }}
{{- partial "related_posts.html" . }}
{{- end }}
```

---

## 5. 样式设计

### 5.1 CSS 变量复用

复用 PaperMod 主题现有变量：
- `--content`：文字颜色
- `--border`：边框颜色
- `--link-color`：链接颜色

### 5.2 样式规格

| 元素 | 规格 |
|------|------|
| 标题 | 16px，加粗，下边距 12px |
| 列表 | 无序列表，左内边距 20px |
| 链接 | 继承主题链接样式，悬停下划线 |
| 日期 | 12px，灰色，右浮动 |

### 5.3 CSS 实现

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
```

---

## 6. 配置项

### 6.1 全局配置

在 `hugo.toml` 中添加：

```toml
[params]
  ShowRelatedPosts = true
```

### 6.2 文章级覆盖

在文章 front matter 中可覆盖：

```yaml
---
title: 文章标题
ShowRelatedPosts: false  # 此文章不显示相关文章
---
```

---

## 7. 性能考虑

### 7.1 时间复杂度

- 遍历文章：O(n)
- 标签交集计算：O(k)，k 为标签数量
- 排序：O(n log n)

总体：O(n log n)，n 为文章数量

### 7.2 当前项目评估

- 文章数量：13 篇
- 预期增长：< 100 篇/年
- 性能影响：可忽略

### 7.3 未来优化

当文章数量超过 200 篇时，可考虑：
- 使用 Hugo 原生 Related Content
- 引入 `.Store` 缓存机制

---

## 8. 测试计划

### 8.1 功能测试

- [ ] 有相关文章时正确显示
- [ ] 无相关文章时不显示
- [ ] 显示数量不超过 5 篇
- [ ] 排序正确（分数降序）
- [ ] 配置开关生效

### 8.2 边界测试

- [ ] 文章无标签时不崩溃
- [ ] 文章无分类时不崩溃
- [ ] 所有文章都是草稿时不显示
- [ ] 只有一篇文章时不显示

### 8.3 样式测试

- [ ] 亮色主题下样式正确
- [ ] 暗色主题下样式正确
- [ ] 移动端响应式正确

---

## 9. 风险评估

| 风险 | 可能性 | 影响 | 缓解措施 |
|------|-------|------|---------|
| 文章增长导致构建变慢 | 低 | 中 | 监控构建时间，必要时优化 |
| 样式与主题冲突 | 低 | 低 | 使用特定类名前缀 |
| 算法效果不佳 | 中 | 低 | 可根据反馈调整权重 |

---

## 10. 实施步骤

1. 创建 `layouts/partials/related_posts.html`
2. 修改 `layouts/_default/single.html`
3. 添加 CSS 样式
4. 更新 `hugo.toml` 配置
5. 本地测试验证
6. 部署上线
