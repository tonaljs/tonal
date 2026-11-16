# @tonaljs/scale ![tonal](https://img.shields.io/badge/@tonaljs-scale-yellow.svg?style=flat-square) [![npm version](https://img.shields.io/npm/v/@tonaljs/scale.svg?style=flat-square)](https://www.npmjs.com/package/@tonaljs/scale)

`@tonaljs/scale` is a collection of functions to create and manipulate musical scales

```js
import { Scale } from "tonal";

Scale.get("c5 pentatonic").notes; // => ["C5", "D5", "E5", "G5", "A5"]
```

## Usage

ES6:

```js
import { Scale } from "tonal";
```

nodejs:

```js
const { Scale } = require("tonal");
```

Single module:

```js
import Scale from "@tonaljs/scale";
```

## Scale properties

### `Scale.get`

`get(name: string) => Scale`

Get a scale from a scale name. `Scale.get` accepts tonics in the scale name and returns a [scale type](https://tonaljs.github.io/tonal/docs/dictionaries/scale-types) with two more properties: `tonic` and `notes`:

```js
Scale.get("c5 pentatonic");
// =>
// {
//   empty: false,
//   name: "C5 major pentatonic",
//   type: "major pentatonic",
//   tonic: "C5",
//   notes: ["C5", "D5", "E5", "G5", "A5"],
//   intervals: ["1P", "2M", "3M", "5P", "6M"],
//   aliases: ["pentatonic"],
//   setNum: 2708,
//   chroma: "101010010100",
//   normalized: "100101001010"
// }
```

## Scale notes

### `Scale.degrees`

`degrees(scaleName: string) => (degree: number) => string`

`Scale.degrees` returns a function to get a note name from a scale degree:

```js
const c4major = Scale.degrees("C4 major");
c4major(1); // => "C4"
c4major(2); // => "D4"
c4major(8); // => "C5"
c4major(-1); // => "B3"
c4major(-3); // => "G3"
c4major(-7); // => "C3"
```

Bear in mind that degree numbers starts with 1 and 0 returns an empty string:

```js
c4major(0); // => ""
```

Because it returns a function, it's handy to be used with `map` (and similar functions):

```js
[1, 2, 3].map(Scale.degrees("C major")); // => ["C", "D", "E"]
[1, 2, 3].map(Scale.degrees("C4 major")); // => ["C4", "D4", "E4"]
[-1, -2, -3].map(Scale.degrees("C major")); // => ["B", "A", "G"]
```

Notice that it uses octaves if the scale tonic has an octave or pitch classes (_octaveless_ notes) otherwise.

See [`Chord.degrees`](https://tonaljs.github.io/tonal/docs/groups/chords#chorddegrees)

See https://en.wikipedia.org/wiki/Degree_(music)

### `Scale.steps`

`steps(scaleName: string) => (degree: number) => string`

Same as `Scale.degrees` but 0 is tonic. It plays better with ranges:

```js
import { Range, Scale } from "tonal";

Range.numeric([-3, 3]).map(Scale.steps("C4 major"));
// => ["G3", "A3", "B3", "C4", "D4", "E4", "F4"]
```

### `Scale.scaleNotes`

`scaleNotes(notes: string[]) => string[]`

Given an array of notes, return an array of sorted note names starting from the first note name of the input array.

```js
// Always start with the first note of the input array
Scale.scaleNotes(["D4", "c#5", "A5", "F#6"]); // => ["D", "F#", "A", "C#"]
// Remove duplicates
Scale.scaleNotes(["C4", "c3", "C5", "C4", "c4"]); // => ["C"]
```

### `Scale.rangeOf`

`rangeOf(scale: string | string[]) => (from: string, to: string) => string[]`

`Scale.rangeOf` returns a function to create scale ranges:

```js
const range = Scale.rangeOf("C pentatonic");
range("C4", "C5"); // => ["C4", "D4", "E4", "G4", "A4", "C5"]
```

Please note that the scale name _must_ have tonic:

```js
const range = Scale.rangeOf("pentatonic");
range("C4", "C5"); // => []
```

This function also works with a collection of notes:

```js
const range = Scale.rangeOf(["C", "Db", "G"]);
range("C4", "C5"); // => ["C4", "Db4", "G4", "C5"]
```

## Finding scales

### `Scale.names`

`names() => string[]`

List all known scale names. Same as `ScaleType.names()`

See [scale-type](https://tonaljs.github.io/tonal/docs/dictionaries/scale-types)

### `Scale.detect`

`detect(notes: string[], options: { tonic?: string, match?: "fit" | "exact" }) => string[]`

Find all scales that first a collection of notes with a given tonic:

```js
Scale.detect(["C", "D", "E", "F", "G", "A", "B"]);
// => ["C major", "C bebop", "C bebop major",
//     "C ichikosucho",  "C chromatic"];
```

You can pass an optional tonic (otherwise first note will be used):

```js
Scale.detect(["C", "D", "E", "F", "G", "A", "B"], { tonic: "A" });
// => [ 'A minor', 'A minor bebop', 'A chromatic' ]
```

You can ask just the exact match:

```js
Scale.detect(["D", "E", "F#", "A", "B"], { match: "exact" });
// => ["D major pentatonic"]
Scale.detect(["D", "E", "F#", "A", "B"], { match: "exact", tonic: "B" });
// => ["B minor pentatonic"]
```

## Relationships

### `Scale.scaleChords`

`scaleChords(scale: string) => string[]`

Get all chords that fits a given scale:

```js
Scale.scaleChords("pentatonic");
// => ["5", "M", "6", "sus2", "Madd9"]
```

### `Scale.extended`

`extended(scale: string) => string[]`

Get all scales names that has the same notes and at least one more:

```js
Scale.extended("major");
// => ["bebop", "bebop major", "ichikosucho", "chromatic"]
```

### `Scale.reduced`

`reduced(scale: string) => string[]`

Find all scales names that are a subset of the given one (less notes but all from the given scale)

```js
Scale.reduced("major");
// => ["major pentatonic", "ionian pentatonic", "ritusen"]
```

### `Scale.modeNames`

`modeNames(name: string) => [string, string][]`

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
