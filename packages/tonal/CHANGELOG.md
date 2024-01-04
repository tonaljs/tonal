# tonal

## 5.1.3

### Patch Changes

- Named type was renamed to NamedPitch. Add old export for backwards compatibility
- Updated dependencies
  - @tonaljs/abc-notation@4.8.1
  - @tonaljs/array@4.8.1
  - @tonaljs/chord@5.0.1
  - @tonaljs/chord-type@5.0.3
  - @tonaljs/collection@4.8.1
  - @tonaljs/core@4.10.3
  - @tonaljs/duration-value@4.8.1
  - @tonaljs/interval@4.8.1
  - @tonaljs/key@4.9.2
  - @tonaljs/midi@4.9.1
  - @tonaljs/mode@4.8.2
  - @tonaljs/note@4.10.1
  - @tonaljs/pcset@4.8.3
  - @tonaljs/progression@4.8.2
  - @tonaljs/range@4.8.2
  - @tonaljs/roman-numeral@4.8.1
  - @tonaljs/scale@4.12.3
  - @tonaljs/scale-type@4.8.3
  - @tonaljs/time-signature@4.8.1
  - @tonaljs/voice-leading@5.0.1
  - @tonaljs/voicing@5.0.1
  - @tonaljs/voicing-dictionary@5.0.1

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
