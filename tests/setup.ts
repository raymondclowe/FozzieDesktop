// Jest setup file for additional test configuration
import 'dotenv/config';

// Mock Electron APIs for testing
global.window = {
  electronAPI: {
    onNewChat: jest.fn(),
    onOpenSettings: jest.fn(), 
    onToggleFozzieMode: jest.fn(),
    onSwitchModel: jest.fn(),
    onSaveChat: jest.fn(),
    removeAllListeners: jest.fn(),
  }
} as any;

// Ensure fetch is available in test environment
// In Node.js 20+, fetch is available globally but might need to be enabled
if (typeof globalThis.fetch === 'undefined') {
  // Use undici as polyfill for environments where fetch is not available
  const { fetch, Headers, Request, Response } = require('undici');
  globalThis.fetch = fetch;
  globalThis.Headers = Headers;
  globalThis.Request = Request;
  globalThis.Response = Response;
}

// Increase timeout for async tests
jest.setTimeout(30000);