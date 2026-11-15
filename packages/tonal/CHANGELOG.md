# tonal

## 6.6.0

### Minor Changes

- 875f1b7: **Behavior change:** `distance` between pitch classes (when either note has no octave) now always returns a simple interval, ascending by letter, even when it sounds lower. Some results that led to the right note before are now named differently: `C` to `Cb` is `1d` (was `8d`), and `C#` to `Dbb` is `2dd` (was `9dd`).

  Fix `distance` results that led to the wrong note. The written letters now decide the interval: between notes with octaves, the direction comes from the letters, and only a unison takes it from the sound. `C4` to `B##3` is `-2dd` (was `7AA`), `B#3` to `Cb4` is `2dd` (was `-7AA`), and `C10` to `B#9` is `-2d` (was `7A`). `C4` to `Cb4` is still `-1A`. Between pitch classes, `Cbb` to `A#` is `6AAA` (was `-1AAA`).

- 875f1b7: Fix `Interval.add`, `Interval.subtract` and `Interval.transposeFifths` results that led to the wrong note. The letter steps now decide the direction of the result, even when the sound goes the other way: `subtract("2d", "1A")` is `2dd` (was `-7AA`) and `subtract("2m", "1AA")` is `2dd` (was `-7AA`). A unison still takes its direction from the sound: `subtract("1P", "1A")` is `-1A`.

  **Deprecated:** the `forceDescending` parameter of `coordToInterval`, since the letter steps already give the direction.

