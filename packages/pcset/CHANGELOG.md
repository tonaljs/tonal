# @tonaljs/pcset

## 4.10.8

### Patch Changes

- 1a13828: No public function throws on invalid input any more, apart from `deprecate` and `ChordType.add`, which aren't music functions. Each gives the empty value of its type:

  - Lists (`[]`): `Collection` and `Array` (`compact`, `permutations`, `rotate`, `shuffle`, `sortedNoteNames`…), `Midi.pcset` and the `pcset*` functions, `Note.sortedNames`, `Pcset.filter`, `Progression.fromRomanNumerals` and `toRomanNumerals`, `Range.chromatic` and `numeric`, `Scale.detect` and `scaleNotes`, `RhythmPattern.binary`, `hex`, `probability` and `rotate`, and `VoiceLeading.topNoteDiff`.
  - `TimeSignature.get` and `parse` give the empty signature (`[0, 0]`); `coordToNote` and `coordToInterval` give `{ empty: true }`; `altToAcc` and `fillStr` give `""`, `accToAlt` `0`; `tonicIntervalsTransposer` without intervals gives a function that returns `""`.
  - The low-level pitch helpers keep their types: `chroma` and `height` give `NaN`, `coordinates` `[NaN]`, `pitch` a pitch of `NaN`s (`isPitch` is false), and `midi` `null`. They'll give `null` in tonal 7.
  - `Note.ascending` and `descending` sort invalid notes as equal to the others. A comparator, a `rnd` or a rotation that isn't valid falls back to its default.

  The test that calls every public function with invalid values now has no list of known exceptions, only the two exempt functions.

- Updated dependencies [1a13828]
  - @tonaljs/pitch@5.0.4
  - @tonaljs/pitch-note@6.2.1
  - @tonaljs/pitch-interval@6.4.1
  - @tonaljs/pitch-distance@5.1.3
  - @tonaljs/collection@4.9.3

## 4.10.7

### Patch Changes

- Updated dependencies [ce9b347]
  - @tonaljs/pitch-note@6.2.0
  - @tonaljs/pitch-interval@6.4.0
  - @tonaljs/pitch-distance@5.1.2

## 4.10.6

### Patch Changes

- 1cf932e: `Pcset.isSubsetOf` and `Pcset.isSupersetOf` return `false` instead of `0` when the reference set is empty, and are typed `boolean` (they were `boolean | 0`). The README now says they test for a proper subset or superset.

## 4.10.5

### Patch Changes

- 223f729: `Pcset.get` only reads whole numbers from 0 to 4095 as pcset numbers. A number like `2.5` used to give a non-empty set with the chroma `"0000000010.1"` (and `Pcset.notes(2.5)` gave `["Ab", "B"]`); now it gives the empty set.
- Updated dependencies [f2cecb3]
- Updated dependencies [e6cd704]
- Updated dependencies [66f551a]
- Updated dependencies [99ee8a1]
- Updated dependencies [f2cecb3]
  - @tonaljs/pitch-interval@6.3.0
  - @tonaljs/pitch-note@6.1.3
  - @tonaljs/collection@4.9.2
  - @tonaljs/pitch-distance@5.1.1

## 4.10.4

### Patch Changes

- Updated dependencies [61dedc5]
- Updated dependencies [875f1b7]
- Updated dependencies [875f1b7]
  - @tonaljs/pitch-distance@5.1.0
  - @tonaljs/pitch-interval@6.2.0

## 4.10.3

### Patch Changes

- 4694a12: - Build `dist/index.js` and `dist/index.d.ts` again, so the `main` and `types` entries of every package resolve. Since the tsdown migration the build wrote `index.cjs` and `index.d.cts` instead, and `require("tonal")` or `import "tonal"` in Node failed with "Cannot find module".
- Updated dependencies [4694a12]
  - @tonaljs/collection@4.9.1
  - @tonaljs/pitch@5.0.3
  - @tonaljs/pitch-distance@5.0.7
  - @tonaljs/pitch-interval@6.1.2
  - @tonaljs/pitch-note@6.1.2

## 4.10.2

### Patch Changes

- 9aeb912: - Add `maj11` chord type (major eleventh) (#476)
  - Name `aug7` chord type as "seventh augmented fifth", so `Chord.get("Caug7").type` is no longer empty (#500)
  - `Chord.steps` and `Chord.degrees` keep the tonic octave when the chord is given as tokens: `Chord.steps(["C4", "aug"])` (#497)
  - `TimeSignature.get` accepts common time (`C`) and cut time (`C|`, `¢`) symbols, and no longer throws on invalid input (#490)
  - `Interval.get` rejects malformed intervals like `ddd5` or `5Pgarbage` (#494)
  - Faster pitch class set normalization (#499)
  - Invalid input is no longer cached, so caches can't grow without limit (#498)
  - `Object.prototype` keys like `"constructor"` no longer return built-in functions from `Interval.get`, `RomanNumeral.get`, `ChordType.get`, `ScaleType.get` and `Mode.get`
- Updated dependencies [9aeb912]
  - @tonaljs/pitch-interval@6.1.1
  - @tonaljs/pitch-note@6.1.1
  - @tonaljs/pitch-distance@5.0.6

## 4.10.1

### Patch Changes

- Updated dependencies [b791283]
  - @tonaljs/pitch-interval@6.1.0
  - @tonaljs/pitch-note@6.1.0
  - @tonaljs/pitch-distance@5.0.5

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

- Updated dependencies [4e05792]
- Updated dependencies [56d89f7]
  - @tonaljs/pitch-distance@5.0.4
  - @tonaljs/collection@4.9.0

## 4.9.2

### Patch Changes

- Updated dependencies [48fecc4]
- Updated dependencies [48fecc4]
  - @tonaljs/core@5.0.0

## 4.9.1

### Patch Changes

- Dependencies between packages are now fixed
- Updated dependencies
  - @tonaljs/core@4.10.4

## 4.9.0

### Minor Changes

- f21525b: Add `Pcset.notes()` function that returns the ordered pitch class notes of the given set

## 4.8.3

### Patch Changes

- Named type was renamed to NamedPitch. Add old export for backwards compatibility
- Updated dependencies
  - @tonaljs/collection@4.8.1
  - @tonaljs/core@4.10.3

## 4.8.2

### Patch Changes

- 3bec1d60: Fix setNumToChroma: it must return a string of length in order to work correctly

## 4.8.1

### Patch Changes

- Fix: function not exported

## 4.8.0

### Minor Changes

- - fix time signature parsing
  - add support for irrational time signatures
  - add option `assumePerfectFifth` to `Chord.detect` function

### Patch Changes

- Updated dependencies
  - @tonaljs/collection@4.8.0
  - @tonaljs/core@4.8.0

## 4.7.2

### Patch Changes

- Unify package versions
- Updated dependencies
  - @tonaljs/core@4.7.2
  - @tonaljs/collection@4.7.2

## 4.7.1

### Patch Changes

- fix npm publish problem
- Updated dependencies
  - @tonaljs/collection@4.7.1
  - @tonaljs/core@4.6.12

## 4.7.0

### Minor Changes

- b120fc42: Publish tonal in `tonal` package. So use `npm install tonal` instead of `npm install @tonaljs/tonal`

### Patch Changes

- fix memory leak
- Updated dependencies
- Updated dependencies [b120fc42]
  - @tonaljs/collection@4.7.0
  - @tonaljs/core@4.6.11

## 4.6.10

### Patch Changes

- Bug fixing
- Updated dependencies
  - @tonaljs/collection@4.6.10
  - @tonaljs/core@4.6.10
