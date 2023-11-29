# @tonaljs/pitch-interval ![tonal](https://img.shields.io/badge/@tonaljs-pitch_interval-yellow.svg?style=flat-square) [![npm version](https://img.shields.io/npm/v/@tonaljs/pitch-interval.svg?style=flat-square)](https://www.npmjs.com/package/@tonaljs/pitch-interval)

> Pitch interval support

## Usage

⚠️ It's probably you don't need to use this package directly. Use [tonal-interval](/packages/interval) instead.

```js
import { parse, toName } from "@tonaljs/pitch-interval";

parse("4P").semitones; // => 5
```

## API

### `interval(name: string) => Interval`

Given an interval name, ite returns an object with the following properties:

- name: the interval name
- type: perfectable | majorable
- dir: direction: 1 | -1
- num: the interval number
- q: quality (...| 'dd' | 'd' | 'm' | 'M' | 'A' | ...)
- alt: the quality number as a number
- oct: the number of octaves it spans
- semitones: the number of semitones it spans
- simple: the simplified number

Example:

```js
interval("4d");
// =>
// {
//   name: "4d",
//   type: "perfectable",
//   dir: 1,
//   num: 4,
//   q: "d",
//   alt: -1,
//   chroma: 4,
//   oct: 0,
//   semitones: 4,
//   simple: 4,
// }
```

This function always returns an object:

```js
interval("hello"); // => { empty: true, name: "" }
```
