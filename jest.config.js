/**
 * @file jest.config.js
 * @url https://jestjs.io/docs/en/configuration
 */
module.exports = {
  moduleFileExtensions: [
    "js"
  ],
  testMatch: [
    "**/*.(test|spec).js"
  ],
  testPathIgnorePatterns: [
    "/bin/"
  ],
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "enzyme.js"
  ],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  coverageReporters: [
    "json",
    "lcov",
    "text",
    "text-summary"
  ],
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/__mocks__/mocks.js",
    "\\.(css|less|scss)$": "<rootDir>/__mocks__/mocks.js"
  }
};
