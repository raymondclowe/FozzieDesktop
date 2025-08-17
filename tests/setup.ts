// Jest setup file for additional test configuration
import 'dotenv/config';
import '@testing-library/jest-dom';

// Mock TextEncoder/TextDecoder for Node.js environment
import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock DOM methods not available in jsdom
Element.prototype.scrollIntoView = jest.fn();

// Mock clipboard for user-event - avoid conflicts with testing-library/user-event
if (!navigator.clipboard) {
  Object.defineProperty(navigator, 'clipboard', {
    value: {
      writeText: jest.fn().mockResolvedValue(undefined),
      readText: jest.fn().mockResolvedValue(''),
    },
    writable: true,
    configurable: true,
  });
}

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

// Mock localStorage for testing
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Only mock fetch for non-API tests
// API tests (github-secret.test.ts, providers.test.ts) need real fetch
const isAPITest = process.env.JEST_WORKER_ID && (
  process.argv.includes('github-secret.test.ts') ||
  process.argv.includes('providers.test.ts') ||
  process.env.NODE_OPTIONS?.includes('--experimental-fetch')
);

if (!isAPITest) {
  // Mock fetch for component and integration tests
  global.fetch = jest.fn();
  global.Headers = jest.fn();
  global.Request = jest.fn();
  global.Response = jest.fn();
} else {
  // For API tests, use real fetch from Node.js
  console.log('🌐 Using real fetch for API tests');
}

// Increase timeout for async tests
jest.setTimeout(30000);