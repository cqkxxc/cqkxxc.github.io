# 右侧目录导航实现计划

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在文章页面右侧添加固定目录导航，支持点击跳转和滚动高亮

**架构:** 使用 Hugo 模板生成目录 HTML，CSS 实现固定右侧布局，原生 JavaScript 处理滚动监听和高亮

**Tech Stack:** Hugo, CSS (CSS Variables), Vanilla JavaScript (Intersection Observer)

---

## Chunk 1: 创建目录模板

### Task 1: 创建右侧目录 Partial 模板

**Files:**
- Create: `layouts/partials/right_toc.html`

- [ ] **Step 1: 创建目录模板文件**

创建 `layouts/partials/right_toc.html`：

```html
{{- $headers := findRE "<h[2-4].*?>(.|\n])+?</h[2-4]>" .Content -}}
{{- $has_headers := ge (len $headers) 1 -}}
{{- if $has_headers -}}
<aside class="right-toc" aria-label="Table of Contents">
  <div class="right-toc-title">目录</div>
  <nav class="right-toc-nav">
    <ul class="right-toc-list">
      {{- range $headers -}}
        {{- $headerLevel := index (findRE "[2-4]" . 1) 0 -}}
        {{- $level := len (seq $headerLevel) -}}
        {{- $id := index (findRE "(id=\"(.*?)\")" . 9) 0 -}}
        {{- $cleanedID := replace (replace $id "id=\"" "") "\"" "" -}}
        {{- $headerText := replaceRE "<h[2-4].*?>((.|\n])+?)</h[2-4]>" "$1" . -}}
        <li class="right-toc-item right-toc-level-{{ $level }}">
          <a href="#{{ $cleanedID }}" class="right-toc-link" data-target="{{ $cleanedID }}">{{ $headerText }}</a>
        </li>
      {{- end -}}
    </ul>
  </nav>
</aside>
{{- end -}}
```

- [ ] **Step 2: 验证模板语法**

运行 Hugo 检查模板语法：
```bash
hugo --templateMetrics
```

Expected: 无模板错误

- [ ] **Step 3: Commit**

```bash
git add layouts/partials/right_toc.html
git commit -m "feat: add right side toc partial template"
```

---

## Chunk 2: 修改文章布局

### Task 2: 修改 single.html 布局

**Files:**
- Modify: `layouts/_default/single.html`

- [ ] **Step 1: 备份原文件**

```bash
cp layouts/_default/single.html layouts/_default/single.html.backup
```

- [ ] **Step 2: 修改布局结构**

修改 `layouts/_default/single.html`，在 `<article>` 外层添加 wrapper，并在其后添加右侧 TOC：

```html
{{- define "main" }}

<div class="post-wrapper">
  <article class="post-single">
    <header class="post-header">
      {{ partial "breadcrumbs.html" . }}
      <h1 class="post-title entry-hint-parent">
        {{ .Title }}
        {{- if .Draft }}
        <span class="entry-hint" title="Draft">
          <svg xmlns="http://www.w3.org/2000/svg" height="35" viewBox="0 -960 960 960" fill="currentColor">
            <path
              d="M160-410v-60h300v60H160Zm0-165v-60h470v60H160Zm0-165v-60h470v60H160Zm360 580v-123l221-220q9-9 20-13t22-4q12 0 23 4.5t20 13.5l37 37q9 9 13 20t4 22q0 11-4.5 22.5T862.09-380L643-160H520Zm300-263-37-37 37 37ZM580-220h38l121-122-18-19-19-18-122 121v38Zm141-141-19-18 37 37-18-19Z" />
          </svg>
        </span>
        {{- end }}
      </h1>
      {{- if .Description }}
      <div class="post-description">
        {{ .Description }}
      </div>
      {{- end }}
      {{- if not (.Param "hideMeta") }}
      <div class="post-meta">
        {{- partial "post_meta.html" . -}}
        {{- partial "translation_list.html" . -}}
        {{- partial "edit_post.html" . -}}
        {{- partial "post_canonical.html" . -}}
      </div>
      {{- end }}
    </header>
    {{- $isHidden := (.Param "cover.hiddenInSingle") | default (.Param "cover.hidden") | default false }}
    {{- partial "cover.html" (dict "cxt" . "IsSingle" true "isHidden" $isHidden) }}
    
    {{- if (.Param "ShowToc") }}
    {{- partial "toc.html" . }}
    {{- end }}

    {{- if .Content }}
    <div class="post-content">
      {{- if not (.Param "disableAnchoredHeadings") }}
      {{- partial "anchored_headings.html" .Content -}}
      {{- else }}{{ .Content }}{{ end }}
    </div>
    {{- end }}

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
      {{- if (and site.Params.ShowShareButtons (ne .Params.disableShare true)) }}
      {{- partial "share_icons.html" . -}}
      {{- end }}
    </footer>

    {{- if (.Param "comments") }}
    {{- partial "comments.html" . }}
    {{- end }}
  </article>
  
  {{- if (.Param "ShowToc") }}
  {{- partial "right_toc.html" . }}
  {{- end }}
</div>

{{- end }}{{/* end main */}}
```

