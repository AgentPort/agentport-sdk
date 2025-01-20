import { Logger } from '../../src/utils/logger';

// Disable logging during tests unless explicitly enabled
Logger.prototype.debug = jest.fn();
Logger.prototype.info = jest.fn();
Logger.prototype.warn = jest.fn();
Logger.prototype.error = jest.fn();

// Global test timeout
jest.setTimeout(30000);

// Clean up resources after each test
afterEach(() => {
    jest.clearAllMocks();
});
