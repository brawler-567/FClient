const { getNavPadding, initNavShrink } = require('../src/navShrink');

/* ── tests ───────────────────────────────────────────── */

describe('navShrink', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  describe('getNavPadding', () => {
    test('returns compact padding when scrollY exceeds threshold', () => {
      expect(getNavPadding(100)).toBe('12px 60px');
    });

    test('returns default padding when scrollY is below threshold', () => {
      expect(getNavPadding(30)).toBe('18px 60px');
    });

    test('returns default padding when scrollY equals threshold exactly', () => {
      expect(getNavPadding(60)).toBe('18px 60px');
    });

    test('returns compact padding when scrollY is just above threshold', () => {
      expect(getNavPadding(61)).toBe('12px 60px');
    });

    test('returns default padding when scrollY is 0', () => {
      expect(getNavPadding(0)).toBe('18px 60px');
    });

    test('respects a custom threshold', () => {
      expect(getNavPadding(100, 200)).toBe('18px 60px');
      expect(getNavPadding(201, 200)).toBe('12px 60px');
    });

    test('uses 60 as default threshold', () => {
      expect(getNavPadding(60)).toBe('18px 60px');
      expect(getNavPadding(61)).toBe('12px 60px');
    });
  });

  describe('initNavShrink', () => {
    test('returns handler and nav element when nav exists', () => {
      document.body.innerHTML = '<nav></nav>';
      const result = initNavShrink();
      expect(result).not.toBeNull();
      expect(result.nav.tagName).toBe('NAV');
      expect(typeof result.handler).toBe('function');
    });

    test('returns null when nav element does not exist', () => {
      document.body.innerHTML = '<div></div>';
      const result = initNavShrink();
      expect(result).toBeNull();
    });

    test('accepts a custom nav selector', () => {
      document.body.innerHTML = '<header id="main-nav"></header>';
      const result = initNavShrink('#main-nav');
      expect(result).not.toBeNull();
      expect(result.nav.tagName).toBe('HEADER');
    });

    test('handler sets compact padding when scrollY > threshold', () => {
      document.body.innerHTML = '<nav></nav>';
      const { nav, handler } = initNavShrink();

      Object.defineProperty(window, 'scrollY', { value: 100, writable: true });
      handler();
      expect(nav.style.padding).toBe('12px 60px');
    });

    test('handler sets default padding when scrollY <= threshold', () => {
      document.body.innerHTML = '<nav></nav>';
      const { nav, handler } = initNavShrink();

      Object.defineProperty(window, 'scrollY', { value: 10, writable: true });
      handler();
      expect(nav.style.padding).toBe('18px 60px');
    });

    test('respects custom threshold parameter', () => {
      document.body.innerHTML = '<nav></nav>';
      const { nav, handler } = initNavShrink('nav', 200);

      Object.defineProperty(window, 'scrollY', { value: 150, writable: true });
      handler();
      expect(nav.style.padding).toBe('18px 60px');

      Object.defineProperty(window, 'scrollY', { value: 201, writable: true });
      handler();
      expect(nav.style.padding).toBe('12px 60px');
    });

    test('handler is registered as a scroll listener', () => {
      document.body.innerHTML = '<nav></nav>';
      const addSpy = jest.spyOn(window, 'addEventListener');

      initNavShrink();

      expect(addSpy).toHaveBeenCalledWith(
        'scroll',
        expect.any(Function),
        { passive: true },
      );

      addSpy.mockRestore();
    });
  });
});
