# @tonaljs/pitch-interval

## 6.1.0

### Minor Changes

- b791283: ### Export `NoteType` and `IntervalType` types

  Typescript types `NoteType` and `IntervalType` are now exported:

  ```ts
  import { Interval, IntervalType, Note, NoteType } from "tonal";

  const note: NoteType = Note.get("C4");
  const interval: IntervalType = Interval.get("P4");
  ```

## 6.0.0

### Major Changes

- 48fecc4: Breaking change: remove `NoInterval` interface. Return `Interval` type (with `emtpy: true`) when parsing invalid intervals.

### Patch Changes

- Updated dependencies [48fecc4]
  - @tonaljs/pitch@5.0.2

## 5.0.2

### Patch Changes

- Dependencies between packages are now fixed

## 5.0.1

### Patch Changes

- Named type was renamed to NamedPitch. Add old export for backwards compatibility
- Updated dependencies
  - @tonaljs/pitch@5.0.1

## 5.0.0

### Major Changes

- 4689b77: First public release
