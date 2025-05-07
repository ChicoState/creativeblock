// @ts-check
/** @type {import('@stryker-mutator/api/core').PartialStrykerOptions} */
const config = {
  $schema: "./node_modules/@stryker-mutator/core/schema/stryker-schema.json",
  packageManager: "npm",
  reporters: [
    "html",
    "clear-text",
    "progress"
  ],
  checkers: ["typescript"],
  tsconfigFile: "tsconfig.json",
  concurrency: 4,
  testRunner: "jest",
  tempDirName: "stryker-tmp",
  jest: {
    projectType: "custom",
    configFile: "jest.config.ts",
    enableFindRelatedTests : false
  },
  coverageAnalysis: "perTest",
  //mutate: ["Scripts/app/utilities/formIoJsonProcessor.ts", "Scripts/app/utilities/questionnaireLanguageSelector.ts"],
  disableTypeChecks: "Scripts/app/**/*.{js,ts,jsx,tsx,html,vue}"
  };
export default config;
