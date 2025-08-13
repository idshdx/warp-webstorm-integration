/**
 * Jest Test Setup
 * 
 * This file is executed before each test file to set up the testing environment.
 */

// Ensure Jest globals are available in this context
import 'jest';

// Mock WebSocket for tests
// @ts-ignore - Mocking global WebSocket for tests
global.WebSocket = class MockWebSocket {
  static CONNECTING = 0;
  static OPEN = 1;
  static CLOSING = 2;
  static CLOSED = 3;

  send = jest.fn();
  close = jest.fn();
  readyState = 1; // OPEN
  addEventListener = jest.fn();
  removeEventListener = jest.fn();
} as any;

// Mock console to reduce noise in tests
const originalConsole = global.console as Console;
// @ts-ignore
global.console = {
  ...originalConsole,
  info: jest.fn(),
  debug: jest.fn(),
  // keep important logs
  error: originalConsole.error,
  warn: originalConsole.warn,
  log: originalConsole.log,
};

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.MCP_SERVER_PORT = '8765';
process.env.LOG_LEVEL = 'error';

// Global test timeout
jest.setTimeout(10000);

// Clean up after tests
afterAll(() => {
  // Restore original console
  // @ts-ignore
  global.console = originalConsole;
});
