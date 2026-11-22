# @tonaljs/progression

## 4.11.3

### Patch Changes

- Updated dependencies [a13e397]
- Updated dependencies [94b2e44]
  - @tonaljs/chord-type@5.4.0
  - @tonaljs/chord@6.4.0

## 4.11.2

### Patch Changes

- Updated dependencies [aa4ab10]
  - @tonaljs/chord@6.3.2
  - @tonaljs/chord-type@5.3.2

## 4.11.1

### Patch Changes

- 9cac7a4: `Progression.fromRomanNumerals` reads composed chord types, like `Chord.get` does: `fromRomanNumerals("C", ["V7(b9)", "Imaj7(no3)"])` gave `["", ""]` (now `["G7(b9)", "Cmaj7(no3)"]`). So `toRomanNumerals("C", ["G7(b9)"])`, which gives `"V7(b9)"`, now reads back as `"G7(b9)"`.
- 5519908: `Progression.fromRomanNumerals` makes the third of a lowercase numeral minor and keeps the rest of the chord type, alterations included: `fromRomanNumerals("C", ["ii7b9", "ii13#11", "ii7(b9)"])` gave `["D7b9", "D13#11", "D7(b9)"]` (now `["Dm7b9", "Dm13#11", "Dm7(b9)"]`). A flat fifth gives a half-diminished chord: `ii7b5` was `D7b5` and is now `Dm7b5`, and `ii7b5b9` is `Dm7b5b9`. A chord type with a `#9` stays as written (`ii7#9` is `D7#9`), since its minor third would be the same note as the `#9`.
- 6c10671: Roman numerals read chord types with an `i` or a `v` in them: `RomanNumeral.get("viidim7")` and `"iimin7"` were empty, so `Progression.fromRomanNumerals("C", ["viidim7", "iimin7"])` gave `["", ""]` (now `["Bdim7", "Dmin7"]`). `Progression.toRomanNumerals("C", ["Bdim7"])` gives `"VIIdim7"`, which now reads back as `"Bdim7"`.
- Updated dependencies [a328946]
- Updated dependencies [6c10671]
  - @tonaljs/chord-type@5.3.1
  - @tonaljs/chord@6.3.1
  - @tonaljs/roman-numeral@4.10.1

## 4.11.0

### Minor Changes

- 0ad56fe: Applied (secondary) chords. `RomanNumeral.get("V7/V")` has `of: "V"`, and its `interval`, `step` and `alt` locate the chord's root from the tonic (`2M`). `Progression.fromRomanNumerals("C", ["V7/V", "V/V/V"])` gives `["D7", "A"]`. `RomanNumeral.tokenize` returns the applied degree as a fifth element.

  `Progression.fromRomanNumerals` gives an empty string when a numeral's chord type isn't a known chord type, instead of a made-up chord: `V65` was `G65`, `It6` was `Ct6` and `VIIb5` was `Bb5`. A lowercase numeral with a bass note is minor (`i/Eb` is `Cm/Eb`, it was `C/Eb`).

### Patch Changes

- Updated dependencies [1f86506]
- Updated dependencies [3d5530d]
- Updated dependencies [09043d6]
- Updated dependencies [d880522]
- Updated dependencies [f2cecb3]
- Updated dependencies [e6cd704]
- Updated dependencies [66f551a]
- Updated dependencies [0ad56fe]
- Updated dependencies [f2cecb3]
- Updated dependencies [bb8889d]
  - @tonaljs/chord-type@5.3.0
  - @tonaljs/chord@6.3.0
  - @tonaljs/pitch-interval@6.3.0
  - @tonaljs/pitch-note@6.1.3
  - @tonaljs/roman-numeral@4.10.0
  - @tonaljs/pitch-distance@5.1.1

## 4.10.0

### Minor Changes

