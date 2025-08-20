# API Provider Configuration Guide

FozzieDesktop supports multiple AI providers for real API testing and production use. This guide explains how to configure API keys as GitHub secrets and environment variables.

## Supported Providers

### 🥇 Recommended: OpenRouter
- **Cost-effective** with access to 100+ models
- **Free tier** available with some models
- **API Endpoint**: `https://openrouter.ai/api/v1`
- **Key Format**: `sk-or-v1-...`
- **Get API Key**: [https://openrouter.ai/keys](https://openrouter.ai/keys)

### ⚡ Speed: Groq
- **Ultra-fast inference** (fastest in industry)
- **Free tier** with generous limits
- **API Endpoint**: `https://api.groq.com/openai/v1`
- **Key Format**: `gsk_...`
- **Get API Key**: [https://console.groq.com/keys](https://console.groq.com/keys)

### ☁️ Integration: Cloudflare AI
- **Workers AI integration**
- **Cost-effective** for high volume
- **API Endpoint**: `https://api.cloudflare.com/client/v4/accounts/{account_id}/ai/v1`
- **Key Format**: Variable (Cloudflare API token)
- **Get API Key**: [https://dash.cloudflare.com/profile/api-tokens](https://dash.cloudflare.com/profile/api-tokens)

### 🏢 Official: OpenAI
- **Official OpenAI models**
- **Latest features first**
- **API Endpoint**: `https://api.openai.com/v1`
- **Key Format**: `sk-...`
- **Get API Key**: [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)

## GitHub Secrets Configuration

### For Repository Maintainers

1. **Navigate to Repository Settings**
   ```
   GitHub Repository → Settings → Secrets and variables → Actions
   ```

2. **Add Repository Secrets** (add one or more):
   - `OPENROUTER_API_KEY`: Your OpenRouter API key
   - `OPENAI_API_KEY`: Your OpenAI API key  
   - `GROQ_API_KEY`: Your Groq API key
   - `CLOUDFLARE_API_KEY`: Your Cloudflare API token
   - `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare Account ID (required for Cloudflare AI)

3. **Priority Order** (first available is used):
   ```
   OPENROUTER_API_KEY > OPENAI_API_KEY > CLOUDFLARE_API_KEY > GROQ_API_KEY > AI_API_KEY > API_KEY
   ```

### For GitHub Actions Workflows

The secrets are automatically available in GitHub Actions:

```yaml
- name: Run API Tests
  env:
    OPENROUTER_API_KEY: ${{ secrets.OPENROUTER_API_KEY }}
    GROQ_API_KEY: ${{ secrets.GROQ_API_KEY }}
  run: npm run test:api
```

## Local Development Setup

### Option 1: Environment Variables
```bash
export OPENROUTER_API_KEY="sk-or-v1-your-key-here"
export GROQ_API_KEY="gsk_your-key-here"
export OPENAI_API_KEY="sk-your-key-here"
```

### Option 2: .env File
```bash
# Copy the example file
cp .env.example .env

# Edit with your API keys
nano .env
```

### Example .env Content
```env
# Choose one or more providers
OPENROUTER_API_KEY=sk-or-v1-your-openrouter-key-here
GROQ_API_KEY=gsk_your-groq-key-here
OPENAI_API_KEY=sk-your-openai-key-here

# For Cloudflare AI
CLOUDFLARE_API_KEY=your-cloudflare-token-here
CLOUDFLARE_ACCOUNT_ID=your-account-id-here
```

## Testing Configuration

### Run API Tests
```bash
# Test with whatever API key is available
npm run test:api

# Test all providers (if keys available)
npm test -- tests/providers.test.ts

# Test GitHub secret integration
npm test -- tests/github-secret.test.ts
```

### Test Output Examples

✅ **Successful Configuration:**
```
✅ GitHub secret OPENROUTER_API_KEY is accessible
✅ API key format validation: Valid OpenRouter API key format
🌐 Testing REAL API connection...
✅ Real API connection successful!
   Model: openai/gpt-3.5-turbo
   Response: Hello! How can I help you today?
```

⚠️ **Missing Configuration:**
```
⚠️ Running in GitHub Actions but API key not accessible
🔧 To configure the secret:
   1. Go to repository Settings → Secrets and variables → Actions
   2. Add a new repository secret named OPENROUTER_API_KEY
   3. Set the value to your OpenRouter API key
```

## Cost Considerations

### Free Tiers
- **Groq**: Generous free tier with fast models
- **OpenRouter**: Some free models available
- **Cloudflare AI**: Pay-per-use, very cheap

### Recommended for Testing
1. **Groq** - Free and very fast
2. **OpenRouter** - Access to free models + paid options
3. **Cloudflare AI** - Extremely cheap pay-per-use

### Cost-Effective Models
- `openai/gpt-3.5-turbo` (OpenRouter)
- `llama-3.1-8b-instant` (Groq - free)
- `@cf/meta/llama-3.1-8b-instruct` (Cloudflare)

## Security Best Practices

✅ **DO:**
- Use GitHub secrets for repository API keys
- Use environment variables for local development
- Rotate API keys regularly
- Use least-privilege API tokens

❌ **DON'T:**
- Commit API keys to version control
- Share API keys in plain text
- Use production keys for testing
- Store keys in code or comments

## Troubleshooting

### Common Issues

**API Key Not Found:**
```bash
# Check if environment variable is set
echo $OPENROUTER_API_KEY

# Check .env file exists and has content
cat .env
```

**Invalid Key Format:**
- OpenRouter keys start with `sk-or-v1-`
- OpenAI keys start with `sk-`
- Groq keys start with `gsk_`
- Cloudflare uses flexible token format

**Cloudflare Account ID Missing:**
```bash
# Required for Cloudflare AI
export CLOUDFLARE_ACCOUNT_ID="your-account-id"
```

**GitHub Actions Secret Not Accessible:**
1. Check repository settings
2. Verify secret name spelling
3. Ensure workflow has access to secrets
4. Check organization/repository permissions

### Test Commands

```bash
# Test specific provider
OPENROUTER_API_KEY="your-key" npm test -- tests/github-secret.test.ts

# Test provider detection
npm test -- tests/providers.test.ts

# Test all API functionality
npm run test:modules
```

## Provider Endpoint Examples

```typescript
// OpenRouter
const settings = {
  apiKey: process.env.OPENROUTER_API_KEY,
  apiEndpoint: 'https://openrouter.ai/api/v1',
  selectedModel: 'openai/gpt-3.5-turbo'
};

// Groq
const settings = {
  apiKey: process.env.GROQ_API_KEY,
  apiEndpoint: 'https://api.groq.com/openai/v1',
  selectedModel: 'llama-3.1-8b-instant'
};

// Cloudflare AI
const settings = {
  apiKey: process.env.CLOUDFLARE_API_KEY,
  apiEndpoint: `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/v1`,
  selectedModel: '@cf/meta/llama-3.1-8b-instruct'
};
```

This configuration ensures reliable, cost-effective testing with real API calls while maintaining security best practices.