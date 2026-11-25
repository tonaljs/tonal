# @tonaljs/modules

## 4.8.21

### Patch Changes

- Updated dependencies [bf12819]
  - tonal@6.11.0

## 4.8.20

### Patch Changes

- Updated dependencies [6d3c02c]
- Updated dependencies [1bc3aff]
- Updated dependencies [85a4f22]
- Updated dependencies [732fe81]
- Updated dependencies [f7f99c8]
- Updated dependencies [4866365]
- Updated dependencies [8cb2ad2]
- Updated dependencies [8d007fe]
- Updated dependencies [58b37c1]
- Updated dependencies [dd77b64]
  - tonal@6.10.0

## 4.8.19

### Patch Changes

- Updated dependencies [a13e397]
- Updated dependencies [3456e6c]
- Updated dependencies [94b2e44]
  - tonal@6.9.0

## 4.8.18

### Patch Changes

- Updated dependencies [7d6ca63]
- Updated dependencies
  - tonal@6.8.0

## 4.8.17

### Patch Changes

- Updated dependencies [a328946]
- Updated dependencies [9b041bb]
- Updated dependencies [4162dde]
- Updated dependencies [9cac7a4]
- Updated dependencies [5519908]
- Updated dependencies [6c10671]
  - tonal@6.7.1

## 4.8.16

### Patch Changes

- Updated dependencies [1f86506]
- Updated dependencies [3d5530d]
- Updated dependencies [09043d6]
- Updated dependencies [d880522]
- Updated dependencies [7aa10aa]
- Updated dependencies [f2cecb3]
- Updated dependencies [f2cecb3]
- Updated dependencies [d81d784]
- Updated dependencies [e6cd704]
- Updated dependencies [8a32ef0]
- Updated dependencies [66f551a]
- Updated dependencies [223f729]
- Updated dependencies [99ee8a1]
- Updated dependencies [0ad56fe]
- Updated dependencies [f064526]
- Updated dependencies [6a92fc2]
- Updated dependencies [f035b9b]
- Updated dependencies [f2cecb3]
- Updated dependencies [bb8889d]
- Updated dependencies [6c44917]
- Updated dependencies [d21bd4b]
- Updated dependencies [b2c7821]
  - tonal@6.7.0

## 4.8.15

### Patch Changes

- Updated dependencies [61dedc5]
- Updated dependencies [875f1b7]
- Updated dependencies [875f1b7]
- Updated dependencies [012c2f2]
- Updated dependencies [b757383]
- Updated dependencies [f3b53a4]
- Updated dependencies [80a12e3]
  - tonal@6.6.0

## 4.8.14

### Patch Changes

- 4694a12: - Build `dist/index.js` and `dist/index.d.ts` again, so the `main` and `types` entries of every package resolve. Since the tsdown migration the build wrote `index.cjs` and `index.d.cts` instead, and `require("tonal")` or `import "tonal"` in Node failed with "Cannot find module".
- Updated dependencies [4694a12]
  - tonal@6.5.1

## 4.8.13

### Patch Changes

- Updated dependencies [9aeb912]
  - tonal@6.5.0

## 4.8.12

### Patch Changes

- Updated dependencies
  - tonal@6.4.3

## 4.8.11

### Patch Changes

- Updated dependencies [3c89703]
  - tonal@6.4.2

## 4.8.10

### Patch Changes

- Updated dependencies [72de4e4]
  - tonal@6.4.1

## 4.8.9

### Patch Changes

- Updated dependencies [b791283]
  - tonal@6.4.0

## 4.8.8

### Patch Changes

- Updated dependencies [33693a1]
  - tonal@6.3.0

## 4.8.7

### Patch Changes

- Updated dependencies [b113754]
- Updated dependencies [3cd5f16]
- Updated dependencies [4e05792]
- Updated dependencies [56d89f7]
  - tonal@6.2.0

## 4.8.6

### Patch Changes

- Updated dependencies [2bc58fb]
  - tonal@6.1.0

## 4.8.5

### Patch Changes

- Updated dependencies [9d8c41d]
  - tonal@6.0.1

## 4.8.x

### Patch Changes

- Updated dependencies [97f01d4]
- Updated dependencies [48fecc4]
- Updated dependencies [48fecc4]
- Updated dependencies [48fecc4]
  - tonal@6.0.0

## 4.8.3

### Patch Changes

- Dependencies between packages are now fixed
- Updated dependencies
  - tonal@5.2.1

## 4.8.2

### Patch Changes

- Named type was renamed to NamedPitch. Add old export for backwards compatibility
- Updated dependencies
  - tonal@5.1.3

## 4.8.1

### Patch Changes

- Updated dependencies [b07a54c0]
  - tonal@5.0.0

## 4.8.0

### Minor Changes

- - fix time signature parsing
  - add support for irrational time signatures
  - add option `assumePerfectFifth` to `Chord.detect` function

### Patch Changes

- Updated dependencies
  - tonal@4.8.0

## 4.7.2

### Patch Changes

- Unify package versions
- Updated dependencies
  - tonal@4.7.2

## 4.7.1

### Patch Changes

- fix npm publish problem
- Updated dependencies
  - tonal@4.7.1

## 4.7.0

### Minor Changes

- b120fc42: Publish tonal in `tonal` package. So use `npm install tonal` instead of `npm install @tonaljs/tonal`

### Patch Changes

- fix memory leak
- Updated dependencies
- Updated dependencies [b120fc42]
  - tonal@4.7.0

## 4.6.10

### Patch Changes

- Bug fixing
- Updated dependencies
  - tonal@4.6.10
