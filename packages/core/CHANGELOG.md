# @tonaljs/core

## 5.1.1

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

## 5.1.0

### Minor Changes

- ce9b347: `NoteName`, `PcName`, `NoteWithOctave` and `IntervalName` now list the common note and interval names, so editors suggest them, and still accept any string. The listed names are exported on their own as `KnownNoteName`, `KnownPcName`, `KnownNoteWithOctave` and `KnownIntervalName`; the known intervals are written number first, as tonal returns them (`3M`, `-5P`). Types only, nothing changes at runtime.

  If your code types a `Record<NoteName, X>` (or `Record<IntervalName, X>`), it now needs every known name as a key: use `Partial<Record<NoteName, X>>` or `Record<string, X>` instead.

### Patch Changes

- Updated dependencies [ce9b347]
  - @tonaljs/pitch-note@6.2.0
  - @tonaljs/pitch-interval@6.4.0
  - @tonaljs/pitch-distance@5.1.2

## 5.0.6

### Patch Changes

- Updated dependencies [f2cecb3]
- Updated dependencies [e6cd704]
- Updated dependencies [66f551a]
- Updated dependencies [f2cecb3]
  - @tonaljs/pitch-interval@6.3.0
  - @tonaljs/pitch-note@6.1.3
  - @tonaljs/pitch-distance@5.1.1

## 5.0.5

### Patch Changes

- Updated dependencies [61dedc5]
- Updated dependencies [875f1b7]
- Updated dependencies [875f1b7]
  - @tonaljs/pitch-distance@5.1.0
  - @tonaljs/pitch-interval@6.2.0

## 5.0.4

### Patch Changes

- 4694a12: - Build `dist/index.js` and `dist/index.d.ts` again, so the `main` and `types` entries of every package resolve. Since the tsdown migration the build wrote `index.cjs` and `index.d.cts` instead, and `require("tonal")` or `import "tonal"` in Node failed with "Cannot find module".
- Updated dependencies [4694a12]
  - @tonaljs/pitch@5.0.3
  - @tonaljs/pitch-distance@5.0.7
  - @tonaljs/pitch-interval@6.1.2
  - @tonaljs/pitch-note@6.1.2

## 5.0.3

### Patch Changes

- Updated dependencies [9aeb912]
  - @tonaljs/pitch-interval@6.1.1
  - @tonaljs/pitch-note@6.1.1
  - @tonaljs/pitch-distance@5.0.6

## 5.0.2

### Patch Changes

- Updated dependencies [b791283]
  - @tonaljs/pitch-interval@6.1.0
  - @tonaljs/pitch-note@6.1.0
  - @tonaljs/pitch-distance@5.0.5

## 5.0.1

### Patch Changes

- Updated dependencies [4e05792]
  - @tonaljs/pitch-distance@5.0.4

## 5.0.0

### Major Changes

- 48fecc4: Breaking change: remove `NoInterval` interface. Return `Interval` type (with `emtpy: true`) when parsing invalid intervals.
- 48fecc4: Breaking change: `NoNote` interface is removed. Always return `Note` type (with `empty: true`) when parsing invalid notes.

### Patch Changes

- Updated dependencies [48fecc4]
- Updated dependencies [48fecc4]
- Updated dependencies [48fecc4]
  - @tonaljs/pitch-interval@6.0.0
  - @tonaljs/pitch-note@6.0.0
  - @tonaljs/pitch@5.0.2
  - @tonaljs/pitch-distance@5.0.3

## 4.10.4

### Patch Changes

- Dependencies between packages are now fixed
- Updated dependencies
  - @tonaljs/pitch-distance@5.0.2
  - @tonaljs/pitch-interval@5.0.2
  - @tonaljs/pitch-note@5.0.3

## 4.10.3

### Patch Changes

- Named type was renamed to NamedPitch. Add old export for backwards compatibility
- Updated dependencies
  - @tonaljs/pitch@5.0.1
  - @tonaljs/pitch-distance@5.0.1
  - @tonaljs/pitch-interval@5.0.1
  - @tonaljs/pitch-note@5.0.1

## 4.10.2

### Patch Changes

- Move core into pitch modules
- Updated dependencies [4689b77]
  - @tonaljs/pitch-distance@5.0.0
  - @tonaljs/pitch-interval@5.0.0
  - @tonaljs/pitch-note@5.0.0

## 4.10.1

### Patch Changes

- Restructure code to use new `@tonaljs/pitch`. No changes to functionality
- Updated dependencies
  - @tonaljs/pitch@5.0.0

## 4.10.0

### Minor Changes

- 6fcd52db: Add Scale.steps and Chord.steps

## 4.9.0

### Minor Changes

New internal function

## 4.8.0

### Minor Changes

- - fix time signature parsing
  - add support for irrational time signatures
  - add option `assumePerfectFifth` to `Chord.detect` function

## 4.7.2

### Patch Changes

- Unify package versions

## 4.6.12

### Patch Changes

- fix npm publish problem

## 4.6.11

### Patch Changes

- fix memory leak

## 4.6.10

### Patch Changes

- Bug fixing
