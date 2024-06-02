/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/strict-type-checked",
    "plugin:@typescript-eslint/stylistic-type-checked",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "plugin:jsx-a11y/recommended",
    "plugin:unicorn/recommended",
    "next/core-web-vitals",
    "prettier",
  ],
  plugins: ["no-relative-import-paths", "simple-import-sort"],
  parserOptions: { project: true },
  settings: { "import/resolver": "typescript" },
  rules: {
    "no-useless-return": "error",
    "no-useless-rename": "error",
    "no-restricted-imports": [
      "error",
      { patterns: ["~/app*", "~/script*", "~/lib/*/"] },
    ],
    "no-restricted-globals": ["error", "window"],
    "object-shorthand": "error",
    "arrow-body-style": "error",
    "lines-around-directive": "error",
    curly: ["error", "multi-or-nest", "consistent"],
    quotes: "off",
    "@typescript-eslint/quotes": ["error", "double", { avoidEscape: true }],
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": [
      "error",
      { ignoreRestSiblings: true },
    ],
    "@typescript-eslint/no-import-type-side-effects": "error",
    "@typescript-eslint/consistent-type-imports": "error",
    "@typescript-eslint/explicit-function-return-type": [
      "error",
      {
        allowConciseArrowFunctionExpressionsStartingWithVoid: true,
        allowExpressions: true,
        allowIIFEs: true,
      },
    ],
    "import/first": "error",
    "import/newline-after-import": "error",
    "import/consistent-type-specifier-style": ["error", "prefer-top-level"],
    "import/no-cycle": "error",
    "import/no-self-import": "error",
    "import/no-useless-path-segments": ["error", { noUselessIndex: true }],
    "no-relative-import-paths/no-relative-import-paths": [
      "error",
      { prefix: "~", allowSameFolder: true },
    ],
    "simple-import-sort/imports": [
      "error",
      {
        groups: [
          ["client", "server"].map((env) => `^\\u0000${env}-only$`), // Runtime environments
          ["^\\u0000[^\\.]"], // External side-effects
          ["^\\u0000~\\/"], // Internal side-effects
          ["^\\u0000\\.\\."], // Parent side-effects
          ["^\\u0000\\.[^\\.]"], // Relative side-effects
          ["\\u0000$"], // External types
          ["^~\\/.*\\u0000$"], // Internal types
          ["^\\.\\..*\\u0000$"], // Parent types
          ["^\\.[^\\.].*\\u0000$"], // Relative types
          ["^[^\\.]"], // External modules
          ["^~\\/"], // Internal modules
          ["^\\.\\."], // Parent modules
          ["^\\.[^\\.]"], // Relative modules
        ],
      },
    ],
    "simple-import-sort/exports": "error",
    "react/self-closing-comp": "error",
    "react/jsx-no-useless-fragment": ["error", { allowExpressions: true }],
    "react/jsx-curly-brace-presence": "error",
    "react/jsx-filename-extension": [
      "error",
      { allow: "as-needed", extensions: [".tsx"] },
    ],
    "unicorn/prevent-abbreviations": [
      "error",
      {
        replacements: {
          env: { environment: false },
          lib: { library: false },
          ref: { reference: false },
          param: { parameter: false },
          params: { parameters: false },
          prop: { property: false },
          props: { properties: false },
          arg: { argument: false },
          args: { arguments: false },
        },
      },
    ],
    "unicorn/catch-error-name": ["error", { ignore: [/^cause$/] }],
  },
  overrides: [
    {
      files: "./lib.d.ts",
      rules: {
        "@typescript-eslint/no-empty-interface": [
          "error",
          { allowSingleExtends: true },
        ],
      },
    },
    {
      files: ["./*.{ts,tsx}", "lib/*.{ts,tsx}"],
      rules: {
        "no-relative-import-paths/no-relative-import-paths": [
          "error",
          { prefix: "~", allowSameFolder: false },
        ],
      },
    },
  ],
};
