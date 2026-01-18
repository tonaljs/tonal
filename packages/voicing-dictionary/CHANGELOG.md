# @tonaljs/voicing-dictionary

## 5.1.3

### Patch Changes

- @tonaljs/chord@6.1.2

## 5.1.2

### Patch Changes

- @tonaljs/note@4.12.1
- @tonaljs/voice-leading@5.1.2

## 5.1.1

### Patch Changes

- Updated dependencies [b791283]
  - @tonaljs/note@4.12.0
  - @tonaljs/chord@6.1.1
  - @tonaljs/voice-leading@5.1.1

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
  - @tonaljs/note@4.11.0
  - @tonaljs/voice-leading@5.1.0
  - @tonaljs/chord@6.1.0

## 5.0.3

### Patch Changes

- Updated dependencies [97f01d4]
  - @tonaljs/chord@6.0.0
  - @tonaljs/note@4.10.3
  - @tonaljs/voice-leading@5.0.3

## 5.0.2

### Patch Changes

- Dependencies between packages are now fixed
- Updated dependencies
  - @tonaljs/voice-leading@5.0.2
  - @tonaljs/chord@5.0.3
  - @tonaljs/note@4.10.2

## 5.0.1

### Patch Changes

- Named type was renamed to NamedPitch. Add old export for backwards compatibility
- Updated dependencies
  - @tonaljs/chord@5.0.1
  - @tonaljs/note@4.10.1
  - @tonaljs/voice-leading@5.0.1

## 5.0.0

### Major Changes

- 15017c0: First published version

### Patch Changes

- Updated dependencies [15017c0]
  - @tonaljs/voice-leading@5.0.0
