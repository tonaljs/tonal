# @tonaljs/scale-dictionary [![npm version](https://img.shields.io/npm/v/@tonaljs/scale-dictionary.svg?style=flat-square)](https://www.npmjs.com/package/@tonaljs/scale-dictionary)

[![tonal](https://img.shields.io/badge/@tonaljs-scale_dictionary-yellow.svg?style=flat-square)](https://www.npmjs.com/browse/keyword/tonal)

`@tonaljs/scale-dictionary` is a dictionary of musical scales.

## API

#### `scaleType(type: string) => ScaleType`

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
scaleType("major"); // =>
// {
// name: "major",
// aliases: ["ionian"],
// num: 2773,
// chroma: "101011010101",
// length: 7
// intervals: ["1P", "2M", "3M", "4P", "5P", "6M", "7M"],
// });
```

#### `entries() => Scale[]`

Return a list of all available scale types

## FAQ

#### How do I get all pentatonics names?

```js
entries()
  .filter(type => type.intervals.length === 5)
  .map(n => name);
```
