# @tonaljs/scale [![npm version](https://img.shields.io/npm/v/@tonaljs/scale.svg?style=flat-square)](https://www.npmjs.com/package/@tonaljs/scale)

[![tonal](https://img.shields.io/badge/@tonaljs-scale-yellow.svg?style=flat-square)](https://www.npmjs.com/browse/keyword/tonal)

`@tonaljs/scale` is a collection of functions to create and manipulate musical scales

## Usage

ES6:

```js
import { Scale } from "@tonaljs/tonal";
```

nodejs:

```js
const { Scale } = require("@tonaljs/tonal");
```

Single module:

```js
import Scale from "@tonaljs/scale";
```

## API

### `Scale.names()`

List all known scale names. Same as `ScaleType.names()`

See [scale-type](/package/scale-type)

### `Scale.get(name: string) => Scale`

Get a scale from a scale name. `Scale.get` accepts tonics in the scale name and returns a [scale type](/packages/scale-type) with two more properties: `tonic` and `notes`:

```js
Scale.get("c5 pentatonic");
// =>
// {
//   empty: false,
//   name: "C5 pentatonic",
//   type: "major pentatonic",
//   tonic: "C5",
//   notes: ["C5", "D5", "E5", "G5", "A5"],
//   intervals: ["1P", "2M", "3M", "5P", "6M"],
//   aliases: ["pentatonic"],
//   setNum: 2708,
//   chroma: "101010010100",
//   normalized: "101010010100"
// }
```

### `Scale.scaleChords(scale: string) => string[]`

Get all chords that fits a given scale:

```js
Scale.scaleChords("pentatonic");
// => ["5", "64", "M", "M6", "Madd9", "Msus2"]
```

### `Scale.extended(scale: string) => string[]`

Get all scales names that has the same notes and at least one more:

```js
Scale.extended("major");
// => ["bebop", "bebop dominant", "bebop major", "chromatic", "ichikosucho"]
```

### `Scale.reduced(scale: string) => string[]`

Find all scales names that are a subset of the given one (less notes but all from the given scale)

```js
Scale.reduced("major");
// => ["ionian pentatonic", "major pentatonic", "ritusen"]
```

### `Scale.scaleNotes(notes: string[]) => string[]`

Given an array of notes, return the scale: a pitch class set starting from the first note

```js
Scale.scaleNotes(["C4", "c3", "C5", "C4", "c4"]); // => ["C"]
Scale.scaleNotes(["D4", "c#5", "A5", "F#6"]); // => ["D", "F#", "A", "C#"]
```

### `Scale.modes(name: string) => string[][]`

Find mode names (if any) of a given scale:

```js
Scale.modeNames("C pentatonic"); // => [
//    ["C", "major pentatonic"],
//    ["D", "egyptian"],
//    ["E", "malkos raga"],
//    ["G", "ritusen"],
//    ["A", "minor pentatonic"]
//  ]
```
