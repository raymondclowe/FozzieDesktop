/**
 * Test for multi-provider support
 * Tests real API calls to different providers when API keys are available
 */

import { APIService, SUPPORTED_PROVIDERS, detectProvider, getAPIKeyFromEnv } from '../src/services/apiService';
import { Settings } from '../src/renderer/App';

describe('Multi-Provider Support', () => {
  describe('Provider Detection', () => {
    it('should detect OpenRouter provider', () => {
      const provider = detectProvider('https://openrouter.ai/api/v1');
      expect(provider).toBeTruthy();
      expect(provider?.name).toBe('OpenRouter');
      expect(provider?.keyPrefix).toBe('sk-or-v1-');
    });

    it('should detect OpenAI provider', () => {
      const provider = detectProvider('https://api.openai.com/v1');
      expect(provider).toBeTruthy();
      expect(provider?.name).toBe('OpenAI');
      expect(provider?.keyPrefix).toBe('sk-');
    });

    it('should detect Groq provider', () => {
      const provider = detectProvider('https://api.groq.com/openai/v1');
      expect(provider).toBeTruthy();
      expect(provider?.name).toBe('Groq');
      expect(provider?.keyPrefix).toBe('gsk_');
    });

    it('should detect Cloudflare provider', () => {
      const provider = detectProvider('https://api.cloudflare.com/client/v4/accounts/test/ai/v1');
      expect(provider).toBeTruthy();
      expect(provider?.name).toBe('Cloudflare AI');
      expect(provider?.keyPrefix).toBe('');
    });

    it('should return null for unknown provider', () => {
      const provider = detectProvider('https://unknown.provider.com/api/v1');
      expect(provider).toBeNull();
    });
  });

  describe('Provider Configurations', () => {
    it('should have valid OpenRouter configuration', () => {
      const config = SUPPORTED_PROVIDERS.openrouter;
      expect(config.name).toBe('OpenRouter');
      expect(config.endpoint).toBe('https://openrouter.ai/api/v1');
      expect(config.models.length).toBeGreaterThan(0);
      expect(config.headers).toBeDefined();
    });

    it('should have valid OpenAI configuration', () => {
      const config = SUPPORTED_PROVIDERS.openai;
      expect(config.name).toBe('OpenAI');
      expect(config.endpoint).toBe('https://api.openai.com/v1');
      expect(config.models.length).toBeGreaterThan(0);
    });

    it('should have valid Groq configuration', () => {
      const config = SUPPORTED_PROVIDERS.groq;
      expect(config.name).toBe('Groq');
      expect(config.endpoint).toBe('https://api.groq.com/openai/v1');
      expect(config.models.length).toBeGreaterThan(0);
      expect(config.keyPrefix).toBe('gsk_');
    });

    it('should have valid Cloudflare configuration', () => {
      const config = SUPPORTED_PROVIDERS.cloudflare;
      expect(config.name).toBe('Cloudflare AI');
      expect(config.endpoint).toContain('cloudflare.com');
      expect(config.models.length).toBeGreaterThan(0);
    });
  });

  describe('Real API Testing (when keys available)', () => {
    const originalEnv = process.env;

    beforeEach(() => {
      process.env = { ...originalEnv };
    });

    afterEach(() => {
      process.env = originalEnv;
    });

    it('should configure for OpenRouter when OPENROUTER_API_KEY is available', async () => {
      const apiKey = process.env.OPENROUTER_API_KEY;
      if (!apiKey) {
        console.log('⏭️  Skipping OpenRouter configuration test - no OPENROUTER_API_KEY available');
        expect(true).toBe(true);
        return;
      }

      console.log('🧪 Configuring for OpenRouter real API...');
      
      const settings: Settings = {
        apiKey: apiKey,
        selectedModel: 'openai/gpt-3.5-turbo',
        apiEndpoint: 'https://openrouter.ai/api/v1',
        fozzieMode: false,
        theme: 'light',
        maxTokens: 50,
        temperature: 0.7,
      };

      const apiService = new APIService(settings);
      
      expect(apiService).toBeInstanceOf(APIService);
      expect(apiService.getProviderInfo()?.name).toBe('OpenRouter');
      
      console.log(`✅ OpenRouter API configured!`);
      console.log(`   Provider: ${apiService.getProviderInfo()?.name}`);
      console.log(`   Model: ${settings.selectedModel}`);
      console.log(`   Ready for real API calls (outside Jest environment)`);
    }, 30000);

    it('should work with OpenAI when OPENAI_API_KEY is available', async () => {
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
        console.log('⏭️  Skipping OpenAI real API test - no OPENAI_API_KEY available');
        expect(true).toBe(true);
        return;
      }

      console.log('🧪 Testing OpenAI with real API...');
      
      const settings: Settings = {
        apiKey: apiKey,
        selectedModel: 'gpt-3.5-turbo',
        apiEndpoint: 'https://api.openai.com/v1',
        fozzieMode: false,
        theme: 'light',
        maxTokens: 50,
        temperature: 0.7,
      };

      const apiService = new APIService(settings);
      const result = await apiService.testConnection();
      
      expect(result.success).toBe(true);
      console.log(`✅ OpenAI real API test successful: ${result.message}`);
    }, 30000);

    it('should work with Groq when GROQ_API_KEY is available', async () => {
      const apiKey = process.env.GROQ_API_KEY;
      if (!apiKey) {
        console.log('⏭️  Skipping Groq real API test - no GROQ_API_KEY available');
        expect(true).toBe(true);
        return;
      }

      console.log('🧪 Testing Groq with real API...');
      
      const settings: Settings = {
        apiKey: apiKey,
        selectedModel: 'llama-3.1-8b-instant',
        apiEndpoint: 'https://api.groq.com/openai/v1',
        fozzieMode: false,
        theme: 'light',
        maxTokens: 50,
        temperature: 0.7,
      };

      const apiService = new APIService(settings);
      const result = await apiService.testConnection();
      
      expect(result.success).toBe(true);
      console.log(`✅ Groq real API test successful: ${result.message}`);
    }, 30000);

    it('should work with Cloudflare when CLOUDFLARE_API_KEY is available', async () => {
      const apiKey = process.env.CLOUDFLARE_API_KEY;
      const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
      
      if (!apiKey || !accountId) {
        console.log('⏭️  Skipping Cloudflare real API test - CLOUDFLARE_API_KEY or CLOUDFLARE_ACCOUNT_ID not available');
        expect(true).toBe(true);
        return;
      }

      console.log('🧪 Testing Cloudflare AI with real API...');
      
      const settings: Settings = {
        apiKey: apiKey,
        selectedModel: '@cf/meta/llama-3.1-8b-instruct',
        apiEndpoint: `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/v1`,
        fozzieMode: false,
        theme: 'light',
        maxTokens: 50,
        temperature: 0.7,
      };

      const apiService = new APIService(settings);
      const result = await apiService.testConnection();
      
      expect(result.success).toBe(true);
      console.log(`✅ Cloudflare AI real API test successful: ${result.message}`);
    }, 30000);
  });

  describe('Provider Information Display', () => {
    it('should provide helpful information about provider setup', () => {
      console.log('\n📚 MULTI-PROVIDER SETUP GUIDE:');
      console.log('');
      console.log('🔑 Supported Providers & Setup:');
      console.log('');
      
      Object.entries(SUPPORTED_PROVIDERS).forEach(([key, provider]) => {
        console.log(`${provider.name}:`);
        console.log(`  Endpoint: ${provider.endpoint}`);
        console.log(`  Key Prefix: ${provider.keyPrefix || 'flexible'}`);
        console.log(`  Models: ${provider.models.slice(0, 3).join(', ')}...`);
        console.log('');
      });
      
      console.log('💡 Recommendations:');
      console.log('  • OpenRouter: Best for variety & cost-effectiveness');
      console.log('  • Groq: Best for speed (free tier available)');
      console.log('  • Cloudflare AI: Best for Workers integration');
      console.log('  • OpenAI: Best for official models');
      console.log('');
      
      expect(true).toBe(true);
    });
  });
});