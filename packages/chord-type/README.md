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

The dictionary includes the shorthand often written in charts: `-` for minor, `^` for major seventh, `h` for half-diminished and `o` for diminished, so `-7b6`, `^7#9`, `h9` and `o^7` are listed types.

`ChordType.get` only finds listed types. `Chord.get` also reads a listed type followed by alterations, such as `7(b9,#9)` or `m7b5b9` (see [`Chord.get`](https://tonaljs.github.io/tonal/docs/groups/chords#chordget)).

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

`add(intervals: string[], names: string[], fullName?: string) => void`

Add a chord type to dictionary:

```js
ChordType.add(["1P", "3M", "5P"], ["M"], "mayor");
```

### `ChordType.addAlias`

`addAlias(chordType: ChordType, alias: string) => void`

Add an alias to get a chord type from the dictionary. The alias is only used to find it (it's not added to its `aliases`):

```js
ChordType.addAlias(ChordType.get("major"), "dur");
ChordType.get("dur").name; // => "major"
```

### `ChordType.keys`

`keys() => string[]`

List every key that finds a chord type: names, aliases, set numbers and chromas:

```js
ChordType.keys().includes("maj7"); // => true
```

### `ChordType.removeAll`

`removeAll() => void`

Remove every chord type from the dictionary. Other modules that use it (`Chord`, `Scale.scaleChords`...) won't find any chord afterwards.

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
