const { initDownloadFeedback } = require('../src/downloadFeedback');

describe('downloadFeedback', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  test('returns null when the link element does not exist', () => {
    document.body.innerHTML = '<div></div>';
    expect(initDownloadFeedback()).toBeNull();
  });

  test('returns handler and link element when the link exists', () => {
    document.body.innerHTML = '<a id="win-dl" href="https://example.com/file.zip">Get</a>';
    const result = initDownloadFeedback();
    expect(result).not.toBeNull();
    expect(result.dlLink.id).toBe('win-dl');
    expect(typeof result.handler).toBe('function');
  });

  test('accepts a custom selector', () => {
    document.body.innerHTML = '<a class="dl-btn" href="#">Get</a>';
    const result = initDownloadFeedback('.dl-btn');
    expect(result).not.toBeNull();
    expect(result.dlLink.classList.contains('dl-btn')).toBe(true);
  });

  test('does nothing when href is present on click', () => {
    document.body.innerHTML = '<a id="win-dl" href="https://example.com/file.zip">Get</a>';
    const { handler } = initDownloadFeedback();

    const event = { preventDefault: jest.fn() };
    handler(event);
    expect(event.preventDefault).not.toHaveBeenCalled();
  });

  test('prevents default and alerts when href is missing', () => {
    document.body.innerHTML = '<a id="win-dl">Get</a>';
    const { handler } = initDownloadFeedback();

    const event = { preventDefault: jest.fn() };
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

    handler(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith('[FClient] Download link has no href');
    expect(alertSpy).toHaveBeenCalledWith('Download link is currently unavailable. Please try again later.');

    consoleSpy.mockRestore();
    alertSpy.mockRestore();
  });

  test('prevents default when href is empty string', () => {
    document.body.innerHTML = '<a id="win-dl" href="">Get</a>';
    const { handler } = initDownloadFeedback();

    const event = { preventDefault: jest.fn() };
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

    handler(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith('[FClient] Download link has no href');

    consoleSpy.mockRestore();
    alertSpy.mockRestore();
  });
});
