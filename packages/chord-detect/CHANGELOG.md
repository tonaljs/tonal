# @tonaljs/chord-detect

## 4.11.2

### Patch Changes

- f95a90c: Invalid input gives an empty value instead of an exception in more functions:

  - Every `Chord` function given something that isn't a string (`Chord.get(undefined)`, `Chord.notes(null)`, `Chord.degrees(5)`…) gives an empty chord, `[]` or `""`. So do `Voicing.get`, `Voicing.search` and `Voicing.sequence`.
  - `Chord.detect` gives `[]` when the notes aren't an array.
  - `ChordType.complexity` gives `0`, and `ChordType.family` `""`, when the intervals aren't an array (`ChordType.complexity("m7")` used to throw).
  - `RhythmPattern.toDurations(undefined)` gives `[]`.

  A new test calls every public function with invalid values and fails if one throws, apart from a list of known cases still to fix.

- Updated dependencies [1a13828]
- Updated dependencies [f95a90c]
  - @tonaljs/pitch-note@6.2.1
  - @tonaljs/pitch-interval@6.4.1
  - @tonaljs/pitch-distance@5.1.3
  - @tonaljs/pcset@4.10.8
  - @tonaljs/chord-type@5.4.2

## 4.11.1

### Patch Changes

- Updated dependencies [ce9b347]
  - @tonaljs/pitch-note@6.2.0
  - @tonaljs/pitch-interval@6.4.0
  - @tonaljs/pcset@4.10.7
  - @tonaljs/pitch-distance@5.1.2
  - @tonaljs/chord-type@5.4.1

## 4.11.0

### Minor Changes

- 94b2e44: Diminished ninth and eleventh chords: `Chord.get("Co9")` (or `Cdim9`, `C°9`) is the diminished seventh with a 9th, `["C", "Eb", "Gb", "Bbb", "D"]`, and `Co11` adds the 11th too. More tokens can follow (`Co9b13`). `Cdim13` stays empty: its 13th would be the same note as the diminished seventh.

  Chord symbols can have spaces between their qualifiers: `Chord.get("Cm7 b9")` is `Cm7b9`, and `Cmin maj7`, `Cmaj add 9` and `C7(#5) b9` work too. The spaces are removed only when the symbol with them isn't a chord, so names like `"C major seventh"` are unchanged, and the symbol is written without them.

  `Chord.detect` finds chords played without their fifth. When the notes over a root have no name of their own but a chord with a third, a perfect fifth and a seventh has them plus the fifth, it's named with `no5`: `Chord.detect(["C", "E", "B"])` is `["Cmaj7no5"]` (it was `[]`), and C Eb Bb D is `Cm9no5`. These names go after the inversions with every note and before unusual readings, and parse back with `Chord.get`. Listed types without fifth keep their name (`C7no5`, `C9no5`). The new `missingFifth: false` option leaves them out; `assumePerfectFifth` works as before. `Scale.chords` only names listed chord types, as before.

### Patch Changes

- Updated dependencies [a13e397]
  - @tonaljs/chord-type@5.4.0

## 4.10.2

### Patch Changes

- Updated dependencies [1cf932e]
  - @tonaljs/pcset@4.10.6
  - @tonaljs/chord-type@5.3.2

## 4.10.1

### Patch Changes

- Updated dependencies [a328946]
  - @tonaljs/chord-type@5.3.1

## 4.10.0

### Minor Changes

- 09043d6: `Chord.detect` finds the bass and ranks names better, and every name it returns parses back. This changes its output:

  - When every note has an octave, the lowest note is the bass, whatever the order: `Chord.detect(["A3", "C4", "F3"])` is `["FM", "Am#5/F"]` (it was `["Am#5", "FM/A"]`). Without octaves, the first note is still the bass.
  - Unusual readings go after inversions, with a rule adapted from sharp11: no perfect fifth and no stated altered fifth (except dominant chords without fifth, like `C7no5`), a fifth with a minor third and a minor sixth, a sixth chord with an added fourth, or `o7M7`. `Chord.detect(["E4", "G4", "C5"])` is `["CM/E", "Em#5"]` (it was `["Em#5", "CM/E"]`), `Chord.detect(["E", "G", "B", "C"])` is `["Cmaj7/E", "Emb6"]` and `Chord.detect(["C", "F", "Bb", "Eb"])` is `["F7sus4/C", "Bbsus24/C", "Cquartal"]` (it started with `"C4"`).
  - Among names with the same notes over the same root, the one that spells the given notes goes first: `Chord.detect(["Eb", "G", "B", "D"])` starts with `"Ebmaj7#5"` (it was `"EbM7b6"`).
  - A new `exclude` option leaves out chord types by name or alias: `Chord.detect(["C", "F", "Bb", "Eb"], { exclude: ["quartal"] })` is `["F7sus4/C", "Bbsus24/C"]`.

  Three chord types have a new first alias, so they're printed differently by `Chord.detect`, `Scale.scaleChords`, `Scale.extended`, `Scale.reduced`, `Chord.extended`, `Chord.reduced` and `Progression.fromRomanNumerals` (`iimaj7` in C is `DmMaj7`, it was `Dm/ma7`). No alias is removed, so the old names still parse:

  - `mMaj7` (was `m/ma7`, which made inversions like `Cm/ma7/Eb`): `Chord.detect(["Eb", "G", "B", "C"])` is `["CmMaj7/Eb"]`.
  - `7b9sus4` (was `b9sus`: `Chord.get("Cb9sus")` is Cb plus `9sus`): `Chord.detect(["C", "F", "G", "Bb", "Db"])` starts with `"C7b9sus4"`.
  - `quartal` (was `4`, so `C4` read as a note).

