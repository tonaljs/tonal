# @tonaljs/midi

## 4.11.2

### Patch Changes

- 1a13828: No public function throws on invalid input any more, apart from `deprecate` and `ChordType.add`, which aren't music functions. Each gives the empty value of its type:

  - Lists (`[]`): `Collection` and `Array` (`compact`, `permutations`, `rotate`, `shuffle`, `sortedNoteNames`…), `Midi.pcset` and the `pcset*` functions, `Note.sortedNames`, `Pcset.filter`, `Progression.fromRomanNumerals` and `toRomanNumerals`, `Range.chromatic` and `numeric`, `Scale.detect` and `scaleNotes`, `RhythmPattern.binary`, `hex`, `probability` and `rotate`, and `VoiceLeading.topNoteDiff`.
  - `TimeSignature.get` and `parse` give the empty signature (`[0, 0]`); `coordToNote` and `coordToInterval` give `{ empty: true }`; `altToAcc` and `fillStr` give `""`, `accToAlt` `0`; `tonicIntervalsTransposer` without intervals gives a function that returns `""`.
  - The low-level pitch helpers keep their types: `chroma` and `height` give `NaN`, `coordinates` `[NaN]`, `pitch` a pitch of `NaN`s (`isPitch` is false), and `midi` `null`. They'll give `null` in tonal 7.
  - `Note.ascending` and `descending` sort invalid notes as equal to the others. A comparator, a `rnd` or a rotation that isn't valid falls back to its default.

  The test that calls every public function with invalid values now has no list of known exceptions, only the two exempt functions.

- Updated dependencies [1a13828]
  - @tonaljs/pitch-note@6.2.1

## 4.11.1

### Patch Changes

- Updated dependencies [ce9b347]
  - @tonaljs/pitch-note@6.2.0

## 4.11.0

### Minor Changes

- 1cf932e: `Midi.isMidi` accepts numeric strings like `"60"`, but its type guard said the value was a `number`, so TypeScript let you call number methods on a string. The guard now narrows to a number or a numeric string.

  **Migration (TypeScript only):** code that passes a value checked with `isMidi` to a function that only takes numbers, such as `if (Midi.isMidi(v)) Midi.midiToFreq(v)`, no longer compiles. Convert it first: `Midi.midiToFreq(Midi.toMidi(v)!)` or `Midi.midiToFreq(+v)`. Nothing changes at runtime.

## 4.10.7

### Patch Changes

- 9b041bb: `Midi.chroma` returns a pitch class from 0 to 11 for midi numbers below 0 too (`Midi.chroma(-1)` was `-1`, now `11`), so `Midi.pcset([-1])` is `[11]`. `Midi.pcsetNearest` finds the nearest note below midi 0 (`pcsetNearest([2])(-11)` was `undefined`, now `-10`) and for decimal midi numbers like the ones from `freqToMidi` (`pcsetNearest(Scale.get("C major").chroma)(59.96)` was `undefined`, now `60`). Whole midi numbers from 0 to 127 give the same results as before.
- 4162dde: `Midi.pcset` rounds decimal midi numbers to the nearest note and ignores numbers that aren't finite, so a pitch class set is always whole numbers from 0 to 11, and `pcsetNearest`, `pcsetSteps` and `pcsetDegrees` return whole midi numbers for a set built from decimal midi. `Midi.chroma` keeps the fraction of a decimal midi number, which is now documented.

## 4.10.6

### Patch Changes

- Updated dependencies [66f551a]
  - @tonaljs/pitch-note@6.1.3

## 4.10.5

### Patch Changes

- f3b53a4: Fix `Note.simplify` dropping the octave of notes outside the midi range (`simplify("C10")` was `"C"`), and `Midi.midiToNoteName` returning `NaN` for negative numbers (`midiToNoteName(-1)` is now `"B-2"`)
- 80a12e3: Fix `isMidi` and `toMidi`: empty or blank strings, `null`, arrays and booleans are not midi numbers anymore (`toMidi("")` was `0`) (see #519)

## 4.10.4

### Patch Changes

- 4694a12: - Build `dist/index.js` and `dist/index.d.ts` again, so the `main` and `types` entries of every package resolve. Since the tsdown migration the build wrote `index.cjs` and `index.d.cts` instead, and `require("tonal")` or `import "tonal"` in Node failed with "Cannot find module".
- Updated dependencies [4694a12]
  - @tonaljs/pitch-note@6.1.2

## 4.10.3

### Patch Changes

- Updated dependencies [9aeb912]
  - @tonaljs/pitch-note@6.1.1

## 4.10.2

### Patch Changes

- 3c89703: Fix octave displacement of Midi.pcsetNearest

## 4.10.1

### Patch Changes

- Updated dependencies [b791283]
  - @tonaljs/pitch-note@6.1.0

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

## 4.9.3

### Patch Changes

- Updated dependencies [48fecc4]
- Updated dependencies [48fecc4]
  - @tonaljs/core@5.0.0

## 4.9.2

### Patch Changes

- Dependencies between packages are now fixed
- Updated dependencies
  - @tonaljs/core@4.10.4

## 4.9.1

### Patch Changes

- Named type was renamed to NamedPitch. Add old export for backwards compatibility
- Updated dependencies
  - @tonaljs/core@4.10.3

## 4.9.0

### Minor Changes

- New midi functions

  - Midi.pcset
  - Midi.pcsetSteps
  - Midi.pcsetDegrees
  - Midi.pcsetNearest

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
