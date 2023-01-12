# tonal

## 4.11.0

### Minor Changes

- Scale.degrees

  Example: `[1, 2, 3, 4].map(Chord.degrees("C4")) => ["C4", "E4", "G4", "C5"]`

  Deprecation removal: `@tonal/tonal` won't receive any updates. Use `tonal` instead.

### Patch Changes

- Updated dependencies
  - @tonaljs/chord@4.9.0
  - @tonaljs/scale@4.10.0
  - @tonaljs/core@4.9.0
  - @tonaljs/note@4.10.0

## 4.10.0

### Minor Changes

- Scale.degrees new function

  Example: `[1, 2, 3].map(Scale.degrees("C major")) => ["C", "D", "E"]`

### Patch Changes

- Updated dependencies
  - @tonaljs/scale@4.9.0
  - @tonaljs/note@4.9.0

## 4.9.0

### Minor Changes

- 10056eff: Add triads to key.

  For example: `Key.majorKey("C").triads` or `Key.minorKey("C").melodic.triads`

### Patch Changes

- Updated dependencies [10056eff]
  - @tonaljs/key@4.9.0

## 4.8.1

### Patch Changes

- 3f4e78ee: Fix browser build

## 4.8.0

### Minor Changes

- - fix time signature parsing
  - add support for irrational time signatures
  - add option `assumePerfectFifth` to `Chord.detect` function

### Patch Changes

- Updated dependencies
  - @tonaljs/abc-notation@4.8.0
  - @tonaljs/array@4.8.0
  - @tonaljs/chord@4.8.0
  - @tonaljs/chord-type@4.8.0
  - @tonaljs/collection@4.8.0
  - @tonaljs/core@4.8.0
  - @tonaljs/duration-value@4.8.0
  - @tonaljs/interval@4.8.0
  - @tonaljs/key@4.8.0
  - @tonaljs/midi@4.8.0
  - @tonaljs/mode@4.8.0
  - @tonaljs/note@4.8.0
  - @tonaljs/pcset@4.8.0
  - @tonaljs/progression@4.8.0
  - @tonaljs/range@4.8.0
  - @tonaljs/roman-numeral@4.8.0
  - @tonaljs/scale@4.8.0
  - @tonaljs/scale-type@4.8.0
  - @tonaljs/time-signature@4.8.0

## 4.7.2

### Patch Changes

- Unify package versions
- Updated dependencies
  - @tonaljs/array@4.7.2
  - @tonaljs/core@4.7.2
  - @tonaljs/abc-notation@4.7.2
  - @tonaljs/chord@4.7.2
  - @tonaljs/chord-type@4.7.2
  - @tonaljs/collection@4.7.2
  - @tonaljs/duration-value@4.7.2
  - @tonaljs/interval@4.7.2
  - @tonaljs/key@4.7.2
  - @tonaljs/midi@4.7.2
  - @tonaljs/mode@4.7.2
  - @tonaljs/note@4.7.2
  - @tonaljs/pcset@4.7.2
  - @tonaljs/progression@4.7.2
  - @tonaljs/range@4.7.2
  - @tonaljs/roman-numeral@4.7.2
  - @tonaljs/scale@4.7.2
  - @tonaljs/scale-type@4.7.2
  - @tonaljs/time-signature@4.7.2

## 4.7.1

### Patch Changes

- fix npm publish problem
- Updated dependencies
  - @tonaljs/abc-notation@4.7.1
  - @tonaljs/array@4.6.12
  - @tonaljs/chord@4.7.1
  - @tonaljs/chord-type@4.7.1
  - @tonaljs/collection@4.7.1
  - @tonaljs/core@4.6.12
  - @tonaljs/duration-value@4.7.1
  - @tonaljs/interval@4.7.1
  - @tonaljs/key@4.7.1
  - @tonaljs/midi@4.7.1
  - @tonaljs/mode@4.7.1
  - @tonaljs/note@4.7.1
  - @tonaljs/pcset@4.7.1
  - @tonaljs/progression@4.7.1
  - @tonaljs/range@4.7.1
  - @tonaljs/roman-numeral@4.7.1
  - @tonaljs/scale@4.7.1
  - @tonaljs/scale-type@4.7.1
  - @tonaljs/time-signature@4.7.1

## 4.7.0

### Minor Changes

- b120fc42: Publish tonal in `tonal` package. So use `npm install tonal` instead of `npm install @tonaljs/tonal`

### Patch Changes

- fix memory leak
- Updated dependencies
- Updated dependencies [b120fc42]
  - @tonaljs/abc-notation@4.7.0
  - @tonaljs/array@4.6.11
  - @tonaljs/chord@4.7.0
  - @tonaljs/chord-type@4.7.0
  - @tonaljs/collection@4.7.0
  - @tonaljs/core@4.6.11
  - @tonaljs/duration-value@4.7.0
  - @tonaljs/interval@4.7.0
  - @tonaljs/key@4.7.0
  - @tonaljs/midi@4.7.0
  - @tonaljs/mode@4.7.0
  - @tonaljs/note@4.7.0
  - @tonaljs/pcset@4.7.0
  - @tonaljs/progression@4.7.0
  - @tonaljs/range@4.7.0
  - @tonaljs/roman-numeral@4.7.0
  - @tonaljs/scale@4.7.0
  - @tonaljs/scale-type@4.7.0
  - @tonaljs/time-signature@4.7.0

## 4.6.10

### Patch Changes

- Bug fixing
- Updated dependencies
  - @tonaljs/abc-notation@4.6.10
  - @tonaljs/array@4.6.10
  - @tonaljs/chord@4.6.10
  - @tonaljs/chord-type@4.6.10
  - @tonaljs/collection@4.6.10
  - @tonaljs/core@4.6.10
  - @tonaljs/duration-value@4.6.10
  - @tonaljs/interval@4.6.10
  - @tonaljs/key@4.6.10
  - @tonaljs/midi@4.6.10
  - @tonaljs/mode@4.6.10
  - @tonaljs/note@4.6.10
  - @tonaljs/pcset@4.6.10
  - @tonaljs/progression@4.6.10
  - @tonaljs/range@4.6.10
  - @tonaljs/roman-numeral@4.6.10
  - @tonaljs/scale@4.6.10
  - @tonaljs/scale-type@4.6.10
  - @tonaljs/time-signature@4.6.10
