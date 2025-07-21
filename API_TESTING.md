# API Testing and GitHub Secrets Guide

This document explains how to test the OpenRouter API integration and work with the `OPENROUTER_API_KEY` GitHub secret.

## 🔑 GitHub Secret Configuration

The repository has been configured with an `OPENROUTER_API_KEY` secret that provides access to OpenRouter's API for testing and development purposes.

### Secret Status
- ✅ **Secret Name**: `OPENROUTER_API_KEY`
- ✅ **Accessibility**: Available in GitHub Actions workflows
- ✅ **Scope**: Repository-level secret
- ✅ **Format**: OpenRouter API key (`sk-or-v1-...`)

## 🧪 Testing the API Integration

### Automated Testing in CI/CD

The GitHub Actions workflows automatically test the API integration:

```bash
# API Testing Workflow
.github/workflows/test-api.yml    # Dedicated API testing
.github/workflows/release.yml     # Includes API tests before builds
```

### Manual Testing

#### 1. Quick API Test Script
```bash
npm run test:api
```

This runs a comprehensive test that:
- ✅ Checks for API key availability
- ✅ Validates API key format  
- ✅ Tests actual API connection
- ✅ Sends a test message
- ✅ Reports detailed results

#### 2. Jest Test Suite
```bash
npm test                    # Run all tests
npm run test:ci            # CI-optimized test run
```

The test suite includes:
- Unit tests for API service functions
- Integration tests with real API calls
- GitHub secret accessibility validation
- Error handling and edge cases

## 🏗️ Local Development Setup

### Option 1: Environment Variables
```bash
export OPENROUTER_API_KEY="sk-or-v1-your-key-here"
npm run test:api
```

### Option 2: .env File
```bash
cp .env.example .env
# Edit .env and add your API key
npm run test:api
```

### Option 3: Direct CLI
```bash
OPENROUTER_API_KEY="sk-or-v1-your-key" npm run test:api
```

## 🔧 Getting Your Own API Key

If you need a personal API key for development:

1. **OpenRouter** (Recommended - access to multiple models):
   - Visit: https://openrouter.ai/keys
   - Sign up and create an API key
   - Format: `sk-or-v1-...`

2. **OpenAI** (Direct access):
   - Visit: https://platform.openai.com/api-keys
   - Create an API key
   - Format: `sk-...`

## 📊 Test Results Interpretation

### ✅ Success Indicators
```
✅ GitHub secret OPENROUTER_API_KEY is accessible
✅ API key format validation: Valid OpenRouter API key format
✅ API connection successful!
✅ Message test successful!
```

### ❌ Common Issues

#### Missing API Key
```
❌ No API key found in environment variables
```
**Solution**: Set up environment variable or .env file

#### Invalid Format
```
❌ OpenRouter API keys should start with "sk-or-v1-"
```
**Solution**: Verify your API key is copied correctly

#### Network/Auth Errors
```
❌ API Error (401): Invalid API key
```
**Solution**: Check API key validity or regenerate

#### Rate Limits
```
❌ API Error (429): Rate limit exceeded
```
**Solution**: Wait and retry, or check usage limits

## 🚀 Production Usage

### Application Integration
The app automatically detects available API keys:

1. **With API Key**: Real AI responses from configured provider
2. **Without API Key**: Falls back to mock responses with guidance

### Settings Configuration
- Open FozzieDesktop
- Go to Settings → AI Provider
- Enter your API key
- Select model and endpoint
- Test connection

## 🔍 Debugging Tips

### Check Secret Availability
```bash
# In GitHub Actions logs, look for:
echo "Key length: ${#OPENROUTER_API_KEY} characters"
```

### Local Environment Debug
```bash
node -e "console.log('API Key:', process.env.OPENROUTER_API_KEY ? 'Available' : 'Missing')"
```

### Test Script Debug Mode
```bash
DEBUG=1 npm run test:api
```

## 🔒 Security Best Practices

### ✅ Do's
- Use environment variables for API keys
- Never commit keys to version control
- Rotate keys periodically
- Use repository secrets for CI/CD
- Test with minimal permissions

### ❌ Don'ts
- Never hardcode API keys in source code
- Don't share keys in chat/email
- Don't commit .env files
- Don't use personal keys in shared environments
- Don't log full API keys

## 📚 Related Documentation

- [OpenRouter API Docs](https://openrouter.ai/docs)
- [GitHub Secrets Guide](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [FozzieDesktop README](./README.md)
- [Contributing Guide](./CONTRIBUTING.md)

## 🆘 Getting Help

If the GitHub secret isn't working:

1. **Check Repository Settings**:
   - Go to repository Settings → Secrets and variables → Actions
   - Verify `OPENROUTER_API_KEY` exists

2. **Check Workflow Logs**:
   - Look at GitHub Actions workflow runs
   - Check for secret accessibility messages

3. **Local Development Alternatives**:
   - Use personal API key in .env file
   - Contact repository maintainer for assistance
   - Use mock mode for UI development

4. **Test Command Output**:
   ```bash
   npm run test:api 2>&1 | tee api-test.log
   ```
   
   This saves full output for debugging.

---

**Last Updated**: December 2024  
**Tested With**: OpenRouter API v1, Node.js 20+, GitHub Actions