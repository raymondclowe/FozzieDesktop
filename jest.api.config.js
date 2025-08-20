/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: [
    '**/github-secret.test.ts',
    '**/providers.test.ts'
  ],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      useESM: false,
    }],
  },
  setupFilesAfterEnv: ['<rootDir>/tests/api-setup.ts'],
  testTimeout: 30000,
  verbose: true,
};