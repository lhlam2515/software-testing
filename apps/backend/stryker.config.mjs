/** @type {import('@stryker-mutator/api/core').PartialStrykerOptions} */
export default {
  testRunner: 'jest',
  jest: {
    configFile: 'jest.config.js',
  },
  mutate: ['server.js'],
  coverageAnalysis: 'perTest',
  reporters: ['html', 'clear-text', 'progress'],
  htmlReporter: {
    fileName: 'reports/mutation/mutation.html',
  },
  timeoutMS: 10000,
  concurrency: 2,
};
