# @tonaljs/mode ![tonal](https://img.shields.io/badge/@tonaljs-mode-yellow.svg?style=flat-square) [![npm version](https://img.shields.io/npm/v/@tonaljs/mode.svg?style=flat-square)](https://www.npmjs.com/package/@tonaljs/mode)

`@tonaljs/mode` greek modes dictionary

```js
import { Mode } from "tonal";
Mode.names(); // => ["ionian", "dorian", "phrygian", "lydian", "mixolydian", "aeolian", "locrian"];
```

## Usage

ES6:

```js
import { Mode } from "tonal";
```

node:

```js
const { Mode } = require("tonal");
```

## API

### `Mode.get`

`get(name: string) => Mode`

Given a mode name, returns a Mode object with the following fields:

- name: the mode name
- aliases: alternative mode names
- modeNum: the mode number (0...6)
- setNum, chroma and normalized: the mode as a pitch class set
- intervals: the mode intervals
- alt: the alterations
- triad: the triad chord type
- seventh: the seventh chord type

Example:

```js
Mode.get("major"); // =>
// {
//   empty: false,
//   name: "ionian",
//   aliases: ["major"],
//   intervals: ["1P", "2M", "3M", "4P", "5P", "6M", "7M"],
//   modeNum: 0,
//   setNum: 2773,
//   chroma: "101011010101",
//   normalized: "101011010101",
//   alt: 0,
//   triad: "",
//   seventh: "Maj7",
// }
```

### `Mode.names`

`names() => string[]`

Get a list of all mode names.

```js
Mode.names();
// => ["ionian", "dorian", "phrygian", "lydian", "mixolydian", "aeolian", "locrian"];
```

### `Mode.all`

`all() => object[]`

Return a list of known modes

```js
Mode.all();
```

### `Mode.notes`

`notes(modeName: string, tonic: string) => string[]`

Find notes of a mode with tonic:

```js
Mode.notes("ionian", "C");
// => ["C", "D", "E", "F", "G", "A", "B"];
Mode.notes("major", "C");
// => ["C", "D", "E", "F", "G", "A", "B"];
Mode.notes("minor", "C");
// => ["C", "D", "Eb", "F", "G", "Ab", "Bb"];
```

### `Mode.triads`

`triads(modeName: string, tonic: string) => string[]`

Return the triads of a mode with tonic:

```js
Mode.triads("major", "C");
// => ["C", "Dm", "Em", "F", "G", "Am", "Bdim"];
```

### `Mode.seventhChords`

`seventhChords(modeName: string, tonic: string) => string[]`

Return the seventh chords of a mode with tonic:

```js
Mode.seventhChords("major", "C");
// => ["CMaj7", "Dm7", "Em7", "FMaj7", "G7", "Am7", "Bm7b5"];
```

### `Mode.distance`

`distance(destination: string, source: string) => string`

Get the interval from the tonic of the source mode to the tonic of the destination mode that has the same key signature (the same notes):

```js
Mode.distance("dorian", "ionian"); // => "2M"
Mode.distance("aeolian", "major"); // => "6M"
Mode.distance("major", "minor"); // => "-6M"
```

`Mode.relativeTonic` uses it to find the tonic of the relative mode.

### `Mode.relativeTonic`

`relativeTonic(destination: string, source: string, tonic: string)`

Find a relative tonic. For example, the "minor" relative tonic of "C major" is "A":

```js
Mode.relativeTonic("minor", "major", "C"); // => "A"
```

## How to...

### How to get notes from a mode?

For example, "A major" mode:

```js
import { Mode, Note } from "tonal";

Mode.get("major").intervals.map(Note.transposeFrom("A"));
// => ["A", "B", "C#", "D", "E", "F#", "G#"]
```

## Want more?

Take a look to [@tonaljs/key](https://tonaljs.github.io/tonal/docs/harmony/keys)
