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

#### `add(intervals: string[], name?: string, aliases?: string[]) => ScaleType`

Add a scale type to dictionary:

```js
add(['1P', '5P'], null, ['5']);
```

## HOW TO

#### How to get all names?

```js
entries().map(scaleType => scaleType.name)
```

#### How to get all pentatonics names?

```js
entries()
  .filter(scaleType => scaleType.length === 5)
  .map(scaleType =>scaleType.name);
```

#### How do to add a scale to the dictionary?

```js
import { scale, add } from '@tonaljs/scale'
add(['1P', '5P'], 'quinta', ['quinta justa', 'diapente'])
scale('quinta') // => { name: "quinta", intervals: ...}
scale('quinta justa') // => { name: "quinta", intervals: ... }
```
