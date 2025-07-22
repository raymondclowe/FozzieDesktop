module.exports = {
  presets: [
    ['@babel/preset-env', {
      targets: {
        node: 'current'
      }
    }],
    ['@babel/preset-typescript', {
      allowDeclareFields: true
    }]
  ],
  env: {
    test: {
      plugins: [
        // Only apply istanbul instrumentation in test environment to prevent double instrumentation
        ['babel-plugin-istanbul', {
          exclude: [
            '**/*.test.ts',
            '**/*.test.tsx',
            '**/*.spec.ts',
            '**/*.spec.tsx',
            '**/tests/**',
            '**/node_modules/**',
            '**/dist/**',
            '**/coverage/**'
          ]
        }]
      ]
    }
  }
};