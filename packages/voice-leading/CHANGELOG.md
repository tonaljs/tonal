# @tonaljs/voice-leading

## 5.1.1

### Patch Changes

- Updated dependencies [b791283]
  - @tonaljs/note@4.12.0

## 5.1.0

### Minor Changes

- 56d89f7: #### `default` export is deprecated for @tonaljs modules

  Using default exports for single packages are deprecated, so instead of:

  ```js
  import Note from "@tonaljs/note";
  ```

  You should do this:

  ```js
  import * as Note from "@tonaljs/note";
  ```

  The same for all modules.

### Patch Changes

- Updated dependencies [b113754]
- Updated dependencies [3cd5f16]
  - @tonaljs/note@4.11.0

## 5.0.3

### Patch Changes

- @tonaljs/note@4.10.3

## 5.0.2

### Patch Changes

- Dependencies between packages are now fixed
- Updated dependencies
  - @tonaljs/note@4.10.2

## 5.0.1

### Patch Changes

- Named type was renamed to NamedPitch. Add old export for backwards compatibility
- Updated dependencies
  - @tonaljs/note@4.10.1

## 5.0.0

### Major Changes

- 15017c0: First published version

## 4.8.0

### Minor Changes

- - fix time signature parsing
  - add support for irrational time signatures
  - add option `assumePerfectFifth` to `Chord.detect` function

### Patch Changes

- Updated dependencies
  - @tonaljs/note@4.8.0

## 4.7.2

### Patch Changes

- Unify package versions
- Updated dependencies
  - @tonaljs/note@4.7.2

## 4.7.1

### Patch Changes

- fix npm publish problem
- Updated dependencies
  - @tonaljs/note@4.7.1

## 4.7.0

### Minor Changes

- b120fc42: Publish tonal in `tonal` package. So use `npm install tonal` instead of `npm install @tonaljs/tonal`

### Patch Changes

- fix memory leak
- Updated dependencies
- Updated dependencies [b120fc42]
  - @tonaljs/note@4.7.0

## 4.6.6

### Patch Changes

- Bug fixing
- Updated dependencies
  - @tonaljs/note@4.6.10
