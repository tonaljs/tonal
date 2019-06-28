# @tonaljs/chord-dictionary [![npm version](https://img.shields.io/npm/v/@tonaljs/chord-dictionary.svg?style=flat-square)](https://www.npmjs.com/package/@tonaljs/chord-dictionary)

[![tonal](https://img.shields.io/badge/@tonaljs-chord_dictionary-yellow.svg?style=flat-square)](https://www.npmjs.com/browse/keyword/tonal)

`@tonaljs/chord-dictionary` is a dictionary of musical chords.

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

#### `names() => string[]`

Return a list of all available chord type names

#### `aliases() => string[]`

Return a list of all available chord type alternative names
