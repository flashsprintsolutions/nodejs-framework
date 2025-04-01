const importPlugin = require("eslint-plugin-import");
const { configs } = require("@eslint/js");
const promisePlugin = require("eslint-plugin-promise");
const typescriptEslintParser = require("@typescript-eslint/parser"); // Import parser object
const typescriptEslintPlugin = require("@typescript-eslint/eslint-plugin"); // Import plugin

module.exports = [
  { ignores: ["./src/allocation-set"] },
  configs.recommended,
  {
    files: ["**/*.ts", "**/*.tsx", "*.ts", "*.tsx"],
    languageOptions: {
      parser: typescriptEslintParser, // Use parser object directly
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
        project: "./tsconfig.json",
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {},
    },
    plugins: {
      import: importPlugin,
      promise: promisePlugin,
      "@typescript-eslint": typescriptEslintPlugin,
    },
    settings: {
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx']
        },
      },
    },
    rules: {
      ...importPlugin.configs.recommended.rules,
      ...promisePlugin.configs.recommended.rules,
      ...typescriptEslintPlugin.configs.recommended.rules,
      ...typescriptEslintPlugin.configs["recommended-requiring-type-checking"].rules,
      "semi": ["error"],
      "import/order": ["error"],
      "quotes": ["error", "single"],
      "max-len": ["error", 140],
      "object-curly-spacing": ["error", "always"],
      "comma-dangle": ["error", "always-multiline"],
      "key-spacing": "error",
      "import/named": [0],
      "indent": ["error", 2, { "FunctionDeclaration": { "parameters": "first"}, "SwitchCase": 1 }],
      "prefer-arrow-callback": "error",
      "import/no-relative-packages": "error",
      "func-names": "error",
      "no-console": "error",
      "no-await-in-loop": ["error"],
      "no-multi-assign": ["error"],
      "@typescript-eslint/no-duplicate-type-constituents": ["error"],
      "@typescript-eslint/explicit-function-return-type": ["error"],
      "no-unused-private-class-members": ["error"],
      "no-param-reassign": ["error", {
        "props": true,
        "ignorePropertyModificationsFor": ["req", "res", "context"]
      }],
      "no-nested-ternary": ["error"],
      "max-classes-per-file": ["error"],
      "@typescript-eslint/no-unused-vars": ["error", {
        "vars": "local",
        "varsIgnorePattern": "^_",
        "args": "after-used",
        "argsIgnorePattern": "^_"
      }],
      "@typescript-eslint/no-unsafe-assignment": [0],
      "no-undef": [0],
      "object-curly-newline": ["error", { "consistent": true }],
      "prefer-destructuring": ["error", {"object": true, "array": false}],
      "no-multiple-empty-lines": "error",
      "import/no-extraneous-dependencies": ["error", { "devDependencies": true }],
      "import/extensions": ["error", "ignorePackages", { "js": "never", "jsx": "never", "ts": "never", "tsx": "never" }],
      "no-use-before-define": ["error", { "functions": true, "classes": true }],
      "@typescript-eslint/ban-ts-comment": 0,
      "new-cap": [2, { "capIsNewExceptions": ["Router", "GET", "POST", "PUT", "DELETE"] } ],
      "lines-between-class-members": ["error", "always", { "exceptAfterSingleLine": true }],
    },
  },
  {
    files: ["*.spec.ts", "*.test.ts", "**/*.spec.ts", "**/*.test.ts"],
    rules: {
      "import/no-extraneous-dependencies": [0],
      "no-unused-expressions": [0],
      "max-classes-per-file": [0],
      "promise/no-callback-in-promise": [0]
    },
    languageOptions: {
      globals: {
        describe: "readonly",
        it: "readonly",
        test: "readonly",
        expect: "readonly",
        beforeAll: "readonly",
        afterAll: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
        jest: "readonly",
      },
    },
  },
];
