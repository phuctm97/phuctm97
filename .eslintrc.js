const path = require("path");

const fs = require("fs");

const yaml = require("yaml");

const workspace = yaml.parse(
  fs.readFileSync(path.resolve(__dirname, "pnpm-workspace.yaml")).toString()
);

const jsExtensions = [".js", ".mjs", ".cjs", ".jsx"];

const tsExtensions = [
  ...jsExtensions.map((ext) => ext.replace("js", "ts")),
  ".d.ts",
];

const esExtensions = [...tsExtensions, ...jsExtensions];

const reactExtensions = esExtensions.filter((ext) => ext.endsWith("sx"));

/** @type {import('eslint').Linter.Config} */
const config = {
  root: true,
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "next/core-web-vitals",
    "prettier",
  ],
  plugins: [
    "@typescript-eslint",
    "import",
    "simple-import-sort",
    "react",
    "react-hooks",
    "jsx-a11y",
    "@next/next",
  ].reverse(),
  rules: {
    "eol-last": "error",
    "no-multiple-empty-lines": ["error", { max: 1, maxBOF: 0, maxEOF: 1 }],
    "no-unused-vars": "off",
    "no-use-before-define": "off",
    "no-constant-condition": "off",
    "lines-around-directive": ["error", { before: "never", after: "always" }],
    quotes: "off",
    "dot-notation": "error",
    "arrow-body-style": "error",
    "prefer-arrow-callback": "error",
    "require-await": "off",
    "@typescript-eslint/no-unused-vars": [
      "error",
      { ignoreRestSiblings: true },
    ],
    "@typescript-eslint/no-use-before-define": "error",
    "@typescript-eslint/no-unnecessary-condition": [
      "error",
      { allowConstantLoopConditions: true },
    ],
    "@typescript-eslint/ban-ts-comment": [
      "error",
      {
        "ts-expect-error": "allow-with-description",
        "ts-nocheck": "allow-with-description",
      },
    ],
    "@typescript-eslint/ban-types": ["error", { types: { Function: false } }],
    "@typescript-eslint/quotes": "error",
    "@typescript-eslint/consistent-type-imports": "error",
    "@typescript-eslint/consistent-type-definitions": "error",
    "@typescript-eslint/array-type": [
      "error",
      { default: "array-simple", readonly: "array-simple" },
    ],
    "@typescript-eslint/prefer-function-type": "error",
    "@typescript-eslint/explicit-function-return-type": [
      "error",
      { allowExpressions: true },
    ],
    "@typescript-eslint/require-await": "error",
    "@typescript-eslint/await-thenable": "error",
    "@typescript-eslint/no-misused-promises": "error",
    "@typescript-eslint/no-floating-promises": "error",
    "import/first": "error",
    "import/newline-after-import": "error",
    "import/namespace": ["error", { allowComputed: true }],
    "import/no-cycle": "error",
    "import/no-internal-modules": [
      "error",
      {
        allow: [
          "next/*",
          "next/font/*",
          "react-dom/*",
          "jotai/*",
          "aws-cdk-lib/*",
          "~/*",
        ],
      },
    ],
    "simple-import-sort/imports": [
      "error",
      {
        groups: [
          ["client", "server"].map((name) => `^\\u0000${name}-only$`),
          ["^\\u0000[^\\.]"],
          ["^\\u0000~\\/"],
          ["^\\u0000\\.\\."],
          ["^\\u0000\\.[^\\.]"],
          ["\\u0000$"],
          ["^~\\/.*\\u0000$"],
          ["^\\.\\..*\\u0000$"],
          ["^\\.[^\\.].*\\u0000$"],
          ["^[^\\.]"],
          ["^~\\/"],
          ["^\\.\\."],
          ["^\\.[^\\.]"],
        ],
      },
    ],
    "simple-import-sort/exports": "error",
    "react/jsx-filename-extension": [
      "error",
      { allow: "as-needed", extensions: reactExtensions },
    ],
    "react/function-component-definition": [
      "error",
      {
        namedComponents: "arrow-function",
        unnamedComponents: "arrow-function",
      },
    ],
  },
  settings: {
    "import/extensions": esExtensions,
    "import/parsers": { "@typescript-eslint/parser": tsExtensions },
    "import/resolver": {
      typescript: {
        project: workspace.packages.map(
          (package) => `${package}/tsconfig.json`
        ),
      },
    },
    react: { version: "18" },
    next: { rootDir: "apps/www" },
  },
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: workspace.packages.map((package) => `${package}/tsconfig.json`),
  },
};

module.exports = config;
