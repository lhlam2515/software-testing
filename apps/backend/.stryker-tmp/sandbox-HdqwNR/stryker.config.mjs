// @ts-nocheck
// /** @type {import('@stryker-mutator/api/core').PartialStrykerOptions} */
// export default {
//   testRunner: "jest",
//   jest: {
//     configFile: "jest.config.js",
//   },
//   mutate: ["server.js"],
  
//   // coverageAnalysis: "perTest",
//   coverageAnalysis: "off",

//   reporters: ["html", "clear-text", "progress"],
//   htmlReporter: {
//     fileName: "reports/mutation/mutation.html",
//   },
//   timeoutMS: 60000,
//   timeoutFactor: 2,
//   concurrency: 1,
//   //remove jitless
// };


// stryker.config.mjs
export default {
  testRunner: "command",
  commandRunner: {
    command: "npx jest --no-cache"
  },
  mutate: [
    "server.js"
  ],
  coverageAnalysis: "off",
  reporters: ["html", "clear-text", "progress"]
};
