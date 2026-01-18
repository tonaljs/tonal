# @tonaljs/scale-type

## 4.9.2

### Patch Changes

- - Fix neapolitan spelling (#480)
  - Fix scale uppercase problem (#482)

## 4.9.1

### Patch Changes

- @tonaljs/pcset@4.10.1

## 4.9.0

### Minor Changes

- b113754: #### `default` export is deprecated for @tonaljs modules

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
  - @tonaljs/pcset@4.10.0

## 4.8.5

### Patch Changes

- Updated dependencies [48fecc4]
- Updated dependencies [48fecc4]
  - @tonaljs/core@5.0.0
  - @tonaljs/pcset@4.9.2

## 4.8.4

### Patch Changes

- Dependencies between packages are now fixed
- Updated dependencies
  - @tonaljs/pcset@4.9.1
  - @tonaljs/core@4.10.4

## 4.8.3

### Patch Changes

- Named type was renamed to NamedPitch. Add old export for backwards compatibility
- Updated dependencies
  - @tonaljs/core@4.10.3
  - @tonaljs/pcset@4.8.3

## 4.8.1

### Patch Changes

- Fix order of scales to show most common first
- Updated dependencies
  - @tonaljs/pcset@4.8.1

## 4.8.0

### Minor Changes

- - fix time signature parsing
  - add support for irrational time signatures
  - add option `assumePerfectFifth` to `Chord.detect` function

### Patch Changes

- Updated dependencies
  - @tonaljs/core@4.8.0
  - @tonaljs/pcset@4.8.0

## 4.7.2

### Patch Changes

- Unify package versions
- Updated dependencies
  - @tonaljs/core@4.7.2
  - @tonaljs/pcset@4.7.2

## 4.7.1

### Patch Changes

- fix npm publish problem
- Updated dependencies
  - @tonaljs/core@4.6.12
  - @tonaljs/pcset@4.7.1

## 4.7.0

### Minor Changes

- b120fc42: Publish tonal in `tonal` package. So use `npm install tonal` instead of `npm install @tonaljs/tonal`

### Patch Changes

- fix memory leak
- Updated dependencies
- Updated dependencies [b120fc42]
  - @tonaljs/core@4.6.11
  - @tonaljs/pcset@4.7.0

## 4.6.10

### Patch Changes

- Bug fixing
- Updated dependencies
  - @tonaljs/core@4.6.10
  - @tonaljs/pcset@4.6.10
