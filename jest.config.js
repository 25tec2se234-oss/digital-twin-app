module.exports = {
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/tests/env.setup.js'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  roots: ['<rootDir>/tests'],
  testMatch: ['**/*.test.js'],
  watchPathIgnorePatterns: [
    '<rootDir>/extensions/',
    '<rootDir>/my-app/',
    '<rootDir>/digital-twin-project/'
  ],
  moduleNameMapper: {
    '^dompurify$': '<rootDir>/tests/__mocks__/dompurify.js',
    '^jsdom$': '<rootDir>/tests/__mocks__/jsdom.js'
  }
};
