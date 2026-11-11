/**
 * DOCS.JS
 * Logika Dokumentasi: TOC Generator & Scroll Spy, Copy Code Block, Kalkulasi Waktu Baca, & Doc Search
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    initReadingTime();
    initCopyCodeButtons();
    initTocScrollSpy();
    initDocFilter();
    initMobileDocsDrawer();
  });

  // --- 1. Kalkulasi Waktu Baca (Reading Time) ---
  function initReadingTime() {
    const article = document.querySelector('.docs-content');
    const badge = document.getElementById('reading-time-badge');
    if (!article || !badge) return;

    const text = article.innerText || '';
    const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
    const wordsPerMinute = 200;
    const minutes = Math.max(1, Math.ceil(wordCount / wordsPerMinute));

    badge.textContent = `${minutes} mnt baca (${wordCount} kata)`;
  }

  // --- 2. Tombol Salin Kode (Copy Code) ---
  function initCopyCodeButtons() {
    const copyButtons = document.querySelectorAll('.code-block__copy');

    copyButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const pre = btn.closest('.code-block').querySelector('pre');
        if (!pre) return;

        const codeText = pre.innerText;

        navigator.clipboard.writeText(codeText).then(() => {
          const originalText = btn.innerHTML;
          btn.innerHTML = `
            <svg class="icon icon--sm" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
            <span>Tersalin!</span>
          `;
          btn.style.backgroundColor = 'var(--status-success)';
          btn.style.color = '#1B1A22';

          if (window.showToast) {
            window.showToast({
              title: 'Kode Disalin',
              message: 'Snippet kode berhasil disalin ke clipboard Anda.',
              type: 'success',
              duration: 2500
            });
          }

          setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.backgroundColor = '';
            btn.style.color = '';
          }, 2000);
        }).catch(err => {
          console.error('Gagal menyalin kode:', err);
          if (window.showToast) {
            window.showToast({
              title: 'Gagal Menyalin',
              message: 'Izin clipboard ditolak oleh peramban.',
              type: 'danger'
            });
          }
        });
      });
    });
  }

  // --- 3. Table of Contents & IntersectionObserver Spy ---
  function initTocScrollSpy() {
    const content = document.querySelector('.docs-content');
    const tocContainer = document.getElementById('docs-toc-list');
    if (!content || !tocContainer) return;

    const headings = content.querySelectorAll('h2[id], h3[id]');
    if (!headings.length) return;

    // Bersihkan dan generate list TOC dinamis
    tocContainer.innerHTML = '';
    headings.forEach(heading => {
      const li = document.createElement('li');
      const isSub = heading.tagName.toLowerCase() === 'h3';
      li.style.paddingLeft = isSub ? 'var(--space-3)' : '0';

      const a = document.createElement('a');
      a.className = 'docs-toc__link';
      a.href = `#${heading.id}`;
      a.textContent = heading.textContent.replace(/^[#0-9.\s]+/, ''); // buang penomoran jika ada
      li.appendChild(a);
      tocContainer.appendChild(li);
    });

    const tocLinks = tocContainer.querySelectorAll('.docs-toc__link');

    // Observer untuk mendeteksi heading yang sedang aktif
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          tocLinks.forEach(link => {
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('is-active');
            } else {
              link.classList.remove('is-active');
            }
          });
        }
      });
    }, {
      rootMargin: '0px 0px -70% 0px',
      threshold: 0
    });

    headings.forEach(heading => observer.observe(heading));
  }

  // --- 4. Pencarian / Filter Dokumen Cepat ---
  function initDocFilter() {
    const searchInput = document.getElementById('docs-quick-search');
    const navLinks = document.querySelectorAll('.docs-nav-link');
    if (!searchInput || !navLinks.length) return;

    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();

      navLinks.forEach(link => {
        const text = link.textContent.toLowerCase();
        const parentLi = link.parentElement;
        if (!query || text.includes(query)) {
          parentLi.style.display = '';
        } else {
          parentLi.style.display = 'none';
        }
      });
    });
  }

  // --- 5. Mobile Docs Navigation Drawer ---
  function initMobileDocsDrawer() {
    const toggleBtn = document.getElementById('mobile-docs-toggle');
    const sidebar = document.getElementById('docs-sidebar');
    if (!toggleBtn || !sidebar) return;

    toggleBtn.addEventListener('click', () => {
      const isOpen = sidebar.classList.toggle('is-open');
      toggleBtn.setAttribute('aria-expanded', String(isOpen));
      toggleBtn.textContent = isOpen ? '✕ Tutup Daftar Isi Dokumen' : '☰ Buka Menu Dokumen';
    });
  }
})();

