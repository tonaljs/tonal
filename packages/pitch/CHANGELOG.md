# @tonaljs/pitch

## 5.0.3

### Patch Changes

- 4694a12: - Build `dist/index.js` and `dist/index.d.ts` again, so the `main` and `types` entries of every package resolve. Since the tsdown migration the build wrote `index.cjs` and `index.d.cts` instead, and `require("tonal")` or `import "tonal"` in Node failed with "Cannot find module".

## 5.0.2

### Patch Changes

- 48fecc4: Improve `isPitch` detection to accept `NaN` as values.

## 5.0.1

### Patch Changes

- Named type was renamed to NamedPitch. Add old export for backwards compatibility

## 5.0.0

First release
