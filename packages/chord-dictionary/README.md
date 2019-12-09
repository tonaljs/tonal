# @tonaljs/chord-dictionary ![tonal](https://img.shields.io/badge/@tonaljs-chord_dictionary-yellow.svg?style=flat-square) [![npm version](https://img.shields.io/npm/v/@tonaljs/chord-dictionary.svg?style=flat-square)](https://www.npmjs.com/package/@tonaljs/chord-dictionary)

> A dictionary of musical chords.

## Usage

```js
import { chordType } from "@tonaljs/chord-dictionary";
// or
const { chordType } = require("@tonaljs/chord-dictionary");
```

## API

#### `chordType(type: string) => ChordType`

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
chordType("major"); // =>
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

Return a list of all available chord types

#### `add(intervals: string[], names: string[], fullName?: string) => ChordType`

Add a chord type to dictionary:

```js
add(['1P', '3M', '5P'], ['M'], 'mayor');
```


## HOW TO

#### Get all chord names

```js
entries()
  .map(chordType => chordType.name)
  .filter(chordType => chordType)
```

#### How to get triad chord names?

```js
entries()
  .filter(chordType => chordType.length === 3)
  .map(chordType => chordType.name);
```

#### How to add a chord type to the dictionary?

```js
add(['1P', '3M', '5P'], ['M', 'may'], 'mayor')
chordType('mayor') // => { name: 'mayor', quality: "Major", chroma: ... }
chordType('may') // => { name: 'mayor', quality: "Major", chroma: ... }
```

#### How to know if a collection of notes is a known chord?

A poor's man version of chord detection. Only detects chord in first inversion.

```js
import { pcset } from "@tonaljs/pcset";

const notes = ["C4", "f#3", ...]
chordType(pcset(notes).chroma).name
```
