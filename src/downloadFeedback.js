/**
 * Download error feedback: alerts the user when the download link has no
 * href, preventing a broken navigation.
 */

function initDownloadFeedback(linkSelector = '#win-dl') {
  var dlLink = document.querySelector(linkSelector);
  if (!dlLink) return null;

  var handler = function (event) {
    var href = dlLink.getAttribute('href');
    if (!href) {
      event.preventDefault();
      console.error('[FClient] Download link has no href');
      alert('Download link is currently unavailable. Please try again later.');
    }
  };

  dlLink.addEventListener('click', handler);
  return { dlLink: dlLink, handler: handler };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { initDownloadFeedback };
}
