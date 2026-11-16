# @tonaljs/roman-numeral ![tonal](https://img.shields.io/badge/@tonaljs-roman_numeral-yellow.svg?style=flat-square) [![npm version](https://img.shields.io/npm/v/@tonaljs/roman-numeral.svg?style=flat-square)](https://www.npmjs.com/package/@tonaljs/roman-numeral)

> Functions to parse roman numeral strings (like the ones used for chord analysis)

A roman numeral symbol is a string like `"bVIImaj7"` that can be used to represent chords in an abstract tonality.

## Usage

ES6:

```js
import { RomanNumeral } from "tonal";
```

node:

```js
const { RomanNumeral } = require("tonal");
```

## API

### `RomanNumeral.get`

`get(src: string | Pitch) => RomanNumeral`

Get the properties of a roman numeral:

Example:

```js
RomanNumeral.get("bVIIMaj7");
// =>
// {
//   empty: false,
//   name: "bVIIMaj7",
//   roman: "VII",
//   interval: "7m",
//   acc: "b",
//   chordType: "Maj7",
//   alt: -1,
//   step: 6,
//   major: true,
//   oct: 0,
//   dir: 1
// }
```

## FAQ

### How do I get a roman numeral from an interval

`RomanNumeral.get` accepts a `Pitch` as argument:

```js
import { Interval, RomanNumeral } from "tonal";

RomanNumeral.get(Interval.get("3m")).name; // => "bIII"
```

## Want more?

Take a look to [@tonaljs/progression](https://tonaljs.github.io/tonal/docs/harmony/progressions) or [@tonaljs/key](https://tonaljs.github.io/tonal/docs/harmony/keys)
