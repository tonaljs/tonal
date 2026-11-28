import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: [
      "packages/**/test.ts",
      "packages/**/*.test.ts",
      "integrations/**/test.ts",
      "integrations/**/*.test.ts",
    ],
    typecheck: {
      enabled: true,
      include: ["packages/**/*.test-d.ts"],
      tsconfig: "./tsconfig.typecheck.json",
    },
    coverage: {
      provider: "v8",
      exclude: ["node_modules/", "dist/", "build/", "coverage/", "site/**"],
    },
  },
});
