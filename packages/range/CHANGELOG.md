# @tonaljs/range

## 4.9.2

### Patch Changes

- Updated dependencies [3c89703]
  - @tonaljs/midi@4.10.2

## 4.9.1

### Patch Changes

- @tonaljs/midi@4.10.1

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
- Updated dependencies [56d89f7]
  - @tonaljs/midi@4.10.0
  - @tonaljs/collection@4.9.0

## 4.8.4

### Patch Changes

- @tonaljs/midi@4.9.3

## 4.8.3

### Patch Changes

- Dependencies between packages are now fixed
- Updated dependencies
  - @tonaljs/midi@4.9.2

## 4.8.2

### Patch Changes

- Named type was renamed to NamedPitch. Add old export for backwards compatibility
- Updated dependencies
  - @tonaljs/collection@4.8.1
  - @tonaljs/midi@4.9.1

## 4.8.1

### Patch Changes

- 52c5c9cc: Numeric ranges support negative numbers

## 4.8.0

### Minor Changes

- - fix time signature parsing
  - add support for irrational time signatures
  - add option `assumePerfectFifth` to `Chord.detect` function

### Patch Changes

- Updated dependencies
  - @tonaljs/collection@4.8.0
  - @tonaljs/midi@4.8.0

## 4.7.2

### Patch Changes

- Unify package versions
- Updated dependencies
  - @tonaljs/collection@4.7.2
  - @tonaljs/midi@4.7.2

## 4.7.1

### Patch Changes

- fix npm publish problem
- Updated dependencies
  - @tonaljs/collection@4.7.1
  - @tonaljs/midi@4.7.1

## 4.7.0

### Minor Changes

- b120fc42: Publish tonal in `tonal` package. So use `npm install tonal` instead of `npm install @tonaljs/tonal`

### Patch Changes

- fix memory leak
- Updated dependencies
- Updated dependencies [b120fc42]
  - @tonaljs/collection@4.7.0
  - @tonaljs/midi@4.7.0

## 4.6.10

### Patch Changes

- Bug fixing
- Updated dependencies
  - @tonaljs/collection@4.6.10
  - @tonaljs/midi@4.6.10
