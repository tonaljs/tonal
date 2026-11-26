# @tonaljs/pitch-interval

## 6.4.0

### Minor Changes

- ce9b347: `NoteName`, `PcName`, `NoteWithOctave` and `IntervalName` now list the common note and interval names, so editors suggest them, and still accept any string. The listed names are exported on their own as `KnownNoteName`, `KnownPcName`, `KnownNoteWithOctave` and `KnownIntervalName`; the known intervals are written number first, as tonal returns them (`3M`, `-5P`). Types only, nothing changes at runtime.

  If your code types a `Record<NoteName, X>` (or `Record<IntervalName, X>`), it now needs every known name as a key: use `Partial<Record<NoteName, X>>` or `Record<string, X>` instead.

## 6.3.0

### Minor Changes

- f2cecb3: Intervals can have any number of augmented or diminished: `Interval.get("4AAAAA").semitones` is `10`, and `Interval.add`, `Interval.subtract` and `Interval.distance` give a name for every pair (`Interval.add("4AAAA", "1A")` was `""`, now it's `"4AAAAA"`)
- f2cecb3: **Behaviour change.** `Interval.simplify` keeps the octave, however many octaves an interval spans, and `Interval.invert` gives the interval that completes the simplified interval to an octave. Before, `simplify` kept `8P` but turned `15P` into `1P`, and `invert` kept compound intervals compound and left unisons and octaves as they were. The new results follow music21's semi-simple intervals and complements:

  |                    | before  | now     |
  | ------------------ | ------- | ------- |
  | `simplify("15P")`  | `"1P"`  | `"8P"`  |
  | `simplify("-22P")` | `"-1P"` | `"-8P"` |
  | `invert("1P")`     | `"1P"`  | `"8P"`  |
  | `invert("8P")`     | `"8P"`  | `"1P"`  |
  | `invert("1A")`     | `"1d"`  | `"8d"`  |
  | `invert("9M")`     | `"14m"` | `"7m"`  |

  Other simple intervals are unchanged, and the direction is kept (`invert("-3M")` is still `"-6m"`). `Interval.get(i).simple` follows `simplify`: it's `8` for `"15P"`

### Patch Changes

- e6cd704: A unison, fourth, fifth or octave with a major or minor quality is not an interval anymore: `Interval.get("5m")` used to be a perfect fifth (`semitones: 7`) and `Note.transpose("C4", "5m")` gave `"G4"`; now they give the empty interval and `""`, like `"2P"` already did.

## 6.2.0

### Minor Changes

- 875f1b7: Fix `Interval.add`, `Interval.subtract` and `Interval.transposeFifths` results that led to the wrong note. The letter steps now decide the direction of the result, even when the sound goes the other way: `subtract("2d", "1A")` is `2dd` (was `-7AA`) and `subtract("2m", "1AA")` is `2dd` (was `-7AA`). A unison still takes its direction from the sound: `subtract("1P", "1A")` is `-1A`.

  **Deprecated:** the `forceDescending` parameter of `coordToInterval`, since the letter steps already give the direction.

## 6.1.2

### Patch Changes

- 4694a12: - Build `dist/index.js` and `dist/index.d.ts` again, so the `main` and `types` entries of every package resolve. Since the tsdown migration the build wrote `index.cjs` and `index.d.cts` instead, and `require("tonal")` or `import "tonal"` in Node failed with "Cannot find module".
- Updated dependencies [4694a12]
  - @tonaljs/pitch@5.0.3

## 6.1.1

### Patch Changes

- 9aeb912: - Add `maj11` chord type (major eleventh) (#476)
  - Name `aug7` chord type as "seventh augmented fifth", so `Chord.get("Caug7").type` is no longer empty (#500)
  - `Chord.steps` and `Chord.degrees` keep the tonic octave when the chord is given as tokens: `Chord.steps(["C4", "aug"])` (#497)
  - `TimeSignature.get` accepts common time (`C`) and cut time (`C|`, `¢`) symbols, and no longer throws on invalid input (#490)
  - `Interval.get` rejects malformed intervals like `ddd5` or `5Pgarbage` (#494)
  - Faster pitch class set normalization (#499)
  - Invalid input is no longer cached, so caches can't grow without limit (#498)
  - `Object.prototype` keys like `"constructor"` no longer return built-in functions from `Interval.get`, `RomanNumeral.get`, `ChordType.get`, `ScaleType.get` and `Mode.get`

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
