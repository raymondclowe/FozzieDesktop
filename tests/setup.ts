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

// Mock fetch for API tests
global.fetch = jest.fn();

// Increase timeout for async tests
jest.setTimeout(30000);