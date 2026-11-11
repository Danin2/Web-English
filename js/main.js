/**
 * MAIN.JS
 * Inisialisasi Global, Tema Gelap/Terang (LocalStorage), Mobile Nav Drawer, dan Toast Helper
 */

(function () {
  'use strict';

  // --- 1. Manajer Tema (Dark / Light Mode) ---
  const THEME_KEY = 'neo_brutalism_theme';

  function getPreferredTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    localStorage.setItem(THEME_KEY, theme);
  }

  // Terapkan tema sedini mungkin
  applyTheme(getPreferredTheme());

  document.addEventListener('DOMContentLoaded', () => {
    // Tombol Toggle Tema
    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
      });
    }

    // --- 2. Mobile Navigation Drawer ---
    const mobileToggle = document.getElementById('mobile-nav-toggle');
    const mobileDrawer = document.getElementById('mobile-drawer');

    if (mobileToggle && mobileDrawer) {
      mobileToggle.addEventListener('click', () => {
        const isOpen = mobileDrawer.classList.toggle('is-open');
        mobileToggle.setAttribute('aria-expanded', String(isOpen));
      });

      // Tutup drawer saat link di-klik
      mobileDrawer.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
          mobileDrawer.classList.remove('is-open');
          mobileToggle.setAttribute('aria-expanded', 'false');
        });
      });

      // Tutup drawer saat klik di luar
      document.addEventListener('click', (e) => {
        if (!mobileDrawer.contains(e.target) && !mobileToggle.contains(e.target)) {
          mobileDrawer.classList.remove('is-open');
          mobileToggle.setAttribute('aria-expanded', 'false');
        }
      });
    }

    // --- 3. Highlight Navigasi Aktif ---
    highlightActiveNavLink();
  });

  function highlightActiveNavLink() {
    const sections = document.querySelectorAll('section[id], header[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    if (sections.length > 1) {
      // Single Page Scroll Spy
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            navLinks.forEach(link => {
              const href = link.getAttribute('href');
              if (href === `#${id}`) {
                link.classList.add('is-active');
              } else if (href && href.startsWith('#')) {
                link.classList.remove('is-active');
              }
            });
          }
        });
      }, { rootMargin: '-20% 0px -70% 0px' });

      sections.forEach(s => observer.observe(s));
      return;
    }

    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (!href) return;
      const linkFile = href.split('/').pop();
      if (linkFile === currentPath || (currentPath === '' && linkFile === 'index.html')) {
        link.classList.add('is-active');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('is-active');
        link.removeAttribute('aria-current');
      }
    });
  }

  // --- 4. Toast Notification Utility ---
  function showToast({ title, message, type = 'info', duration = 4000 }) {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      container.setAttribute('aria-live', 'polite');
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.setAttribute('role', 'alert');

    const iconMap = {
      success: `<svg class="icon icon--sm" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>`,
      danger: `<svg class="icon icon--sm" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
      warning: `<svg class="icon icon--sm" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
      info: `<svg class="icon icon--sm" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`
    };

    toast.innerHTML = `
      <div class="toast__icon">${iconMap[type] || iconMap.info}</div>
      <div class="toast__content">
        <div class="toast__title">${escapeHtml(title)}</div>
        <div class="toast__message">${escapeHtml(message)}</div>
      </div>
      <button class="toast__close" aria-label="Close notification">
        <svg class="icon icon--sm" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    `;

    const closeBtn = toast.querySelector('.toast__close');
    const dismiss = () => {
      toast.classList.add('is-hiding');
      setTimeout(() => toast.remove(), 220);
    };

    closeBtn.addEventListener('click', dismiss);
    if (duration > 0) {
      setTimeout(dismiss, duration);
    }

    container.appendChild(toast);
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Expose ke global window
  window.showToast = showToast;
  window.escapeHtml = escapeHtml;
})();

// ── Scroll-reveal (IntersectionObserver) ────────────────────
(function () {
  'use strict';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) return; // CSS already handles opacity:1; nothing more to do

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('anim-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  function observeAll() {
    document.querySelectorAll('.anim-ready:not(.anim-visible)').forEach(el => observer.observe(el));
  }

  // Initial pass after DOM ready
  document.addEventListener('DOMContentLoaded', observeAll);

  // Re-observe after reviews are rendered (they're injected by reviews.js)
  window.onReviewsRendered = observeAll;
})();


