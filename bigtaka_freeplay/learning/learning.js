/* =================================================================
   BIGTAKA LEARNING HUB — runtime
   - Loads articles.json
   - Picks "Today's 3" by published date (today first, else most-recent 3)
   - Renders archive grid with category filter + search + sort
   - Wires sticky CTA on mobile
   ================================================================= */

(function () {
  'use strict';

  const CAT_LABELS = {
    aviator: 'Aviator',
    slots: 'Slots',
    live: 'Live Casino',
    strategy: 'Strategy',
    cricket: 'Cricket',
    bonus: 'Bonuses',
    basics: 'Basics'
  };

  // Category → gradient for cards without a real poster image
  const CAT_GRADIENTS = {
    aviator:  'linear-gradient(135deg, #500ecf 0%, #89eb16 100%)',
    slots:    'linear-gradient(135deg, #ff1ed7 0%, #500ecf 100%)',
    live:     'linear-gradient(135deg, #500ecf 0%, #ff1ed7 60%, #FFD700 100%)',
    strategy: 'linear-gradient(135deg, #1a0c35 0%, #89eb16 100%)',
    cricket:  'linear-gradient(135deg, #89eb16 0%, #500ecf 100%)',
    bonus:    'linear-gradient(135deg, #FFD700 0%, #ff1ed7 100%)',
    basics:   'linear-gradient(135deg, #500ecf 0%, #1a0c35 100%)'
  };
  const CAT_EMOJI = {
    aviator: '✈️', slots: '🎰', live: '🎴', strategy: '🎯',
    cricket: '🏏', bonus: '🎁', basics: '📚'
  };

  let ARTICLES = [];
  let activeCat = 'all';
  let activeQuery = '';
  let activeSort = 'newest';

  // ============ DATE HELPERS ============
  function todayISO() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return y + '-' + m + '-' + day;
  }
  function formatDate(iso) {
    if (!iso) return '';
    const d = new Date(iso + 'T00:00:00');
    const opts = { day: 'numeric', month: 'short', year: 'numeric' };
    return d.toLocaleDateString('en-US', opts);
  }
  function relativeLabel(iso) {
    const todayStr = todayISO();
    if (iso === todayStr) return 'Today';
    const today = new Date(todayStr + 'T00:00:00');
    const then = new Date(iso + 'T00:00:00');
    const diff = Math.round((today - then) / (1000 * 60 * 60 * 24));
    if (diff === 1) return 'Yesterday';
    if (diff < 7) return diff + ' days ago';
    return formatDate(iso);
  }

  // ============ PICK TODAY'S 3 ============
  function pickTodaysThree(list) {
    const today = todayISO();
    const todayArticles = list.filter(a => a.published === today);
    if (todayArticles.length >= 3) {
      return todayArticles.slice(0, 3);
    }
    // Fallback: take today's articles + most recent until we have 3
    const sorted = list.slice().sort((a, b) => b.published.localeCompare(a.published));
    const seen = new Set(todayArticles.map(a => a.slug));
    const picks = todayArticles.slice();
    for (const a of sorted) {
      if (picks.length >= 3) break;
      if (!seen.has(a.slug)) {
        picks.push(a);
        seen.add(a.slug);
      }
    }
    return picks.slice(0, 3);
  }

  // ============ RENDER ============
  function articleUrl(slug) {
    return 'articles/' + slug + '.html';
  }

  function cardCover(a) {
    const langPill = a.bn ? '<span class="card-lang">EN · বাং</span>' : '';
    if (a.image) {
      return `<div class="card-cover" style="background-image:url('${a.image}')">${langPill}</div>`;
    }
    const grad = CAT_GRADIENTS[a.cat] || CAT_GRADIENTS.basics;
    const emoji = CAT_EMOJI[a.cat] || '📖';
    return `<div class="card-cover card-cover-placeholder" style="background:${grad}"><span class="cover-emoji">${emoji}</span>${langPill}</div>`;
  }

  function renderTodays() {
    const grid = document.getElementById('todays-grid');
    if (!grid) return;
    const picks = pickTodaysThree(ARTICLES);
    grid.innerHTML = picks.map((a, i) => `
      <a href="${articleUrl(a.slug)}" class="today-card${i === 0 ? ' feat' : ''}">
        ${cardCover(a)}
        <div class="today-card-body">
          <span class="today-badge">${a.published === todayISO() ? 'New Today' : 'Top Read'}</span>
          <span class="cat">${CAT_LABELS[a.cat] || a.cat}</span>
          <h3>${escapeHtml(a.title)}</h3>
          <p>${escapeHtml(a.excerpt)}</p>
          <div class="meta">
            <span><b>${a.readMin}</b> min read</span>
            <span>${relativeLabel(a.published)}</span>
          </div>
          <div class="read-arrow">Read article →</div>
        </div>
      </a>
    `).join('');
    const tdEl = document.getElementById('today-date');
    if (tdEl) tdEl.textContent = formatDate(todayISO());
  }

  function applyFilters() {
    let filtered = ARTICLES.slice();

    if (activeCat !== 'all') {
      filtered = filtered.filter(a => a.cat === activeCat);
    }
    if (activeQuery) {
      const q = activeQuery.toLowerCase();
      filtered = filtered.filter(a =>
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        (a.tags || []).some(t => t.toLowerCase().includes(q))
      );
    }
    if (activeSort === 'newest') {
      filtered.sort((a, b) => b.published.localeCompare(a.published));
    } else if (activeSort === 'oldest') {
      filtered.sort((a, b) => a.published.localeCompare(b.published));
    } else if (activeSort === 'reading') {
      filtered.sort((a, b) => a.readMin - b.readMin);
    }
    return filtered;
  }

  function renderArchive() {
    const grid = document.getElementById('archive-grid');
    const empty = document.getElementById('archive-empty');
    if (!grid) return;

    const list = applyFilters();
    if (list.length === 0) {
      grid.innerHTML = '';
      if (empty) empty.hidden = false;
      return;
    }
    if (empty) empty.hidden = true;

    grid.innerHTML = list.map(a => `
      <a href="${articleUrl(a.slug)}" class="archive-card" data-cat="${a.cat}">
        ${cardCover(a)}
        <div class="archive-card-body">
          <span class="cat">${CAT_LABELS[a.cat] || a.cat}</span>
          <h4>${escapeHtml(a.title)}</h4>
          <p>${escapeHtml(a.excerpt)}</p>
          <div class="meta">
            <span>${relativeLabel(a.published)} · ${a.readMin} min</span>
            <span class="read">Read →</span>
          </div>
        </div>
      </a>
    `).join('');
  }

  function renderCounts() {
    const all = ARTICLES.length;
    const byCat = {};
    ARTICLES.forEach(a => { byCat[a.cat] = (byCat[a.cat] || 0) + 1; });
    document.querySelectorAll('[data-count]').forEach(el => {
      const k = el.getAttribute('data-count');
      el.textContent = k === 'all' ? all : (byCat[k] || 0);
    });
    const statEl = document.getElementById('stat-articles');
    if (statEl) statEl.textContent = String(all);
  }

  // ============ EVENTS ============
  function bindEvents() {
    document.querySelectorAll('.cat-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('.cat-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        activeCat = chip.getAttribute('data-cat');
        renderArchive();
      });
    });

    const search = document.getElementById('search-input');
    if (search) {
      let debounce;
      search.addEventListener('input', () => {
        clearTimeout(debounce);
        debounce = setTimeout(() => {
          activeQuery = search.value.trim();
          renderArchive();
        }, 120);
      });
    }

    const sortSel = document.getElementById('sort-select');
    if (sortSel) {
      sortSel.addEventListener('change', () => {
        activeSort = sortSel.value;
        renderArchive();
      });
    }

    // Apply ?cat= URL param on load
    const params = new URLSearchParams(location.search);
    const urlCat = params.get('cat');
    if (urlCat) {
      const chip = document.querySelector('.cat-chip[data-cat="' + urlCat + '"]');
      if (chip) chip.click();
    }

    // Sticky mobile CTA after 30% scroll
    const sticky = document.getElementById('sticky-cta');
    if (sticky) {
      let shown = false;
      window.addEventListener('scroll', () => {
        const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight);
        if (!shown && pct > 0.15) {
          sticky.classList.add('visible');
          shown = true;
        } else if (shown && pct < 0.1) {
          sticky.classList.remove('visible');
          shown = false;
        }
      }, { passive: true });
    }
  }

  // ============ UTIL ============
  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // ============ INIT ============
  async function init() {
    try {
      const resp = await fetch('articles.json', { cache: 'no-store' });
      const data = await resp.json();
      ARTICLES = (data.articles || []).slice();
    } catch (e) {
      console.error('Could not load articles.json', e);
      ARTICLES = [];
    }
    renderCounts();
    renderTodays();
    renderArchive();
    bindEvents();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

/* =================================================================
   ARTICLE PAGE — reading progress + related articles loader
   ================================================================= */
(function () {
  'use strict';
  if (!document.body.classList.contains('article-page')) return;

  // Reading progress bar
  const bar = document.createElement('div');
  bar.className = 'read-progress';
  document.body.appendChild(bar);
  function updateProgress() {
    const max = document.body.scrollHeight - window.innerHeight;
    const pct = max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0;
    bar.style.width = pct + '%';
  }
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);
  updateProgress();

  // Related articles
  const relatedHost = document.getElementById('related-grid');
  if (relatedHost) {
    const currentSlug = document.body.getAttribute('data-slug');
    const currentCat = document.body.getAttribute('data-cat');
    fetch('../articles.json', { cache: 'no-store' })
      .then(r => r.json())
      .then(data => {
        const list = (data.articles || [])
          .filter(a => a.slug !== currentSlug)
          .map(a => ({
            ...a,
            score: (a.cat === currentCat ? 10 : 0) + Math.random()
          }))
          .sort((a, b) => b.score - a.score)
          .slice(0, 4);
        relatedHost.innerHTML = list.map(a => `
          <a href="${a.slug}.html" class="related-card">
            <span class="cat">${a.cat}</span>
            <h5>${a.title}</h5>
          </a>
        `).join('');
      })
      .catch(() => { relatedHost.parentElement.hidden = true; });
  }
})();
