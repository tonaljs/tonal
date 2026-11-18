# @tonaljs/key

## 4.11.7

### Patch Changes

- Updated dependencies [6c10671]
  - @tonaljs/roman-numeral@4.10.1
  - @tonaljs/note@4.12.6

## 4.11.6

### Patch Changes

- 8a32ef0: `Key` supertonics have the right chord quality (#232).

  - `secondaryDominantSupertonics`: a ii-V into a minor chord gets a half-diminished ii (`Em7b5` before `A7` → `Dm`), and a ii-V into a major chord gets a minor seventh ii (`Gm7` before `C7` → `F`). They were swapped since `@tonaljs/key` 4.11.0 (#447). C major gives `["", "Em7b5", "F#m7b5", "Gm7", "Am7", "Bm7b5", ""]` (it was `["", "Em7", "F#m7", "Gm7b5", "Am7b5", "Bm7", ""]`).
  - `substituteDominantSupertonics`: the ii of a substitute dominant is always a minor seventh (`Bbm7` before `Eb7` → `Dm`), because a substitute dominant doesn't resolve to its own tonic. C major gives `["", "Bbm7", "Cm7", "Dbm7", "Ebm7", "Fm7", ""]` (it was `["", "Bbm7", "Cm7", "Dbm7b5", "Ebm7b5", "Fm7", ""]`).

  This also changes the deprecated `secondaryDominantsMinorRelative` and `substituteDominantsMinorRelative`, and the `ii/` and `subii/` roles of `majorKeyChords` and `minorKeyChords`. For example, in C major `Em7` is no longer `ii/II` (`Em7b5` is), and `Am7` is now also `ii/V`.

  The `@deprecated` tags of the `...MinorRelative` fields name the right replacement and show up in editors.

- Updated dependencies [66f551a]
- Updated dependencies [0ad56fe]
- Updated dependencies [6c44917]
  - @tonaljs/pitch-note@6.1.3
  - @tonaljs/roman-numeral@4.10.0
  - @tonaljs/note@4.12.5

## 4.11.5

### Patch Changes

- 012c2f2: Fix `majorTonicFromKeySignature`: only strings made of all `b` or all `#` are read as a key signature (`"F#"` and `"b#"` now give `null`), and `""` gives `"C"` (see #517)
- Updated dependencies [f3b53a4]
  - @tonaljs/note@4.12.4
  - @tonaljs/roman-numeral@4.9.4

## 4.11.4

### Patch Changes

- 4694a12: - Build `dist/index.js` and `dist/index.d.ts` again, so the `main` and `types` entries of every package resolve. Since the tsdown migration the build wrote `index.cjs` and `index.d.cts` instead, and `require("tonal")` or `import "tonal"` in Node failed with "Cannot find module".
- Updated dependencies [4694a12]
  - @tonaljs/note@4.12.3
  - @tonaljs/pitch-note@6.1.2
  - @tonaljs/roman-numeral@4.9.3

## 4.11.3

### Patch Changes

- Updated dependencies [9aeb912]
  - @tonaljs/pitch-note@6.1.1
  - @tonaljs/roman-numeral@4.9.2
  - @tonaljs/note@4.12.2

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
