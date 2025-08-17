import { Settings } from '../renderer/App';

export interface ChatCompletionRequest {
  model: string;
  messages: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
  }>;
  max_tokens?: number;
  temperature?: number;
  stream?: boolean;
}

export interface ChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: 'assistant';
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export class APIService {
  private settings: Settings;

  constructor(settings: Settings) {
    this.settings = settings;
  }

  async sendChatMessage(messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>): Promise<string> {
    if (!this.settings.apiKey) {
      throw new Error('API key is required. Please configure your API key in settings.');
    }

    const request: ChatCompletionRequest = {
      model: this.settings.selectedModel,
      messages,
      max_tokens: this.settings.maxTokens,
      temperature: this.settings.temperature,
    };

    try {
      const provider = detectProvider(this.settings.apiEndpoint);
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.settings.apiKey}`,
      };

      // Add provider-specific headers
      if (provider?.headers) {
        Object.assign(headers, provider.headers);
      }

      // Handle Cloudflare AI special case (requires account ID in URL)
      let endpoint = this.settings.apiEndpoint;
      if (provider?.name === 'Cloudflare AI' && endpoint.includes('{account_id}')) {
        const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
        if (!accountId) {
          throw new Error('CLOUDFLARE_ACCOUNT_ID environment variable is required for Cloudflare AI');
        }
        endpoint = endpoint.replace('{account_id}', accountId);
      }

      const response = await fetch(`${endpoint}/chat/completions`, {
        method: 'POST',
        headers,
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`API request failed (${response.status}): ${errorData.error?.message || response.statusText}`);
      }

      const data: ChatCompletionResponse = await response.json();
      
      if (!data.choices || data.choices.length === 0) {
        throw new Error('No response from AI provider');
      }

      return data.choices[0].message.content;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to communicate with AI provider');
    }
  }

  private isOpenRouter(): boolean {
    return this.settings.apiEndpoint.includes('openrouter.ai');
  }

  getProviderInfo(): ProviderConfig | null {
    return detectProvider(this.settings.apiEndpoint);
  }

  async testConnection(): Promise<{ success: boolean; message: string; model?: string }> {
    try {
      const testMessages = [
        { role: 'user' as const, content: 'Hello, this is a connection test. Please respond with "Connection successful".' }
      ];

      const response = await this.sendChatMessage(testMessages);
      
      return {
        success: true,
        message: response || 'Connection successful',
        model: this.settings.selectedModel,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('API connection test failed:', errorMessage);
      
      return {
        success: false,
        message: errorMessage,
      };
    }
  }
}

// Utility function to check if API key is valid format
export function validateAPIKey(apiKey: string, endpoint: string): { valid: boolean; message: string } {
  if (!apiKey || apiKey.trim().length === 0) {
    return { valid: false, message: 'API key is required' };
  }

  // Minimum length check (except for Cloudflare which can have different formats)
  if (apiKey.length < 10) {
    return { valid: false, message: 'API key appears to be too short' };
  }

  const provider = detectProvider(endpoint);
  if (provider) {
    // Validate based on known provider format
    if (provider.keyPrefix && !apiKey.startsWith(provider.keyPrefix)) {
      return { 
        valid: false, 
        message: `${provider.name} API keys should start with "${provider.keyPrefix}"` 
      };
    }
    return { valid: true, message: `Valid ${provider.name} API key format` };
  }

  // Basic format validation for unknown providers
  if (endpoint.includes('openrouter')) {
    if (!apiKey.startsWith('sk-or-v1-')) {
      return { valid: false, message: 'OpenRouter API keys should start with "sk-or-v1-"' };
    }
  } else if (endpoint.includes('openai')) {
    if (!apiKey.startsWith('sk-')) {
      return { valid: false, message: 'OpenAI API keys should start with "sk-"' };
    }
  } else if (endpoint.includes('groq')) {
    if (!apiKey.startsWith('gsk_')) {
      return { valid: false, message: 'Groq API keys should start with "gsk_"' };
    }
  } else if (endpoint.includes('cloudflare')) {
    // Cloudflare API keys are more flexible
    if (apiKey.length < 20) {
      return { valid: false, message: 'Cloudflare API key appears to be too short' };
    }
  }

  return { valid: true, message: 'API key format is valid' };
}

// Environment variable handling
export function getAPIKeyFromEnv(): string | null {
  // Check multiple possible environment variable names
  const envVars = [
    'OPENROUTER_API_KEY',
    'OPENAI_API_KEY',
    'CLOUDFLARE_API_KEY',
    'GROQ_API_KEY',
    'AI_API_KEY',
    'API_KEY'
  ];

  for (const envVar of envVars) {
    const value = process.env[envVar];
    if (value && value.trim().length > 0) {
      return value.trim();
    }
  }

  return null;
}

// Provider configuration
export interface ProviderConfig {
  name: string;
  endpoint: string;
  models: string[];
  keyPrefix: string;
  headers?: Record<string, string>;
}

export const SUPPORTED_PROVIDERS: Record<string, ProviderConfig> = {
  openrouter: {
    name: 'OpenRouter',
    endpoint: 'https://openrouter.ai/api/v1',
    models: [
      'openai/gpt-4o-mini',
      'openai/gpt-3.5-turbo',
      'anthropic/claude-3-haiku',
      'meta-llama/llama-3.1-8b-instruct:free',
      'microsoft/wizardlm-2-8x22b',
      'google/gemma-2-9b-it:free'
    ],
    keyPrefix: 'sk-or-v1-',
    headers: {
      'HTTP-Referer': 'https://github.com/raymondclowe/FozzieDesktop',
      'X-Title': 'FozzieDesktop'
    }
  },
  openai: {
    name: 'OpenAI',
    endpoint: 'https://api.openai.com/v1',
    models: [
      'gpt-4o-mini',
      'gpt-3.5-turbo',
      'gpt-4o',
      'gpt-4-turbo'
    ],
    keyPrefix: 'sk-'
  },
  cloudflare: {
    name: 'Cloudflare AI',
    endpoint: 'https://api.cloudflare.com/client/v4/accounts/{account_id}/ai/v1',
    models: [
      '@cf/meta/llama-3.1-8b-instruct',
      '@cf/microsoft/phi-2',
      '@cf/mistral/mistral-7b-instruct-v0.1',
      '@hf/thebloke/codellama-7b-instruct-awq'
    ],
    keyPrefix: ''
  },
  groq: {
    name: 'Groq',
    endpoint: 'https://api.groq.com/openai/v1',
    models: [
      'llama-3.1-70b-versatile',
      'llama-3.1-8b-instant',
      'mixtral-8x7b-32768',
      'gemma2-9b-it'
    ],
    keyPrefix: 'gsk_'
  }
};

export function detectProvider(endpoint: string): ProviderConfig | null {
  for (const provider of Object.values(SUPPORTED_PROVIDERS)) {
    if (endpoint.includes(provider.endpoint.split('/')[2])) {
      return provider;
    }
  }
  return null;
}