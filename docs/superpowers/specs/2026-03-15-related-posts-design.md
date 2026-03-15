# 相关文章功能设计文档

## 1. 概述

### 1.1 目标

在文章页面底部展示相关文章列表，提升用户阅读深度和站内内容发现能力。

### 1.2 范围

- 仅在文章页面 (single.html) 显示
- 仅针对 `posts` section 的文章
- 使用 Hugo 原生 Related Content 功能

### 1.3 策略说明

采用 **方案一优先** 策略：
- Phase 1：使用 Hugo 原生 Related Content（当前阶段）
- Phase 2：若效果不达标，迁移到自定义算法

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

### 3.1 Hugo 原生算法

Hugo 使用 Bleve 索引引擎，基于 TF-IDF 变体计算相关性：

```
score = Σ(weight_i × term_frequency × inverse_document_frequency)
```

### 3.2 配置权重

| 维度 | 权重 | 说明 |
|------|------|------|
| tags | 100 | 标签匹配，最高优先级 |
| categories | 50 | 分类匹配，中等优先级 |
| date | 10 | 时间因素，低优先级 |

### 3.3 配置参数

```toml
[related]
  includeNewer = true    # 包含新文章
  threshold = 60         # 相关性阈值 (0-100)
  toLower = true         # 忽略大小写
  
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

---

## 4. 技术实现

### 4.1 文件结构

```
layouts/
├── partials/
│   └── related_posts.html    # 相关文章渲染
└── _default/
    └── single.html           # 引入 partial (已存在，需修改)
```

### 4.2 模板逻辑

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
| 列表 | 无序列表，无内边距 |
| 链接 | 继承主题链接样式，悬停下划线 |
| 日期 | 12px，灰色，右对齐 |

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

---

## 6. 配置项

### 6.1 全局配置

在 `hugo.toml` 中添加：

```toml
[params]
  ShowRelatedPosts = true

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

### 6.2 文章级覆盖

在文章 front matter 中可覆盖：

```yaml
---
title: 文章标题
ShowRelatedPosts: false  # 此文章不显示相关文章
---
```

---

## 7. 效果评估

### 7.1 量化指标

| 指标 | 定义 | 目标值 | 数据来源 |
|------|------|-------|---------|
| 点击率 (CTR) | 相关文章点击数 / 页面浏览数 | > 3% | Umami |
| 跳出率降低 | 查看相关文章后的跳出率变化 | -5% | Umami |
| 页面/会话 | 平均每会话浏览页面数 | +0.5 | Umami |

### 7.2 质性指标

| 指标 | 评估方式 | 目标 |
|------|---------|------|
| 相关性准确度 | 人工抽检 20 篇文章 | > 80% 认为相关 |
| 用户反馈 | 评论/GitHub Issue | 无负面反馈 |

### 7.3 评估周期

| 阶段 | 周期 | 评估内容 |
|------|------|---------|
| 初期 | 上线后 2 周 | 功能稳定性、无报错 |
| 中期 | 上线后 1 个月 | 点击率、相关性抽检 |
| 长期 | 上线后 3 个月 | 全量指标评估、迁移决策 |

---

## 8. 迁移触发条件

满足以下 **任一条件** 即触发迁移到方案二（自定义算法）：

| 条件 | 阈值 |
|------|------|
| 点击率 | < 2%，持续 2 周 |
| 相关性准确度 | < 70%（人工抽检） |
| 用户反馈 | "相关文章不相关" ≥ 3 次 |
| 业务需求 | 需要手动指定相关文章 |
| 业务需求 | 需要排除特定标签 |

---

## 9. 性能考虑

### 9.1 构建性能

Hugo 原生 Related Content 使用 Bleve 索引：
- 时间复杂度：O(n log n)
- 并发处理：Go 原生支持
- 内存占用：索引结构优化

### 9.2 当前项目评估

- 文章数量：13 篇
- 预期增长：< 100 篇/年
- 性能影响：可忽略

---

## 10. 测试计划

### 10.1 功能测试

- [ ] 有相关文章时正确显示
- [ ] 无相关文章时不显示
- [ ] 显示数量不超过 5 篇
- [ ] 配置开关生效

### 10.2 边界测试

- [ ] 文章无标签时不崩溃
- [ ] 文章无分类时不崩溃
- [ ] 只有一篇文章时不显示

### 10.3 样式测试

- [ ] 亮色主题下样式正确
- [ ] 暗色主题下样式正确
- [ ] 移动端响应式正确

---

## 11. 风险评估

| 风险 | 可能性 | 影响 | 缓解措施 |
|------|-------|------|---------|
| 相关性效果不佳 | 中 | 中 | 迁移到方案二 |
| 无法满足特定需求 | 中 | 低 | 迁移到方案二 |
| Hugo 版本兼容问题 | 低 | 低 | 锁定版本 |

---

## 12. 实施步骤

1. 添加 `hugo.toml` 相关性配置
2. 创建 `layouts/partials/related_posts.html`
3. 修改 `layouts/_default/single.html`
4. 添加 CSS 样式
5. 本地测试验证
6. 部署上线
7. 持续监控效果指标

---

## 13. 附录：方案二迁移指南

若需迁移到自定义算法，参考以下步骤：

### 13.1 迁移成本

约 25 分钟

### 13.2 迁移步骤

1. 删除 `hugo.toml` 中的 `[related]` 配置
2. 修改 `related_posts.html` 为自定义算法
3. 测试验证
4. 部署

### 13.3 自定义算法模板

参见 `docs/superpowers/specs/2026-03-15-related-posts-design-v2.md`（待创建）
