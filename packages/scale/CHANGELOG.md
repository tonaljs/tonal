# @tonaljs/scale

## 4.15.1

### Patch Changes

- Updated dependencies [6d3c02c]
  - @tonaljs/chord@6.5.0

## 4.15.0

### Minor Changes

- a13e397: `ChordType.complexity(intervals)`, and a `complexity` property on every chord type and chord: the number of notes added to a triad, plus two for each chromatic note (a note, as spelled, outside the major scale that holds most of the chord). `m` is 0, `m7b5` 1, `maj9` 2, `dim7` 3, `7b9#11` 7. Sorting by it lists the common chord types first.

  `Scale.outside(scale, chord)` returns the notes of a chord that aren't in a scale, spelled as in the chord: `Scale.outside("C major", "Bb7")` is `["Bb", "Ab"]`, and `[]` when the chord fits. The scale and the chord can also be note lists.

- 3456e6c: Every mode of the harmonic major, neapolitan major, neapolitan minor and double harmonic major scales has a name now. 18 new scale types: dorian b5, phrygian b4, mixolydian b2, lydian augmented #2, locrian bb7 (harmonic major); lydian augmented dominant, locrian #2 b4, altered bb3 (neapolitan major); lydian #6, mixolydian augmented, aeolian #4, locrian dominant, ionian #2, ultralocrian bb3 (neapolitan minor); lydian #2 #6, ultraphrygian, ionian augmented #2, locrian bb3 bb7 (double harmonic major). So `Scale.modeNames("C harmonic major")` names all seven modes.

  Scale types (and scales) have `family` and `degree`: the parent scale they're a mode of and the degree they start on, or `""` and `0`. The families are major, melodic minor, harmonic minor, harmonic major, neapolitan major, neapolitan minor, double harmonic major and major pentatonic: `ScaleType.get("dorian b5")` is degree 2 of "harmonic major".

  "balinese" is now named "neapolitan minor", its usual name and its family's name; "balinese" stays as an alias, so `Scale.get("C balinese")` still works, but its `name` and `type` are "C neapolitan minor" and "neapolitan minor", and `Scale.names()`, `Scale.detect` and `Scale.modeNames` give the new name.

  New aliases: "lydian b3" (lydian diminished), "lydian augmented #6" (leading whole tone), "byzantine" and "gypsy major" (double harmonic major), "freygish" and "spanish gypsy" (phrygian dominant). The other names and aliases are unchanged. More scales also means more results from functions that search the dictionary: `Chord.chordScales("C7b9")` now includes mixolydian b2 and phrygian b4.

### Patch Changes

- 94b2e44: Diminished ninth and eleventh chords: `Chord.get("Co9")` (or `Cdim9`, `C°9`) is the diminished seventh with a 9th, `["C", "Eb", "Gb", "Bbb", "D"]`, and `Co11` adds the 11th too. More tokens can follow (`Co9b13`). `Cdim13` stays empty: its 13th would be the same note as the diminished seventh.

  Chord symbols can have spaces between their qualifiers: `Chord.get("Cm7 b9")` is `Cm7b9`, and `Cmin maj7`, `Cmaj add 9` and `C7(#5) b9` work too. The spaces are removed only when the symbol with them isn't a chord, so names like `"C major seventh"` are unchanged, and the symbol is written without them.

  `Chord.detect` finds chords played without their fifth. When the notes over a root have no name of their own but a chord with a third, a perfect fifth and a seventh has them plus the fifth, it's named with `no5`: `Chord.detect(["C", "E", "B"])` is `["Cmaj7no5"]` (it was `[]`), and C Eb Bb D is `Cm9no5`. These names go after the inversions with every note and before unusual readings, and parse back with `Chord.get`. Listed types without fifth keep their name (`C7no5`, `C9no5`). The new `missingFifth: false` option leaves them out; `assumePerfectFifth` works as before. `Scale.chords` only names listed chord types, as before.

