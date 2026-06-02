/**
 * Scroll-reveal: adds the "visible" class to observed elements when they
 * enter the viewport, then stops watching them.  Falls back to making all
 * targets visible immediately when IntersectionObserver is unavailable.
 */

function createRevealObserver(threshold = 0.15) {
  const io = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold });
  return io;
}

function initScrollReveal(selectors = '.reveal, .feat-card, .step-item, .dl-platform', threshold = 0.15) {
  const targets = document.querySelectorAll(selectors);

  if ('IntersectionObserver' in window) {
    const io = createRevealObserver(threshold);
    targets.forEach(el => io.observe(el));
    return io;
  }

  targets.forEach(el => el.classList.add('visible'));
  return null;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { createRevealObserver, initScrollReveal };
}
