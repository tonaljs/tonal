# @tonaljs/chord-type

## 5.0.3

### Patch Changes

- Named type was renamed to NamedPitch. Add old export for backwards compatibility
- Updated dependencies
  - @tonaljs/core@4.10.3
  - @tonaljs/pcset@4.8.3

## 5.0.2

- Add missing -maj7 alias

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

## 4.8.1

### Patch Changes

- 96df1a19: Add 6add9 to chord types aliases. Rename to "sixth added ninth"

## 4.8.0

### Minor Changes

- - fix time signature parsing
  - add support for irrational time signatures
  - add option `assumePerfectFifth` to `Chord.detect` function

### Patch Changes

- Updated dependencies
  - @tonaljs/core@4.8.0
  - @tonaljs/pcset@4.8.0

## 4.7.2

### Patch Changes

- Unify package versions
- Updated dependencies
  - @tonaljs/core@4.7.2
  - @tonaljs/pcset@4.7.2

## 4.7.1

### Patch Changes

- fix npm publish problem
- Updated dependencies
  - @tonaljs/core@4.6.12
  - @tonaljs/pcset@4.7.1

## 4.7.0

### Minor Changes

- b120fc42: Publish tonal in `tonal` package. So use `npm install tonal` instead of `npm install @tonaljs/tonal`

### Patch Changes

- fix memory leak
- Updated dependencies
- Updated dependencies [b120fc42]
  - @tonaljs/core@4.6.11
  - @tonaljs/pcset@4.7.0

## 4.6.10

### Patch Changes

- Bug fixing
- Updated dependencies
  - @tonaljs/core@4.6.10
  - @tonaljs/pcset@4.6.10
