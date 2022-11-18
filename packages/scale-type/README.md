# @tonaljs/scale-type [![npm version](https://img.shields.io/npm/v/@tonaljs/scale-type.svg?style=flat-square)](https://www.npmjs.com/package/@tonaljs/scale-type)

[![tonal](https://img.shields.io/badge/@tonaljs-scale_dictionary-yellow.svg?style=flat-square)](https://www.npmjs.com/browse/keyword/tonal)

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

#### `get(name: string) => ScaleType`

Given a scale type name, return a ScaleType object with the following properties:

- name: the scale type name
- aliases: a list of alternative names
- quality: Major | Minor | Augmented | Diminished | Unknown
- num: the pcset number
- chroma: the pcset chroma
- length: the number of notes
- intervals: the interval list

Example:

```js
ScaleType.get("major"); // =>
// {
// name: "major",
// aliases: ["ionian"],
// num: 2773,
// chroma: "101011010101",
// length: 7
// intervals: ["1P", "2M", "3M", "4P", "5P", "6M", "7M"],
// });
```

#### `names() => string[]`

Return a list of all scale names

#### `all() => object[]`

Return a list of all scale types

#### `add(intervals: string[], name?: string, aliases?: string[]) => ScaleType`

Add a scale type to dictionary:

```js
ScaleType.add(["1P", "5P"], null, ["5"]);
```

## HOW TO

#### How to get all pentatonics names?

```js
ScaleType.all()
  .filter((scaleType) => scaleType.intervals.length === 5)
  .map((scaleType) => scaleType.name);
```

#### How do to add a scale to the dictionary?

```js
ScaleType.add(["1P", "5P"], "quinta", ["quinta justa", "diapente"]);
ScaleType.scale("quinta"); // => { name: "quinta", intervals: ...}
ScaleType.scale("quinta justa"); // => { name: "quinta", intervals: ... }
```

#### References

Some sources explaining various scale systems:

- [Modes](<https://en.wikipedia.org/wiki/Mode_(music)>)
- [Blues Scales](https://en.wikipedia.org/wiki/Blues_scale)
- [Jazz Scales](https://en.wikipedia.org/wiki/Jazz_scale)
- [Messiaen's "Modes of Limited Transposition" (wikipedia, en)](https://en.wikipedia.org/wiki/Mode_of_limited_transposition)
- [Raga](https://de.wikipedia.org/wiki/Raga)
