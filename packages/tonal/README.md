# @tonaljs/tonal [![npm version](https://img.shields.io/npm/v/@tonaljs/tonal.svg?style=flat-square)](https://www.npmjs.com/package/@tonaljs/tonal)

[![tonal](https://img.shields.io/badge/@tonaljs-tonal-yellow.svg?style=flat-square)]()

`@tonaljs/tonal` is a collection of functions to get musical notes and interval properties

## API

### `note(name: string) => Note`

Given a note name, it returns an object with the following properties:

- name: the note name
- pc: the pitch class name
- letter: the note letter
- step: the letter number (0..6)
- acc: the note accidentals
- alt: the accidental number (..., -1 = 'b', 0 = '', 1 = '#', ...)
- oct: the octave (or null if not present)
- chroma: the note chroma (0..11)
- midi: the note midi or null if octave is not present
- freq: the note frecuency in Hertzs, or null if the octave is note present

Example:

```js
note("ab4");
// =>
// {
//   name: "Ab4",
//   pc: "Ab",
//   letter: "A",
//   acc: "b",
//   step: 5,
//   alt: -1,
//   oct: 4,
//   chroma: 8,
//   midi: 68,
//   freq: 415.3046975799451,
// }
```

This function always returns an object:

```js
note("hello"); // => { empty: true, name: "" }
```

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

### `transpose(note: string, interval: string) => string`

Transpose a note by an interval. It returns the note name or "" if not valid parameters.

Examples:

```js
transpose("d3", "3M"); // => "F#3"
transpose("D", "3M"); // => "F#"
["C", "D", "E", "F", "G"].map(pc => transpose(pc, "M3"));
// => ["E", "F#", "G#", "A", "B"]
```

This function always returns a string:

```js
transpose("one", "two"); // => ""
```

### `distance(from: string, to: string) => string`

Find the distance between two notes. It returns the interval name, or "" if not valid parameters.

Examples:

```js
distance("C3", "E4"); // => "10M"
```

If one of the note is a pitch class, the interval will be simple:

```js
distance("C", "E"); // => "3M"
distance("C", "E4"); // => "3M"
distance("C4", "E"); // => "3M"
```

This function always returns a string:

```js
distance("today", "tomorrow"); // => ""
```
