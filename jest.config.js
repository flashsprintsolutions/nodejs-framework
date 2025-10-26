/* eslint-disable no-undef */
const esmModule = [
  'uuid',
];

module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts'],
  moduleFileExtensions: ['ts', 'js', 'mjs', 'cjs'],
  coverageProvider: 'v8',
  setupFilesAfterEnv: ['./test/setup.ts'],
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc/jest', {
      jsc: {
        parser: { syntax: 'typescript', decorators: true },
        target: 'es2021',
        transform: { legacyDecorator: true, decoratorMetadata: true },
      },
      module: { type: 'commonjs' },
    }],
  },
  extensionsToTreatAsEsm: ['.ts'],
  transformIgnorePatterns: [`/node_modules/(?!(${esmModule.join('|')})/)`],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  clearMocks: true,
  verbose: false,
  reporters: [
    ['jest-simple-dot-reporter', { color: true }]
  ],
};
