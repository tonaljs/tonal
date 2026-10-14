# @tonaljs/chord-dictionary

## 4.8.9

### Patch Changes

- 14a1f7e: Restore the named exports of the CommonJS build. Since the tsdown migration, `require("@tonaljs/chord-dictionary")` returned only the default export, without `addAlias` or `default` (and `require("@tonaljs/scale-dictionary")` also lost `NoScaleType`).

## 4.8.8

### Patch Changes

- 4694a12: - Build `dist/index.js` and `dist/index.d.ts` again, so the `main` and `types` entries of every package resolve. Since the tsdown migration the build wrote `index.cjs` and `index.d.cts` instead, and `require("tonal")` or `import "tonal"` in Node failed with "Cannot find module".
- Updated dependencies [4694a12]
  - @tonaljs/chord-type@5.2.1

## 4.8.7

### Patch Changes

- Updated dependencies [9aeb912]
  - @tonaljs/chord-type@5.2.0

## 4.8.6

### Patch Changes

- @tonaljs/chord-type@5.1.1

## 4.8.5

### Patch Changes

- Updated dependencies [b113754]
  - @tonaljs/chord-type@5.1.0

## 4.8.4

### Patch Changes

- @tonaljs/chord-type@5.0.5

## 4.8.3

### Patch Changes

- Dependencies between packages are now fixed
- Updated dependencies
  - @tonaljs/chord-type@5.0.4

## 4.8.2

### Patch Changes

- Named type was renamed to NamedPitch. Add old export for backwards compatibility
- Updated dependencies
  - @tonaljs/chord-type@5.0.3

## 4.8.1

### Patch Changes

- Updated dependencies [b07a54c0]
  - @tonaljs/chord-type@5.0.0

## 4.8.0

### Minor Changes

- - fix time signature parsing
  - add support for irrational time signatures
  - add option `assumePerfectFifth` to `Chord.detect` function

### Patch Changes

- Updated dependencies
  - @tonaljs/chord-type@4.8.0

## 4.7.2

### Patch Changes

- Unify package versions
- Updated dependencies
  - @tonaljs/chord-type@4.7.2

## 4.6.12

### Patch Changes

- fix npm publish problem
- Updated dependencies
  - @tonaljs/chord-type@4.7.1

## 4.6.11

### Patch Changes

- fix memory leak
- Updated dependencies
- Updated dependencies [b120fc42]
  - @tonaljs/chord-type@4.7.0

## 4.6.10

### Patch Changes

- Bug fixing
- Updated dependencies
  - @tonaljs/chord-type@4.6.10