### Patch Changes

- Updated dependencies [1f86506]
- Updated dependencies [09043d6]
- Updated dependencies [d880522]
- Updated dependencies [f2cecb3]
- Updated dependencies [e6cd704]
- Updated dependencies [66f551a]
- Updated dependencies [223f729]
- Updated dependencies [f2cecb3]
- Updated dependencies [bb8889d]
  - @tonaljs/chord-type@5.3.0
  - @tonaljs/pitch-interval@6.3.0
  - @tonaljs/pitch-note@6.1.3
  - @tonaljs/pcset@4.10.5
  - @tonaljs/pitch-distance@5.1.1

## 4.9.4

### Patch Changes

- @tonaljs/pcset@4.10.4
- @tonaljs/chord-type@5.2.2

## 4.9.3

### Patch Changes

- 4694a12: - Build `dist/index.js` and `dist/index.d.ts` again, so the `main` and `types` entries of every package resolve. Since the tsdown migration the build wrote `index.cjs` and `index.d.cts` instead, and `require("tonal")` or `import "tonal"` in Node failed with "Cannot find module".
- Updated dependencies [4694a12]
  - @tonaljs/chord-type@5.2.1
  - @tonaljs/pcset@4.10.3
  - @tonaljs/pitch-note@6.1.2

## 4.9.2

### Patch Changes

- Updated dependencies [9aeb912]
  - @tonaljs/chord-type@5.2.0
  - @tonaljs/pitch-note@6.1.1
  - @tonaljs/pcset@4.10.2

## 4.9.1

### Patch Changes

- Updated dependencies [b791283]
  - @tonaljs/pitch-note@6.1.0
  - @tonaljs/pcset@4.10.1
  - @tonaljs/chord-type@5.1.1

## 4.9.0

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
  - @tonaljs/chord-type@5.1.0
  - @tonaljs/pcset@4.10.0

## 4.8.5

### Patch Changes

- Updated dependencies [48fecc4]
- Updated dependencies [48fecc4]
  - @tonaljs/core@5.0.0
  - @tonaljs/chord-type@5.0.5
  - @tonaljs/pcset@4.9.2

## 4.8.4

### Patch Changes

- Dependencies between packages are now fixed
- Updated dependencies
  - @tonaljs/chord-type@5.0.4
  - @tonaljs/pcset@4.9.1
  - @tonaljs/core@4.10.4

## 4.8.3

### Patch Changes

- Named type was renamed to NamedPitch. Add old export for backwards compatibility
- Updated dependencies
  - @tonaljs/chord-type@5.0.3
  - @tonaljs/core@4.10.3
  - @tonaljs/pcset@4.8.3

## 4.8.2

### Patch Changes

- Updated dependencies [b07a54c0]
  - @tonaljs/chord-type@5.0.0

## 4.8.0

### Minor Changes

- - fix time signature parsing
  - add support for irrational time signatures
  - add option `assumePerfectFifth` to `Chord.detect` function

### Patch Changes

- Updated dependencies
  - @tonaljs/chord-type@4.8.0
  - @tonaljs/core@4.8.0
  - @tonaljs/pcset@4.8.0

## 4.7.2

### Patch Changes

- Unify package versions
- Updated dependencies
  - @tonaljs/core@4.7.2
  - @tonaljs/chord-type@4.7.2
  - @tonaljs/pcset@4.7.2

## 4.7.1

### Patch Changes

- fix npm publish problem
- Updated dependencies
  - @tonaljs/chord-type@4.7.1
  - @tonaljs/core@4.6.12
  - @tonaljs/pcset@4.7.1

## 4.7.0

### Minor Changes

- b120fc42: Publish tonal in `tonal` package. So use `npm install tonal` instead of `npm install @tonaljs/tonal`

### Patch Changes

- fix memory leak
- Updated dependencies
- Updated dependencies [b120fc42]
  - @tonaljs/chord-type@4.7.0
  - @tonaljs/core@4.6.11
  - @tonaljs/pcset@4.7.0

## 4.6.10

### Patch Changes

- Bug fixing
- Updated dependencies
  - @tonaljs/chord-type@4.6.10
  - @tonaljs/core@4.6.10
  - @tonaljs/pcset@4.6.10
