# @tonaljs/note ![tonal](https://img.shields.io/badge/@tonaljs-note-yellow.svg?style=flat-square) [![npm version](https://img.shields.io/npm/v/@tonaljs/note.svg?style=flat-square)](https://www.npmjs.com/package/@tonaljs/note)

> A collection of functions to manipulate musical notes

## API

### `tokenize(noteName: string) => [string, string, string, string]`

Given a note name, returns its parts: [letter, accidentals, octave, rest]:

```js
tokenize("c##4"); // => ["C", "##", "4", ""]
tokenize("c##4 mixolidian"); // => ["C", "##", "4", " mixolydian"]
tokenize("not a note"); // => ["", "", "", ""]
```

### `simplify(noteName: string) => string`

Given a note name, return the same note with less accidentals (or "" if not a valid note):

```js
simplify("C#"); // => "C#"
simplify("C##"); // => "D"
simplify("C###"); // => "D#"
```

### `enharmonic(noteName: string) => string`

Given a note name, returns it enharmonic not (or "" if not valid note):

```js
enharmonic("C#"); // => "Db"
enharmonic("C##"); // => "D"
enharmonic("C###"); // => "Eb"
```

### `transposeBy(interval: string) => (note: string) => string`

Given an interval, returns a function that transposes a note by that interval:

```js
["C", "D", "E"].map(transposeBy("5P"));
// => ["G", "A", "B"]
```

### `transposeFrom(note: string) => (interval: string) => string`

Given an interval, returns a function that transposes a note by that interval:

```js
["1P", "3M", "5P"].map(transposeFrom("C"));
// => ["C", "E", "G"]
```

### `transposeFifths(noteName: string, fifths: number) => string`

Transpose a note a given number of fifths:

```js
transposeFifths("G4", 3); // => "E6"
transposeFifths("G", 3); // => "E"

[0, 1, 2, 3, 4, 5, 6].map(n => transposeFifths("F#", n));
// => ["F#", "C#", "G#", "D#", "A#", "E#", "B#"]
[0, -1, -2, -3, -4, -5, -6].map(n => transposeFifths("Bb", n));
// => ["Bb", "Eb", "Ab", "Db", "Gb", "Cb", "Fb"]
```
