/** @type {import('jest').Config} */
// @ts-nocheck

module.exports = {
  testEnvironment: "node",

  testMatch: ["**/__tests__/**/*.test.js"],

  testPathIgnorePatterns: [
    "/node_modules/",
    "/coverage/",
    "/.stryker-tmp/",
  ],

  // SQLite shared file: prevent race condition from parallel worker initialization
  maxWorkers: 1,

  collectCoverage: false,

  coverageDirectory: "coverage",

  coverageReporters: ["text", "lcov"],
};