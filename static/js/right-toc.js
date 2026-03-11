(function() {
  'use strict';

  // 等待 DOM 加载完成
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initRightToc);
  } else {
    initRightToc();
  }

  function initRightToc() {
    const tocContainer = document.querySelector('.right-toc-container');
    if (!tocContainer) return;

    const toc = tocContainer.querySelector('.right-toc');
    const tocLinks = toc.querySelectorAll('a[href^="#"]');
    if (tocLinks.length === 0) return;

    // 获取原始内联目录元素
    const inlineToc = document.querySelector('article .toc');
    
    // 控制右侧目录显示/隐藏
    function updateTocVisibility() {
      if (!inlineToc) {
        // 如果没有内联目录，始终显示右侧目录
        tocContainer.style.opacity = '1';
        tocContainer.style.visibility = 'visible';
        return;
      }

      const inlineTocRect = inlineToc.getBoundingClientRect();
      const inlineTocBottom = inlineTocRect.bottom;
      
      // 当内联目录完全滚出视口时，显示右侧目录
      if (inlineTocBottom < 0) {
        tocContainer.style.opacity = '1';
        tocContainer.style.visibility = 'visible';
      } else {
        tocContainer.style.opacity = '0';
        tocContainer.style.visibility = 'hidden';
      }
    }

    // 初始化状态
    tocContainer.style.transition = 'opacity 0.3s ease, visibility 0.3s ease';
    updateTocVisibility();

    // 滚动时更新可见性
    let ticking = false;
    window.addEventListener('scroll', function() {
      if (!ticking) {
        window.requestAnimationFrame(function() {
          updateTocVisibility();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    // 获取所有标题元素
    const headings = [];
    tocLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        const targetId = href.substring(1);
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

    let activeLink = null;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
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
    function setActiveLink(link) {
      if (activeLink === link) return;
      
      // 移除所有活动状态
      tocLinks.forEach(l => l.classList.remove('active'));
      
      // 添加活动状态
      link.classList.add('active');
      activeLink = link;

      // 滚动目录使活动项可见
      scrollTocToActive(link);
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
        e.stopPropagation();
        e.stopImmediatePropagation();
        const href = this.getAttribute('href');
        if (!href || !href.startsWith('#')) return;
        
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          const offset = 80;
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });

          // 更新 URL hash，但不添加历史记录条目
          history.replaceState(null, null, href);
        }
      });
    });

    // 备用：滚动时更新高亮
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

    // 滚动时更新（备用方案）
    let highlightTicking = false;
    window.addEventListener('scroll', function() {
      if (!highlightTicking) {
        window.requestAnimationFrame(function() {
          updateActiveOnScroll();
          highlightTicking = false;
        });
        highlightTicking = true;
      }
    }, { passive: true });
  }
})();
