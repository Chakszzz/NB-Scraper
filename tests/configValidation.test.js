/* eslint-env jest */
const validateConfig = require('../src/config/validateConfig'); // adjust path if needed

function createValidConfig() {
  return {
    host: 'localhost',
    port: 8080,
    database: { user: 'admin', password: 'secret', name: 'app' },
    features: { experimental: false },
  };
}

jest.spyOn(process, 'env', 'get').mockReturnValue({});
beforeEach(() => { jest.clearAllMocks(); });
afterAll(() => { jest.restoreAllMocks(); });

describe('validateConfig', () => {
  it('should return true for a fully valid configuration', () => {
    const cfg = createValidConfig();
    expect(() => validateConfig(cfg)).not.toThrow();
  });

  const REQUIRED_KEYS = ['host', 'port', 'database'];
  it.each(REQUIRED_KEYS)('should throw if required key %s is missing', (key) => {
    const cfg = createValidConfig();
    delete cfg[key];
    expect(() => validateConfig(cfg)).toThrow(new RegExp(key));
  });

  it('should throw if port is not a number', () => {
    const cfg = createValidConfig();
    cfg.port = 'not-a-number';
    expect(() => validateConfig(cfg)).toThrow(/port/i);
  });

  describe('port boundaries', () => {
    it.each([-1, 0, 65536])('should reject out-of-range port %i', (badPort) => {
      const cfg = createValidConfig();
      cfg.port = badPort;
      expect(() => validateConfig(cfg)).toThrow(/port/i);
    });

    it.each([1, 80, 65535])('should accept valid port %i', (goodPort) => {
      const cfg = createValidConfig();
      cfg.port = goodPort;
      expect(() => validateConfig(cfg)).not.toThrow();
    });
  });

  it('should reject unexpected extra keys', () => {
    const cfg = createValidConfig();
    cfg.unexpected = 123;
    expect(() => validateConfig(cfg)).toThrow(/unexpected/i);
  });
});