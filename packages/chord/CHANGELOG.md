# @tonaljs/chord

## 6.4.0

### Minor Changes

- a13e397: `ChordType.complexity(intervals)`, and a `complexity` property on every chord type and chord: the number of notes added to a triad, plus two for each chromatic note (a note, as spelled, outside the major scale that holds most of the chord). `m` is 0, `m7b5` 1, `maj9` 2, `dim7` 3, `7b9#11` 7. Sorting by it lists the common chord types first.

  `Scale.outside(scale, chord)` returns the notes of a chord that aren't in a scale, spelled as in the chord: `Scale.outside("C major", "Bb7")` is `["Bb", "Ab"]`, and `[]` when the chord fits. The scale and the chord can also be note lists.

- 94b2e44: Diminished ninth and eleventh chords: `Chord.get("Co9")` (or `Cdim9`, `C°9`) is the diminished seventh with a 9th, `["C", "Eb", "Gb", "Bbb", "D"]`, and `Co11` adds the 11th too. More tokens can follow (`Co9b13`). `Cdim13` stays empty: its 13th would be the same note as the diminished seventh.

  Chord symbols can have spaces between their qualifiers: `Chord.get("Cm7 b9")` is `Cm7b9`, and `Cmin maj7`, `Cmaj add 9` and `C7(#5) b9` work too. The spaces are removed only when the symbol with them isn't a chord, so names like `"C major seventh"` are unchanged, and the symbol is written without them.

  `Chord.detect` finds chords played without their fifth. When the notes over a root have no name of their own but a chord with a third, a perfect fifth and a seventh has them plus the fifth, it's named with `no5`: `Chord.detect(["C", "E", "B"])` is `["Cmaj7no5"]` (it was `[]`), and C Eb Bb D is `Cm9no5`. These names go after the inversions with every note and before unusual readings, and parse back with `Chord.get`. Listed types without fifth keep their name (`C7no5`, `C9no5`). The new `missingFifth: false` option leaves them out; `assumePerfectFifth` works as before. `Scale.chords` only names listed chord types, as before.

### Patch Changes

- Updated dependencies [a13e397]
- Updated dependencies [3456e6c]
- Updated dependencies [94b2e44]
  - @tonaljs/chord-type@5.4.0
  - @tonaljs/scale-type@4.10.0
  - @tonaljs/chord-detect@4.11.0

## 6.3.2

### Patch Changes

- aa4ab10: `Chord.get` no longer reads symbols that double an interval or put a bare major seventh after a seventh. `Cmaj7maj7`, `Cmaj7(maj7)`, `Csus4sus4`, `C7maj7` and `C4maj7` were chords with a repeated 7M or 4P, a dominant silently turned into a major seventh, or a quartal chord; they're now empty. The major seventh still replaces a seventh in parentheses, as charts write it: `Cm9(^7)`, `Cdim7(maj7)`, `C7(maj7)`.
- Updated dependencies [1cf932e]
  - @tonaljs/pcset@4.10.6
  - @tonaljs/chord-detect@4.10.2
  - @tonaljs/chord-type@5.3.2
  - @tonaljs/scale-type@4.9.7

## 6.3.1

### Patch Changes

- a328946: A `b5` in a chord symbol lowers the fifth. Six chord types listed a `b5` spelling as another name of a `#11` chord, which keeps the fifth, so `Chord.get("C7b5b9").notes` was `["C", "E", "G", "Bb", "Db", "F#"]` (now `["C", "E", "Gb", "Bb", "Db"]`, like `C7b5` and `Cm7b5b9`). The spellings were `7b5b9`, `7b9b5`, `7b5#9`, `7#9b5`, `7b5b13`, `9b5b13`, `7b5b9b13`, `6b5` and `M6b5`. They aren't listed types any more: `Chord.get` reads them as a listed type plus alterations, and `ChordType.get("7b5b9")` is empty. `7b9#11`, `7#9#11`, `6#11` and the other `#11` spellings are unchanged, and so is `Chord.detect`.
- Updated dependencies [a328946]
  - @tonaljs/chord-type@5.3.1
  - @tonaljs/chord-detect@4.10.1

## 6.3.0

### Minor Changes

