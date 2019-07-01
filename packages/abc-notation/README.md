# @tonaljs/abc-notation ![tonal](https://img.shields.io/badge/@tonaljs-abc-notation-yellow.svg?style=flat-square) [![npm version](https://img.shields.io/npm/v/@tonaljs/abc_notation.svg?style=flat-square)](https://www.npmjs.com/package/@tonaljs/abc-notation)

> Convert note names between scientific and abc notation

## References

- - [ABC Notation](https://en.wikipedia.org/wiki/ABC_notation)

## API

#### `abcToScientificNotation(noteNameInAbc: string) => string`

```js
abcToScientificNotation("c"); // => "C5"
```

#### `scientificToAbcNotation(noteNameInScientific: string) => string`

```js
scientificToAbcNotation("C#4"); // => "^C"
```

## How to?

#### Transpose notes in abc notation

```js
import { transpose } from "@tonal/tonal";
import {
  abcToScientificNotation,
  scientificToAbcNotation
} from "@tonal/abc-notation";

const transposeAbc = (note, interval) =>
  scientificToAbcNotation(abcToScientificNotation(note), interval);

transposeAbc("c", "P5");
```
