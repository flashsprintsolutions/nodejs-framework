module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts'],
  moduleFileExtensions: ['ts', 'js'],
  setupFilesAfterEnv: ['./test/setup.ts'],
  transform: {
    '^.+\\.ts$': ['ts-jest']
  },
  clearMocks: true,
  verbose: false,
  // reporters: [
  //   ['jest-simple-dot-reporter', { color: true }]
  // ],
};
