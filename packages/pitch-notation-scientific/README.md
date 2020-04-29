# @tonaljs/pitch-notation-scientific ![tonal](https://img.shields.io/badge/@tonaljs-pitch_notation_scientific-yellow.svg?style=flat-square) [![npm version](https://img.shields.io/npm/v/@tonaljs/pitch-notation-scientific.svg?style=flat-square)](https://www.npmjs.com/package/@tonaljs/pitch-notation-scientific)

> Parse note names in scientific notation

## Usage

⚠️ It's probably you don't need to use this package directly. Use [tonal-note](/packages/note) instead.

```js
import { parse, toName } from "@tonalhs/pitch-notation-scientific";

parse("c4").name; // => "C4"
```

## API

#### `tokenize(input: string) => PitchScientificTokens`

Tokenize a note name:

```js
```

#### `parse(input: string) => PitchScientific`

Parse a note name:

```js
```

#### `name(pitch: Pitch) => string`

Convert a Pitch into a note name in scientific notation:

```js
```

It returns an empty string if the pitch is not a valid pitch object
