# @tonaljs/chord ![tonal](https://img.shields.io/badge/@tonaljs-chord-yellow.svg?style=flat-square) [![npm version](https://img.shields.io/npm/v/@tonaljs/chord.svg?style=flat-square)](https://www.npmjs.com/package/@tonaljs/chord)

## Usage

ES6:

```js
import { Chord } from "tonal";
```

Nodejs:

```js
const { Chord } = require("tonal");
```

## API

#### `Chord.getChord(type: string, tonic?: string, root?: string) => Chord`

#### `Chord.get(name: string | [string, string] | [string, string, string]) => Chord`

Given a chord symbol or tokens, it returns the chord properties.

Chord properties is the the same object that `ChordType.get` but with additional fields:

- symbol: the chord symbol (a combination of the tonic, chord type shortname and root, if present). For example: `Cmaj7`, `Db7b5/F`. The symbol always uses pitch classes (note names without octaves) for both the tonic and root.
- tonic: the tonic of the chord (or an empty string if not present)
- bass: the bass of the chord (or an empty string if not present). The bass can be any pitch class.
- root: the root of the chord (or an empty string if not present). The root is present if the bass not belongs to the chord. It could be chords with bass without root field, but not the opposite.
- rootDegree: the degree of the root. NaN if root not present. A number greater than 0 if present, where 1 indicates the tonic, 2 the second note (normally the 3th), 2 the third note (normally the 5th), etc.
- notes: an array of notes, or empty array if tonic is not present. The notes will be always pitch classes.

Example:

```js
Chord.get("Cmaj7/B"); // =>
// {
//   empty: false,
//   name: 'C major seventh over B',
//   setNum: 2193,
//   chroma: '100010010001',
//   normalized: '100010010001',
//   intervals: [ '7M', '8P', '10M', '12P' ],
//   quality: 'Major',
//   aliases: [ 'maj7', 'Δ', 'ma7', 'M7', 'Maj7', '^7' ],
//   symbol: 'Cmaj7/B',
//   tonic: 'C',
//   type: 'major seventh',
//   root: 'B',
//   bass: 'B',
//   rootDegree: 4,
//   notes: [ 'B', 'C', 'E', 'G' ]
// }
```

`Chord.chord` is an alias that is handy if using the `@tonaljs/chord` directly:

```js
import { chord } from "@tonaljs/chord";

chord("C6add2");
```

`Chord.getChord(chordType, tonic, bass)` is very similar but with arguments for each chord part:

```js
Chord.getChord("maj7", "C", "B") === Chord.get("Cmaj7/B");
```

### `Chord.notes(chordType: string, tonic?: string) => string[]`

Print the notes of the given chord at the given tonic:

```js
Chord.notes("maj7", "C4"); // => ["C4", "E4", "G4", "B4"]
```

### `Chord.degrees(chordType: string, tonic?: string) => (degree: number) => string`

`Scale.degrees` returns a function to get a note name from a scale degree:

```js
const c4m7 = Chord.degrees("m7", "C4");
c4m7(1); // => "C4"
c4m7(2); // => "Eb4"
c4m7(3); // => "G4"
c4m7(4); // => "Bb4"
c4m7(1); // => "C5"
```

It can be used, for example, to get the notes of chord inversions:

```js
[1, 2, 3, 4].map(c4m7); // => ["C4", "Eb4", "G4", "Bb4"]
[2, 3, 4, 5].map(c4m7); // => ["Eb4", "G4", "Bb4", "C5"]
[3, 4, 5, 6].map(c4m7); // => ["G4", "Bb4", "C5", "Eb5"]
[4, 5, 6, 7].map(c4m7); // => ["Bb4", "C5", "Eb5", "G5"]
```

Bear in mind that degree numbers starts with 1 and 0 returns an empty string:

```js
c4m7(0); // => ""
```

See [`Scale.degrees`](https://github.com/tonaljs/tonal/tree/main/packages/scale#scaledegreesscalename-string--degree-number--string)

### `Chord.steps(chordName: string) => (degree: number) => string`

Same as `Chord.degrees` but 0 is the tonic. Plays better with numeric ranges:

```js
import { Range, Chord } from "tonal";

Range.numeric([-3, 3]).map(Chord.steps(["C4", "aug"]));
// => ["G#3", "E3", "C3", "C4", "E4", "G#4", "C5"]
```

#### `Chord.detect(notes: string[]) => string[]`

Given a list of notes, get the possible chord names:

```js
Chord.detect(["D", "F#", "A", "C"]); // => ["D7"]
Chord.detect(["F#", "A", "C", "D"]); // => ["D7/F#"]
```

Read more at [chord-detect](/packages/chord-detect)

#### `Chord.transpose(chordName: string, intervalName: string) => string`

Transpose a chord symbol by an interval:

```js
Chord.transpose("Eb7b9", "5P"); // => "Bb7b9"
```

#### `Chord.chordScales(chordName: string) => string[]`

Get all scales where the given chord fits:

```js
Chord.chordScales("C7b9");
// => ["phrygian dominant", "flamenco", "spanish heptatonic", "half-whole diminished", "chromatic"]
```

#### `Chord.extended(chord: string) => string[]`

Get all chords names that are a superset of the given one (has the same notes and at least one more)

```js
Chord.extended("Cmaj7");
// => [ 'Cmaj#4', 'Cmaj7#9#11', 'Cmaj9', 'CM7add13', 'Cmaj13', 'Cmaj9#11', 'CM13#11', 'CM7b9' ]
```

#### `Chord.reduced(chord: string) => string[]`

Find all chords names that are a subset of the given one (less notes but all from the given chord)

```js
Chord.reduced("Cmaj7"); // => ["C5", "CM"]
```
