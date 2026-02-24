/* ============================================
   Gudfinnur Sveinsson — Site JS
   Dark mode toggle, reading progress, TOC
   ============================================ */

(function () {
  'use strict';

  // ===== Dark Mode Toggle =====
  (function initTheme() {
    const root = document.documentElement;
    const btn = document.getElementById('theme-toggle');
    const stored = localStorage.getItem('theme'); // 'light' | 'dark' | null

    // Apply stored preference immediately (prevents flash)
    function applyTheme(theme) {
      if (theme === 'dark') {
        root.setAttribute('data-theme', 'dark');
      } else if (theme === 'light') {
        root.setAttribute('data-theme', 'light');
      } else {
        // Auto — let prefers-color-scheme handle it
        root.setAttribute('data-theme', 'auto');
      }
    }

    applyTheme(stored);

    if (btn) {
      btn.addEventListener('click', function () {
        const current = root.getAttribute('data-theme');
        let next;
        if (current === 'dark') {
          next = 'light';
        } else {
          // 'light' or 'auto'
          next = 'dark';
        }
        localStorage.setItem('theme', next);
        applyTheme(next);
      });
    }
  })();

  // ===== Reading Progress Bar =====
  (function initProgress() {
    const bar = document.getElementById('reading-progress');
    if (!bar) return;

    // Only show on article pages
    const article = document.querySelector('.article-body');
    if (!article) {
      bar.style.display = 'none';
      return;
    }

    function updateProgress() {
      const articleTop = article.getBoundingClientRect().top + window.scrollY;
      const articleBottom = article.getBoundingClientRect().bottom + window.scrollY;
      const windowHeight = window.innerHeight;
      const scrolled = window.scrollY;

      const start = articleTop - windowHeight * 0.5;
      const end = articleBottom - windowHeight * 0.5;
      const total = end - start;
      const progress = Math.min(Math.max((scrolled - start) / total, 0), 1);

      bar.style.width = (progress * 100) + '%';
    }

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  })();

  // ===== TOC Scroll Highlighting =====
  (function initTOC() {
    const toc = document.getElementById('toc-sidebar');
    if (!toc) return;

    const tocLinks = toc.querySelectorAll('#TableOfContents a');
    if (!tocLinks.length) return;

    const headings = [];
    tocLinks.forEach(function (link) {
      const id = link.getAttribute('href').replace('#', '');
      const el = document.getElementById(id);
      if (el) headings.push({ el, link });
    });

    let ticking = false;

    function highlightTOC() {
      const scrollY = window.scrollY;
      const offset = 100; // pixels from top to consider "active"

      let current = null;
      for (let i = 0; i < headings.length; i++) {
        const { el } = headings[i];
        if (el.getBoundingClientRect().top + scrollY - offset <= scrollY) {
          current = headings[i];
        }
      }

      tocLinks.forEach(function (l) { l.classList.remove('toc-active'); });
      if (current) {
        current.link.classList.add('toc-active');
      }

      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(highlightTOC);
        ticking = true;
      }
    }, { passive: true });

    highlightTOC();
  })();

})();