- [ ] **Step 3: 验证布局**

```bash
hugo server -D &
```

访问文章页面，检查 HTML 结构是否正确生成

- [ ] **Step 4: Commit**

```bash
git add layouts/_default/single.html
git commit -m "feat: add post-wrapper and right toc to single layout"
```

---

## Chunk 3: 创建 CSS 样式

### Task 3: 创建右侧目录样式

**Files:**
- Create: `assets/css/extended/right-toc.css`

- [ ] **Step 1: 创建 CSS 文件**

创建 `assets/css/extended/right-toc.css`：

```css
/* 文章包装器 - Grid 布局 */
.post-wrapper {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  max-width: 100%;
}

/* 桌面端显示右侧 TOC */
@media screen and (min-width: 1200px) {
  .post-wrapper {
    grid-template-columns: 1fr 250px;
  }
}

/* 右侧 TOC 容器 */
.right-toc {
  display: none;
}

@media screen and (min-width: 1200px) {
  .right-toc {
    display: block;
    position: sticky;
    top: 100px;
    height: fit-content;
    max-height: calc(100vh - 200px);
    overflow-y: auto;
    padding: 1rem;
    border-left: 2px solid var(--border);
  }
}

/* 隐藏滚动条但保持功能 */
.right-toc::-webkit-scrollbar {
  width: 4px;
}

.right-toc::-webkit-scrollbar-track {
  background: transparent;
}

.right-toc::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: 2px;
}

/* TOC 标题 */
.right-toc-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--primary);
  margin-bottom: 0.75rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border);
}

/* TOC 列表 */
.right-toc-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

/* TOC 列表项 */
.right-toc-item {
  margin: 0;
  padding: 0;
}

/* TOC 链接 */
.right-toc-link {
  display: block;
  padding: 0.35rem 0;
  font-size: 13px;
  line-height: 1.4;
  color: var(--secondary);
  text-decoration: none;
  border-left: 2px solid transparent;
  padding-left: 0.75rem;
  transition: all 0.2s ease;
}

.right-toc-link:hover {
  color: var(--primary);
  border-left-color: var(--secondary);
}

/* 层级缩进 */
.right-toc-level-2 .right-toc-link {
  padding-left: 0.75rem;
}

.right-toc-level-3 .right-toc-link {
  padding-left: 1.5rem;
  font-size: 12px;
}

.right-toc-level-4 .right-toc-link {
  padding-left: 2.25rem;
  font-size: 12px;
}

/* 当前活动项 */
.right-toc-link.active {
  color: var(--primary);
  border-left-color: var(--primary);
  font-weight: 500;
}

/* 暗色主题适配 */
[data-theme="dark"] .right-toc-link:hover {
  border-left-color: var(--secondary);
}

[data-theme="dark"] .right-toc-link.active {
  border-left-color: var(--primary);
}

/* 平滑滚动 */
html {
  scroll-behavior: smooth;
}

/* 调整文章最大宽度 */
@media screen and (min-width: 1200px) {
  .post-single {
    max-width: 100%;
  }
}
```