- b757383: `Progression.fromRomanNumerals` reads a lowercase roman numeral as a minor chord: `fromRomanNumerals("C", ["ii", "ii7"])` returns `["Dm", "Dm7"]` instead of `["D", "D7"]`. Every spelling of a chord type gives the same chord (`iimaj7` and `iiMaj7` are both minor-major sevenths, `ii6/9` and `ii69` are both `Dm69`). A chord type with its own quality (`viio`, `iim7`, `viim7b5`, `ii+`, `ii7#5`) is kept as written, and so is one without a minor form (`ii7b9`) (#457)

### Patch Changes

- 61dedc5: Fix `distance` for a descending diminished second written across the octave line, e.g. `C4` to `B#3` is now `-2d` (see #514)
- 012c2f2: Fix `majorTonicFromKeySignature`: only strings made of all `b` or all `#` are read as a key signature (`"F#"` and `"b#"` now give `null`), and `""` gives `"C"` (see #517)
- f3b53a4: Fix `Note.simplify` dropping the octave of notes outside the midi range (`simplify("C10")` was `"C"`), and `Midi.midiToNoteName` returning `NaN` for negative numbers (`midiToNoteName(-1)` is now `"B-2"`)
- 80a12e3: Fix `isMidi` and `toMidi`: empty or blank strings, `null`, arrays and booleans are not midi numbers anymore (`toMidi("")` was `0`) (see #519)
- Updated dependencies [875f1b7]
- Updated dependencies [012c2f2]
- Updated dependencies [b757383]
- Updated dependencies [f3b53a4]
- Updated dependencies [80a12e3]
  - @tonaljs/interval@5.1.2
  - @tonaljs/key@4.11.5
  - @tonaljs/progression@4.10.0
  - @tonaljs/midi@4.10.5
  - @tonaljs/note@4.12.4
  - @tonaljs/range@4.9.5
  - @tonaljs/abc-notation@4.9.4
  - @tonaljs/chord@6.2.2
  - @tonaljs/core@5.0.5
  - @tonaljs/mode@4.9.5
  - @tonaljs/pcset@4.10.4
  - @tonaljs/scale@4.13.7
  - @tonaljs/roman-numeral@4.9.4
  - @tonaljs/voicing@5.1.6
  - @tonaljs/voice-leading@5.1.5
  - @tonaljs/voicing-dictionary@5.1.6
  - @tonaljs/chord-type@5.2.2
  - @tonaljs/scale-type@4.9.5

## 6.5.1

### Patch Changes

- 4694a12: - Build `dist/index.js` and `dist/index.d.ts` again, so the `main` and `types` entries of every package resolve. Since the tsdown migration the build wrote `index.cjs` and `index.d.cts` instead, and `require("tonal")` or `import "tonal"` in Node failed with "Cannot find module".
- Updated dependencies [4694a12]
  - @tonaljs/abc-notation@4.9.3
  - @tonaljs/array@4.8.6
  - @tonaljs/chord@6.2.1
  - @tonaljs/chord-type@5.2.1
  - @tonaljs/collection@4.9.1
  - @tonaljs/core@5.0.4
  - @tonaljs/duration-value@4.9.1
  - @tonaljs/interval@5.1.1
  - @tonaljs/key@4.11.4
  - @tonaljs/midi@4.10.4
  - @tonaljs/mode@4.9.4
  - @tonaljs/note@4.12.3
  - @tonaljs/pcset@4.10.3
  - @tonaljs/progression@4.9.4
  - @tonaljs/range@4.9.4
  - @tonaljs/rhythm-pattern@1.0.1
  - @tonaljs/roman-numeral@4.9.3
  - @tonaljs/scale@4.13.6
  - @tonaljs/scale-type@4.9.4
  - @tonaljs/time-signature@4.10.1
  - @tonaljs/voice-leading@5.1.4
  - @tonaljs/voicing@5.1.5
  - @tonaljs/voicing-dictionary@5.1.5

## 6.5.0

### Minor Changes

- 9aeb912: - Add `maj11` chord type (major eleventh) (#476)
  - Name `aug7` chord type as "seventh augmented fifth", so `Chord.get("Caug7").type` is no longer empty (#500)
  - `Chord.steps` and `Chord.degrees` keep the tonic octave when the chord is given as tokens: `Chord.steps(["C4", "aug"])` (#497)
  - `TimeSignature.get` accepts common time (`C`) and cut time (`C|`, `¢`) symbols, and no longer throws on invalid input (#490)
  - `Interval.get` rejects malformed intervals like `ddd5` or `5Pgarbage` (#494)
  - Faster pitch class set normalization (#499)
  - Invalid input is no longer cached, so caches can't grow without limit (#498)
  - `Object.prototype` keys like `"constructor"` no longer return built-in functions from `Interval.get`, `RomanNumeral.get`, `ChordType.get`, `ScaleType.get` and `Mode.get`

### Patch Changes

- Updated dependencies [9aeb912]
  - @tonaljs/chord-type@5.2.0
  - @tonaljs/chord@6.2.0
  - @tonaljs/time-signature@4.10.0
  - @tonaljs/pcset@4.10.2
  - @tonaljs/roman-numeral@4.9.2
  - @tonaljs/scale-type@4.9.3
  - @tonaljs/mode@4.9.3
  - @tonaljs/scale@4.13.5
  - @tonaljs/key@4.11.3
  - @tonaljs/progression@4.9.3
  - @tonaljs/voicing@5.1.4
  - @tonaljs/voicing-dictionary@5.1.4
  - @tonaljs/core@5.0.3
  - @tonaljs/note@4.12.2
  - @tonaljs/abc-notation@4.9.2
  - @tonaljs/array@4.8.5
  - @tonaljs/midi@4.10.3
  - @tonaljs/voice-leading@5.1.3
  - @tonaljs/range@4.9.3

## 6.4.3

### Patch Changes

- - Fix neapolitan spelling (#480)
  - Fix scale uppercase problem (#482)
- Updated dependencies
  - @tonaljs/scale-type@4.9.2
  - @tonaljs/scale@4.13.4
  - @tonaljs/chord@6.1.2
  - @tonaljs/mode@4.9.2
  - @tonaljs/progression@4.9.2
  - @tonaljs/voicing@5.1.3
  - @tonaljs/voicing-dictionary@5.1.3

## 6.4.2

### Patch Changes

- 3c89703: Fix octave displacement of Midi.pcsetNearest

- Updated dependencies [3c89703]
  - @tonaljs/midi@4.10.2
  - @tonaljs/note@4.12.1
  - @tonaljs/range@4.9.2
  - @tonaljs/key@4.11.2
  - @tonaljs/scale@4.13.3
  - @tonaljs/voice-leading@5.1.2
  - @tonaljs/voicing@5.1.2
  - @tonaljs/voicing-dictionary@5.1.2

## 6.4.x

- 72de4e4: Fix a bug where `Scale.tokenize` didn't lowercase scale type when tonic is not preset

### Minor Changes

- b791283: ### Export `NoteType` and `IntervalType` types

  Typescript types `NoteType` and `IntervalType` are now exported:

  ```ts
  import { Interval, IntervalType, Note, NoteType } from "tonal";

  const note: NoteType = Note.get("C4");
  const interval: IntervalType = Interval.get("P4");
  ```

### Patch Changes

- Updated dependencies [b791283]
  - @tonaljs/note@4.12.0
  - @tonaljs/core@5.0.2
  - @tonaljs/pcset@4.10.1
  - @tonaljs/progression@4.9.1
  - @tonaljs/roman-numeral@4.9.1
  - @tonaljs/abc-notation@4.9.1
  - @tonaljs/array@4.8.4
  - @tonaljs/chord@6.1.1
  - @tonaljs/key@4.11.1
  - @tonaljs/midi@4.10.1
  - @tonaljs/mode@4.9.1
  - @tonaljs/scale@4.13.1
  - @tonaljs/voice-leading@5.1.1
  - @tonaljs/voicing@5.1.1
  - @tonaljs/voicing-dictionary@5.1.1
  - @tonaljs/chord-type@5.1.1
  - @tonaljs/scale-type@4.9.1
  - @tonaljs/range@4.9.1

## 6.3.0

- New `Key.majorKeyChords` and `Key.minorKeyChords` functions.

```js
import * as Key from "tonal";

Key.majorKeyChords("C").find((chord) => chord.name === "Em"); // => { name: "Em", roles: ["T", "ii/II"] }
```

- Renamed fields of key results. `secondaryDominantsMinorRelative` is now `secondaryDominantSupertonics` and `substituteDominantsMinorRelative` is now `substituteDominantSupertonics`. Previous names are kept for compatibility as deprecated (will be removed in next major version)

## 6.2.0

### Minor Changes

#### `default` export is deprecated for @tonaljs modules

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

#### Fix: add `Note.distance` back

The documentation said `Note.distance` was available, but was not.

Now you can do:

```js
import { Note } from "tonal";
Note.distance("c4", "e7"); // => "24M"
```

#### Fix a bug finding distance between notes when they are in adjacent octaves (see #428)

## 6.1.0

New `rhythm-pattern` package:

```ts
import { RhythmPattern } from "tonal";

RhythmPattern.euclid(8, 3); // => [1, 0, 0, 1, 0, 0, 1, 0]
RhythmPattern.binary(12, 13); // => [1, 1, 0, 0, 1, 1, 0, 1]
RhythmPattern.hex("8f"); // => [1, 0, 0, 0, 1, 1, 1, 1]
RhythmPattern.onsets(1, 2, 2, 1); // => [1, 0, 1, 0, 0, 1, 0, 0, 1, 0]
RhythmPattern.random(4); // => [1, 0, 0, 1]
RhythmPattern.probability([0.6, 0, 0.2, 0.5]); // => [0, 0, 0, 1]
RhythmPattern.rotate([1, 0, 0, 1], 2); // => [0, 1, 1, 0]
```

## 6.0.1

Scale.get ignores case.

Now both calls returns the same scale:

```js
Scale.get("C Major");
Scale.get("c major");
```

## 6.0.0

### Major Changes

#### Breaking change: chord uses pitch classes, never notes with octaves

Chords now uses only pitch classes. Before `Chord.getChord('M', 'C4')` would consider `C4` to be the tonic and now is `C``

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

#### Feature: slash chords

- Chord now accepts a slash and a bass. The bass _must_ be a pitch class
- Chord properties include `bass` that is a pitch class that could or could not belong to the chord itself.

Example:

```js
Chord.get("Cmaj7/B");
Chord.get("Eb/D");
```

#### Feature: chord `notes`

Now `notes` property of a chord are always pitch classes, there's a new function to get the actual notes:

```js
Chord.notes("Cmaj7", "C4"); // => ['C4', 'E4', 'G4', 'B4']
Chord.notes("maj7", "D5"); // => ['D5', 'F#5', 'A5', 'C#6']
```

- 48fecc4: Fix typo (breaking change): `substract` is now `subtract`
- 48fecc4: Breaking change: remove `NoInterval` interface. Return `Interval` type (with `emtpy: true`) when parsing invalid intervals.
- 48fecc4: Breaking change: `NoNote` interface is removed. Always return `Note` type (with `empty: true`) when parsing invalid notes.

### Patch Changes

Updated dependencies

## 5.2.x

Updated dependencies

## 5.2.0

### Minor Changes

- Add `Pcset.notes()` function that returns the ordered pitch class notes of the given set

### Patch Changes

- Updated dependencies [f21525b]

## 5.1.3

### Patch Changes

- Named type was renamed to NamedPitch. Add old export for backwards compatibility
- Updated dependencies

## 5.1.2

### Patch Changes

- Move core into pitch modules
- Updated dependencies
  - @tonaljs/core@4.10.2

## 5.1.1

### Patch Changes

- Restructure code to use new `@tonaljs/pitch`. No changes to functionality
- Updated dependencies
  - @tonaljs/core@4.10.1

## 5.1.0

### Minor Changes

- Publish voicing packages. Now there a three new namespaces:

  ```ts
  import { VoiceLeading, Voicing, VoicingDictionary } from "tonal";
  ```

- Updated dependencies [15017c0]
  - @tonaljs/voicing-dictionary@5.0.0
  - @tonaljs/voice-leading@5.0.0
  - @tonaljs/voicing@5.0.0

## 5.0.1

- Add -maj7 chord alias
- Updated dependencies
  - @tonaljs/chord-type@5.0.2

## 5.0.0

### Major Changes

Breaking change: `Chord.get` and `Chord.tokenize` assumes all numbers are part of the chord type, and never the tonic octave, when using with a single string parameter.

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
  - @tonaljs/chord@5.0.0
  - @tonaljs/scale@4.12.2
  - @tonaljs/progression@4.8.1

## 4.14.2

### Patch Changes

- pcset - Fix setNumToChroma: it must return a string of length in order to work correctly

## 4.14.1

### Patch Changes

- 96df1a19: Add 6add9 to chord types aliases. Rename to "sixth added ninth"
- Updated dependencies [96df1a19]
  - @tonaljs/chord-type@4.8.1
  - @tonaljs/chord@4.10.1

## 4.14.0

### Minor Changes

- 52c5c9cc: Numeric ranges support negative numbers

```js
Range.numeric([-5, 5]); // => [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5]
```

- 6fcd52db: Add Scale.steps and Chord.steps

```js
import { Range, Scale, Chod } from "tonal";

Range.numeric([-3, 3]).map(Scale.steps("C4 major"));
Range.numeric([-3, 3]).map(Chord.steps(["C4", "aug"]));
// => ["G3", "A3", "B3", "C4", "D4", "E4", "F4"]
```

## 4.13.0

### Minor Changes

- Add Scale.detect function

```js
Scale.detect(["C", "D", "E", "F", "G", "A", "B"]);
// => ["C major", "C bebop", "C bebop major",
//     "C ichikosucho",  "C chromatic"];
```

## 4.12.0

### Minor Changes

- New midi functions
  - Midi.pcset
  - Midi.pcsetSteps
  - Midi.pcsetDegrees
  - Midi.pcsetNearest

```js
Midi.pcset([62, 63, 60, 65, 70, 72]); // => [0, 2, 3, 5, 10]
Midi.pcset("100100100101"); // => [0, 3, 6, 9, 11]

const steps = Midi.pcsetSteps(Scale.get("D dorian").chroma, 60);
[-2, -1, 0, 1, 2, 3].map(steps); // => [ 57, 58, 60, 62, 63, 65 ]

const steps = Midi.pcsetDegrees(Scale.get("D dorian").chroma, 60);
[-2, -1, 1, 2, 3, 4].map(steps); // => [ 57, 58, 60, 62, 63, 65 ]

const nearest = Midi.pcsetNearest(Scale.get("D dorian").chroma);
[60, 61, 62, 63, 64, 65, 66].map(nearest); // => [60, 62, 62, 63, 65, 65, 67]
```

## 4.11.0

### Minor Changes

- Scale.degrees

```js
[1, 2, 3, 4].map(Chord.degrees("C4")) => ["C4", "E4", "G4", "C5"]`
```

## 4.10.0

### Minor Changes

- Scale.degrees new function

```js
[1, 2, 3].map(Scale.degrees("C major")) => ["C", "D", "E"]
[1, 2, 3].map(Scale.degrees("C4 major")) => ["C4", "D4", "E4"]
[-1, -2, -3].map(Scale.degrees("C major")) => ["B", "A", "G"]
```

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

## 4.6.x

- Add `Note.enharmonic`
- Bug fixing
- Updated dependencies

## 4.5.x

- Mode notes, triads, seventhChords and relativeTonic #221
- Scale.rangeOf #220
- Improve chord detection and remove invalid chord #209
- Fixes #218, #208, #207, #215

## 4.x

Adopt a fixed/locked mode with lerna. Before, each module has it's own version. Now the same version is used for all modules. [More info](https://github.com/lerna/lerna#fixedlocked-mode-default)

Deprecated modules:

- @tonaljs/modules (use tonal)
- @tonaljs/array (use @tonaljs/collection)

## Before

Before 4.5.0 there's no changelog, sorry 🙏. I'm afraid you have to dive into commits.

To make things worse, each module had it's own version, making difficult to know what was released when.

At least I'll try to keep this one up to date

Theres a [migration guide](migration-guide.md) for older versions (pre 4)
