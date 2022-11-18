# @tonaljs/abc-notation ![tonal](https://img.shields.io/badge/@tonaljs-abc_notation-yellow.svg?style=flat-square) [![npm version](https://img.shields.io/npm/v/@tonaljs/abc-notation.svg?style=flat-square)](https://www.npmjs.com/package/@tonaljs/abc-notation)

> Convert note names between scientific and abc notation

## Usage

ES6:

```js
import { AbcNotation } from "tonal";
```

nodejs:

```js
const { AbcNotation } = require("tonal");
```

## API

#### `abcToScientificNotation(noteNameInAbc: string) => string`

```js
AbcNotation.abcToScientificNotation("c"); // => "C5"
```

#### `scientificToAbcNotation(noteNameInScientific: string) => string`

```js
AbcNotation.scientificToAbcNotation("C#4"); // => "^C"
```

#### `transpose(note: string, interval: string) => string`

Transpose an note in abc notation:

```js
AbcNotation.transpose("=C", "P19"); // => "g'"
```

#### `distance(from: string, to: string) => string`

Find the interval between two notes in abc notation:

```js
AbcNotation.distance("=C", "g"); // => "12P"
```

## References

- [ABC Notation](https://en.wikipedia.org/wiki/ABC_notation)
