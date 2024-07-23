# @tonaljs/progression

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
- Updated dependencies [4e05792]
- Updated dependencies [56d89f7]
  - @tonaljs/roman-numeral@4.9.0
  - @tonaljs/pitch-distance@5.0.4
  - @tonaljs/chord@6.1.0

## 4.8.4

### Patch Changes

- Updated dependencies [97f01d4]
- Updated dependencies [48fecc4]
- Updated dependencies [48fecc4]
  - @tonaljs/chord@6.0.0
  - @tonaljs/core@5.0.0
  - @tonaljs/roman-numeral@4.8.3

## 4.8.3

### Patch Changes

- Dependencies between packages are now fixed
- Updated dependencies
  - @tonaljs/roman-numeral@4.8.2
  - @tonaljs/chord@5.0.3
  - @tonaljs/core@4.10.4

## 4.8.2

### Patch Changes

- Named type was renamed to NamedPitch. Add old export for backwards compatibility
- Updated dependencies
  - @tonaljs/chord@5.0.1
  - @tonaljs/core@4.10.3
  - @tonaljs/roman-numeral@4.8.1

## 4.8.1

### Patch Changes

- Updated dependencies [b07a54c0]
  - @tonaljs/chord@5.0.0

## 4.8.0

### Minor Changes

- - fix time signature parsing
  - add support for irrational time signatures
  - add option `assumePerfectFifth` to `Chord.detect` function

### Patch Changes

- Updated dependencies
  - @tonaljs/chord@4.8.0
  - @tonaljs/core@4.8.0
  - @tonaljs/roman-numeral@4.8.0

## 4.7.2

### Patch Changes

- Unify package versions
- Updated dependencies
  - @tonaljs/core@4.7.2
  - @tonaljs/chord@4.7.2
  - @tonaljs/roman-numeral@4.7.2

## 4.7.1

### Patch Changes

- fix npm publish problem
- Updated dependencies
  - @tonaljs/chord@4.7.1
  - @tonaljs/core@4.6.12
  - @tonaljs/roman-numeral@4.7.1

## 4.7.0

### Minor Changes

- b120fc42: Publish tonal in `tonal` package. So use `npm install tonal` instead of `npm install @tonaljs/tonal`

### Patch Changes

- fix memory leak
- Updated dependencies
- Updated dependencies [b120fc42]
  - @tonaljs/chord@4.7.0
  - @tonaljs/core@4.6.11
  - @tonaljs/roman-numeral@4.7.0

## 4.6.10

### Patch Changes

- Bug fixing
- Updated dependencies
  - @tonaljs/chord@4.6.10
  - @tonaljs/core@4.6.10
  - @tonaljs/roman-numeral@4.6.10
