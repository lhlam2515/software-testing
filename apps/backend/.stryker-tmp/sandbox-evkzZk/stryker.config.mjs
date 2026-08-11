/** @type {import('@stryker-mutator/api/core').PartialStrykerOptions} */
// @ts-nocheck

export default {
  testRunner: "jest",
  jest: {
    configFile: "jest.config.js",
  },
  mutate: ["server.js"],
  
  // coverageAnalysis: "perTest",
  coverageAnalysis: "off",

  reporters: ["html", "clear-text", "progress"],
  htmlReporter: {
    fileName: "reports/mutation/mutation.html",
  },
  timeoutMS: 60000,
  timeoutFactor: 2,
  concurrency: 1,
  //remove jitless
};
