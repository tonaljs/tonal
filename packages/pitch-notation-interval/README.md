# @tonaljs/pitch-notation-interval ![tonal](https://img.shields.io/badge/@tonaljs-pitch_notation_interval-yellow.svg?style=flat-square) [![npm version](https://img.shields.io/npm/v/@tonaljs/pitch-notation-interval.svg?style=flat-square)](https://www.npmjs.com/package/@tonaljs/pitch-notation-interval)

> Parse interval names in shorthand notation

## Usage

⚠️ It's probably you don't need to use this package directly. Use [tonal-note](/packages/interval) instead.

```js
import { parse, toName } from "@tonalhs/pitch-notation-interval";

parse("4P").semitones; // => 5
```

## API

#### `tokenize(input: string) => PitchScientificTokens`

Tokenize an interval in shorthand notation:

```js
```

#### `parse(input: string) => PitchScientific`

Parse an interval in shorthand notation:

```js
```

#### `name(pitch: Pitch) => string`

Convert a Pitch into an interval name in tonal shorthand notation:

```js
```

It returns an empty string if the pitch is not a interval pitch object
