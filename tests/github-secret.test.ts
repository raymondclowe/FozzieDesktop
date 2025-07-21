/**
 * Integration test for GitHub secret OPENROUTER_API_KEY
 * This test validates that the GitHub secret is accessible and functional
 */

import { APIService, getAPIKeyFromEnv, validateAPIKey } from '../src/services/apiService';
import { Settings } from '../src/renderer/App';

describe('GitHub Secret Integration Test', () => {
  let apiKey: string | null;

  beforeAll(() => {
    // Try to get API key from environment (GitHub secret)
    apiKey = getAPIKeyFromEnv();
  });

  describe('GitHub Secret Accessibility', () => {
    it('should be able to access OPENROUTER_API_KEY GitHub secret', () => {
      if (process.env.CI) {
        // In CI environment, the secret should be available
        expect(apiKey).toBeTruthy();
        expect(typeof apiKey).toBe('string');
        expect(apiKey!.length).toBeGreaterThan(20);
        
        console.log('✅ GitHub secret OPENROUTER_API_KEY is accessible in CI environment');
      } else {
        // In local development, secret may not be available - this is expected
        console.log('⚠️  Running in local environment - GitHub secret may not be available');
        console.log('   Set OPENROUTER_API_KEY environment variable for local testing');
        
        if (!apiKey) {
          console.log('📋 To test locally, run: export OPENROUTER_API_KEY="your-api-key"');
          // Don't fail the test in local dev when no key is present
          expect(true).toBe(true);
        } else {
          // If a key is present locally, it should be valid
          expect(apiKey).toBeTruthy();
          expect(typeof apiKey).toBe('string');
          expect(apiKey.length).toBeGreaterThan(20);
        }
      }
    });

    it('should have valid API key format when available', () => {
      if (apiKey) {
        const validation = validateAPIKey(apiKey, 'https://openrouter.ai/api/v1');
        expect(validation.valid).toBe(true);
        console.log(`✅ API key format validation: ${validation.message}`);
      } else {
        console.log('⏭️  Skipping format validation - no API key available');
      }
    });
  });

  describe('API Integration Test', () => {
    let apiService: APIService;

    beforeEach(() => {
      if (apiKey) {
        const testSettings: Settings = {
          apiKey: apiKey,
          selectedModel: 'openai/gpt-3.5-turbo',
          apiEndpoint: 'https://openrouter.ai/api/v1',
          fozzieMode: false,
          theme: 'light',
          maxTokens: 50,
          temperature: 0.7,
        };
        apiService = new APIService(testSettings);
      }
    });

    it('should successfully connect to OpenRouter API with GitHub secret', async () => {
      if (!apiKey) {
        console.log('⏭️  Skipping API connection test - no API key available');
        return;
      }

      console.log('🌐 Testing API connection with GitHub secret...');
      
      const result = await apiService.testConnection();
      
      expect(result.success).toBe(true);
      expect(result.message).toBe('Connection successful');
      expect(result.model).toBeDefined();
      
      console.log(`✅ API connection successful!`);
      console.log(`   Model: ${result.model}`);
      console.log(`   Response: ${result.message}`);
    }, 30000); // 30 second timeout for API call

    it('should successfully send a test message', async () => {
      if (!apiKey) {
        console.log('⏭️  Skipping message test - no API key available');
        return;
      }

      console.log('💬 Testing message sending with GitHub secret...');
      
      const testMessages = [
        {
          role: 'user' as const,
          content: 'Hello! This is a test from FozzieDesktop. Please respond with just "Test successful".'
        }
      ];

      const response = await apiService.sendChatMessage(testMessages);
      
      expect(response).toBeDefined();
      expect(typeof response).toBe('string');
      expect(response.length).toBeGreaterThan(0);
      
      console.log(`✅ Message test successful!`);
      console.log(`   Response: "${response}"`);
    }, 30000);
  });

  describe('Environment Suggestions', () => {
    it('should provide helpful guidance for development setup', () => {
      if (!apiKey && !process.env.CI) {
        console.log('\n📚 DEVELOPMENT SETUP GUIDANCE:');
        console.log('');
        console.log('🔑 To use the API in local development:');
        console.log('');
        console.log('1. Create a .env file in the project root:');
        console.log('   echo "OPENROUTER_API_KEY=your-api-key-here" > .env');
        console.log('');
        console.log('2. Or set environment variable:');
        console.log('   export OPENROUTER_API_KEY="your-api-key-here"');
        console.log('');
        console.log('3. Get an API key from: https://openrouter.ai/keys');
        console.log('');
        console.log('4. Run tests: npm run test:api');
        console.log('');
        console.log('🏗️  In GitHub Actions:');
        console.log('   The OPENROUTER_API_KEY secret should be automatically available');
        console.log('   and accessible through process.env.OPENROUTER_API_KEY');
        console.log('');
      }
      
      // This test always passes - it's just for informational output
      expect(true).toBe(true);
    });
  });
});