# @tonaljs/mode ![tonal](https://img.shields.io/badge/@tonaljs-mode-yellow.svg?style=flat-square) [![npm version](https://img.shields.io/npm/v/@tonaljs/mode.svg?style=flat-square)](https://www.npmjs.com/package/@tonaljs/mode)

`@tonaljs/mode` greek modes dictionary

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

#### `get(name: string) => object`

Given a mode name, returns a Mode object with the following fields:

- name: the mode name
- aliases: alternative mode names
- modeNum: the mode number (0...7)
- mode: the mode number
- alt: the alterations
- triad: the triad chord type
- seventh: the seventh chord type

Example:

```js
Mode.get("major");
// {
//   name: "ionian",
//   aliases: ["major"]
//   intervals: ["1P", "2M", "3M", "4P", "5P", "6M", "7M"]
//   modeNum: 0,
//   mode: 2773,
//   alt: 0,
//   triad: "",
//   seventh: "Maj7",
// }
```

#### `names() => string[]`

Get a list of all mode names.

```js
Mode.names();
// => ["ionian", "dorian", "phrygian", "lydian", "mixolydian", "aeolian", "locrian"];
```

#### `all() => object[]`

Return a list of known modes

```js
Mode.all();
```

### `notes(modeName: string, tonic: string) => string[]`

Find notes of a mode with tonic:

```js
Mode.notes("ionian", "C");
// => ["C", "D", "E", "F", "G", "A", "B"];
Mode.notes("major", "C");
// => ["C", "D", "E", "F", "G", "A", "B"];
Mode.notes("minor", "C");
// => ["C", "D", "Eb", "F", "G", "Ab", "Bb"];
```

### `triads(modeName: string, tonic: string) => string[]`

Return the triads of a mode with tonic:

```js
Mode.triads("major", "C");
// => ["C", "Dm", "Em", "F", "G", "Am", "Bdim"];
```

### `seventhChords(modeName: string, tonic: string) => string[]`

Return the seventh chords of a mode with tonic:

```js
Mode.seventhChords("major", "C");
// => ["CMaj7", "Dm7", "Em7", "FMaj7", "G7", "Am7", "B7b5"];
```

#### `relativeTonic(destination: string, source: string, tonic: string)`

Find a relative tonic. For example, the "minor" relative tonic of "C major" is "A":

```js
Mode.relativeTonic("minor", "major", "C"); // => "A"
```

## How to?

#### Get notes from a mode?

For example, "A major" mode:

```js
import { Mode, Note } from "tonal";

Mode.get("major").intervals.map(Note.transposeFrom("A"));
["A", "B", "C#", "D", "E", "F#", "G#"];
```

## Want more?

Take a look to [@tonal/key](/packages/key)
