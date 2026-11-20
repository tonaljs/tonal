# @tonaljs/voicing

## 5.2.2

### Patch Changes

- Updated dependencies [aa4ab10]
- Updated dependencies [1cf932e]
  - @tonaljs/chord@6.3.2
  - @tonaljs/voice-leading@5.1.8
  - @tonaljs/voicing-dictionary@5.1.9
  - @tonaljs/note@4.12.7
  - @tonaljs/range@4.9.8

## 5.2.1

### Patch Changes

- Updated dependencies [a328946]
  - @tonaljs/chord@6.3.1
  - @tonaljs/voicing-dictionary@5.1.8
  - @tonaljs/note@4.12.6
  - @tonaljs/range@4.9.7
  - @tonaljs/voice-leading@5.1.7

## 5.2.0

### Minor Changes

- b2c7821: **Behaviour change.** `Voicing.get` now returns `[]` when no voicing is found (it was `undefined`); check `voicing.length === 0` instead of `!voicing` or `??`, because `[]` is truthy. `Voicing.search` without a dictionary now searches `VoicingDictionary.all` (it was `VoicingDictionary.triads`), the same default as `Voicing.get`, so it returns more results:

  |                           | before      | now          |
  | ------------------------- | ----------- | ------------ |
  | `Voicing.search("Cmaj7")` | `[]`        | two voicings |
  | `Voicing.get("C13")`      | `undefined` | `[]`         |

  `Voicing.sequence` keeps `[]` at the position of chords without voicing, and voice-leads the next chord from the last chord that had a voicing

### Patch Changes

- Updated dependencies [1f86506]
- Updated dependencies [3d5530d]
- Updated dependencies [09043d6]
- Updated dependencies [d880522]
- Updated dependencies [f2cecb3]
- Updated dependencies [d81d784]
- Updated dependencies [99ee8a1]
- Updated dependencies [f2cecb3]
- Updated dependencies [bb8889d]
- Updated dependencies [6c44917]
  - @tonaljs/chord@6.3.0
  - @tonaljs/interval@5.2.0
  - @tonaljs/range@4.9.6
  - @tonaljs/note@4.12.5
  - @tonaljs/voicing-dictionary@5.1.7
  - @tonaljs/voice-leading@5.1.6

## 5.1.6

### Patch Changes

- Updated dependencies [875f1b7]
- Updated dependencies [f3b53a4]
- Updated dependencies [80a12e3]
  - @tonaljs/interval@5.1.2
  - @tonaljs/note@4.12.4
  - @tonaljs/range@4.9.5
  - @tonaljs/chord@6.2.2
  - @tonaljs/voice-leading@5.1.5
  - @tonaljs/voicing-dictionary@5.1.6

## 5.1.5

### Patch Changes

- 4694a12: - Build `dist/index.js` and `dist/index.d.ts` again, so the `main` and `types` entries of every package resolve. Since the tsdown migration the build wrote `index.cjs` and `index.d.cts` instead, and `require("tonal")` or `import "tonal"` in Node failed with "Cannot find module".
- Updated dependencies [4694a12]
  - @tonaljs/chord@6.2.1
  - @tonaljs/interval@5.1.1
  - @tonaljs/note@4.12.3
  - @tonaljs/range@4.9.4
  - @tonaljs/voice-leading@5.1.4
  - @tonaljs/voicing-dictionary@5.1.5

## 5.1.4

### Patch Changes

- Updated dependencies [9aeb912]
  - @tonaljs/chord@6.2.0
  - @tonaljs/voicing-dictionary@5.1.4
  - @tonaljs/note@4.12.2
  - @tonaljs/voice-leading@5.1.3
  - @tonaljs/range@4.9.3

## 5.1.3

### Patch Changes

- @tonaljs/chord@6.1.2
- @tonaljs/voicing-dictionary@5.1.3

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
