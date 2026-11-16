# @tonaljs/chord-type ![tonal](https://img.shields.io/badge/@tonaljs-chord_type-yellow.svg?style=flat-square) [![npm version](https://img.shields.io/npm/v/@tonaljs/chord-type.svg?style=flat-square)](https://www.npmjs.com/package/@tonaljs/chord-type)

> A dictionary of musical chords.

```js
import { ChordType } from "tonal";

ChordType.get("major").intervals; // => ["1P", "3M", "5P"]
```

## Usage

ES6:

```js
import { ChordType } from "tonal";
```

node:

```js
const { ChordType } = require("tonal");
```

## API

### `ChordType.get`

`get(name: string) => ChordType`

Given a chord type name, return an object with the following properties:

- empty: true if the chord type is not found
- name: the chord type name
- aliases: a list of alternative names
- quality: Major | Minor | Augmented | Diminished | Unknown
- setNum: the pcset number
- chroma: the pcset chroma
- normalized: the pcset chroma rotated to start with its first note
- intervals: the interval list

Example:

```js
ChordType.get("major"); // =>
// {
//   empty: false,
//   name: "major",
//   setNum: 2192,
//   chroma: "100010010000",
//   normalized: "100001000100",
//   intervals: ["1P", "3M", "5P"],
//   quality: "Major",
//   aliases: ["M", "^", "", "maj"],
// }
```

### `ChordType.names`

`names() => string[]`

List all chord type (long) names in the dictionary

### `ChordType.symbols`

`symbols() => string[]`

List all chord type (long) names in the dictionary

### `ChordType.all`

`all() => object[]`

Return a list of all available chord types.

### `ChordType.add`

`add(intervals: string[], names: string[], fullName?: string) => ChordType`

Add a chord type to dictionary:

```js
ChordType.add(["1P", "3M", "5P"], ["M"], "mayor");
```

## How to...

### How to get triad chord names?

```js
ChordType.all()
  .filter((chordType) => chordType.intervals.length === 3)
  .map((chordType) => chordType.name);
```

### How to add a chord type to the dictionary?

```js
ChordType.add(["1P", "3M", "5P"], ["M", "may"], "mayor");
ChordType.get("mayor"); // => { name: 'mayor', quality: "Major", chroma: ... }
ChordType.get("may"); // => { name: 'mayor', quality: "Major", chroma: ... }
```
