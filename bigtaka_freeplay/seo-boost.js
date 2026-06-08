/* BIGTAKA FREE-PLAY — SEO boost / conversion triggers
 * Adds three signup-conversion nudges on top of the existing flow:
 *   1) Sticky bottom "Sign Up · Welcome Pack" pill on game pages after 5 spins
 *   2) Desktop exit-intent — fires Signup the first time the cursor
 *      leaves the viewport via the top edge
 *   3) Mobile idle — after 90s of no interaction on a game page, fires
 *      the non-blocking RegisterPrompt once per session
 * Each trigger fires at most once per session (sessionStorage flag).
 */

(function () {
  if (typeof window === 'undefined') return;
  const KEY_EXIT = 'bt_seo_exit_fired_v1';
  const KEY_IDLE = 'bt_seo_idle_fired_v1';
  const KEY_PILL = 'bt_seo_pill_dismissed_v1';

  function openSignup() {
    try {
      if (window.Signup && typeof Signup.open === 'function') Signup.open();
      else if (typeof window.openSignup === 'function') window.openSignup();
    } catch (e) {}
  }
  function fireRegisterPrompt() {
    try { if (window.RegisterPrompt && typeof RegisterPrompt.trigger === 'function') { RegisterPrompt._lastShownAt = 0; RegisterPrompt.trigger(); } } catch (e) {}
  }

  // ============ 1) Sticky signup pill on game pages after 5 spins ============
  function maybeAddPill() {
    if (sessionStorage.getItem(KEY_PILL) === '1') return;
    const isGame = location.pathname.includes('/games/');
    if (!isGame) return;
    // Wait until the user has interacted with the game
    let spins = 0;
    function onClick(e) {
      const btn = e.target.closest('#spin-btn, [data-bet], .mw-bet-btn, .ct-bet-btn, .dc-bet-btn, .cl-bet-btn, .ft-bet-btn, .ml-bet-btn, #drop-btn, #roll-btn, #shoot-btn, #deal-btn, #hit-btn');
      if (!btn) return;
      spins++;
      if (spins >= 5) {
        document.removeEventListener('click', onClick, true);
        showPill();
      }
    }
    document.addEventListener('click', onClick, true);
  }

  function showPill() {
    if (document.getElementById('seo-pill')) return;
    const pill = document.createElement('div');
    pill.id = 'seo-pill';
    pill.innerHTML = `
      <button class="seo-pill-close" aria-label="Dismiss">✕</button>
      <span class="seo-pill-emoji">🎁</span>
      <span class="seo-pill-text">
        <strong>Get the VIP Welcome Pack</strong>
        <small>Sign up · Bangladesh only · auto-credited</small>
      </span>
      <button class="seo-pill-cta">Sign Up</button>
    `;
    document.body.appendChild(pill);
    pill.querySelector('.seo-pill-cta').addEventListener('click', () => {
      openSignup();
      sessionStorage.setItem(KEY_PILL, '1');
      pill.remove();
    });
    pill.querySelector('.seo-pill-close').addEventListener('click', () => {
      sessionStorage.setItem(KEY_PILL, '1');
      pill.remove();
    });
  }

  // ============ 2) Desktop exit-intent ============
  function attachExitIntent() {
    if (sessionStorage.getItem(KEY_EXIT) === '1') return;
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return; // mobile skip
    function onLeave(e) {
      if (sessionStorage.getItem(KEY_EXIT) === '1') return;
      // Only trigger when cursor exits via the top edge of the viewport
      if (e.clientY <= 0 && (!e.relatedTarget || e.relatedTarget.nodeName === 'HTML')) {
        sessionStorage.setItem(KEY_EXIT, '1');
        openSignup();
      }
    }
    document.addEventListener('mouseout', onLeave);
  }

  // ============ 3) Mobile 90s idle on a game page ============
  function attachIdleTrigger() {
    if (sessionStorage.getItem(KEY_IDLE) === '1') return;
    const isMobile = (window.innerWidth || 9999) <= 820 || ('ontouchstart' in window);
    if (!isMobile) return;
    const isGame = location.pathname.includes('/games/');
    if (!isGame) return;
    let idleTimer;
    function reset() {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        if (sessionStorage.getItem(KEY_IDLE) === '1') return;
        sessionStorage.setItem(KEY_IDLE, '1');
        fireRegisterPrompt();
      }, 90000);
    }
    ['touchstart', 'click', 'scroll', 'keydown'].forEach(ev => document.addEventListener(ev, reset, { passive: true }));
    reset();
  }

  // ============ Inject pill styles ============
  function injectStyles() {
    if (document.getElementById('seo-boost-styles')) return;
    const s = document.createElement('style');
    s.id = 'seo-boost-styles';
    s.textContent = `
      #seo-pill {
        position: fixed;
        left: 50%;
        bottom: calc(86px + env(safe-area-inset-bottom));
        transform: translateX(-50%);
        z-index: 8800;
        display: inline-flex;
        align-items: center;
        gap: 10px;
        max-width: calc(100vw - 24px);
        padding: 10px 12px 10px 14px;
        background: linear-gradient(135deg, #ffd700, #ff8a00);
        color: #1a0c35;
        border-radius: 999px;
        box-shadow: 0 12px 30px rgba(255, 138, 0, 0.5), 0 0 24px rgba(255, 215, 0, 0.3);
        font-weight: 800;
        animation: seoPillIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
      }
      @keyframes seoPillIn {
        from { opacity: 0; transform: translate(-50%, 30px); }
        to   { opacity: 1; transform: translate(-50%, 0); }
      }
      #seo-pill .seo-pill-emoji { font-size: 22px; line-height: 1; flex-shrink: 0; }
      #seo-pill .seo-pill-text { display: flex; flex-direction: column; gap: 1px; min-width: 0; }
      #seo-pill .seo-pill-text strong { font-size: 13px; font-weight: 900; line-height: 1.1; }
      #seo-pill .seo-pill-text small { font-size: 10px; opacity: 0.75; font-weight: 600; line-height: 1.2; }
      #seo-pill .seo-pill-cta {
        background: rgba(0, 0, 0, 0.85);
        color: #ffd700;
        border: 0;
        padding: 10px 14px;
        border-radius: 999px;
        font-weight: 900;
        font-size: 12px;
        white-space: nowrap;
        margin-left: 4px;
        cursor: pointer;
      }
      #seo-pill .seo-pill-cta:hover { background: #000; }
      #seo-pill .seo-pill-close {
        position: absolute;
        top: -8px;
        right: -6px;
        width: 22px;
        height: 22px;
        border-radius: 50%;
        background: #1a0c35;
        color: #fff;
        border: 0;
        font-size: 11px;
        font-weight: 800;
        cursor: pointer;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
      }
      @media (min-width: 720px) {
        #seo-pill { bottom: 20px; padding: 12px 14px 12px 16px; }
        #seo-pill .seo-pill-emoji { font-size: 26px; }
        #seo-pill .seo-pill-text strong { font-size: 14px; }
        #seo-pill .seo-pill-text small { font-size: 11px; }
        #seo-pill .seo-pill-cta { padding: 11px 16px; font-size: 13px; }
      }
    `;
    document.head.appendChild(s);
  }

  // ============ Boot ============
  function boot() {
    injectStyles();
    maybeAddPill();
    attachExitIntent();
    attachIdleTrigger();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
