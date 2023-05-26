const defaultCommands = [
  "prettier --write --ignore-unknown",
  "cspell --no-must-find-files",
];

const jsExtensions = ["js", "mjs", "cjs", "jsx"];

const tsExtensions = jsExtensions.map((ext) => ext.replace("js", "ts"));

const esExtensions = [...tsExtensions, ...jsExtensions];

const esPatterns = `*.{${esExtensions.join(",")}}`;

const esCommands = [
  "eslint --fix --no-error-on-unmatched-pattern",
  ...defaultCommands,
];

/** @type {import('lint-staged').Config} */
const config = {
  [`!${esPatterns}`]: defaultCommands,
  [esPatterns]: esCommands,
};

module.exports = config;
