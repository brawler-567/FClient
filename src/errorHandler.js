/**
 * Global error handlers: logs uncaught errors and unhandled promise
 * rejections to the console with a [FClient] prefix.
 */

function initErrorHandler() {
  window.addEventListener('error', function (event) {
    console.error('[FClient] Uncaught error:', event.message, 'at', event.filename + ':' + event.lineno);
  });

  window.addEventListener('unhandledrejection', function (event) {
    console.error('[FClient] Unhandled promise rejection:', event.reason);
  });
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { initErrorHandler };
}
