// Setup for API tests that need real fetch
import 'dotenv/config';

// Mock TextEncoder/TextDecoder for Node.js environment
import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Since we run with --experimental-fetch, Node.js should already have fetch
// Just ensure it's available globally
if (typeof global.fetch === 'undefined') {
  console.log('⚠️  Fetch not available - this might be a configuration issue');
  console.log('Make sure to run with --experimental-fetch flag');
} else {
  console.log('🌐 Real fetch available for API tests');
}

// Increase timeout for API tests
jest.setTimeout(30000);