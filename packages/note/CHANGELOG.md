# @tonaljs/note

## 4.13.0

### Minor Changes

- 659c1a5: `Note.fold` takes pitch classes: a note without octave goes to the lowest octave at or above the low end of the range (in a range under an octave, the octave nearest the range), in either mode. It places notes in a register: `Note.fold(["D", "G", "C"], ["E2", "D3"])` is `["D3", "G2", "C3"]`, and a bass line is `Note.fold(chords.map((chord) => Chord.bass(chord)), ["E1", "D2"])`. It used to return `[]` for a pitch class.
- 7ce587b: Play note patterns over voicings and keep them in a register.

  - `Voicing.steps(voicing)` gives a function from a position to a note, 0 being the lowest voice, like `Scale.steps` and `Chord.steps`: `[0, 1, 2, 3].map(Voicing.steps(["C4", "E4", "G4"]))` is `["C4", "E4", "G4", "C5"]`. Past the top voice the voicing repeats above itself, moved up the fewest octaves that put its lowest note at or above the top note (two for C3 G3 E4), so `Pattern` arpeggios keep going up. Negative positions go down the same way.
  - `Note.fold(notes, [low, high])` moves a figure by octaves into a range, keeping its shape and spelling; with `{ each: true }` each note moves on its own. `Note.fold(["C2", "E2", "G2", "Bb2"], ["E2", "G3"])` is `["C3", "E3", "G3", "Bb3"]`.
  - `Chord.bass(chord, octave?)` is the slash bass, or the root: `Chord.bass("C7/E", 2)` is `"E2"`, `Chord.bass("C7")` is `"C"`.

  The pattern README plays patterns over voicings with `Voicing.steps`. The chord README shows approach notes for bass lines (a half step or a scale step below or above, the fifth, enclosures) as transpositions of the target.

## 4.12.9

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
  - @tonaljs/midi@4.11.2

## 4.12.8

### Patch Changes

- Updated dependencies [ce9b347]
  - @tonaljs/pitch-note@6.2.0
  - @tonaljs/pitch-interval@6.4.0
  - @tonaljs/midi@4.11.1
  - @tonaljs/pitch-distance@5.1.2

## 4.12.7

### Patch Changes

- Updated dependencies [1cf932e]
  - @tonaljs/midi@4.11.0

## 4.12.6

### Patch Changes

- Updated dependencies [9b041bb]
- Updated dependencies [4162dde]
  - @tonaljs/midi@4.10.7

## 4.12.5

### Patch Changes

- 6c44917: `Note.sortedUniqNames` (and so `Scale.scaleNotes`) removes every duplicate, even when an enharmonic note sorts between two copies: `Note.sortedUniqNames(["C4", "B#3", "C4"])` is now `["C4", "B#3"]` instead of `["C4", "B#3", "C4"]`.
- Updated dependencies [f2cecb3]
- Updated dependencies [e6cd704]
- Updated dependencies [66f551a]
- Updated dependencies [f2cecb3]
  - @tonaljs/pitch-interval@6.3.0
  - @tonaljs/pitch-note@6.1.3
  - @tonaljs/pitch-distance@5.1.1
  - @tonaljs/midi@4.10.6

## 4.12.4

### Patch Changes

- f3b53a4: Fix `Note.simplify` dropping the octave of notes outside the midi range (`simplify("C10")` was `"C"`), and `Midi.midiToNoteName` returning `NaN` for negative numbers (`midiToNoteName(-1)` is now `"B-2"`)
- Updated dependencies [61dedc5]
- Updated dependencies [875f1b7]
- Updated dependencies [875f1b7]
- Updated dependencies [f3b53a4]
- Updated dependencies [80a12e3]
  - @tonaljs/pitch-distance@5.1.0
  - @tonaljs/pitch-interval@6.2.0
  - @tonaljs/midi@4.10.5

## 4.12.3

### Patch Changes

