# @tonaljs/rhythm-pattern

## 1.1.0

### Minor Changes

- a36f367: Rhythm patterns from durations and onset positions, and measures from Toussaint's _The Geometry of Musical Rhythm_ (#483).

  - `fromDurations([3, 3, 2])` and `fromOnsets([0, 3, 6], 8)` build a pattern (`[1, 0, 0, 1, 0, 0, 1, 0]`); `toDurations` and `toOnsets` read it back. Positions count from 0, and a pattern is a loop.
  - `onsets` is deprecated and warns on every call: its numbers are the rests after each onset, not onsets. `onsets(...gaps)` is `fromDurations(gaps.map((g) => g + 1))`. It will be removed in tonal 7.
  - `complement`, `necklace` (the same for every rotation) and `intervalVector`.
  - `isMaximallyEven`, `evenness`, `isDeep`, `hasOddity`, `oddity`, `offbeatness` and `distance` (`"hamming"` or `"swap"`). Measures that can't be computed return `null`.
  - The `euclid` docs note its argument order: steps first, then beats (E(3, 8) is `euclid(8, 3)`).

### Patch Changes

- 1a13828: No public function throws on invalid input any more, apart from `deprecate` and `ChordType.add`, which aren't music functions. Each gives the empty value of its type:

  - Lists (`[]`): `Collection` and `Array` (`compact`, `permutations`, `rotate`, `shuffle`, `sortedNoteNames`…), `Midi.pcset` and the `pcset*` functions, `Note.sortedNames`, `Pcset.filter`, `Progression.fromRomanNumerals` and `toRomanNumerals`, `Range.chromatic` and `numeric`, `Scale.detect` and `scaleNotes`, `RhythmPattern.binary`, `hex`, `probability` and `rotate`, and `VoiceLeading.topNoteDiff`.
  - `TimeSignature.get` and `parse` give the empty signature (`[0, 0]`); `coordToNote` and `coordToInterval` give `{ empty: true }`; `altToAcc` and `fillStr` give `""`, `accToAlt` `0`; `tonicIntervalsTransposer` without intervals gives a function that returns `""`.
  - The low-level pitch helpers keep their types: `chroma` and `height` give `NaN`, `coordinates` `[NaN]`, `pitch` a pitch of `NaN`s (`isPitch` is false), and `midi` `null`. They'll give `null` in tonal 7.
  - `Note.ascending` and `descending` sort invalid notes as equal to the others. A comparator, a `rnd` or a rotation that isn't valid falls back to its default.

  The test that calls every public function with invalid values now has no list of known exceptions, only the two exempt functions.

- f95a90c: Invalid input gives an empty value instead of an exception in more functions:

  - Every `Chord` function given something that isn't a string (`Chord.get(undefined)`, `Chord.notes(null)`, `Chord.degrees(5)`…) gives an empty chord, `[]` or `""`. So do `Voicing.get`, `Voicing.search` and `Voicing.sequence`.
  - `Chord.detect` gives `[]` when the notes aren't an array.
  - `ChordType.complexity` gives `0`, and `ChordType.family` `""`, when the intervals aren't an array (`ChordType.complexity("m7")` used to throw).
  - `RhythmPattern.toDurations(undefined)` gives `[]`.

  A new test calls every public function with invalid values and fails if one throws, apart from a list of known cases still to fix.

- 3db3917: `RhythmPattern.rotate` takes any array of numbers and returns the same type, so it rotates a `number[]` of 0s and 1s (built with `map`, for example) as well as probabilities or accents. It was typed for `RhythmPattern` only.

## 1.0.2

### Patch Changes

- 7aa10aa: `RhythmPattern.euclid(steps, 0)` now returns only rests. It returned a beat on the first step.

## 1.0.1

### Patch Changes

- 4694a12: - Build `dist/index.js` and `dist/index.d.ts` again, so the `main` and `types` entries of every package resolve. Since the tsdown migration the build wrote `index.cjs` and `index.d.cts` instead, and `require("tonal")` or `import "tonal"` in Node failed with "Cannot find module".

## 1.0.0 Initial release

New package:

```ts
import { RhythmPattern } from "tonal";

RhythmPattern.euclid(8, 3); // => [1, 0, 0, 1, 0, 0, 1, 0]
RhythmPattern.hex("8f"); // => [1, 0, 0, 0, 1, 1, 1, 1]
RhythmPattern.binary(12, 13); // => [1, 1, 0, 0, 1, 1, 0, 1]
RhythmPattern.onsets(1, 2, 2, 1); // => [1, 0, 1, 0, 0, 1, 0, 0, 1, 0]
RhythmPattern.random(4); // => [1, 0, 0, 1]
RhythmPattern.probability([0.6, 0, 0.2, 0.5]); // => [0, 0, 0, 1]
RhythmPattern.rotate([1, 0, 0, 1], 2); // => [0, 1, 1, 0]
```