- 1f86506: Chord symbols as written in charts.

  `Chord.get` reads a listed chord type followed by alterations: `Cm7b5b9`, `C7(b9,#9)`, `C7(no3)`, `Cdim(maj7)`, `C(add9)`. The tokens are `b5 #5 +5 b9 #9 #11 #4 b13 b6`, `add` plus a tone (`add9`, `add11`, `addb9`...), `9 11 13 6` inside parentheses, `no3`, `no5` and `maj7`. An altered tone replaces the natural one (`C13b9` has no 9). The chord keeps the symbol as written, and has the listed type's name when its intervals are a listed type, or an empty `type` otherwise. `7alt` stays `7#5#9`.

  `Chord.get("N.C.")` (or `"NC"`) is "no chord": not empty, with no notes.

  New chord types: `mb6`, `m7b6`, `m9b6`, `mMaj11`, `mMaj13`, `Madd4`, `7susadd3` and `maj7#9`. New aliases for chart shorthand: `-b6 -7b6 -9b6 -^11 -^13 -add2 -add4 add4 7susadd3 7susb9 7susb9b13 ^7#9 ^7b5 ^13#11 h9 o^7`, plus `madd2`, `maj7b5` and `ø9`.

  The new types are part of the dictionary, so functions that list or search chord types can return them: `Chord.detect(["C", "E", "G", "B"])` is `["Cmaj7", "Emb6/C"]` (it was `["Cmaj7"]`), `Chord.extended("Cmaj7")` includes `Cmaj7#9`, `Scale.scaleChords("minor")` includes `mb6`, `m7b6` and `m9b6`, and `Progression.fromRomanNumerals("C", ["iiadd2"])` is `["Dmadd2"]` (it was `["Dmadd9"]`, the same chord).

  `m9b5` has a ninth (`9M`) instead of a second (`2M`), so `Chord.get("Cm9b5").notes` is `["C", "Eb", "Gb", "Bb", "D"]`.

- 3d5530d: Chord degrees by name: `Chord.formula`, `Chord.degreeOf`, `Chord.noteOf` and `Chord.degreesByImportance`.

  Degrees are named as in chord formulas, counted from the major scale of the root (`1 b3 5 b7` for a minor seventh). `Chord.formula("Cm7")` is `["1", "b3", "5", "b7"]`. `Chord.degreeOf("C7b9", "Db")` is `"b9"`; a note that isn't in the chord gets its most probable degree (`Chord.degreeOf("C7", "F")` is `"11"`, `Chord.degreeOf("C", "A")` is `"6"`). `Chord.noteOf("C7b9", "b9")` is `"Db"`, spelled from the root, and gives back the note of any degree from `degreeOf`. `Chord.degreesByImportance("C13")` is `["3", "b7", "9", "1", "5", "13"]`: the degrees sorted by how much they define the chord.

  `Chord.degrees` doesn't change: its numbers count the chord notes in order (`Chord.degrees("C")(3)` is `"G"`), while `Chord.noteOf("C", "3")` is `"E"`.

- 09043d6: `Chord.detect` finds the bass and ranks names better, and every name it returns parses back. This changes its output:

  - When every note has an octave, the lowest note is the bass, whatever the order: `Chord.detect(["A3", "C4", "F3"])` is `["FM", "Am#5/F"]` (it was `["Am#5", "FM/A"]`). Without octaves, the first note is still the bass.
  - Unusual readings go after inversions, with a rule adapted from sharp11: no perfect fifth and no stated altered fifth (except dominant chords without fifth, like `C7no5`), a fifth with a minor third and a minor sixth, a sixth chord with an added fourth, or `o7M7`. `Chord.detect(["E4", "G4", "C5"])` is `["CM/E", "Em#5"]` (it was `["Em#5", "CM/E"]`), `Chord.detect(["E", "G", "B", "C"])` is `["Cmaj7/E", "Emb6"]` and `Chord.detect(["C", "F", "Bb", "Eb"])` is `["F7sus4/C", "Bbsus24/C", "Cquartal"]` (it started with `"C4"`).
  - Among names with the same notes over the same root, the one that spells the given notes goes first: `Chord.detect(["Eb", "G", "B", "D"])` starts with `"Ebmaj7#5"` (it was `"EbM7b6"`).
  - A new `exclude` option leaves out chord types by name or alias: `Chord.detect(["C", "F", "Bb", "Eb"], { exclude: ["quartal"] })` is `["F7sus4/C", "Bbsus24/C"]`.

  Three chord types have a new first alias, so they're printed differently by `Chord.detect`, `Scale.scaleChords`, `Scale.extended`, `Scale.reduced`, `Chord.extended`, `Chord.reduced` and `Progression.fromRomanNumerals` (`iimaj7` in C is `DmMaj7`, it was `Dm/ma7`). No alias is removed, so the old names still parse:

  - `mMaj7` (was `m/ma7`, which made inversions like `Cm/ma7/Eb`): `Chord.detect(["Eb", "G", "B", "C"])` is `["CmMaj7/Eb"]`.
  - `7b9sus4` (was `b9sus`: `Chord.get("Cb9sus")` is Cb plus `9sus`): `Chord.detect(["C", "F", "G", "Bb", "Db"])` starts with `"C7b9sus4"`.
  - `quartal` (was `4`, so `C4` read as a note).