- Updated dependencies [a13e397]
- Updated dependencies [3456e6c]
- Updated dependencies [94b2e44]
  - @tonaljs/chord-type@5.4.0
  - @tonaljs/chord@6.4.0
  - @tonaljs/scale-type@4.10.0
  - @tonaljs/chord-detect@4.11.0

## 4.14.2

### Patch Changes

- Updated dependencies [1cf932e]
  - @tonaljs/pcset@4.10.6
  - @tonaljs/note@4.12.7
  - @tonaljs/chord-detect@4.10.2
  - @tonaljs/chord-type@5.3.2
  - @tonaljs/scale-type@4.9.7

## 4.14.1

### Patch Changes

- Updated dependencies [a328946]
  - @tonaljs/chord-type@5.3.1
  - @tonaljs/chord-detect@4.10.1
  - @tonaljs/note@4.12.6

## 4.14.0

### Minor Changes

- f064526: `Scale.chords(scale, { size, step })`: the chord built on each degree of any scale, by stacking scale notes. Each chord has its `degree`, its `notes` and its `symbol`.

  `Scale.chords("C major", { size: 4 })[6]` is `{ degree: 7, notes: ["B", "D", "F", "A"], symbol: "Bm7b5" }`, and `Scale.chords("C melodic minor", { size: 4 })` gives `CmMaj7 Dm7 Ebmaj7#5 F7 G7 Am7b5 Bm7b5`. `size` is the number of notes (3, triads, by default) and `step` the scale steps between them (2, thirds, by default; 3 for fourths, 1 for seconds). With an octave in the tonic, the notes have octaves: `Scale.chords("C4 major")[4].notes` is `["G4", "B4", "D5"]`.

  The symbol is the chord type that spells the notes, or one with the same notes over the same root, or `""` when no chord type has them. A major triad is written `"C"`, as in `Key`. The melodic minor tonic is `CmMaj7`, while `Key.minorKey("C").melodic.chords` keeps `Cm6`.

  `@tonaljs/scale` now depends on `@tonaljs/chord-detect`.

- 6a92fc2: Move within a scale: `Scale.transposeBySteps`, `Scale.nearest`, and altered degrees in `Scale.degrees` and `Scale.steps`.

  `Scale.transposeBySteps("C major", "E4", 2)` is `"G4"` and `Scale.transposeBySteps("C major", "E4", -3)` is `"B3"`. Pitch classes work too (`"E"` gives `"G"`). Notes are compared by pitch, so enharmonic spellings work, and the result is spelled as in the scale. A note outside the scale gives `""`.

  `Scale.nearest("C major", "F#4")` is `"G4"`: the scale note closest to a note, by pitch. A note halfway between two scale notes goes up, so `Gb4` gives `G4` too.

  `Scale.degrees` and `Scale.steps` accept a string with accidentals after the number: `Scale.degrees("C major")("7b")` is `"Bb"`, `Scale.degrees("A major")("7b")` is `"G"` (spelled by interval), and `Scale.steps("C4 major")("-1b")` is `"Bb3"`. The number counts scale notes, so `"7b"` is the 7th scale note lowered. A string with the accidentals in front, like `"b7"`, is an interval name (as in `Chord.noteOf`) and gives `""`.

### Patch Changes

- f035b9b: A scale whose tonic has a double sharp written as `x` works now: `Scale.get("Cx major")` used to be the empty scale, because `Scale.tokenize("Cx major")` gave `["C##", "ajor"]`; now it gives `["C##", "major"]`, the same as `"C## major"`.
- 6c44917: `Note.sortedUniqNames` (and so `Scale.scaleNotes`) removes every duplicate, even when an enharmonic note sorts between two copies: `Note.sortedUniqNames(["C4", "B#3", "C4"])` is now `["C4", "B#3"]` instead of `["C4", "B#3", "C4"]`.
- Updated dependencies [1f86506]
- Updated dependencies [09043d6]
- Updated dependencies [d880522]
- Updated dependencies [66f551a]
- Updated dependencies [223f729]
- Updated dependencies [99ee8a1]
- Updated dependencies [bb8889d]
- Updated dependencies [6c44917]
  - @tonaljs/chord-type@5.3.0
  - @tonaljs/chord-detect@4.10.0
  - @tonaljs/pitch-note@6.1.3
  - @tonaljs/pcset@4.10.5
  - @tonaljs/collection@4.9.2
  - @tonaljs/note@4.12.5
  - @tonaljs/pitch-distance@5.1.1
  - @tonaljs/scale-type@4.9.6

