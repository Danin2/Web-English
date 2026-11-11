/**
 * DASHBOARD.JS
 * Logika Home Dashboard: Animasi Counter Halus, Render Chart Bar, dan Aktivitas Terbaru
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    initCounters();
    initChartAnimation();
    populateRecentActivity();
  });

  // --- 1. Animasi Hitung Naik (Count-Up) Halus ---
  function initCounters() {
    const counterElements = document.querySelectorAll('[data-counter-target]');
    if (!counterElements.length) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseFloat(el.getAttribute('data-counter-target')) || 0;
          const suffix = el.getAttribute('data-counter-suffix') || '';
          const decimals = parseInt(el.getAttribute('data-counter-decimals') || '0', 10);

          if (prefersReducedMotion) {
            el.textContent = target.toFixed(decimals) + suffix;
          } else {
            animateValue(el, 0, target, 1400, decimals, suffix);
          }

          obs.unobserve(el);
        }
      });
    }, { threshold: 0.2 });

    counterElements.forEach(el => observer.observe(el));
  }

  function animateValue(obj, start, end, duration, decimals, suffix) {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Easing out cubic
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const current = start + (end - start) * easedProgress;

      obj.textContent = current.toFixed(decimals) + suffix;

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        obj.textContent = end.toFixed(decimals) + suffix;
      }
    };
    window.requestAnimationFrame(step);
  }

  // --- 2. Bar Chart Animation ---
  function initChartAnimation() {
    const bars = document.querySelectorAll('.bar-fill[data-fill-percent]');
    if (!bars.length) return;

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const percent = bar.getAttribute('data-fill-percent');
          bar.style.width = percent + '%';
          obs.unobserve(bar);
        }
      });
    }, { threshold: 0.3 });

    bars.forEach(bar => {
      bar.style.width = '0%';
      observer.observe(bar);
    });
  }

  // --- 3. Recent Activity Feed ---
  function populateRecentActivity() {
    const listContainer = document.getElementById('recent-activity-list');
    if (!listContainer) return;

    // Ambil data dari REVIEWS_DATA jika ada
    const reviews = (window.REVIEWS_DATA && window.REVIEWS_DATA.length)
      ? window.REVIEWS_DATA.slice(0, 3)
      : [];

    if (!reviews.length) return;

    const activityHTML = reviews.map(rev => `
      <li class="activity-item">
        <div style="flex: 1 1 auto;">
          <div class="flex items-center gap-2" style="margin-bottom: 2px;">
            <span class="badge badge--mustard">${rev.category}</span>
            <strong style="font-size: var(--text-sm); font-family: var(--font-display);">${window.escapeHtml(rev.name)}</strong>
            <span style="font-family: var(--font-mono); font-size: var(--text-xs); color: var(--ink-soft);">${rev.version}</span>
          </div>
          <p style="font-size: var(--text-xs); margin: 0; color: var(--ink-soft);">${window.escapeHtml(rev.verdict)}</p>
        </div>
        <div class="activity-date">${formatDate(rev.date)}</div>
      </li>
    `).join('');

    // Tambahkan 1 aktivitas artikel dokumentasi
    const docActivity = `
      <li class="activity-item">
        <div style="flex: 1 1 auto;">
          <div class="flex items-center gap-2" style="margin-bottom: 2px;">
            <span class="badge badge--sage">Dokumentasi</span>
            <strong style="font-size: var(--text-sm); font-family: var(--font-display);">Arsitektur Vanilla UI & Design Tokens</strong>
          </div>
          <p style="font-size: var(--text-xs); margin: 0; color: var(--ink-soft);">Panduan struktur CSS tanpa dependensi bundler atau framework eksternal.</p>
        </div>
        <div class="activity-date">02 Nov 2026</div>
      </li>
    `;

    listContainer.innerHTML = activityHTML + docActivity;
  }

  function formatDate(isoString) {
    if (!isoString) return '';
    const parts = isoString.split('-');
    if (parts.length !== 3) return isoString;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const monthIdx = parseInt(parts[1], 10) - 1;
    return `${parts[2]} ${months[monthIdx] || parts[1]} ${parts[0]}`;
  }
})();