- d880522: Chord types and chords have a `family`: `major`, `minor`, `dominant`, `half-diminished`, `diminished`, `augmented`, `suspended` or `power`, computed from the third, fifth and seventh. It's coarser than `quality`, which doesn't change: `ChordType.get("m7b5").family` is `"half-diminished"` (its quality is `"Diminished"`), `ChordType.get("7b9").family` is `"dominant"` and `ChordType.get("7sus4").family` is `"suspended"` (its quality is `"Unknown"`). Composed chords get one too: `Chord.get("C7(b9,#9)").family` is `"dominant"`.

  `ChordType.family(intervals)` classifies any list of intervals.

- bb8889d: Chord names and suspensions.

  A chord whose type has no long name is named by its symbol: `Chord.get("Cadd9").name` is `"Cadd9"` (it was `"C "`, with a trailing space), and `Chord.get("C7b9b13").name` is `"C7b9b13"`. Types with a long name don't change (`"C major seventh"`).

  Chord symbols as written in charts accept `sus4` (or `sus`) and `sus2`, which replace the third: `Cmaj7sus4`, `Cmaj9sus4`, `C7sus2`, `Cmaj7sus2`, `C6sus4` and `C6sus2` were empty. `Chord.get("Cmaj7sus4")` is the `M7sus4` type. The minor third is replaced too, so `Cm7sus4` is the same chord as `C7sus4`.

### Patch Changes

- Updated dependencies [1f86506]
- Updated dependencies [09043d6]
- Updated dependencies [d880522]
- Updated dependencies [f2cecb3]
- Updated dependencies [d81d784]
- Updated dependencies [66f551a]
- Updated dependencies [223f729]
- Updated dependencies [99ee8a1]
- Updated dependencies [f2cecb3]
- Updated dependencies [bb8889d]
  - @tonaljs/chord-type@5.3.0
  - @tonaljs/chord-detect@4.10.0
  - @tonaljs/interval@5.2.0
  - @tonaljs/pitch-note@6.1.3
  - @tonaljs/pcset@4.10.5
  - @tonaljs/collection@4.9.2
  - @tonaljs/pitch-distance@5.1.1
  - @tonaljs/scale-type@4.9.6

## 6.2.2

### Patch Changes

- Updated dependencies [61dedc5]
- Updated dependencies [875f1b7]
- Updated dependencies [875f1b7]
  - @tonaljs/pitch-distance@5.1.0
  - @tonaljs/interval@5.1.2
  - @tonaljs/pcset@4.10.4
  - @tonaljs/chord-detect@4.9.4
  - @tonaljs/chord-type@5.2.2
  - @tonaljs/scale-type@4.9.5

## 6.2.1

### Patch Changes

- 4694a12: - Build `dist/index.js` and `dist/index.d.ts` again, so the `main` and `types` entries of every package resolve. Since the tsdown migration the build wrote `index.cjs` and `index.d.cts` instead, and `require("tonal")` or `import "tonal"` in Node failed with "Cannot find module".
- Updated dependencies [4694a12]
  - @tonaljs/chord-detect@4.9.3
  - @tonaljs/chord-type@5.2.1
  - @tonaljs/collection@4.9.1
  - @tonaljs/interval@5.1.1
  - @tonaljs/pcset@4.10.3
  - @tonaljs/pitch-distance@5.0.7
  - @tonaljs/pitch-note@6.1.2
  - @tonaljs/scale-type@4.9.4

## 6.2.0

### Minor Changes

