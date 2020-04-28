# @tonaljs/pitch ![tonal](https://img.shields.io/badge/@tonaljs-pitch-yellow.svg?style=flat-square) [![npm version](https://img.shields.io/npm/v/@tonaljs/pitch.svg?style=flat-square)](https://www.npmjs.com/package/@tonaljs/pitch)

> A notation agnostic representation of pitch

## Usage

It's probably you don't need to use this package. Use [tonal-note](/packages/note) instead.

```js
import { isPitch } from "@tonaljs/pitch";

isPitch(object); // => true / false
```

## API

#### type `Pitch`

Defines a pitch in agnostic notation manner

#### type `PitchNotation`

Defines a pair of methods to encode and decode pitches

#### `isPitch => boolean`

Test if a given value is a pitch
