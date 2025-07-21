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
      const response = await fetch(`${this.settings.apiEndpoint}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.settings.apiKey}`,
          ...(this.isOpenRouter() && {
            'HTTP-Referer': 'https://github.com/raymondclowe/FozzieDesktop',
            'X-Title': 'FozzieDesktop',
          }),
        },
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

  async testConnection(): Promise<{ success: boolean; message: string; model?: string }> {
    try {
      const testMessages = [
        { role: 'user' as const, content: 'Hello, this is a connection test. Please respond with "Connection successful".' }
      ];

      const response = await this.sendChatMessage(testMessages);
      
      return {
        success: true,
        message: 'Connection successful',
        model: this.settings.selectedModel,
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }
}

// Utility function to check if API key is valid format
export function validateAPIKey(apiKey: string, provider: string): { valid: boolean; message: string } {
  if (!apiKey || apiKey.trim().length === 0) {
    return { valid: false, message: 'API key is required' };
  }

  if (apiKey.length < 20) {
    return { valid: false, message: 'API key appears to be too short' };
  }

  // Basic format validation
  if (provider.includes('openrouter')) {
    if (!apiKey.startsWith('sk-or-v1-')) {
      return { valid: false, message: 'OpenRouter API keys should start with "sk-or-v1-"' };
    }
  } else if (provider.includes('openai')) {
    if (!apiKey.startsWith('sk-')) {
      return { valid: false, message: 'OpenAI API keys should start with "sk-"' };
    }
  } else {
    // For other providers, just check basic format
    if (!apiKey.startsWith('sk-')) {
      return { valid: false, message: 'API key should start with "sk-"' };
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