# @tonaljs/collection

## 4.9.3

### Patch Changes

- 1a13828: No public function throws on invalid input any more, apart from `deprecate` and `ChordType.add`, which aren't music functions. Each gives the empty value of its type:

  - Lists (`[]`): `Collection` and `Array` (`compact`, `permutations`, `rotate`, `shuffle`, `sortedNoteNames`…), `Midi.pcset` and the `pcset*` functions, `Note.sortedNames`, `Pcset.filter`, `Progression.fromRomanNumerals` and `toRomanNumerals`, `Range.chromatic` and `numeric`, `Scale.detect` and `scaleNotes`, `RhythmPattern.binary`, `hex`, `probability` and `rotate`, and `VoiceLeading.topNoteDiff`.
  - `TimeSignature.get` and `parse` give the empty signature (`[0, 0]`); `coordToNote` and `coordToInterval` give `{ empty: true }`; `altToAcc` and `fillStr` give `""`, `accToAlt` `0`; `tonicIntervalsTransposer` without intervals gives a function that returns `""`.
  - The low-level pitch helpers keep their types: `chroma` and `height` give `NaN`, `coordinates` `[NaN]`, `pitch` a pitch of `NaN`s (`isPitch` is false), and `midi` `null`. They'll give `null` in tonal 7.
  - `Note.ascending` and `descending` sort invalid notes as equal to the others. A comparator, a `rnd` or a rotation that isn't valid falls back to its default.

  The test that calls every public function with invalid values now has no list of known exceptions, only the two exempt functions.

## 4.9.2

### Patch Changes

- 99ee8a1: `Collection.range` (and `Range.numeric` / `Range.chromatic`) no longer hang when a bound is not a whole number, like `Range.numeric([Midi.freqToMidi(261), 72])`. Non-finite bounds give an empty range.

## 4.9.1

### Patch Changes

- 4694a12: - Build `dist/index.js` and `dist/index.d.ts` again, so the `main` and `types` entries of every package resolve. Since the tsdown migration the build wrote `index.cjs` and `index.d.cts` instead, and `require("tonal")` or `import "tonal"` in Node failed with "Cannot find module".

## 4.9.0

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

## 4.8.1

### Patch Changes

- Named type was renamed to NamedPitch. Add old export for backwards compatibility

## 4.8.0

### Minor Changes

- - fix time signature parsing
  - add support for irrational time signatures
  - add option `assumePerfectFifth` to `Chord.detect` function

## 4.7.2

### Patch Changes

- Unify package versions

## 4.7.1

### Patch Changes

- fix npm publish problem

## 4.7.0

### Minor Changes

- b120fc42: Publish tonal in `tonal` package. So use `npm install tonal` instead of `npm install @tonaljs/tonal`

### Patch Changes

- fix memory leak

## 4.6.10

### Patch Changes

- Bug fixing
