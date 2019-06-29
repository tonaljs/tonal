# @tonaljs/scale [![npm version](https://img.shields.io/npm/v/@tonaljs/scale.svg?style=flat-square)](https://www.npmjs.com/package/@tonaljs/scale)

[![tonal](https://img.shields.io/badge/@tonaljs-scale-yellow.svg?style=flat-square)](https://www.npmjs.com/browse/keyword/tonal)

`@tonaljs/scale` is a collection of functions to create and manipulate musical scales

## API

### `scale(name: string) => Scale`

Get a scale from a scale name. Unlike `scaleType`, `scale` accepts tonics in the scale name and returns the scale type with two more properties: `tonic` and `notes`:

See [scale-dictionary](../scale-dictionary) for more details.

```js
scale("c5 pentatonic");
// =>
// {
//   empty: false,
//   name: "C5 pentatonic",
//   type: "major pentatonic",
//   tonic: "C5",
//   notes: ["C5", "D5", "E5", "G5", "A5"],
//   intervals: ["1P", "2M", "3M", "5P", "6M"],
//   aliases: ["pentatonic"],
//   setNum: 2708,
//   chroma: "101010010100",
//   normalized: "101010010100"
// }
```

### `chords(scale: string) => string[]`

Get all chords that fits a given scale

```js
Scale.chords("pentatonic");
// => ["5", "64", "M", "M6", "Madd9", "Msus2"]
```

### `extended(scale: string) => string[]`

Get all scales names that are a superset of the given one (has the same notes and at least one more)

```js
Scale.extended("major");
// => ["bebop", "bebop dominant", "bebop major", "chromatic", "ichikosucho"]
```

### `reduced(scale: string) => string[]`

Find all scales names that are a subset of the given one (less notes but all from the given scale)

```js
Scale.reduced("major");
// => ["ionian pentatonic", "major pentatonic", "ritusen"]
```
