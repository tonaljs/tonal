# @tonaljs/chord-type ![tonal](https://img.shields.io/badge/@tonaljs-chord_type-yellow.svg?style=flat-square) [![npm version](https://img.shields.io/npm/v/@tonaljs/chord-type.svg?style=flat-square)](https://www.npmjs.com/package/@tonaljs/chord-type)

> A dictionary of musical chords.

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

#### `ChordType.get(name: string) => object`

Given a chord type name, return an object with the following properties:

- name: the chord type name
- aliases: a list of alternative names
- quality: Major | Minor | Augmented | Diminished | Unknown
- num: the pcset number
- chroma: the pcset chroma
- length: the number of notes
- intervals: the interval list

Example:

```js
ChordType.get("major"); // =>
// {
//   name: "major",
//   aliases: ["M", ""],
//   quality: "Major",
//   intervals: ["1P", "3M", "5P"],
//   num: 2192,
//   chroma: "100010010000",
//   length: 3
// });
```

#### `ChordType.names() => string[]`

List all chord type (long) names in the dictionary

#### `ChordType.symbols() => string[]`

List all chord type (long) names in the dictionary

#### `ChordType.all() => object[]`

Return a list of all available chord types.

#### `ChordType.add(intervals: string[], names: string[], fullName?: string) => ChordType`

Add a chord type to dictionary:

```js
add(["1P", "3M", "5P"], ["M"], "mayor");
```

## HOW TO

#### How to get triad chord names?

```js
ChordType.all()
  .filter((get) => get.length === 3)
  .map((get) => get.name);
```

#### How to add a chord type to the dictionary?

```js
ChordType.add(["1P", "3M", "5P"], ["M", "may"], "mayor");
ChordType.get("mayor"); // => { name: 'mayor', quality: "Major", chroma: ... }
ChordType.get("may"); // => { name: 'mayor', quality: "Major", chroma: ... }
```
