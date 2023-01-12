# tonal

## 4.12.0

### Minor Changes

- New midi functions

  - Midi.pcset
  - Midi.pcsetSteps
  - Midi.pcsetDegrees
  - Midi.pcsetNearest

### Patch Changes

- Updated dependencies

## 4.11.0

### Minor Changes

- Scale.degrees

  Example: `[1, 2, 3, 4].map(Chord.degrees("C4")) => ["C4", "E4", "G4", "C5"]`

  Deprecation removal: `@tonal/tonal` won't receive any updates. Use `tonal` instead.

### Patch Changes

- Updated dependencies

## 4.10.0

### Minor Changes

- Scale.degrees new function

  Example: `[1, 2, 3].map(Scale.degrees("C major")) => ["C", "D", "E"]`

### Patch Changes

- Updated dependencies

## 4.9.0

### Minor Changes

- 10056eff: Add triads to key.

  For example: `Key.majorKey("C").triads` or `Key.minorKey("C").melodic.triads`

### Patch Changes

- Updated dependencies [10056eff]

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

## 4.7.2

### Patch Changes

- Unify package versions
- Updated dependencies

## 4.7.1

### Patch Changes

- fix npm publish problem
- Updated dependencies

## 4.7.0

### Minor Changes

- b120fc42: Publish tonal in `tonal` package. So use `npm install tonal` instead of `npm install @tonaljs/tonal`

### Patch Changes

- fix memory leak
- Updated dependencies
- Updated dependencies [b120fc42]

## 4.6.10

### Patch Changes

- Bug fixing
- Updated dependencies