- b757383: `Progression.fromRomanNumerals` reads a lowercase roman numeral as a minor chord: `fromRomanNumerals("C", ["ii", "ii7"])` returns `["Dm", "Dm7"]` instead of `["D", "D7"]`. Every spelling of a chord type gives the same chord (`iimaj7` and `iiMaj7` are both minor-major sevenths, `ii6/9` and `ii69` are both `Dm69`). A chord type with its own quality (`viio`, `iim7`, `viim7b5`, `ii+`, `ii7#5`) is kept as written, and so is one without a minor form (`ii7b9`) (#457)

### Patch Changes

- Updated dependencies [61dedc5]
- Updated dependencies [875f1b7]
- Updated dependencies [875f1b7]
  - @tonaljs/pitch-distance@5.1.0
  - @tonaljs/pitch-interval@6.2.0
  - @tonaljs/chord@6.2.2
  - @tonaljs/roman-numeral@4.9.4
  - @tonaljs/chord-type@5.2.2

## 4.9.4

### Patch Changes

- 4694a12: - Build `dist/index.js` and `dist/index.d.ts` again, so the `main` and `types` entries of every package resolve. Since the tsdown migration the build wrote `index.cjs` and `index.d.cts` instead, and `require("tonal")` or `import "tonal"` in Node failed with "Cannot find module".
- Updated dependencies [4694a12]
  - @tonaljs/chord@6.2.1
  - @tonaljs/pitch-distance@5.0.7
  - @tonaljs/pitch-interval@6.1.2
  - @tonaljs/pitch-note@6.1.2
  - @tonaljs/roman-numeral@4.9.3

## 4.9.3

### Patch Changes

- Updated dependencies [9aeb912]
  - @tonaljs/chord@6.2.0
  - @tonaljs/pitch-interval@6.1.1
  - @tonaljs/pitch-note@6.1.1
  - @tonaljs/roman-numeral@4.9.2
  - @tonaljs/pitch-distance@5.0.6

## 4.9.2

### Patch Changes

- @tonaljs/chord@6.1.2

## 4.9.1

### Patch Changes

- Updated dependencies [b791283]
  - @tonaljs/pitch-interval@6.1.0
  - @tonaljs/pitch-note@6.1.0
  - @tonaljs/pitch-distance@5.0.5
  - @tonaljs/roman-numeral@4.9.1
  - @tonaljs/chord@6.1.1

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
- Updated dependencies [4e05792]
- Updated dependencies [56d89f7]
  - @tonaljs/roman-numeral@4.9.0
  - @tonaljs/pitch-distance@5.0.4
  - @tonaljs/chord@6.1.0

## 4.8.4

### Patch Changes

- Updated dependencies [97f01d4]
- Updated dependencies [48fecc4]
- Updated dependencies [48fecc4]
  - @tonaljs/chord@6.0.0
  - @tonaljs/core@5.0.0
  - @tonaljs/roman-numeral@4.8.3

## 4.8.3

### Patch Changes

- Dependencies between packages are now fixed
- Updated dependencies
  - @tonaljs/roman-numeral@4.8.2
  - @tonaljs/chord@5.0.3
  - @tonaljs/core@4.10.4

## 4.8.2

### Patch Changes

- Named type was renamed to NamedPitch. Add old export for backwards compatibility
- Updated dependencies
  - @tonaljs/chord@5.0.1
  - @tonaljs/core@4.10.3
  - @tonaljs/roman-numeral@4.8.1

## 4.8.1

### Patch Changes

- Updated dependencies [b07a54c0]
  - @tonaljs/chord@5.0.0

## 4.8.0

### Minor Changes

- - fix time signature parsing
  - add support for irrational time signatures
  - add option `assumePerfectFifth` to `Chord.detect` function

### Patch Changes

- Updated dependencies
  - @tonaljs/chord@4.8.0
  - @tonaljs/core@4.8.0
  - @tonaljs/roman-numeral@4.8.0

## 4.7.2

### Patch Changes

- Unify package versions
- Updated dependencies
  - @tonaljs/core@4.7.2
  - @tonaljs/chord@4.7.2
  - @tonaljs/roman-numeral@4.7.2

## 4.7.1

### Patch Changes

- fix npm publish problem
- Updated dependencies
  - @tonaljs/chord@4.7.1
  - @tonaljs/core@4.6.12
  - @tonaljs/roman-numeral@4.7.1

## 4.7.0

### Minor Changes

- b120fc42: Publish tonal in `tonal` package. So use `npm install tonal` instead of `npm install @tonaljs/tonal`

### Patch Changes

- fix memory leak
- Updated dependencies
- Updated dependencies [b120fc42]
  - @tonaljs/chord@4.7.0
  - @tonaljs/core@4.6.11
  - @tonaljs/roman-numeral@4.7.0

## 4.6.10

### Patch Changes

- Bug fixing
- Updated dependencies
  - @tonaljs/chord@4.6.10
  - @tonaljs/core@4.6.10
  - @tonaljs/roman-numeral@4.6.10