## 4.13.7

### Patch Changes

- Updated dependencies [61dedc5]
- Updated dependencies [875f1b7]
- Updated dependencies [f3b53a4]
  - @tonaljs/pitch-distance@5.1.0
  - @tonaljs/note@4.12.4
  - @tonaljs/pcset@4.10.4
  - @tonaljs/chord-type@5.2.2
  - @tonaljs/scale-type@4.9.5

## 4.13.6

### Patch Changes

- 4694a12: - Build `dist/index.js` and `dist/index.d.ts` again, so the `main` and `types` entries of every package resolve. Since the tsdown migration the build wrote `index.cjs` and `index.d.cts` instead, and `require("tonal")` or `import "tonal"` in Node failed with "Cannot find module".
- Updated dependencies [4694a12]
  - @tonaljs/chord-type@5.2.1
  - @tonaljs/collection@4.9.1
  - @tonaljs/note@4.12.3
  - @tonaljs/pcset@4.10.3
  - @tonaljs/pitch-distance@5.0.7
  - @tonaljs/pitch-note@6.1.2
  - @tonaljs/scale-type@4.9.4

## 4.13.5

### Patch Changes

- Updated dependencies [9aeb912]
  - @tonaljs/chord-type@5.2.0
  - @tonaljs/pitch-note@6.1.1
  - @tonaljs/pcset@4.10.2
  - @tonaljs/scale-type@4.9.3
  - @tonaljs/note@4.12.2
  - @tonaljs/pitch-distance@5.0.6

## 4.13.4

### Patch Changes

