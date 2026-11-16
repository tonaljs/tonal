# @tonaljs/scale-type ![tonal](https://img.shields.io/badge/@tonaljs-scale_type-yellow.svg?style=flat-square) [![npm version](https://img.shields.io/npm/v/@tonaljs/scale-type.svg?style=flat-square)](https://www.npmjs.com/package/@tonaljs/scale-type)

`@tonaljs/scale-type` is a dictionary of musical scales.

## Usage

ES6:

```js
import { ScaleType } from "tonal";
```

nodejs:

```js
const { ScaleType } = require("tonal");
```

## API

### `ScaleType.get`

`get(name: string) => ScaleType`

Given a scale type name, return a ScaleType object with the following properties:

- empty: true if the scale type is not found
- name: the scale type name
- aliases: a list of alternative names
- setNum: the pcset number
- chroma: the pcset chroma
- normalized: the pcset chroma rotated to start with its first note
- intervals: the interval list

Example:

```js
ScaleType.get("major"); // =>
// {
//   empty: false,
//   name: "major",
//   setNum: 2773,
//   chroma: "101011010101",
//   normalized: "101010110101",
//   intervals: ["1P", "2M", "3M", "4P", "5P", "6M", "7M"],
//   aliases: ["ionian"],
// }
```

### `ScaleType.names`

`names() => string[]`

Return a list of all scale names

### `ScaleType.all`

`all() => object[]`

Return a list of all scale types

### `ScaleType.add`

`add(intervals: string[], name: string, aliases?: string[]) => ScaleType`

Add a scale type to dictionary:

```js
ScaleType.add(["1P", "5P"], "fifth", ["5"]);
```

### `ScaleType.addAlias`

`addAlias(scaleType: ScaleType, alias: string) => void`

Add an alias to get a scale type from the dictionary. The alias is only used to find it (it's not added to its `aliases`):

```js
ScaleType.addAlias(ScaleType.get("major"), "dur");
ScaleType.get("dur").name; // => "major"
```

### `ScaleType.keys`

`keys() => string[]`

List every key that finds a scale type: names, aliases, set numbers and chromas:

```js
ScaleType.keys().includes("ionian"); // => true
```

### `ScaleType.removeAll`

`removeAll() => void`

Remove every scale type from the dictionary. Other modules that use it (`Scale`, `Chord.chordScales`...) won't find any scale afterwards.

## How to...

### How to get all pentatonics names?

```js
ScaleType.all()
  .filter((scaleType) => scaleType.intervals.length === 5)
  .map((scaleType) => scaleType.name);
```

### How to add a scale to the dictionary?

```js
ScaleType.add(["1P", "5P"], "quinta", ["quinta justa", "diapente"]);
ScaleType.get("quinta"); // => { name: "quinta", intervals: ...}
ScaleType.get("quinta justa"); // => { name: "quinta", intervals: ... }
```

## References

Some sources explaining various scale systems:

- [Modes](<https://en.wikipedia.org/wiki/Mode_(music)>)
- [Blues Scales](https://en.wikipedia.org/wiki/Blues_scale)
- [Jazz Scales](https://en.wikipedia.org/wiki/Jazz_scale)
- [Messiaen's "Modes of Limited Transposition" (wikipedia, en)](https://en.wikipedia.org/wiki/Mode_of_limited_transposition)
- [Raga](https://de.wikipedia.org/wiki/Raga)