- 9aeb912: - Add `maj11` chord type (major eleventh) (#476)
  - Name `aug7` chord type as "seventh augmented fifth", so `Chord.get("Caug7").type` is no longer empty (#500)
  - `Chord.steps` and `Chord.degrees` keep the tonic octave when the chord is given as tokens: `Chord.steps(["C4", "aug"])` (#497)
  - `TimeSignature.get` accepts common time (`C`) and cut time (`C|`, `¢`) symbols, and no longer throws on invalid input (#490)
  - `Interval.get` rejects malformed intervals like `ddd5` or `5Pgarbage` (#494)
  - Faster pitch class set normalization (#499)
  - Invalid input is no longer cached, so caches can't grow without limit (#498)
  - `Object.prototype` keys like `"constructor"` no longer return built-in functions from `Interval.get`, `RomanNumeral.get`, `ChordType.get`, `ScaleType.get` and `Mode.get`

### Patch Changes

- Updated dependencies [9aeb912]
  - @tonaljs/chord-type@5.2.0
  - @tonaljs/pitch-note@6.1.1
  - @tonaljs/pcset@4.10.2
  - @tonaljs/scale-type@4.9.3
  - @tonaljs/chord-detect@4.9.2
  - @tonaljs/pitch-distance@5.0.6

## 6.1.2

### Patch Changes

- Updated dependencies
  - @tonaljs/scale-type@4.9.2

## 6.1.1

### Patch Changes

- Updated dependencies [b791283]
  - @tonaljs/pitch-note@6.1.0
  - @tonaljs/pcset@4.10.1
  - @tonaljs/pitch-distance@5.0.5
  - @tonaljs/chord-detect@4.9.1
  - @tonaljs/chord-type@5.1.1
  - @tonaljs/scale-type@4.9.1

## 6.1.0

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
- Updated dependencies [4e05792]
- Updated dependencies [56d89f7]
  - @tonaljs/chord-detect@4.9.0
  - @tonaljs/chord-type@5.1.0
  - @tonaljs/scale-type@4.9.0
  - @tonaljs/pcset@4.10.0
  - @tonaljs/pitch-distance@5.0.4
  - @tonaljs/collection@4.9.0
  - @tonaljs/interval@5.1.0

## 6.0.0

### Major Changes

- 97f01d4: #### Breaking change: chord uses pitch classes, never notes with octaves
  - Breaking change: chords uses only pitch classes. Before `Chord.getChord('M', 'C4')` would consider `C4` to be the tonic and now is `C``

  So **before**:

  ```js
  Chord.get("M", "C4"); // =>
  // {
  //   name: 'C4 major',
  //   tonic: 'C4',
  //   notes: [ 'C4', 'E4', 'G4' ]
  // ...
  // }
  ```

  **Now**:

  ```js
  Chord.get("M", "C4"); // =>
  // {
  //   name: 'C major',
  //   tonic: 'C',
  //   notes: [ 'C', 'E', 'G' ]
  // }
  ```

  ### Feature: slash chords
  - Chord now accepts a slash and a bass. The bass _must_ be a pitch class
  - Chord properties include `bass` that is a pitch class that could or could not belong to the chord itself.

  Example:

  ```js
  Chord.get("Cmaj7/B");
  Chord.get("Eb/D");
  ```

  ### Feature: chord `notes`

  Now `notes` property of a chord are always pitch classes, there's a new function to get the actual notes:

  ```js
  Chord.notes("Cmaj7", "C4"); // => ['C4', 'E4', 'G4', 'B4']
  Chord.notes("maj7", "D5"); // => ['D5', 'F#5', 'A5', 'C#6']
  ```

### Patch Changes

- Updated dependencies [48fecc4]
- Updated dependencies [48fecc4]
  - @tonaljs/interval@5.0.0
  - @tonaljs/pitch-note@6.0.0
  - @tonaljs/pitch-distance@5.0.3
  - @tonaljs/chord-detect@4.8.5
  - @tonaljs/chord-type@5.0.5
  - @tonaljs/pcset@4.9.2
  - @tonaljs/scale-type@4.8.5

## 5.0.3

### Patch Changes

- Dependencies between packages are now fixed
- Updated dependencies
  - @tonaljs/pitch-distance@5.0.2
  - @tonaljs/chord-detect@4.8.4
  - @tonaljs/chord-type@5.0.4
  - @tonaljs/pitch-note@5.0.3
  - @tonaljs/scale-type@4.8.4
  - @tonaljs/pcset@4.9.1

## 5.0.x

- Update dependencies to fix an exception. See #407
- Named type was renamed to NamedPitch. Add old export for backwards compatibility

## 5.0.0

### Major Changes

- b07a54c0: Breaking change: `Chord.get` and `Chord.tokenize` assumes all numbers are part of the chord type, and never the tonic octave, when using with a single string parameter.

  Before, in v4.x:

  ```js
  Chord.get("C4maj7"); // => { symbol: 'Cmaj7', tonic: 'C4' ... }
  ```

  Now, in > 5.x:

  ```js
  Chord.get("C4maj7"); // => { empty: true } <- there is no "4maj7" chord type, so no chord is returned
  ```

  The old behaviour can be replicated by using an array as parameter.

  This works both in v4.x and v5.x:

  ```js
  Chord.get(["C4", "maj7"]); // => { symbol: 'Cmaj7', tonic: 'C4' ... }
  ```

  The reasons for this change are:
  1. Chord symbols never use octaves
  2. The old behavior is confusing and arbitrary

### Patch Changes

- Updated dependencies [b07a54c0]
  - @tonaljs/chord-type@5.0.0
  - @tonaljs/chord-detect@4.8.2

## 4.10.1

### Patch Changes

- 96df1a19: Add 6add9 to chord types aliases. Rename to "sixth added ninth"
- Updated dependencies [96df1a19]
  - @tonaljs/chord-type@4.8.1

## 4.10.0

### Minor Changes

- 6fcd52db: Add Scale.steps and Chord.steps

### Patch Changes

- Updated dependencies [6fcd52db]
  - @tonaljs/core@4.10.0

## 4.9.0

### Minor Changes

- Chord.degrees

  Example: `[1, 2, 3, 4].map(Chord.degrees("C4")) => ["C4", "E4", "G4", "C5"]`

  Deprecation removal: `@tonal/tonal` won't receive any updates. Use `tonal` instead.

### Patch Changes

- Updated dependencies
  - @tonaljs/core@4.9.0

## 4.8.0

### Minor Changes

- - fix time signature parsing
  - add support for irrational time signatures
  - add option `assumePerfectFifth` to `Chord.detect` function

### Patch Changes

- Updated dependencies
  - @tonaljs/chord-detect@4.8.0
  - @tonaljs/chord-type@4.8.0
  - @tonaljs/collection@4.8.0
  - @tonaljs/core@4.8.0
  - @tonaljs/pcset@4.8.0
  - @tonaljs/scale-type@4.8.0

## 4.7.2

### Patch Changes

- Unify package versions
- Updated dependencies
  - @tonaljs/core@4.7.2
  - @tonaljs/chord-detect@4.7.2
  - @tonaljs/chord-type@4.7.2
  - @tonaljs/collection@4.7.2
  - @tonaljs/pcset@4.7.2
  - @tonaljs/scale-type@4.7.2

## 4.7.1

### Patch Changes

- fix npm publish problem
- Updated dependencies
  - @tonaljs/chord-detect@4.7.1
  - @tonaljs/chord-type@4.7.1
  - @tonaljs/collection@4.7.1
  - @tonaljs/core@4.6.12
  - @tonaljs/pcset@4.7.1
  - @tonaljs/scale-type@4.7.1

## 4.7.0

### Minor Changes

- b120fc42: Publish tonal in `tonal` package. So use `npm install tonal` instead of `npm install @tonaljs/tonal`

### Patch Changes

- fix memory leak
- Updated dependencies
- Updated dependencies [b120fc42]
  - @tonaljs/chord-detect@4.7.0
  - @tonaljs/chord-type@4.7.0
  - @tonaljs/collection@4.7.0
  - @tonaljs/core@4.6.11
  - @tonaljs/pcset@4.7.0
  - @tonaljs/scale-type@4.7.0

## 4.6.10

### Patch Changes

- Bug fixing
- Updated dependencies
  - @tonaljs/chord-detect@4.6.10
  - @tonaljs/chord-type@4.6.10
  - @tonaljs/collection@4.6.10
  - @tonaljs/core@4.6.10
  - @tonaljs/pcset@4.6.10
  - @tonaljs/scale-type@4.6.10