- - Fix neapolitan spelling (#480)
  - Fix scale uppercase problem (#482)
- Updated dependencies
  - @tonaljs/scale-type@4.9.2

## 4.13.3

### Patch Changes

- @tonaljs/note@4.12.1

## 4.13.2

### Patch Changes

- 72de4e4: Fix a bug where `Scale.tokenize` didn't lowercase scale type when tonic is not preset

## 4.13.1

### Patch Changes

- Updated dependencies [b791283]
  - @tonaljs/pitch-note@6.1.0
  - @tonaljs/note@4.12.0
  - @tonaljs/pcset@4.10.1
  - @tonaljs/pitch-distance@5.0.5
  - @tonaljs/chord-type@5.1.1
  - @tonaljs/scale-type@4.9.1

## 4.13.0

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
- Updated dependencies [3cd5f16]
- Updated dependencies [4e05792]
- Updated dependencies [56d89f7]
  - @tonaljs/chord-type@5.1.0
  - @tonaljs/scale-type@4.9.0
  - @tonaljs/pcset@4.10.0
  - @tonaljs/note@4.11.0
  - @tonaljs/pitch-distance@5.0.4
  - @tonaljs/collection@4.9.0

## 4.12.6

### Patch Changes

- 9d8c41d: Scale.get ignores case.

  Now both calls returns the same scale:

  ```js
  Scale.get("C Major");
  Scale.get("c major");
  ```

## 4.12.5

### Patch Changes

- Updated dependencies [48fecc4]
- Updated dependencies [48fecc4]
  - @tonaljs/core@5.0.0
  - @tonaljs/chord-type@5.0.5
  - @tonaljs/note@4.10.3
  - @tonaljs/pcset@4.9.2
  - @tonaljs/scale-type@4.8.5

## 4.12.4

### Patch Changes

- Dependencies between packages are now fixed
- Updated dependencies
  - @tonaljs/chord-type@5.0.4
  - @tonaljs/scale-type@4.8.4
  - @tonaljs/pcset@4.9.1
  - @tonaljs/core@4.10.4
  - @tonaljs/note@4.10.2

## 4.12.3

### Patch Changes

- Named type was renamed to NamedPitch. Add old export for backwards compatibility
- Updated dependencies
  - @tonaljs/chord-type@5.0.3
  - @tonaljs/collection@4.8.1
  - @tonaljs/core@4.10.3
  - @tonaljs/note@4.10.1
  - @tonaljs/pcset@4.8.3
  - @tonaljs/scale-type@4.8.3

## 4.12.2

### Patch Changes

- Updated dependencies [b07a54c0]
  - @tonaljs/chord-type@5.0.0

## 4.12.0

### Minor Changes

- 6fcd52db: Add Scale.steps and Chord.steps

### Patch Changes

- Updated dependencies [6fcd52db]
  - @tonaljs/core@4.10.0

## 4.11.0

### Minor Changes

- Add Scale.detect function

```js
Scale.detect(["C", "D", "E", "F", "G", "A", "B"]);
// => ["C major", "C bebop", "C bebop major",
//     "C ichikosucho",  "C chromatic"];
```

### Patch Changes

- Updated dependencies
  - @tonaljs/scale-type@4.8.1
  - @tonaljs/pcset@4.8.1

## 4.10.0

### Minor Changes

- Internal: Refactor Scale.degrees

### Patch Changes

- Updated dependencies
  - @tonaljs/core@4.9.0
  - @tonaljs/note@4.10.0

## 4.9.0

### Minor Changes

- Scale.degrees new function

  Example: `[1, 2, 3].map(Scale.degrees("C major")) => ["C", "D", "E"]`

### Patch Changes

- Updated dependencies
  - @tonaljs/note@4.9.0

## 4.8.0

### Minor Changes

- - fix time signature parsing
  - add support for irrational time signatures
  - add option `assumePerfectFifth` to `Chord.detect` function

### Patch Changes

- Updated dependencies
  - @tonaljs/chord-type@4.8.0
  - @tonaljs/collection@4.8.0
  - @tonaljs/core@4.8.0
  - @tonaljs/note@4.8.0
  - @tonaljs/pcset@4.8.0
  - @tonaljs/scale-type@4.8.0

## 4.7.2

### Patch Changes

- Unify package versions
- Updated dependencies
  - @tonaljs/core@4.7.2
  - @tonaljs/chord-type@4.7.2
  - @tonaljs/collection@4.7.2
  - @tonaljs/note@4.7.2
  - @tonaljs/pcset@4.7.2
  - @tonaljs/scale-type@4.7.2

## 4.7.1

### Patch Changes

- fix npm publish problem
- Updated dependencies
  - @tonaljs/chord-type@4.7.1
  - @tonaljs/collection@4.7.1
  - @tonaljs/core@4.6.12
  - @tonaljs/note@4.7.1
  - @tonaljs/pcset@4.7.1
  - @tonaljs/scale-type@4.7.1

## 4.7.0

### Minor Changes

- b120fc42: Publish tonal in `tonal` package. So use `npm install tonal` instead of `npm install @tonaljs/tonal`

### Patch Changes

- fix memory leak
- Updated dependencies
- Updated dependencies [b120fc42]
  - @tonaljs/chord-type@4.7.0
  - @tonaljs/collection@4.7.0
  - @tonaljs/core@4.6.11
  - @tonaljs/note@4.7.0
  - @tonaljs/pcset@4.7.0
  - @tonaljs/scale-type@4.7.0

## 4.6.10

### Patch Changes

- Bug fixing
- Updated dependencies
  - @tonaljs/chord-type@4.6.10
  - @tonaljs/collection@4.6.10
  - @tonaljs/core@4.6.10
  - @tonaljs/note@4.6.10
  - @tonaljs/pcset@4.6.10
  - @tonaljs/scale-type@4.6.10
