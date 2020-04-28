# @tonaljs/pitch-scientific-notation ![tonal](https://img.shields.io/badge/@tonaljs-note_name_scientific-yellow.svg?style=flat-square) [![npm version](https://img.shields.io/npm/v/@tonaljs/pitch-scientific-notation.svg?style=flat-square)](https://www.npmjs.com/package/@tonaljs/pitch-scientific-notation)

> Parse note names in scientific notation

⚠️ It's probably you don't need to use this package directly. Use [tonal-note](/packages/note) instead.

## Usage

```js
import { parse, toString } from "@tonalhs/pitch-scientific-notation";

parse("c4").name; // => "C4"
```

## API

#### `parse(noteName: string) => ParsedPitch`

Parse a note name:

```js
```

It's aliased as `parse`

#### `toString(pitch: Pitch) => string`

Convert a Pitch into a note name:

```js
```
