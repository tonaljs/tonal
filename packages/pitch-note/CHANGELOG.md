# @tonaljs/pitch-note

## 6.2.1

### Patch Changes

- 1a13828: No public function throws on invalid input any more, apart from `deprecate` and `ChordType.add`, which aren't music functions. Each gives the empty value of its type:

  - Lists (`[]`): `Collection` and `Array` (`compact`, `permutations`, `rotate`, `shuffle`, `sortedNoteNames`…), `Midi.pcset` and the `pcset*` functions, `Note.sortedNames`, `Pcset.filter`, `Progression.fromRomanNumerals` and `toRomanNumerals`, `Range.chromatic` and `numeric`, `Scale.detect` and `scaleNotes`, `RhythmPattern.binary`, `hex`, `probability` and `rotate`, and `VoiceLeading.topNoteDiff`.
  - `TimeSignature.get` and `parse` give the empty signature (`[0, 0]`); `coordToNote` and `coordToInterval` give `{ empty: true }`; `altToAcc` and `fillStr` give `""`, `accToAlt` `0`; `tonicIntervalsTransposer` without intervals gives a function that returns `""`.
  - The low-level pitch helpers keep their types: `chroma` and `height` give `NaN`, `coordinates` `[NaN]`, `pitch` a pitch of `NaN`s (`isPitch` is false), and `midi` `null`. They'll give `null` in tonal 7.
  - `Note.ascending` and `descending` sort invalid notes as equal to the others. A comparator, a `rnd` or a rotation that isn't valid falls back to its default.

  The test that calls every public function with invalid values now has no list of known exceptions, only the two exempt functions.

- Updated dependencies [1a13828]
  - @tonaljs/pitch@5.0.4

## 6.2.0

### Minor Changes

- ce9b347: `NoteName`, `PcName`, `NoteWithOctave` and `IntervalName` now list the common note and interval names, so editors suggest them, and still accept any string. The listed names are exported on their own as `KnownNoteName`, `KnownPcName`, `KnownNoteWithOctave` and `KnownIntervalName`; the known intervals are written number first, as tonal returns them (`3M`, `-5P`). Types only, nothing changes at runtime.

  If your code types a `Record<NoteName, X>` (or `Record<IntervalName, X>`), it now needs every known name as a key: use `Partial<Record<NoteName, X>>` or `Record<string, X>` instead.

## 6.1.3

### Patch Changes

- 66f551a: The octave of a note is read as a number: `Note.get("C04").name` is `"C4"` (was `"C04"`, so `Note.sortedUniqNames(["C04", "C4"])` kept both), and `"C-0"` is `"C0"` with `oct: 0` (was `-0`). A minus sign with no octave digits is not a note anymore: `Note.get("C-")` used to be a note with a `NaN` octave and height, and `Note.transpose("C-", "M2")` gave `"D"`; now they give the empty note and `""`. Code that reads a tonic with `note()` changes the same way: `Key.majorKey("C-")` and `Key.minorKey("C-")` are the empty key, and `Chord.get(["C-", "maj7"])` is no chord (they used to ignore the `-`).

## 6.1.2

### Patch Changes

- 4694a12: - Build `dist/index.js` and `dist/index.d.ts` again, so the `main` and `types` entries of every package resolve. Since the tsdown migration the build wrote `index.cjs` and `index.d.cts` instead, and `require("tonal")` or `import "tonal"` in Node failed with "Cannot find module".
- Updated dependencies [4694a12]
  - @tonaljs/pitch@5.0.3

## 6.1.1

### Patch Changes

- 9aeb912: - Add `maj11` chord type (major eleventh) (#476)
  - Name `aug7` chord type as "seventh augmented fifth", so `Chord.get("Caug7").type` is no longer empty (#500)
  - `Chord.steps` and `Chord.degrees` keep the tonic octave when the chord is given as tokens: `Chord.steps(["C4", "aug"])` (#497)
  - `TimeSignature.get` accepts common time (`C`) and cut time (`C|`, `¢`) symbols, and no longer throws on invalid input (#490)
  - `Interval.get` rejects malformed intervals like `ddd5` or `5Pgarbage` (#494)
  - Faster pitch class set normalization (#499)
  - Invalid input is no longer cached, so caches can't grow without limit (#498)
  - `Object.prototype` keys like `"constructor"` no longer return built-in functions from `Interval.get`, `RomanNumeral.get`, `ChordType.get`, `ScaleType.get` and `Mode.get`

## 6.1.0

### Minor Changes

- b791283: ### Export `NoteType` and `IntervalType` types

  Typescript types `NoteType` and `IntervalType` are now exported:

  ```ts
  import { Interval, IntervalType, Note, NoteType } from "tonal";

  const note: NoteType = Note.get("C4");
  const interval: IntervalType = Interval.get("P4");
  ```

## 6.0.0

### Major Changes

- 48fecc4: Breaking change: `NoNote` interface is removed. Always return `Note` type (with `empty: true`) when parsing invalid notes.

### Patch Changes

- Updated dependencies [48fecc4]
  - @tonaljs/pitch@5.0.2

## 5.0.3

### Patch Changes

- Dependencies between packages are now fixed

## 5.0.2

### Patch Changes

- 859494b: Fix a possible exception on noteTokenizer

## 5.0.1

### Patch Changes

- Named type was renamed to NamedPitch. Add old export for backwards compatibility
- Updated dependencies
  - @tonaljs/pitch@5.0.1

## 5.0.0

### Major Changes

- 4689b77: First public release
