import { defineConfig } from "tsdown";

// Shared build config for every package. tsdown finds it by searching up
// from the package directory, so package build scripts are just `tsdown`.
export default defineConfig({
  entry: "index.ts",
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  // Emit index.js / index.d.ts (not .cjs / .d.cts): `main` and `types` in
  // every package.json point to them.
  fixedExtension: false,
  outputOptions: {
    // Without this, a module with only `export default` plus `export *` from
    // another package compiles to `module.exports = default`, and `require`
    // loses the re-exported names.
    exports: "named",
  },
});
