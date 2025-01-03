# @tonaljs/core

## 5.0.2

### Patch Changes

- Updated dependencies [b791283]
  - @tonaljs/pitch-interval@6.1.0
  - @tonaljs/pitch-note@6.1.0
  - @tonaljs/pitch-distance@5.0.5

## 5.0.1

### Patch Changes

- Updated dependencies [4e05792]
  - @tonaljs/pitch-distance@5.0.4

## 5.0.0

### Major Changes

- 48fecc4: Breaking change: remove `NoInterval` interface. Return `Interval` type (with `emtpy: true`) when parsing invalid intervals.
- 48fecc4: Breaking change: `NoNote` interface is removed. Always return `Note` type (with `empty: true`) when parsing invalid notes.

### Patch Changes

- Updated dependencies [48fecc4]
- Updated dependencies [48fecc4]
- Updated dependencies [48fecc4]
  - @tonaljs/pitch-interval@6.0.0
  - @tonaljs/pitch-note@6.0.0
  - @tonaljs/pitch@5.0.2
  - @tonaljs/pitch-distance@5.0.3

## 4.10.4

### Patch Changes

- Dependencies between packages are now fixed
- Updated dependencies
  - @tonaljs/pitch-distance@5.0.2
  - @tonaljs/pitch-interval@5.0.2
  - @tonaljs/pitch-note@5.0.3

## 4.10.3

### Patch Changes

- Named type was renamed to NamedPitch. Add old export for backwards compatibility
- Updated dependencies
  - @tonaljs/pitch@5.0.1
  - @tonaljs/pitch-distance@5.0.1
  - @tonaljs/pitch-interval@5.0.1
  - @tonaljs/pitch-note@5.0.1

## 4.10.2

### Patch Changes

- Move core into pitch modules
- Updated dependencies [4689b77]
  - @tonaljs/pitch-distance@5.0.0
  - @tonaljs/pitch-interval@5.0.0
  - @tonaljs/pitch-note@5.0.0

## 4.10.1

### Patch Changes

- Restructure code to use new `@tonaljs/pitch`. No changes to functionality
- Updated dependencies
  - @tonaljs/pitch@5.0.0

## 4.10.0

### Minor Changes

- 6fcd52db: Add Scale.steps and Chord.steps

## 4.9.0

### Minor Changes

New internal function

## 4.8.0

### Minor Changes

- - fix time signature parsing
  - add support for irrational time signatures
  - add option `assumePerfectFifth` to `Chord.detect` function

## 4.7.2

### Patch Changes

- Unify package versions

## 4.6.12

### Patch Changes

- fix npm publish problem

## 4.6.11

### Patch Changes

- fix memory leak

## 4.6.10

### Patch Changes

- Bug fixing
