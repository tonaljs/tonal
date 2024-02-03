# @tonaljs/chord

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
