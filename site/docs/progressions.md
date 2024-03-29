---
title: Progressions
sidebar_position: 8
---

`@tonaljs/progression`

![tonal](https://img.shields.io/badge/@tonaljs-progression-yellow.svg?style=flat-square)
[![npm version](https://img.shields.io/npm/v/@tonaljs/progression.svg?style=flat-square)](https://www.npmjs.com/package/@tonaljs/progression)

Chord progressions

## Usage

ES6:

```js
import { Progression } from "tonal";
```

node:

```js
const { Progression } = require("tonal");
```

## API

### `Progression.fromRomanNumerals`

#### `fromRomanNumerals(keyTonic: string, chordProgression: string[]) => string[]`

Given a tonic and a chord progression expressed in roman numeral analysis chords, returns the progression expressed in leadsheet chords.

```js
Progression.fromRomanNumerals("C", ["IMaj7", "IIm7", "V7"]);
// => ["CMaj7", "Dm7", "G7"]
```

### `Progression.toRomanNumerals`

#### `toRomanNumerals(keyTonic: string, chordProgression: string[]) => string[]`

The opposite of `fromRomanNumerals`. Given a tonic and a chord progression expressed in leadsheet chords, returns the progression using roman numeral analysis chords.

```js
Progression.toRomanNumerals("C", ["CMaj7", "Dm7", "G7"]);
// => "IMaj7", "IIm7", "V7"]
```

## References

- [Roman numeral analysis](https://en.wikipedia.org/wiki/Roman_numeral_analysis)
- [Leadsheet chord symbols](https://en.wikipedia.org/wiki/Lead_sheet)
