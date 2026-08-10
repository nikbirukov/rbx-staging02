/* RegBox — "The Manifest" homepage concept: split-flap headline + ticket reveal. */

const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

class Flap {
  constructor(el) {
    this.el = el;
    this.final = el.dataset.final || el.textContent.trim();
  }
  run(delay = 0) {
    if (REDUCED) { this.el.textContent = this.final; return; }
    this.el.textContent = '';
    setTimeout(() => this.tick(0), delay);
  }
  tick(frame) {
    const target = this.final;
    const total = 16;
    const lockAt = (i) => Math.round((i / Math.max(target.length - 1, 1)) * total * 0.65) + 5;
    let out = '';
    for (let i = 0; i < target.length; i++) {
      const ch = target[i];
      if (ch === ' ') { out += ' '; continue; }
      out += frame >= lockAt(i) ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0];
    }
    this.el.textContent = out;
    if (frame <= total) {
      // setTimeout only, not requestAnimationFrame(() => setTimeout(...)):
      // rAF only ticks on an active paint/compositor cycle. Some embedding
      // contexts never run one, and since the callback was chained inside
      // it, the whole scramble would stall on frame 0 forever with nothing
      // to save it — confirmed while verifying this exact page.
      setTimeout(() => this.tick(frame + 1), 34);
    } else {
      this.el.textContent = target;
      this.el.classList.add('is-live');
    }
  }
}

// Counts one element from 0 to its target once, formatting with thousands
// commas when data-format="comma" is set. setTimeout-chained, not
// requestAnimationFrame: rAF only ticks on an active paint/compositor
// cycle, which some embedding contexts never run, and the count would then
// sit stuck at 0 with no fallback able to save it. setTimeout has no such
// dependency.
function countUpOnce(el) {
  const target = parseInt(el.dataset.countTo, 10);
  const format = el.dataset.format === 'comma'
    ? (n) => n.toLocaleString('en-GB')
    : (n) => String(n);
  if (REDUCED) { el.textContent = format(target); return; }
  const duration = 900;
  const step = 16;
  const start = Date.now();
  const tick = () => {
    const p = Math.min((Date.now() - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = format(Math.round(eased * target));
    if (p < 1) setTimeout(tick, step);
  };
  tick();
}

// Runs `fn` once, the first time `el` scrolls into view. IntersectionObserver
// is primary; a scroll/resize-listener fallback covers embedding contexts
// where the observer never reports — a single delayed check isn't enough on
// its own for anything below the fold at load, since that check runs before
// the user has scrolled to it.
function onceInView(el, fn) {
  let started = false;
  const run = () => {
    if (started) return;
    started = true;
    fn();
  };
  if (REDUCED) { run(); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => { if (entry.isIntersecting) { run(); io.disconnect(); } });
  }, { threshold: 0.5 });
  io.observe(el);
  const checkInView = () => {
    const r = el.getBoundingClientRect();
    if (r.top < innerHeight && r.bottom > 0) {
      run();
      removeEventListener('scroll', checkInView);
      removeEventListener('resize', checkInView);
    }
  };
  setTimeout(checkInView, 500);
  addEventListener('scroll', checkInView, { passive: true });
  addEventListener('resize', checkInView);
}

function init() {
  document.querySelectorAll('[data-flap]').forEach((el, i) => {
    new Flap(el).run(i * 260 + 120);
  });

  const ticket = document.querySelector('.ticket__rows');
  if (ticket) {
    const rows = [...ticket.querySelectorAll('.trow')];
    let started = false;
    const light = () => {
      if (started) return;
      started = true;
      rows.forEach((row, i) => setTimeout(() => row.classList.add('is-lit'), i * 420));
    };
    if (REDUCED) {
      rows.forEach((r) => r.classList.add('is-lit'));
    } else {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => { if (entry.isIntersecting) { light(); io.disconnect(); } });
      }, { threshold: 0.5 });
      io.observe(ticket);
      // The hero ticket is usually in view at first paint. IntersectionObserver
      // callbacks depend on a layout/paint cycle that some embedded or
      // pre-render contexts never run, so fall back to a synchronous
      // bounding-rect check if the observer hasn't reported in shortly.
      setTimeout(() => {
        const r = ticket.getBoundingClientRect();
        if (r.top < innerHeight && r.bottom > 0) light();
      }, 400);
    }
  }

  // Event Deck sample dashboard (interior page only): KPIs count up and the
  // primary trend line draws itself in, once, on scroll-into-view. The
  // legend is a real toggle — click isolates or restores a series.
  document.querySelectorAll('[data-count-to]').forEach((el) => {
    onceInView(el, () => countUpOnce(el));
  });
  const deck = document.querySelector('.deck');
  if (deck) {
    onceInView(deck, () => deck.classList.add('is-in'));
    deck.querySelectorAll('.deck__legend button[data-series]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const on = btn.getAttribute('aria-pressed') === 'true';
        btn.setAttribute('aria-pressed', String(!on));
        deck.querySelectorAll('.deck__chart .' + btn.dataset.series).forEach((series) => {
          series.classList.toggle('is-off', on);
        });
      });
    });
    // Campaign-flow legend (marketing-automation page): same isolate-on-click
    // pattern as the chart legend above, but dims tree nodes by data-type
    // instead of chart series by class.
    deck.querySelectorAll('.deck__legend button[data-node-type]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const on = btn.getAttribute('aria-pressed') === 'true';
        btn.setAttribute('aria-pressed', String(!on));
        deck.querySelectorAll('.fnode[data-type="' + btn.dataset.nodeType + '"]').forEach((node) => {
          node.classList.toggle('is-off', on);
        });
      });
    });
  }

  // Organisers/Exhibitors dropdowns: hover/focus-within already show them
  // for mouse and keyboard, but touch has neither, so a tap toggles
  // aria-expanded directly. Closes on outside click and Escape.
  document.querySelectorAll('.nav__parent').forEach((btn) => {
    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') === 'true';
      document.querySelectorAll('.nav__parent[aria-expanded="true"]').forEach((b) => { if (b !== btn) b.setAttribute('aria-expanded', 'false'); });
      btn.setAttribute('aria-expanded', String(!open));
    });
  });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.has-sub')) {
      document.querySelectorAll('.nav__parent[aria-expanded="true"]').forEach((b) => b.setAttribute('aria-expanded', 'false'));
    }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.nav__parent[aria-expanded="true"]').forEach((b) => b.setAttribute('aria-expanded', 'false'));
    }
  });

  const yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();

  const clock = document.getElementById('clock');
  if (clock) {
    const tick = () => {
      clock.textContent = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    };
    tick();
    setInterval(tick, 1000);
  }
}

// `defer` scripts normally run before DOMContentLoaded fires, but if the
// document is already parsed by the time this executes — some embedding or
// pre-render contexts do this — that event has already happened and would
// never fire again, silently killing every animation below.
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
