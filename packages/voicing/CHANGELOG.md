# @tonaljs/voicing

## 5.1.2

### Patch Changes

- @tonaljs/note@4.12.1
- @tonaljs/range@4.9.2
- @tonaljs/voice-leading@5.1.2
- @tonaljs/voicing-dictionary@5.1.2

## 5.1.1

### Patch Changes

- Updated dependencies [b791283]
  - @tonaljs/note@4.12.0
  - @tonaljs/chord@6.1.1
  - @tonaljs/voice-leading@5.1.1
  - @tonaljs/voicing-dictionary@5.1.1
  - @tonaljs/range@4.9.1

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
- Updated dependencies [56d89f7]
  - @tonaljs/range@4.9.0
  - @tonaljs/note@4.11.0
  - @tonaljs/voicing-dictionary@5.1.0
  - @tonaljs/voice-leading@5.1.0
  - @tonaljs/interval@5.1.0
  - @tonaljs/chord@6.1.0

## 5.0.3

### Patch Changes

- Updated dependencies [97f01d4]
- Updated dependencies [48fecc4]
  - @tonaljs/chord@6.0.0
  - @tonaljs/interval@5.0.0
  - @tonaljs/voicing-dictionary@5.0.3
  - @tonaljs/note@4.10.3
  - @tonaljs/range@4.8.4
  - @tonaljs/voice-leading@5.0.3

## 5.0.2

### Patch Changes

- Dependencies between packages are now fixed
- Updated dependencies
  - @tonaljs/voicing-dictionary@5.0.2
  - @tonaljs/voice-leading@5.0.2
  - @tonaljs/interval@4.8.2
  - @tonaljs/chord@5.0.3
  - @tonaljs/range@4.8.3
  - @tonaljs/note@4.10.2

## 5.0.1

### Patch Changes

- Named type was renamed to NamedPitch. Add old export for backwards compatibility
- Updated dependencies
  - @tonaljs/chord@5.0.1
  - @tonaljs/interval@4.8.1
  - @tonaljs/note@4.10.1
  - @tonaljs/range@4.8.2
  - @tonaljs/voice-leading@5.0.1
  - @tonaljs/voicing-dictionary@5.0.1

## 5.0.0

### Major Changes

- 15017c0: First published version

### Patch Changes

- Updated dependencies [15017c0]
  - @tonaljs/voicing-dictionary@5.0.0
  - @tonaljs/voice-leading@5.0.0

## 4.8.1

### Patch Changes

- Updated dependencies [b07a54c0]
  - @tonaljs/chord@5.0.0
  - @tonaljs/voicing-dictionary@4.8.1

## 4.8.0

### Minor Changes

- - fix time signature parsing
  - add support for irrational time signatures
  - add option `assumePerfectFifth` to `Chord.detect` function

### Patch Changes

- Updated dependencies
  - @tonaljs/chord@4.8.0
  - @tonaljs/interval@4.8.0
  - @tonaljs/note@4.8.0
  - @tonaljs/range@4.8.0
  - @tonaljs/voice-leading@4.8.0
  - @tonaljs/voicing-dictionary@4.8.0

## 4.7.2

### Patch Changes

- Unify package versions
- Updated dependencies
  - @tonaljs/chord@4.7.2
  - @tonaljs/interval@4.7.2
  - @tonaljs/note@4.7.2
  - @tonaljs/range@4.7.2
  - @tonaljs/voice-leading@4.7.2
  - @tonaljs/voicing-dictionary@4.7.2

## 4.7.1

### Patch Changes

- fix npm publish problem
- Updated dependencies
  - @tonaljs/chord@4.7.1
  - @tonaljs/interval@4.7.1
  - @tonaljs/note@4.7.1
  - @tonaljs/range@4.7.1
  - @tonaljs/voice-leading@4.7.1
  - @tonaljs/voicing-dictionary@4.7.1

## 4.7.0

### Minor Changes

- b120fc42: Publish tonal in `tonal` package. So use `npm install tonal` instead of `npm install @tonaljs/tonal`

### Patch Changes

- fix memory leak
- Updated dependencies
- Updated dependencies [b120fc42]
  - @tonaljs/chord@4.7.0
  - @tonaljs/interval@4.7.0
  - @tonaljs/note@4.7.0
  - @tonaljs/range@4.7.0
  - @tonaljs/voice-leading@4.7.0
  - @tonaljs/voicing-dictionary@4.7.0

## 4.6.6

### Patch Changes

- Bug fixing
- Updated dependencies
  - @tonaljs/chord@4.6.10
  - @tonaljs/interval@4.6.10
  - @tonaljs/note@4.6.10
  - @tonaljs/range@4.6.10
  - @tonaljs/voice-leading@4.6.6
  - @tonaljs/voicing-dictionary@4.6.6
