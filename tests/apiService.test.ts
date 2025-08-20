import { APIService, validateAPIKey, getAPIKeyFromEnv } from '../src/services/apiService';
import { Settings } from '../src/renderer/App';

describe('APIService', () => {
  const mockSettings: Settings = {
    apiKey: 'test-key',
    selectedModel: 'gpt-3.5-turbo',
    apiEndpoint: 'https://api.openai.com/v1',
    fozzieMode: false,
    theme: 'light',
    maxTokens: 1000,
    temperature: 0.7,
  };

  describe('validateAPIKey', () => {
    it('should validate OpenRouter API key format', () => {
      const result = validateAPIKey('sk-or-v1-test123456789abcdef', 'https://openrouter.ai/api/v1');
      expect(result.valid).toBe(true);
      expect(result.message).toBe('Valid OpenRouter API key format');
    });

    it('should reject invalid OpenRouter API key format', () => {
      const result = validateAPIKey('sk-invalid-key-that-is-long-enough', 'https://openrouter.ai/api/v1');
      expect(result.valid).toBe(false);
      expect(result.message).toContain('OpenRouter API keys should start with "sk-or-v1-"');
    });

    it('should validate OpenAI API key format', () => {
      const result = validateAPIKey('sk-test123456789abcdef', 'https://api.openai.com/v1');
      expect(result.valid).toBe(true);
      expect(result.message).toBe('Valid OpenAI API key format');
    });

    it('should validate Groq API key format', () => {
      const result = validateAPIKey('gsk_test123456789abcdef', 'https://api.groq.com/openai/v1');
      expect(result.valid).toBe(true);
      expect(result.message).toBe('Valid Groq API key format');
    });

    it('should validate Cloudflare API key format', () => {
      const result = validateAPIKey('cloudflare-api-key-with-sufficient-length', 'https://api.cloudflare.com/client/v4/accounts/test/ai/v1');
      expect(result.valid).toBe(true);
      expect(result.message).toBe('Valid Cloudflare AI API key format');
    });

    it('should reject empty API key', () => {
      const result = validateAPIKey('', 'https://api.openai.com/v1');
      expect(result.valid).toBe(false);
      expect(result.message).toBe('API key is required');
    });

    it('should reject short API key', () => {
      const result = validateAPIKey('sk-short', 'https://api.openai.com/v1');
      expect(result.valid).toBe(false);
      expect(result.message).toBe('API key appears to be too short');
    });

    it('should reject Groq key with wrong prefix', () => {
      const result = validateAPIKey('sk-wrong-prefix-for-groq', 'https://api.groq.com/openai/v1');
      expect(result.valid).toBe(false);
      expect(result.message).toContain('Groq API keys should start with "gsk_"');
    });
  });

  describe('getAPIKeyFromEnv', () => {
    const originalEnv = process.env;

    beforeEach(() => {
      process.env = { ...originalEnv };
    });

    afterEach(() => {
      process.env = originalEnv;
    });

    it('should return OPENROUTER_API_KEY when available', () => {
      process.env.OPENROUTER_API_KEY = 'test-openrouter-key';
      const result = getAPIKeyFromEnv();
      expect(result).toBe('test-openrouter-key');
    });

    it('should return OPENAI_API_KEY when OPENROUTER_API_KEY is not available', () => {
      delete process.env.OPENROUTER_API_KEY;
      process.env.OPENAI_API_KEY = 'test-openai-key';
      const result = getAPIKeyFromEnv();
      expect(result).toBe('test-openai-key');
    });

    it('should return CLOUDFLARE_API_KEY when higher priority keys are not available', () => {
      delete process.env.OPENROUTER_API_KEY;
      delete process.env.OPENAI_API_KEY;
      process.env.CLOUDFLARE_API_KEY = 'test-cloudflare-key';
      const result = getAPIKeyFromEnv();
      expect(result).toBe('test-cloudflare-key');
    });

    it('should return GROQ_API_KEY when higher priority keys are not available', () => {
      delete process.env.OPENROUTER_API_KEY;
      delete process.env.OPENAI_API_KEY;
      delete process.env.CLOUDFLARE_API_KEY;
      process.env.GROQ_API_KEY = 'test-groq-key';
      const result = getAPIKeyFromEnv();
      expect(result).toBe('test-groq-key');
    });

    it('should return null when no API key is available', () => {
      delete process.env.OPENROUTER_API_KEY;
      delete process.env.OPENAI_API_KEY;
      delete process.env.CLOUDFLARE_API_KEY;
      delete process.env.GROQ_API_KEY;
      delete process.env.AI_API_KEY;
      delete process.env.API_KEY;
      const result = getAPIKeyFromEnv();
      expect(result).toBeNull();
    });

    it('should trim whitespace from API key', () => {
      process.env.OPENROUTER_API_KEY = '  test-key-with-whitespace  ';
      const result = getAPIKeyFromEnv();
      expect(result).toBe('test-key-with-whitespace');
    });
  });

  describe('APIService constructor', () => {
    it('should create instance with settings', () => {
      const service = new APIService(mockSettings);
      expect(service).toBeInstanceOf(APIService);
    });
  });

  describe('error handling', () => {
    it('should throw error when API key is missing', async () => {
      const settingsWithoutKey = { ...mockSettings, apiKey: '' };
      const service = new APIService(settingsWithoutKey);
      
      await expect(service.sendChatMessage([{ role: 'user', content: 'test' }]))
        .rejects.toThrow('API key is required');
    });
  });
});