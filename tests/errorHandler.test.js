const { initErrorHandler } = require('../src/errorHandler');

describe('errorHandler', () => {
  let addEventSpy;

  beforeEach(() => {
    addEventSpy = jest.spyOn(window, 'addEventListener');
  });

  afterEach(() => {
    addEventSpy.mockRestore();
  });

  test('registers an "error" listener on window', () => {
    initErrorHandler();
    expect(addEventSpy).toHaveBeenCalledWith('error', expect.any(Function));
  });

  test('registers an "unhandledrejection" listener on window', () => {
    initErrorHandler();
    expect(addEventSpy).toHaveBeenCalledWith('unhandledrejection', expect.any(Function));
  });

  test('error handler logs with [FClient] prefix', () => {
    initErrorHandler();
    const errorCb = addEventSpy.mock.calls.find(c => c[0] === 'error')[1];
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

    errorCb({ message: 'boom', filename: 'app.js', lineno: 42 });

    expect(spy).toHaveBeenCalledWith(
      '[FClient] Uncaught error:', 'boom', 'at', 'app.js:42',
    );
    spy.mockRestore();
  });

  test('unhandledrejection handler logs with [FClient] prefix', () => {
    initErrorHandler();
    const rejCb = addEventSpy.mock.calls.find(c => c[0] === 'unhandledrejection')[1];
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

    rejCb({ reason: 'promise failed' });

    expect(spy).toHaveBeenCalledWith(
      '[FClient] Unhandled promise rejection:', 'promise failed',
    );
    spy.mockRestore();
  });
});
