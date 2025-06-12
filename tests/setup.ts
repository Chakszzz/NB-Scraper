/**
 * @fileoverview Test setup configuration
 * @author NB Team
 */

// Set test timeout
jest.setTimeout(30000);

// Mock console.error to reduce noise during tests
const originalError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalError;
});

// Global test utilities
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeValidScraperResponse(): R;
      toBeSuccessfulScraperResponse(): R;
      toBeErrorScraperResponse(): R;
    }
  }
}

// Custom Jest matchers
expect.extend({
  toBeValidScraperResponse(received) {
    const pass = received &&
      typeof received === 'object' &&
      typeof received.creator === 'string' &&
      typeof received.status === 'boolean' &&
      received.creator === 'NB Team';
    
    if (pass) {
      return {
        message: () => `expected ${JSON.stringify(received)} not to be a valid scraper response`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${JSON.stringify(received)} to be a valid scraper response`,
        pass: false,
      };
    }
  },

  toBeSuccessfulScraperResponse(received) {
    const pass = received &&
      typeof received === 'object' &&
      received.status === true &&
      received.data !== undefined &&
      received.error === undefined;
    
    if (pass) {
      return {
        message: () => `expected ${JSON.stringify(received)} not to be a successful scraper response`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${JSON.stringify(received)} to be a successful scraper response`,
        pass: false,
      };
    }
  },

  toBeErrorScraperResponse(received) {
    const pass = received &&
      typeof received === 'object' &&
      received.status === false &&
      typeof received.error === 'string' &&
      received.data === undefined;
    
    if (pass) {
      return {
        message: () => `expected ${JSON.stringify(received)} not to be an error scraper response`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${JSON.stringify(received)} to be an error scraper response`,
        pass: false,
      };
    }
  }
});

export {};
