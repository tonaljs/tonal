# @tonaljs/key

## 4.11.2

### Patch Changes

- @tonaljs/note@4.12.1

## 4.11.1

### Patch Changes

- Updated dependencies [b791283]
  - @tonaljs/pitch-note@6.1.0
  - @tonaljs/note@4.12.0
  - @tonaljs/roman-numeral@4.9.1

## 4.11.0

- New `Key.majorKeyChords` and `Key.minorKeyChords` functions.

```js
import * as Key from "tonal";

Key.majorKeyChords("C").find((chord) => chord.name === "Em"); // => { name: "Em", roles: ["T", "ii/II"] }
```

- Renamed fields of key results. `secondaryDominantsMinorRelative` is now `secondaryDominantSupertonics` and `substituteDominantsMinorRelative` is now `substituteDominantSupertonics`. Previous names are kept for compatibility as deprecated (will be removed in next major version)

## 4.10.0

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
- Updated dependencies [3cd5f16]
  - @tonaljs/roman-numeral@4.9.0
  - @tonaljs/note@4.11.0

## 4.9.4

### Patch Changes

- Updated dependencies [48fecc4]
- Updated dependencies [48fecc4]
  - @tonaljs/core@5.0.0
  - @tonaljs/note@4.10.3
  - @tonaljs/roman-numeral@4.8.3

## 4.9.3

### Patch Changes

- Dependencies between packages are now fixed
- Updated dependencies
  - @tonaljs/roman-numeral@4.8.2
  - @tonaljs/core@4.10.4
  - @tonaljs/note@4.10.2

## 4.9.2

### Patch Changes

- Named type was renamed to NamedPitch. Add old export for backwards compatibility
- Updated dependencies
  - @tonaljs/core@4.10.3
  - @tonaljs/note@4.10.1
  - @tonaljs/roman-numeral@4.8.1

## 4.9.1

### Patch Changes

- Fix test

## 4.9.0

### Minor Changes

- 10056eff: Add triads to key.

  For example: `Key.majorKey("C").triads` or `Key.minorKey("C").melodic.triads`

## 4.8.0

### Minor Changes

- - fix time signature parsing
  - add support for irrational time signatures
  - add option `assumePerfectFifth` to `Chord.detect` function

### Patch Changes

- Updated dependencies
  - @tonaljs/core@4.8.0
  - @tonaljs/note@4.8.0
  - @tonaljs/roman-numeral@4.8.0

## 4.7.2

### Patch Changes

- Unify package versions
- Updated dependencies
  - @tonaljs/core@4.7.2
  - @tonaljs/note@4.7.2
  - @tonaljs/roman-numeral@4.7.2

## 4.7.1

### Patch Changes

- fix npm publish problem
- Updated dependencies
  - @tonaljs/core@4.6.12
  - @tonaljs/note@4.7.1
  - @tonaljs/roman-numeral@4.7.1

## 4.7.0

### Minor Changes

- b120fc42: Publish tonal in `tonal` package. So use `npm install tonal` instead of `npm install @tonaljs/tonal`

### Patch Changes

- fix memory leak
- Updated dependencies
- Updated dependencies [b120fc42]
  - @tonaljs/core@4.6.11
  - @tonaljs/note@4.7.0
  - @tonaljs/roman-numeral@4.7.0

## 4.6.10

### Patch Changes

- Bug fixing
- Updated dependencies
  - @tonaljs/core@4.6.10
  - @tonaljs/note@4.6.10
  - @tonaljs/roman-numeral@4.6.10
