# @tonaljs/scale

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
