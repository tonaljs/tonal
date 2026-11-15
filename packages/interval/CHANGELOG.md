# @tonaljs/interval

## 5.1.2

### Patch Changes

- 875f1b7: Fix `Interval.add`, `Interval.subtract` and `Interval.transposeFifths` results that led to the wrong note. The letter steps now decide the direction of the result, even when the sound goes the other way: `subtract("2d", "1A")` is `2dd` (was `-7AA`) and `subtract("2m", "1AA")` is `2dd` (was `-7AA`). A unison still takes its direction from the sound: `subtract("1P", "1A")` is `-1A`.

  **Deprecated:** the `forceDescending` parameter of `coordToInterval`, since the letter steps already give the direction.

- Updated dependencies [61dedc5]
- Updated dependencies [875f1b7]
- Updated dependencies [875f1b7]
  - @tonaljs/pitch-distance@5.1.0
  - @tonaljs/pitch-interval@6.2.0

## 5.1.1

### Patch Changes

- 4694a12: - Build `dist/index.js` and `dist/index.d.ts` again, so the `main` and `types` entries of every package resolve. Since the tsdown migration the build wrote `index.cjs` and `index.d.cts` instead, and `require("tonal")` or `import "tonal"` in Node failed with "Cannot find module".
- Updated dependencies [4694a12]
  - @tonaljs/pitch@5.0.3
  - @tonaljs/pitch-distance@5.0.7
  - @tonaljs/pitch-interval@6.1.2

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

- Updated dependencies [4e05792]
  - @tonaljs/pitch-distance@5.0.4

## 5.0.0

### Major Changes

- 48fecc4: Fix typo (breaking change): `substract` is now `subtract`

### Patch Changes

- Updated dependencies [48fecc4]
- Updated dependencies [48fecc4]
  - @tonaljs/pitch-interval@6.0.0
  - @tonaljs/pitch@5.0.2
  - @tonaljs/pitch-distance@5.0.3

## 4.8.2

### Patch Changes

- Dependencies between packages are now fixed
- Updated dependencies
  - @tonaljs/core@4.10.4

## 4.8.1

### Patch Changes

- Named type was renamed to NamedPitch. Add old export for backwards compatibility
- Updated dependencies
  - @tonaljs/core@4.10.3

## 4.8.0

### Minor Changes

- - fix time signature parsing
  - add support for irrational time signatures
  - add option `assumePerfectFifth` to `Chord.detect` function

### Patch Changes

- Updated dependencies
  - @tonaljs/core@4.8.0

## 4.7.2

### Patch Changes

- Unify package versions
- Updated dependencies
  - @tonaljs/core@4.7.2

## 4.7.1

### Patch Changes

- fix npm publish problem
- Updated dependencies
  - @tonaljs/core@4.6.12

## 4.7.0

### Minor Changes

- b120fc42: Publish tonal in `tonal` package. So use `npm install tonal` instead of `npm install @tonaljs/tonal`

### Patch Changes

- fix memory leak
- Updated dependencies
  - @tonaljs/core@4.6.11

## 4.6.10

### Patch Changes

- Bug fixing
- Updated dependencies
  - @tonaljs/core@4.6.10
