# @tonaljs/pitch-note ![tonal](https://img.shields.io/badge/@tonaljs-pitch_note-yellow.svg?style=flat-square) [![npm version](https://img.shields.io/npm/v/@tonaljs/pitch-note.svg?style=flat-square)](https://www.npmjs.com/package/@tonaljs/pitch-note)

> Pitch note support

## Usage

⚠️ It's probably you don't need to use this package directly. Use [tonal-note](/packages/note) instead.

```js
import { note } from "@tonaljs/pitch-note";

note("c4"); // => { name: 'C4', oct: 4, ...}
```

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
- freq: the note frequency in Hertzes, or null if the octave is note present

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
