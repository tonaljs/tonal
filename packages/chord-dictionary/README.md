# @tonaljs/chord-dictionary ![tonal](https://img.shields.io/badge/@tonaljs-chord_dictionary-yellow.svg?style=flat-square) [![npm version](https://img.shields.io/npm/v/@tonaljs/chord-dictionary.svg?style=flat-square)](https://www.npmjs.com/package/@tonaljs/chord-dictionary)

> A dictionary of musical chords.

## Usage

```js
import { get } from "@tonaljs/chord-dictionary";
// or
const { get } = require("@tonaljs/chord-dictionary");
```

## API

#### `get(name: string) => ChordType`

Given a chord type name, return a ChordType object with the following properties:

- name: the chord type name
- aliases: a list of alternative names
- quality: Major | Minor | Augmented | Diminished | Unknown
- num: the pcset number
- chroma: the pcset chroma
- length: the number of notes
- intervals: the interval list

Example:

```js
get("major"); // =>
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

#### `entries() => ChordType[]`

Return a list of all available chord types.

#### `add(intervals: string[], names: string[], fullName?: string) => ChordType`

Add a chord type to dictionary:

```js
add(["1P", "3M", "5P"], ["M"], "mayor");
```

## HOW TO

#### Get all chord names

You can get (long) chord names:

```js
entries()
  .map(type => type.name)
  .filter(name => name);
```

Or the first (short) name:

```js
entries()
  .map(type => type.aliases[0])
  .filter(name => name);
```

#### How to get triad chord names?

```js
entries()
  .filter(get => get.length === 3)
  .map(get => get.name);
```

#### How to add a chord type to the dictionary?

```js
add(["1P", "3M", "5P"], ["M", "may"], "mayor");
get("mayor"); // => { name: 'mayor', quality: "Major", chroma: ... }
get("may"); // => { name: 'mayor', quality: "Major", chroma: ... }
```
