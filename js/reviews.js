/**
 * REVIEWS.JS
 * Logika Halaman Software Review: Real-time Search, Category Filter, Sorting, Render Grid, & Accessible Detail Modal
 */

(function () {
  'use strict';

  let reviews = [];
  let currentCategory = 'all';
  let searchQuery = '';
  let currentSort = 'rating-desc';
  const BOOKMARKS_KEY = 'user_bookmarked_reviews';

  function getBookmarks() {
    try {
      return JSON.parse(localStorage.getItem(BOOKMARKS_KEY)) || [];
    } catch (e) {
      return [];
    }
  }

  function toggleBookmark(id) {
    let bm = getBookmarks();
    let isAdded = false;
    if (bm.includes(id)) {
      bm = bm.filter(x => x !== id);
    } else {
      bm.push(id);
      isAdded = true;
    }
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bm));
    updateBookmarkCount();
    return isAdded;
  }

  function updateBookmarkCount() {
    const el = document.getElementById('bookmark-count');
    if (el) el.textContent = getBookmarks().length;
  }

  document.addEventListener('DOMContentLoaded', () => {
    initReviewsData();
    setupEventListeners();
    updateBookmarkCount();
  });

  function initReviewsData() {
    if (window.REVIEWS_DATA && Array.isArray(window.REVIEWS_DATA)) {
      reviews = [...window.REVIEWS_DATA];
      renderReviews();
    } else {
      // Fallback jika dimuat via HTTP server
      fetch('data/reviews.json')
        .then(res => res.json())
        .then(data => {
          reviews = data;
          renderReviews();
        })
        .catch(err => {
          console.error('Gagal memuat reviews.json:', err);
          const grid = document.getElementById('reviews-grid');
          if (grid) {
            grid.innerHTML = `
              <div class="empty-state">
                <h3>Gagal memuat ulasan</h3>
                <p>Silakan pastikan file data/reviews.js atau data/reviews.json tersedia.</p>
              </div>
            `;
          }
        });
    }
  }

  function setupEventListeners() {
    // 1. Search Input
    const searchInput = document.getElementById('review-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase().trim();
        renderReviews();
      });
    }

    // 2. Category Filter Buttons
    const categoryButtons = document.querySelectorAll('[data-category-btn]');
    categoryButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        categoryButtons.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        currentCategory = btn.getAttribute('data-category-btn');
        renderReviews();
      });
    });

    // 3. Sort Select
    const sortSelect = document.getElementById('review-sort');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        currentSort = e.target.value;
        renderReviews();
      });
    }

    // 4. Delegasi Event untuk Tombol Buka Modal
    const grid = document.getElementById('reviews-grid');
    if (grid) {
      grid.addEventListener('click', (e) => {
        const detailBtn = e.target.closest('[data-review-id]');
        if (detailBtn) {
          const id = detailBtn.getAttribute('data-review-id');
          openReviewModal(id);
        }
      });
    }

    // 5. Modal Close Listeners
    const modalBackdrop = document.getElementById('review-modal-backdrop');
    const modalCloseBtn = document.getElementById('modal-close-btn');

    if (modalBackdrop) {
      modalBackdrop.addEventListener('click', (e) => {
        if (e.target === modalBackdrop) {
          closeReviewModal();
        }
      });
    }

    if (modalCloseBtn) {
      modalCloseBtn.addEventListener('click', closeReviewModal);
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeReviewModal();
      }
    });
  }

  function getFilteredAndSortedReviews() {
    let result = reviews.filter(rev => {
      // Filter Kategori
      const matchCat = currentCategory === 'all' || rev.category.toLowerCase() === currentCategory.toLowerCase();

      // Search Query
      const matchSearch = !searchQuery ||
        rev.name.toLowerCase().includes(searchQuery) ||
        rev.summary.toLowerCase().includes(searchQuery) ||
        rev.verdict.toLowerCase().includes(searchQuery) ||
        rev.category.toLowerCase().includes(searchQuery);

      return matchCat && matchSearch;
    });

    // Sorting
    result.sort((a, b) => {
      if (currentSort === 'rating-desc') {
        return b.rating - a.rating;
      } else if (currentSort === 'newest') {
        return new Date(b.date) - new Date(a.date);
      } else if (currentSort === 'name-asc') {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });

    return result;
  }

  function renderReviews() {
    const grid = document.getElementById('reviews-grid');
    const countBadge = document.getElementById('reviews-count');
    if (!grid) return;

    const filtered = getFilteredAndSortedReviews();

    if (countBadge) {
      countBadge.textContent = `${filtered.length} Perangkat Lunak`;
    }

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="empty-state">
          <div style="margin-bottom: var(--space-3); font-size: 2rem;">🔍</div>
          <h3>Tidak ada ulasan yang cocok</h3>
          <p>Coba kata kunci lain atau ubah filter kategori di atas.</p>
          <button class="btn btn--outline btn--sm" id="reset-filter-btn" style="margin-top: var(--space-4);">
            Reset Filter
          </button>
        </div>
      `;

      const resetBtn = document.getElementById('reset-filter-btn');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          const searchInput = document.getElementById('review-search');
          if (searchInput) searchInput.value = '';
          searchQuery = '';
          currentCategory = 'all';

          document.querySelectorAll('[data-category-btn]').forEach(b => {
            b.classList.toggle('is-active', b.getAttribute('data-category-btn') === 'all');
          });

          renderReviews();
        });
      }
      return;
    }

    // Tampilkan hanya 3 ulasan utama
    const displayed = filtered.slice(0, 3);

    grid.innerHTML = displayed.map(rev => `
      <article class="card review-card anim-ready">
        <div class="review-card__header">
          <div>
            <span class="badge badge--neutral" style="margin-bottom: var(--space-1);">${escapeHtml(rev.category)}</span>
            <h3 class="review-card__name">${escapeHtml(rev.name)}</h3>
            <span style="font-family: var(--font-mono); font-size: var(--text-xs); color: var(--ink-soft);">${escapeHtml(rev.version)}</span>
          </div>
          <div class="review-card__score" title="Skor Rating Keseluruhan">
            ${rev.rating.toFixed(1)} / 5.0
          </div>
        </div>

        <div class="review-card__rating-box">
          <div class="rating-stars" aria-label="Rating ${rev.rating} dari 5">
            ${renderStars(rev.rating)}
          </div>
          <span style="font-size: var(--text-xs); color: var(--ink-soft); font-family: var(--font-mono);">
            (${rev.scores.overall}/100)
          </span>
        </div>

        <p style="font-size: var(--text-sm); margin-bottom: var(--space-3);">${escapeHtml(rev.tagline)}</p>

        <div class="review-card__verdict">
          <strong>Verdict:</strong> "${escapeHtml(rev.verdict)}"
        </div>

        <div class="review-card__pros-cons">
          <div class="pro-item">✓ ${escapeHtml(rev.pros[0])}</div>
          <div class="con-item">✕ ${escapeHtml(rev.cons[0])}</div>
        </div>

        <div class="card__footer" style="margin-top: auto;">
          <span style="font-size: var(--text-xs); color: var(--ink-soft); font-family: var(--font-mono);">
            Updated: ${formatDate(rev.date)}
          </span>
          <button class="btn btn--sm btn--primary" data-review-id="${rev.id}" aria-label="View full review of ${escapeHtml(rev.name)}">
            Review Details
          </button>
        </div>
      </article>
    `).join('');

    // Notify scroll-reveal observer to pick up newly injected cards
    if (typeof window.onReviewsRendered === 'function') {
      window.onReviewsRendered();
    }
  }

  function renderStars(rating) {
    const fullStars = Math.floor(rating);
    let starsHtml = '';

    for (let i = 1; i <= 5; i++) {
      const isFilled = i <= fullStars;
      starsHtml += `
        <svg class="star-icon ${isFilled ? 'is-filled' : ''}" viewBox="0 0 24 24">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      `;
    }
    return starsHtml;
  }

  function openReviewModal(id) {
    const rev = reviews.find(r => r.id === id);
    if (!rev) return;

    const modalBackdrop = document.getElementById('review-modal-backdrop');
    const modalContent = document.getElementById('modal-review-content');
    if (!modalBackdrop || !modalContent) return;

    modalContent.innerHTML = `
      <div style="margin-bottom: var(--space-4);">
        <div class="flex items-center justify-between" style="flex-wrap: wrap; gap: var(--space-2); margin-bottom: var(--space-2);">
          <span class="badge badge--mustard">${escapeHtml(rev.category)}</span>
          <span style="font-family: var(--font-mono); font-size: var(--text-xs); color: var(--ink-soft); font-weight: 700;">
            Version ${escapeHtml(rev.version)} • Tested ${formatDate(rev.date)}
          </span>
        </div>
        <h2 style="font-size: var(--text-2xl); margin-bottom: var(--space-1);">${escapeHtml(rev.name)}</h2>
        <p style="font-size: var(--text-base); color: var(--ink); font-weight: 600;">${escapeHtml(rev.tagline)}</p>
      </div>

      <div class="callout callout--tip" style="margin: var(--space-4) 0;">
        <div class="callout__content">
          <strong>Senior Engineer Verdict:</strong>
          <p style="margin-top: 4px;">${escapeHtml(rev.verdict)}</p>
        </div>
      </div>

      <div style="margin-bottom: var(--space-6);">
        <h4 style="margin-bottom: var(--space-2); font-size: var(--text-base);">Summary & Benchmark Findings</h4>
        <p style="font-size: var(--text-sm); line-height: 1.6;">${escapeHtml(rev.summary)}</p>
      </div>

      <!-- Score Breakdown -->
      <div style="margin-bottom: var(--space-6);">
        <h4 style="margin-bottom: var(--space-3); font-size: var(--text-base);">Performance Benchmark Scores (0 - 100)</h4>
        <div class="bar-chart">
          <div class="bar-item">
            <div class="bar-label-group">
              <span>UI/UX & Design Polish</span>
              <span>${rev.scores.ux} / 100</span>
            </div>
            <div class="bar-track">
              <div class="bar-fill bar-fill--peach" style="width: ${rev.scores.ux}%;"></div>
            </div>
          </div>
          <div class="bar-item">
            <div class="bar-label-group">
              <span>Speed & Memory Efficiency</span>
              <span>${rev.scores.performance} / 100</span>
            </div>
            <div class="bar-track">
              <div class="bar-fill bar-fill--sage" style="width: ${rev.scores.performance}%;"></div>
            </div>
          </div>
          <div class="bar-item">
            <div class="bar-label-group">
              <span>Value for Money</span>
              <span>${rev.scores.value} / 100</span>
            </div>
            <div class="bar-track">
              <div class="bar-fill bar-fill--mustard" style="width: ${rev.scores.value}%;"></div>
            </div>
          </div>
          <div class="bar-item">
            <div class="bar-label-group">
              <span>Extensibility & Ecosystem</span>
              <span>${rev.scores.extensibility} / 100</span>
            </div>
            <div class="bar-track">
              <div class="bar-fill bar-fill--blue" style="width: ${rev.scores.extensibility}%;"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pros and Cons -->
      <div style="display: grid; grid-template-columns: 1fr; gap: var(--space-4); margin-bottom: var(--space-6);">
        <div style="background-color: var(--surface-alt); border: var(--border); border-radius: var(--radius-sm); padding: var(--space-4);">
          <strong style="color: #2E6B38; display: block; margin-bottom: var(--space-2); font-family: var(--font-display);">
            ✓ Key Advantages
          </strong>
          <ul style="padding-left: var(--space-4); font-size: var(--text-xs); display: flex; flex-direction: column; gap: 4px;">
            ${rev.pros.map(p => `<li>${escapeHtml(p)}</li>`).join('')}
          </ul>
        </div>
        <div style="background-color: var(--surface-alt); border: var(--border); border-radius: var(--radius-sm); padding: var(--space-4);">
          <strong style="color: #A63828; display: block; margin-bottom: var(--space-2); font-family: var(--font-display);">
            ✕ Drawbacks & Caveats
          </strong>
          <ul style="padding-left: var(--space-4); font-size: var(--text-xs); display: flex; flex-direction: column; gap: 4px;">
            ${rev.cons.map(c => `<li>${escapeHtml(c)}</li>`).join('')}
          </ul>
        </div>
      </div>

      <!-- Technical Specs -->
      <div style="background-color: var(--surface); border: var(--border); border-radius: var(--radius-sm); padding: var(--space-4);">
        <h4 style="margin-bottom: var(--space-2); font-size: var(--text-sm);">Technical Specifications</h4>
        <div style="font-family: var(--font-mono); font-size: var(--text-xs); display: grid; grid-template-columns: 140px 1fr; gap: 6px;">
          <span style="color: var(--ink-soft);">Platform:</span>
          <span>${escapeHtml(rev.specs.platform)}</span>
          <span style="color: var(--ink-soft);">License:</span>
          <span>${escapeHtml(rev.specs.license)}</span>
          <span style="color: var(--ink-soft);">Tech Stack:</span>
          <span>${escapeHtml(rev.specs.techStack)}</span>
          <span style="color: var(--ink-soft);">Developer:</span>
          <span>${escapeHtml(rev.specs.author)}</span>
        </div>
      </div>
    `;

    modalBackdrop.classList.add('is-open');
    modalBackdrop.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Focus close button
    const closeBtn = document.getElementById('modal-close-btn');
    if (closeBtn) closeBtn.focus();
  }

  function closeReviewModal() {
    const modalBackdrop = document.getElementById('review-modal-backdrop');
    if (!modalBackdrop) return;

    modalBackdrop.classList.remove('is-open');
    modalBackdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function formatDate(isoString) {
    if (!isoString) return '';
    const parts = isoString.split('-');
    if (parts.length !== 3) return isoString;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthIdx = parseInt(parts[1], 10) - 1;
    return `${months[monthIdx] || parts[1]} ${parts[2]}, ${parts[0]}`;
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
})();