- [ ] **Step 2: 验证 CSS 语法**

检查 CSS 语法：
```bash
# 使用 Hugo 构建来验证 CSS
hugo --minify
```

Expected: 构建成功，无 CSS 错误

- [ ] **Step 3: Commit**

```bash
git add assets/css/extended/right-toc.css
git commit -m "feat: add right side toc styles"
```

---

## Chunk 4: 创建 JavaScript 交互

### Task 4: 创建滚动监听和高亮逻辑

**Files:**
- Create: `static/js/right-toc.js`

- [ ] **Step 1: 创建 JS 文件**

创建 `static/js/right-toc.js`：

```javascript
(function() {
  'use strict';

  // 等待 DOM 加载完成
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initRightToc);
  } else {
    initRightToc();
  }

  function initRightToc() {
    const toc = document.querySelector('.right-toc');
    if (!toc) return;

    const tocLinks = toc.querySelectorAll('.right-toc-link');
    if (tocLinks.length === 0) return;

    // 获取所有标题元素
    const headings = [];
    tocLinks.forEach(link => {
      const targetId = link.getAttribute('data-target');
      if (targetId) {
        const heading = document.getElementById(targetId);
        if (heading) {
          headings.push({
            element: heading,
            link: link
          });
        }
      }
    });

    if (headings.length === 0) return;

    // 使用 Intersection Observer 监听标题
    const observerOptions = {
      root: null,
      rootMargin: '-80px 0px -60% 0px',
      threshold: 0
    };

    let activeHeading = null;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // 找到对应的目录项
          const heading = headings.find(h => h.element === entry.target);
          if (heading) {
            setActiveLink(heading.link);
          }
        }
      });
    }, observerOptions);

    // 观察所有标题
    headings.forEach(h => observer.observe(h.element));

    // 设置活动链接
    function setActiveLink(activeLink) {
      if (activeHeading === activeLink) return;
      
      // 移除所有活动状态
      tocLinks.forEach(link => link.classList.remove('active'));
      
      // 添加活动状态
      activeLink.classList.add('active');
      activeHeading = activeLink;

      // 滚动目录使活动项可见
      scrollTocToActive(activeLink);
    }

    // 滚动目录使活动项可见
    function scrollTocToActive(link) {
      const tocRect = toc.getBoundingClientRect();
      const linkRect = link.getBoundingClientRect();

      if (linkRect.top < tocRect.top + 50) {
        toc.scrollTop -= tocRect.top - linkRect.top + 50;
      } else if (linkRect.bottom > tocRect.bottom - 50) {
        toc.scrollTop += linkRect.bottom - tocRect.bottom + 50;
      }
    }

    // 处理点击事件 - 平滑滚动
    tocLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('data-target');
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          const offset = 80; // 偏移量，避免被固定头部遮挡
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });

          // 更新 URL hash（不触发默认滚动）
          history.pushState(null, null, '#' + targetId);
        }
      });
    });

    // 初始高亮
    function updateActiveOnScroll() {
      const scrollPos = window.pageYOffset + 100;
      
      for (let i = headings.length - 1; i >= 0; i--) {
        const heading = headings[i];
        if (heading.element.offsetTop <= scrollPos) {
          setActiveLink(heading.link);
          break;
        }
      }
    }

    // 初始检查
    updateActiveOnScroll();

    // 滚动时更新（作为 Intersection Observer 的备用）
    let ticking = false;
    window.addEventListener('scroll', function() {
      if (!ticking) {
        window.requestAnimationFrame(function() {
          updateActiveOnScroll();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }
})();
```

- [ ] **Step 2: 添加 JS 引用到页面**

