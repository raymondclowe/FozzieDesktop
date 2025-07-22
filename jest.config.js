/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  testMatch: [
    '**/__tests__/**/*.(ts|tsx|js)',
    '**/*.(test|spec).(ts|tsx|js)'
  ],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      // ts-jest configuration
      useESM: false,
      // Disable ts-jest's built-in babel processing to avoid double instrumentation
      babelConfig: false,
    }],
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  collectCoverageFrom: [
    'src/**/*.(ts|tsx)',
    '!src/**/*.d.ts',
    '!src/main/**/*', // Exclude Electron main process files
    '!src/renderer/index.tsx', // Exclude entry points
  ],
  // Ensure NODE_ENV is set to 'test' for proper Babel configuration
  setupFiles: ['<rootDir>/tests/jest-setup.js'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  modulePathIgnorePatterns: ['<rootDir>/dist/', '<rootDir>/release/'],
  testTimeout: 30000, // 30 seconds for API tests
  verbose: true,
  // Explicitly disable coverage instrumentation at Jest level since Babel handles it
  coverageProvider: 'babel',
};