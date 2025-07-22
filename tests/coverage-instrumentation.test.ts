import { APIService } from '../src/services/apiService';

describe('Coverage Instrumentation Test', () => {
  it('should not cause babel-plugin-istanbul double instrumentation errors', () => {
    // This test specifically verifies that coverage instrumentation doesn't cause
    // "The 'original' argument must be of type function. Received an instance of Object" errors
    
    const mockSettings = {
      apiKey: 'test-key',
      selectedModel: 'gpt-3.5-turbo',
      apiEndpoint: 'https://api.openai.com/v1',
      fozzieMode: false,
      theme: 'light' as const,
      maxTokens: 1000,
      temperature: 0.7,
    };

    // Create instance - this should work without instrumentation errors
    const service = new APIService(mockSettings);
    expect(service).toBeInstanceOf(APIService);

    // Test that methods exist and are functions (not objects due to instrumentation issues)
    expect(typeof service.sendChatMessage).toBe('function');
    expect(typeof service.testConnection).toBe('function');
  });

  it('should properly instrument functions for coverage without type errors', () => {
    // Test that coverage instrumentation doesn't break function detection
    const { validateAPIKey } = require('../src/services/apiService');
    
    expect(typeof validateAPIKey).toBe('function');
    
    // Call the function to ensure it's properly instrumented
    const result = validateAPIKey('sk-test123456789abcdef', 'https://api.openai.com/v1');
    expect(result).toHaveProperty('valid');
    expect(result).toHaveProperty('message');
  });
});