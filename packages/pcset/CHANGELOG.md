# @tonaljs/pcset

## 4.9.1

### Patch Changes

- Dependencies between packages are now fixed
- Updated dependencies
  - @tonaljs/core@4.10.4

## 4.9.0

### Minor Changes

- f21525b: Add `Pcset.notes()` function that returns the ordered pitch class notes of the given set

## 4.8.3

### Patch Changes

- Named type was renamed to NamedPitch. Add old export for backwards compatibility
- Updated dependencies
  - @tonaljs/collection@4.8.1
  - @tonaljs/core@4.10.3

## 4.8.2

### Patch Changes

- 3bec1d60: Fix setNumToChroma: it must return a string of length in order to work correctly

## 4.8.1

### Patch Changes

- Fix: function not exported

## 4.8.0

### Minor Changes

- - fix time signature parsing
  - add support for irrational time signatures
  - add option `assumePerfectFifth` to `Chord.detect` function

### Patch Changes

- Updated dependencies
  - @tonaljs/collection@4.8.0
  - @tonaljs/core@4.8.0

## 4.7.2

### Patch Changes

- Unify package versions
- Updated dependencies
  - @tonaljs/core@4.7.2
  - @tonaljs/collection@4.7.2

## 4.7.1

### Patch Changes

- fix npm publish problem
- Updated dependencies
  - @tonaljs/collection@4.7.1
  - @tonaljs/core@4.6.12

## 4.7.0

### Minor Changes

- b120fc42: Publish tonal in `tonal` package. So use `npm install tonal` instead of `npm install @tonaljs/tonal`

### Patch Changes

- fix memory leak
- Updated dependencies
- Updated dependencies [b120fc42]
  - @tonaljs/collection@4.7.0
  - @tonaljs/core@4.6.11

## 4.6.10

### Patch Changes

- Bug fixing
- Updated dependencies
  - @tonaljs/collection@4.6.10
  - @tonaljs/core@4.6.10
