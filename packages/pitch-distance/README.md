# @tonaljs/pitch-distance ![tonal](https://img.shields.io/badge/@tonaljs-pitch_distance-yellow.svg?style=flat-square) [![npm version](https://img.shields.io/npm/v/@tonaljs/pitch-distance.svg?style=flat-square)](https://www.npmjs.com/package/@tonaljs/pitch-distance)

> Pitch distance and transposition

## Usage

⚠️ It's probably you don't need to use this package directly. Use [tonal-note](/packages/note).

```js
import { transpose, distance } from "@tonaljs/pitch-distance";
transpose("C4", "5P"); // => "G4"
distance("C4", "G4"); // => "5P"
```

## API

### `transpose(note: string, interval: string) => string`

Transpose a note by an interval. It returns the note name or "" if not valid parameters.

Examples:

```js
transpose("d3", "3M"); // => "F#3"
transpose("D", "3M"); // => "F#"
["C", "D", "E", "F", "G"].map((pc) => transpose(pc, "M3"));
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

## Want more?

Take a look to [@tonaljs/note](/packages/note) or [@tonaljs/interval](/packages/interval) modules.

## FAQ

#### How do I get the note frequency and midi number?

```js
note("C4").octave; // => 4
note("C4").midi; // => 60
```

#### How do I know if a note name is valid?

```js
note("C4").empty; // => false
note("x").empty; // => true
note("x").name; // => ""
note("x").octave; // => undefined
// remove all invalid note names
[...].map(note).filter(n => !n.empty).map(n => n.name)
```

#### How do I know if two notes are enharmonics?

You can test the midi numbers:

```js
note("Cb4").midi === note("B3").midi;
```

Or better yet, use the `height` property that is also present on pitch classes (in notes without octaves midi property is `null`):

```js
note("Cb").height === note("B").height;
```

### How do I change the octave of a note?

```js
note("Cb4").pc + 5; // => "Cb5"
```
