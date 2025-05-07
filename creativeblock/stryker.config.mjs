// @ts-check
/** @type {import('@stryker-mutator/api/core').PartialStrykerOptions} */
const config = {
  _comment:
    "This config was generated using 'stryker init'. Please see the guide for more information: https://stryker-mutator.io/docs/stryker-js/guides/react",
  mutate:["./classes/IdeaTextModule.tsx"],
  testRunner: "jest",
  reporters: ["progress", "clear-text", "html"],
  coverageAnalysis: "off",
  jest: {
    projectType: "custom",
    configFile: "jest.config.ts",
    config: {
      testEnvironment: "jest-environment-jsdom-sixteen"
    },
    enableFindRelatedTests: true
  },
  checkers: ["typescript"],
  tsconfigFile: "tsconfig.json",
  typescriptChecker: {
    prioritizePerformanceOverAccuracy: true
  }
};
export default config;