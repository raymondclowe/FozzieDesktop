#!/usr/bin/env node
/**
 * Test script to validate OpenRouter API integration
 * This script tests the OPENROUTER_API_KEY GitHub secret and provides development setup guidance
 */

require('dotenv').config();

const https = require('https');

// Configuration
const OPENROUTER_ENDPOINT = 'https://openrouter.ai/api/v1';
const TEST_MODEL = 'openai/gpt-3.5-turbo';

// Console colors for better output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function getAPIKey() {
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
      log(`✓ Found API key in ${envVar}`, colors.green);
      return value.trim();
    }
  }

  return null;
}

function validateAPIKeyFormat(apiKey) {
  if (!apiKey || apiKey.length < 20) {
    return { valid: false, message: 'API key appears to be too short' };
  }

  if (apiKey.startsWith('sk-or-v1-')) {
    return { valid: true, message: 'Valid OpenRouter API key format' };
  } else if (apiKey.startsWith('sk-')) {
    return { valid: true, message: 'Valid OpenAI-style API key format' };
  } else {
    return { valid: false, message: 'Unknown API key format' };
  }
}

async function testAPIConnection(apiKey) {
  const requestData = JSON.stringify({
    model: TEST_MODEL,
    messages: [
      {
        role: 'user',
        content: 'Hello! This is a connection test from FozzieDesktop. Please respond with "Connection successful" to confirm the API is working.'
      }
    ],
    max_tokens: 50,
    temperature: 0.7
  });

  const options = {
    hostname: 'openrouter.ai',
    port: 443,
    path: '/api/v1/chat/completions',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': 'https://github.com/raymondclowe/FozzieDesktop',
      'X-Title': 'FozzieDesktop API Test',
      'Content-Length': Buffer.byteLength(requestData)
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          
          if (res.statusCode === 200) {
            if (response.choices && response.choices[0]) {
              resolve({
                success: true,
                message: response.choices[0].message.content,
                model: response.model,
                usage: response.usage
              });
            } else {
              resolve({
                success: false,
                message: 'Invalid response format from API'
              });
            }
          } else {
            resolve({
              success: false,
              message: `API Error (${res.statusCode}): ${response.error?.message || 'Unknown error'}`,
              statusCode: res.statusCode
            });
          }
        } catch (error) {
          resolve({
            success: false,
            message: `Failed to parse API response: ${error.message}`
          });
        }
      });
    });

    req.on('error', (error) => {
      resolve({
        success: false,
        message: `Network error: ${error.message}`
      });
    });

    req.write(requestData);
    req.end();
  });
}

function printEnvironmentHelp() {
  log('\n' + '='.repeat(60), colors.cyan);
  log('DEVELOPMENT ENVIRONMENT SETUP', colors.cyan + colors.bright);
  log('='.repeat(60), colors.cyan);
  
  log('\n📋 Setting up API key for local development:', colors.yellow);
  log('');
  log('1. Create a .env file in the project root:', colors.bright);
  log('   echo "OPENROUTER_API_KEY=your-api-key-here" > .env');
  log('');
  log('2. Or set environment variable directly:');
  log('   export OPENROUTER_API_KEY="your-api-key-here"');
  log('');
  log('3. Get an API key from OpenRouter:');
  log('   https://openrouter.ai/keys');
  log('');
  log('🔒 In CI/CD (GitHub Actions):', colors.yellow);
  log('   The OPENROUTER_API_KEY secret should be available automatically.');
  log('   If not accessible, check repository secrets configuration.');
  log('');
  log('📚 Supported environment variables (in priority order):', colors.yellow);
  log('   - OPENROUTER_API_KEY (preferred for OpenRouter)');
  log('   - OPENAI_API_KEY (for OpenAI or compatible APIs)');
  log('   - AI_API_KEY (generic)');
  log('   - API_KEY (fallback)');
  log('');
}

function printTestResults(result) {
  log('\n' + '='.repeat(60), colors.cyan);
  log('API CONNECTION TEST RESULTS', colors.cyan + colors.bright);
  log('='.repeat(60), colors.cyan);
  
  if (result.success) {
    log('\n✅ API Connection: SUCCESS', colors.green + colors.bright);
    log(`📝 AI Response: "${result.message}"`, colors.green);
    log(`🤖 Model Used: ${result.model}`, colors.blue);
    
    if (result.usage) {
      log(`📊 Token Usage: ${result.usage.total_tokens} tokens`, colors.blue);
      log(`   - Prompt: ${result.usage.prompt_tokens}`);
      log(`   - Completion: ${result.usage.completion_tokens}`);
    }
    
    log('\n🎉 The GitHub secret OPENROUTER_API_KEY is working correctly!', colors.green);
    log('   You can now use this for testing and development.', colors.green);
  } else {
    log('\n❌ API Connection: FAILED', colors.red + colors.bright);
    log(`💥 Error: ${result.message}`, colors.red);
    
    if (result.statusCode) {
      log(`🔧 HTTP Status: ${result.statusCode}`, colors.yellow);
      
      if (result.statusCode === 401) {
        log('   This usually means the API key is invalid or expired.', colors.yellow);
      } else if (result.statusCode === 429) {
        log('   This usually means rate limits are exceeded.', colors.yellow);
      } else if (result.statusCode >= 500) {
        log('   This is a server error on the API provider side.', colors.yellow);
      }
    }
  }
}

async function main() {
  log('🐻 FozzieDesktop API Test Harness', colors.magenta + colors.bright);
  log('Testing OpenRouter API integration and GitHub secrets\n');

  // Step 1: Check for API key
  log('🔍 Checking for API key...', colors.blue);
  const apiKey = getAPIKey();
  
  if (!apiKey) {
    log('❌ No API key found in environment variables', colors.red);
    printEnvironmentHelp();
    process.exit(1);
  }

  // Step 2: Validate API key format
  log('🔑 Validating API key format...', colors.blue);
  const validation = validateAPIKeyFormat(apiKey);
  
  if (validation.valid) {
    log(`✓ ${validation.message}`, colors.green);
  } else {
    log(`❌ ${validation.message}`, colors.red);
    printEnvironmentHelp();
    process.exit(1);
  }

  // Step 3: Test actual API connection
  log('🌐 Testing API connection...', colors.blue);
  log(`   Endpoint: ${OPENROUTER_ENDPOINT}`, colors.blue);
  log(`   Model: ${TEST_MODEL}`, colors.blue);
  
  const result = await testAPIConnection(apiKey);
  printTestResults(result);
  
  if (!result.success) {
    printEnvironmentHelp();
    process.exit(1);
  }

  log('\n🎯 All tests passed! The API integration is ready for use.', colors.green + colors.bright);
  log('   This confirms the GitHub secret is accessible and working.\n', colors.green);
}

// Handle errors gracefully
process.on('unhandledRejection', (error) => {
  log(`\n💥 Unhandled error: ${error.message}`, colors.red);
  process.exit(1);
});

// Run the test
if (require.main === module) {
  main().catch((error) => {
    log(`\n💥 Test failed: ${error.message}`, colors.red);
    process.exit(1);
  });
}