修改 `layouts/partials/extend_footer.html`，添加 JS 引用：

```html
{{- /* Live2D Widget - 可爱的美短猫 */ -}}
<script src="/live2d-widget/dist/autoload.js"></script>

{{- /* Right Side TOC */ -}}
<script src="/js/right-toc.js"></script>
```

- [ ] **Step 3: 验证 JS 语法**

检查 JavaScript 语法：
```bash
# 使用 Node.js 检查语法
node --check static/js/right-toc.js
```

Expected: 无语法错误

- [ ] **Step 4: Commit**

```bash
git add static/js/right-toc.js layouts/partials/extend_footer.html
git commit -m "feat: add right toc scroll spy and highlight functionality"
```

---

## Chunk 5: 测试和验证

### Task 5: 功能测试

**Files:**
- Test: 文章页面

- [ ] **Step 1: 启动开发服务器**

```bash
hugo server -D
```

- [ ] **Step 2: 测试目录生成**

访问一篇有多个标题的文章，检查：
- [ ] 右侧显示目录
- [ ] 目录包含所有 H2-H4 标题
- [ ] 层级缩进正确

- [ ] **Step 3: 测试点击跳转**

- [ ] 点击目录项平滑滚动到对应章节
- [ ] URL hash 正确更新
- [ ] 无 JavaScript 错误

- [ ] **Step 4: 测试滚动高亮**

- [ ] 滚动页面时当前章节高亮
- [ ] 高亮样式正确（左边框 + 加粗）
- [ ] 目录自动滚动使活动项可见

- [ ] **Step 5: 测试响应式**

- [ ] 桌面端 (>= 1200px): 显示右侧 TOC
- [ ] 平板端 (768px - 1199px): 隐藏右侧 TOC
- [ ] 移动端 (< 768px): 隐藏右侧 TOC

- [ ] **Step 6: 测试主题切换**

- [ ] 亮色主题样式正确
- [ ] 暗色主题样式正确
- [ ] 切换主题时无闪烁

- [ ] **Step 7: 测试无障碍**

- [ ] Tab 键可在目录项间导航
- [ ] 屏幕阅读器可识别目录

- [ ] **Step 8: Commit**

```bash
git commit -m "test: verify right side toc functionality"
```

---

## Chunk 6: 清理和优化

### Task 6: 清理和最终优化

**Files:**
- Modify: `layouts/_default/single.html.backup`

- [ ] **Step 1: 删除备份文件**

```bash
rm layouts/_default/single.html.backup
```

- [ ] **Step 2: 最终构建测试**

```bash
hugo --minify
```

Expected: 构建成功，无警告

- [ ] **Step 3: 最终 Commit**

```bash
git add -A
git commit -m "feat: implement right side table of contents navigation

- Add right_toc.html partial for generating TOC
- Modify single.html layout with post-wrapper grid
- Add right-toc.css with responsive styles
- Add right-toc.js with scroll spy and highlight
- Support H2-H4 heading levels
- Responsive: show on desktop (>=1200px), hide on mobile
- Theme-aware styling for light/dark modes"
```

---

## 验证清单

### 功能验证
- [ ] 目录正确生成所有 H2-H4 标题
- [ ] 点击目录项平滑滚动到对应章节
- [ ] 滚动时自动高亮当前章节
- [ ] 目录自动滚动使活动项可见

### 响应式验证
- [ ] 桌面端 (>= 1200px): 显示右侧 TOC
- [ ] 平板端 (< 1200px): 隐藏右侧 TOC
- [ ] 移动端: 隐藏右侧 TOC

### 兼容性验证
- [ ] Chrome/Edge 最新版
- [ ] Firefox 最新版
- [ ] Safari 最新版

### 主题验证
- [ ] 亮色主题样式正确
- [ ] 暗色主题样式正确

### 无障碍验证
- [ ] 键盘导航可用
- [ ] ARIA 标签正确

---

**计划完成，准备执行**
