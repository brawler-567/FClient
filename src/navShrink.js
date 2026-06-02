/**
 * Navbar shrink: reduces padding on the nav element once the user scrolls
 * past a given offset.
 */

function getNavPadding(scrollY, scrollThreshold = 60) {
  return scrollY > scrollThreshold ? '12px 60px' : '18px 60px';
}

function initNavShrink(navSelector = 'nav', scrollThreshold = 60) {
  const nav = document.querySelector(navSelector);
  if (!nav) return null;

  const handler = () => {
    nav.style.padding = getNavPadding(window.scrollY, scrollThreshold);
  };

  window.addEventListener('scroll', handler, { passive: true });
  return { nav, handler };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { getNavPadding, initNavShrink };
}