- 4694a12: - Build `dist/index.js` and `dist/index.d.ts` again, so the `main` and `types` entries of every package resolve. Since the tsdown migration the build wrote `index.cjs` and `index.d.cts` instead, and `require("tonal")` or `import "tonal"` in Node failed with "Cannot find module".
- Updated dependencies [4694a12]
  - @tonaljs/midi@4.10.4
  - @tonaljs/pitch@5.0.3
  - @tonaljs/pitch-distance@5.0.7
  - @tonaljs/pitch-interval@6.1.2
  - @tonaljs/pitch-note@6.1.2

## 4.12.2

### Patch Changes

- Updated dependencies [9aeb912]
  - @tonaljs/pitch-interval@6.1.1
  - @tonaljs/pitch-note@6.1.1
  - @tonaljs/pitch-distance@5.0.6
  - @tonaljs/midi@4.10.3

## 4.12.1

### Patch Changes

- Updated dependencies [3c89703]
  - @tonaljs/midi@4.10.2

## 4.12.0

### Minor Changes

- b791283: ### Export `NoteType` and `IntervalType` types

  Typescript types `NoteType` and `IntervalType` are now exported:

  ```ts
  import { Interval, IntervalType, Note, NoteType } from "tonal";

  const note: NoteType = Note.get("C4");
  const interval: IntervalType = Interval.get("P4");
  ```

### Patch Changes

- Updated dependencies [b791283]
  - @tonaljs/pitch-interval@6.1.0
  - @tonaljs/pitch-note@6.1.0
  - @tonaljs/pitch-distance@5.0.5
  - @tonaljs/midi@4.10.1

## 4.11.0

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

- 3cd5f16: #### Fix: add `Note.distance` back

  The documentation said `Note.distance` was available, but was not.

  Now you can do:

  ```js
  import { Note } from "tonal";
  Note.distance("c4", "e7"); // => "24M"
  ```

- Updated dependencies [b113754]
- Updated dependencies [4e05792]
  - @tonaljs/midi@4.10.0
  - @tonaljs/pitch-distance@5.0.4

## 4.10.3

### Patch Changes

- Updated dependencies [48fecc4]
- Updated dependencies [48fecc4]
  - @tonaljs/core@5.0.0
  - @tonaljs/midi@4.9.3

## 4.10.2

### Patch Changes

- Dependencies between packages are now fixed
- Updated dependencies
  - @tonaljs/core@4.10.4
  - @tonaljs/midi@4.9.2

## 4.10.1

### Patch Changes

- Named type was renamed to NamedPitch. Add old export for backwards compatibility
- Updated dependencies
  - @tonaljs/core@4.10.3
  - @tonaljs/midi@4.9.1

## 4.10.0

### Minor Changes

Refactor transposeFifths and transposeOctaves

### Patch Changes

- Updated dependencies
  - @tonaljs/core@4.9.0

## 4.9.0

### Minor Changes

- Scale.degrees new function

  Example: `[1, 2, 3].map(Scale.degrees("C major")) => ["C", "D", "E"]`

## 4.8.0

### Minor Changes

- - fix time signature parsing
  - add support for irrational time signatures
  - add option `assumePerfectFifth` to `Chord.detect` function

### Patch Changes

- Updated dependencies
  - @tonaljs/core@4.8.0
  - @tonaljs/midi@4.8.0

## 4.7.2

### Patch Changes

- Unify package versions
- Updated dependencies
  - @tonaljs/core@4.7.2
  - @tonaljs/midi@4.7.2

## 4.7.1

### Patch Changes

- fix npm publish problem
- Updated dependencies
  - @tonaljs/core@4.6.12
  - @tonaljs/midi@4.7.1

## 4.7.0

### Minor Changes

- b120fc42: Publish tonal in `tonal` package. So use `npm install tonal` instead of `npm install @tonaljs/tonal`

### Patch Changes

- fix memory leak
- Updated dependencies
- Updated dependencies [b120fc42]
  - @tonaljs/core@4.6.11
  - @tonaljs/midi@4.7.0

## 4.6.10

### Patch Changes

- Bug fixing
- Updated dependencies
  - @tonaljs/core@4.6.10
  - @tonaljs/midi@4.6.10
