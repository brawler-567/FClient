const { createRevealObserver, initScrollReveal } = require('../src/scrollReveal');

/* ── helpers ─────────────────────────────────────────── */

function mockIntersectionObserver() {
  const instances = [];

  class FakeIO {
    constructor(callback, options) {
      this.callback = callback;
      this.options = options;
      this.observed = new Set();
      this.unobserved = new Set();
      instances.push(this);
    }
    observe(el) { this.observed.add(el); }
    unobserve(el) { this.unobserved.add(el); this.observed.delete(el); }
    disconnect() { this.observed.clear(); }
  }

  global.IntersectionObserver = FakeIO;
  window.IntersectionObserver = FakeIO;
  return instances;
}

function removeIntersectionObserver() {
  delete global.IntersectionObserver;
  delete window.IntersectionObserver;
}

function makeElement(classes = '') {
  const el = document.createElement('div');
  if (classes) classes.split(' ').forEach(c => el.classList.add(c));
  return el;
}

/* ── tests ───────────────────────────────────────────── */

describe('scrollReveal', () => {
  let instances;

  beforeEach(() => {
    document.body.innerHTML = '';
    instances = mockIntersectionObserver();
  });

  afterEach(() => {
    removeIntersectionObserver();
  });

  describe('createRevealObserver', () => {
    test('returns an IntersectionObserver with the given threshold', () => {
      const io = createRevealObserver(0.25);
      expect(io).toBeInstanceOf(IntersectionObserver);
      expect(io.options.threshold).toBe(0.25);
    });

    test('uses 0.15 as the default threshold', () => {
      const io = createRevealObserver();
      expect(io.options.threshold).toBe(0.15);
    });

    test('adds "visible" class when entry is intersecting', () => {
      const io = createRevealObserver();
      const el = makeElement();

      io.callback(
        [{ isIntersecting: true, target: el }],
        io,
      );

      expect(el.classList.contains('visible')).toBe(true);
    });

    test('does not add "visible" when entry is NOT intersecting', () => {
      const io = createRevealObserver();
      const el = makeElement();

      io.callback(
        [{ isIntersecting: false, target: el }],
        io,
      );

      expect(el.classList.contains('visible')).toBe(false);
    });

    test('unobserves the element after it becomes visible', () => {
      const io = createRevealObserver();
      const el = makeElement();
      io.observe(el);

      io.callback(
        [{ isIntersecting: true, target: el }],
        io,
      );

      expect(io.unobserved.has(el)).toBe(true);
      expect(io.observed.has(el)).toBe(false);
    });

    test('does not unobserve elements that are not intersecting', () => {
      const io = createRevealObserver();
      const el = makeElement();
      io.observe(el);

      io.callback(
        [{ isIntersecting: false, target: el }],
        io,
      );

      expect(io.unobserved.has(el)).toBe(false);
      expect(io.observed.has(el)).toBe(true);
    });

    test('handles multiple entries in one batch', () => {
      const io = createRevealObserver();
      const visible = makeElement();
      const hidden = makeElement();
      io.observe(visible);
      io.observe(hidden);

      io.callback(
        [
          { isIntersecting: true, target: visible },
          { isIntersecting: false, target: hidden },
        ],
        io,
      );

      expect(visible.classList.contains('visible')).toBe(true);
      expect(hidden.classList.contains('visible')).toBe(false);
      expect(io.unobserved.has(visible)).toBe(true);
      expect(io.unobserved.has(hidden)).toBe(false);
    });
  });

  describe('initScrollReveal', () => {
    test('observes all elements matching the selector string', () => {
      document.body.innerHTML = `
        <div class="reveal"></div>
        <div class="feat-card"></div>
        <div class="step-item"></div>
        <div class="dl-platform"></div>
        <div class="unrelated"></div>
      `;

      const io = initScrollReveal();
      expect(io.observed.size).toBe(4);
    });

    test('accepts a custom selector', () => {
      document.body.innerHTML = `
        <div class="custom-a"></div>
        <div class="custom-b"></div>
        <div class="feat-card"></div>
      `;

      const io = initScrollReveal('.custom-a, .custom-b');
      expect(io.observed.size).toBe(2);
    });

    test('returns the observer instance', () => {
      const io = initScrollReveal();
      expect(io).toBeInstanceOf(IntersectionObserver);
    });

    test('passes threshold to the observer', () => {
      const io = initScrollReveal('.reveal', 0.5);
      expect(io.options.threshold).toBe(0.5);
    });

    test('observes zero elements when none match', () => {
      document.body.innerHTML = '<p>no matches</p>';
      const io = initScrollReveal('.nonexistent');
      expect(io.observed.size).toBe(0);
    });
  });

  describe('initScrollReveal fallback (no IntersectionObserver)', () => {
    test('adds "visible" to all targets immediately when IO is unavailable', () => {
      removeIntersectionObserver();

      document.body.innerHTML = `
        <div class="reveal"></div>
        <div class="feat-card"></div>
      `;

      const result = initScrollReveal();
      expect(result).toBeNull();

      const els = document.querySelectorAll('.reveal, .feat-card');
      els.forEach(el => {
        expect(el.classList.contains('visible')).toBe(true);
      });
    });

    test('returns null when IO is unavailable', () => {
      removeIntersectionObserver();
      document.body.innerHTML = '<div class="reveal"></div>';
      expect(initScrollReveal()).toBeNull();
    });
  });
});
