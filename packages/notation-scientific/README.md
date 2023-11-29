# @tonaljs/notation-scientific ![tonal](https://img.shields.io/badge/@tonaljs-notation_scientific-yellow.svg?style=flat-square) [![npm version](https://img.shields.io/npm/v/@tonaljs/notation-scientific.svg?style=flat-square)](https://www.npmjs.com/package/@tonaljs/notation-scientific)

> Parse notes in scientific notation

## Usage

⚠️ It's probably you don't need to use this package directly. Use [tonal-note](/packages/note) instead.

```js
import { parse, name, tokenize } from "@tonaljs/notation-scientific";

parse("cb4"); // => { step: 0, oct: 4, alt: -1 }
```

## API

### `tokenize(name: string) => [string, string, string, string]`

Given a note name in [scientific notation] it returns an array with the different parts:

```js
tokenize("Abb4 major"); // => ["", "A", "bb", "4", "major"]
```

### `parse(name: string) => { step, alt, oct? } | undefined`

Given a note name, it returns an object with the following properties:

- step (number): the letter number (0..6)
- alt (number): the accidental number (..., -1 = 'b', 0 = '', 1 = '#', ...)
- oct (number?): the optional octave

### `name(parsed) => string`

Given the result of `parse` it returns the name.

```js
name({ step: 1, oct: 2, alt: 1 }); // => "D#1"
```
