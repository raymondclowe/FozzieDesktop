// Jest setup file for additional test configuration
import 'dotenv/config';
import '@testing-library/jest-dom';

// Mock TextEncoder/TextDecoder for Node.js environment
import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock clipboard for user-event
Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: jest.fn().mockResolvedValue(undefined),
    readText: jest.fn().mockResolvedValue(''),
  },
  writable: true,
});

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

// For now, always mock fetch to avoid environment issues
// Real API tests are handled by the separate test:api script
global.fetch = jest.fn();
global.Headers = jest.fn();
global.Request = jest.fn();
global.Response = jest.fn();

// Increase timeout for async tests
jest.setTimeout(30000);