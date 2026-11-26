# @tonaljs/array

## 4.8.9

### Patch Changes

- 1a13828: No public function throws on invalid input any more, apart from `deprecate` and `ChordType.add`, which aren't music functions. Each gives the empty value of its type:

  - Lists (`[]`): `Collection` and `Array` (`compact`, `permutations`, `rotate`, `shuffle`, `sortedNoteNames`…), `Midi.pcset` and the `pcset*` functions, `Note.sortedNames`, `Pcset.filter`, `Progression.fromRomanNumerals` and `toRomanNumerals`, `Range.chromatic` and `numeric`, `Scale.detect` and `scaleNotes`, `RhythmPattern.binary`, `hex`, `probability` and `rotate`, and `VoiceLeading.topNoteDiff`.
  - `TimeSignature.get` and `parse` give the empty signature (`[0, 0]`); `coordToNote` and `coordToInterval` give `{ empty: true }`; `altToAcc` and `fillStr` give `""`, `accToAlt` `0`; `tonicIntervalsTransposer` without intervals gives a function that returns `""`.
  - The low-level pitch helpers keep their types: `chroma` and `height` give `NaN`, `coordinates` `[NaN]`, `pitch` a pitch of `NaN`s (`isPitch` is false), and `midi` `null`. They'll give `null` in tonal 7.
  - `Note.ascending` and `descending` sort invalid notes as equal to the others. A comparator, a `rnd` or a rotation that isn't valid falls back to its default.

  The test that calls every public function with invalid values now has no list of known exceptions, only the two exempt functions.

- Updated dependencies [1a13828]
  - @tonaljs/pitch-note@6.2.1

## 4.8.8

### Patch Changes

- Updated dependencies [ce9b347]
  - @tonaljs/pitch-note@6.2.0

## 4.8.7

### Patch Changes

- 99ee8a1: `Collection.range` (and `Range.numeric` / `Range.chromatic`) no longer hang when a bound is not a whole number, like `Range.numeric([Midi.freqToMidi(261), 72])`. Non-finite bounds give an empty range.
- Updated dependencies [66f551a]
  - @tonaljs/pitch-note@6.1.3

## 4.8.6

### Patch Changes

- 4694a12: - Build `dist/index.js` and `dist/index.d.ts` again, so the `main` and `types` entries of every package resolve. Since the tsdown migration the build wrote `index.cjs` and `index.d.cts` instead, and `require("tonal")` or `import "tonal"` in Node failed with "Cannot find module".
- Updated dependencies [4694a12]
  - @tonaljs/pitch-note@6.1.2

## 4.8.5

### Patch Changes

- Updated dependencies [9aeb912]
  - @tonaljs/pitch-note@6.1.1

## 4.8.4

### Patch Changes

- Updated dependencies [b791283]
  - @tonaljs/pitch-note@6.1.0

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

## 4.6.12

### Patch Changes

- fix npm publish problem
- Updated dependencies
  - @tonaljs/core@4.6.12

## 4.6.11

### Patch Changes

- fix memory leak
- Updated dependencies
  - @tonaljs/core@4.6.11

## 4.6.10

### Patch Changes

- Bug fixing
- Updated dependencies
  - @tonaljs/core@4.6.10
