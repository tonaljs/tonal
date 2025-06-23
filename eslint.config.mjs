import globals from "globals";
import js from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";

export default [
  {
    files: ["packages/**/*.ts"],
    ignores: [
      "node_modules/",
      "packages/**/dist/*",
    ],

    languageOptions: {
      globals: {
        ...globals.browser, // Standard browser globals (e.g., window, document)
        ...globals.node,    // Standard Node.js globals (e.g., process, require)
      },
      ecmaVersion: "latest",
      sourceType: "module",
      parser: tsParser,

      parserOptions: {
        project: "./tsconfig.json", // Adjust this path if your main tsconfig is elsewhere
        ecmaFeatures: {
        },
      },
    },

    plugins: {
      "@typescript-eslint": tsPlugin,
    },

    rules: {
      ...js.configs.recommended.rules,
      ...tsPlugin.configs["eslint-recommended"].rules,
      ...tsPlugin.configs.recommended.rules,
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],

    },
  },
];
