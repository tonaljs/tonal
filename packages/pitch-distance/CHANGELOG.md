# @tonaljs/pitch-distance

## 5.1.1

### Patch Changes

- Updated dependencies [f2cecb3]
- Updated dependencies [e6cd704]
- Updated dependencies [66f551a]
- Updated dependencies [f2cecb3]
  - @tonaljs/pitch-interval@6.3.0
  - @tonaljs/pitch-note@6.1.3

## 5.1.0

### Minor Changes

- 875f1b7: **Behavior change:** `distance` between pitch classes (when either note has no octave) now always returns a simple interval, ascending by letter, even when it sounds lower. Some results that led to the right note before are now named differently: `C` to `Cb` is `1d` (was `8d`), and `C#` to `Dbb` is `2dd` (was `9dd`).

  Fix `distance` results that led to the wrong note. The written letters now decide the interval: between notes with octaves, the direction comes from the letters, and only a unison takes it from the sound. `C4` to `B##3` is `-2dd` (was `7AA`), `B#3` to `Cb4` is `2dd` (was `-7AA`), and `C10` to `B#9` is `-2d` (was `7A`). `C4` to `Cb4` is still `-1A`. Between pitch classes, `Cbb` to `A#` is `6AAA` (was `-1AAA`).

### Patch Changes

- 61dedc5: Fix `distance` for a descending diminished second written across the octave line, e.g. `C4` to `B#3` is now `-2d` (see #514)
- Updated dependencies [875f1b7]
  - @tonaljs/pitch-interval@6.2.0

## 5.0.7

### Patch Changes

- 4694a12: - Build `dist/index.js` and `dist/index.d.ts` again, so the `main` and `types` entries of every package resolve. Since the tsdown migration the build wrote `index.cjs` and `index.d.cts` instead, and `require("tonal")` or `import "tonal"` in Node failed with "Cannot find module".
- Updated dependencies [4694a12]
  - @tonaljs/pitch@5.0.3
  - @tonaljs/pitch-interval@6.1.2
  - @tonaljs/pitch-note@6.1.2

## 5.0.6

### Patch Changes

- Updated dependencies [9aeb912]
  - @tonaljs/pitch-interval@6.1.1
  - @tonaljs/pitch-note@6.1.1

## 5.0.5

### Patch Changes

- Updated dependencies [b791283]
  - @tonaljs/pitch-interval@6.1.0
  - @tonaljs/pitch-note@6.1.0

## 5.0.4

### Patch Changes

- 4e05792: Fix a bug finding distance between notes when they are in adjacent octaves (see #428)

## 5.0.3

### Patch Changes

- Updated dependencies [48fecc4]
- Updated dependencies [48fecc4]
- Updated dependencies [48fecc4]
  - @tonaljs/pitch-interval@6.0.0
  - @tonaljs/pitch-note@6.0.0
  - @tonaljs/pitch@5.0.2

## 5.0.2

### Patch Changes

- Dependencies between packages are now fixed
- Updated dependencies
  - @tonaljs/pitch-interval@5.0.2
  - @tonaljs/pitch-note@5.0.3

## 5.0.1

### Patch Changes

- Named type was renamed to NamedPitch. Add old export for backwards compatibility
- Updated dependencies
  - @tonaljs/pitch@5.0.1
  - @tonaljs/pitch-interval@5.0.1
  - @tonaljs/pitch-note@5.0.1

## 5.0.0

### Major Changes

- 4689b77: First public release
