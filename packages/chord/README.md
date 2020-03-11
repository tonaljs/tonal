# @tonaljs/chord ![tonal](https://img.shields.io/badge/@tonaljs-chord_dictionary-yellow.svg?style=flat-square) [![npm version](https://img.shields.io/npm/v/@tonaljs/chord.svg?style=flat-square)](https://www.npmjs.com/package/@tonaljs/chord)

## Usage

ES6:

```js
import { Chord } from "@tonaljs/tonal";
```

Nodejs:

```js
const { Chord } = require("@tonaljs/tonal");
```

## API

#### `Chord.get(name: string) => Scale`

Get a chord from a chord name. Unlike `chordType`, `chord` accepts tonics in the chord name and returns the a Scale data object (a ChordType with extended properties):

- tonic: the tonic of the chord, or "" if not present
- notes: an array of notes, or empty array if tonic is not present

```js
Chord.get("Cmaj7");
// =>
// {
//   name: "C major seventh",
//   tonic: "C",
//   setNum: 2193,
//   type: "major seventh",
//   aliases: ["maj7", "Δ", "ma7", "M7", "Maj7"],
//   chroma: "100010010001",
//   intervals: ["1P", "3M", "5P", "7M"],
//   notes: ["C", "E", "G", "B"],
//   quality: "Major"
// };
```

#### `Chord.detect(notes: string[]) => string[]`

Given a list of notes, get the possible chord names:

```js
Chord.detect(["D", "F#", "A", "C"]); // => ["D7"]
Chord.detect(["F#", "A", "C", "D"]); // => ["D7/F#"]
```

Alias of [chord-detect](/packages/chord-detect)

#### `Chord.transpose(chordName: string, intervalName: string) => string`

Transpose a chord name by an interval:

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
