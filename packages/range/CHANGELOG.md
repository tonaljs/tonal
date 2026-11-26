# @tonaljs/range

## 4.9.9

### Patch Changes

- @tonaljs/midi@4.11.1

## 4.9.8

### Patch Changes

- Updated dependencies [1cf932e]
  - @tonaljs/midi@4.11.0

## 4.9.7

### Patch Changes

- Updated dependencies [9b041bb]
- Updated dependencies [4162dde]
  - @tonaljs/midi@4.10.7

## 4.9.6

### Patch Changes

- 99ee8a1: `Collection.range` (and `Range.numeric` / `Range.chromatic`) no longer hang when a bound is not a whole number, like `Range.numeric([Midi.freqToMidi(261), 72])`. Non-finite bounds give an empty range.
- Updated dependencies [99ee8a1]
  - @tonaljs/collection@4.9.2
  - @tonaljs/midi@4.10.6

## 4.9.5

### Patch Changes

- 80a12e3: Fix `isMidi` and `toMidi`: empty or blank strings, `null`, arrays and booleans are not midi numbers anymore (`toMidi("")` was `0`) (see #519)
- Updated dependencies [f3b53a4]
- Updated dependencies [80a12e3]
  - @tonaljs/midi@4.10.5

## 4.9.4

### Patch Changes

- 4694a12: - Build `dist/index.js` and `dist/index.d.ts` again, so the `main` and `types` entries of every package resolve. Since the tsdown migration the build wrote `index.cjs` and `index.d.cts` instead, and `require("tonal")` or `import "tonal"` in Node failed with "Cannot find module".
- Updated dependencies [4694a12]
  - @tonaljs/collection@4.9.1
  - @tonaljs/midi@4.10.4

## 4.9.3

### Patch Changes

- @tonaljs/midi@4.10.3

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
