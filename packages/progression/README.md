# @tonaljs/progression ![tonal](https://img.shields.io/badge/@tonaljs-progression-yellow.svg?style=flat-square) [![npm version](https://img.shields.io/npm/v/@tonaljs/progression.svg?style=flat-square)](https://www.npmjs.com/package/@tonaljs/progression)

> Convert chord list to roman numerals analysis chord and reverse

```js
import { Progression } from "tonal";

Progression.fromRomanNumerals("C", ["IMaj7", "IIm7", "V7"]); // => ["CMaj7", "Dm7", "G7"]
```

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

`fromRomanNumerals(keyTonic: string, chordProgression: string[]) => string[]`

Given a tonic and a chord progression expressed in roman numeral analysis chords, returns the progression expressed in leadsheet chords.

```js
Progression.fromRomanNumerals("C", ["IMaj7", "IIm7", "V7"]);
// => ["CMaj7", "Dm7", "G7"]
```

A lowercase roman numeral is a minor chord, unless its chord type already has a quality (like `viio`, `iim7` or `ii+`). Every spelling of a chord type gives the same chord (`iimaj7` and `iiMaj7` are both minor-major sevenths):

```js
Progression.fromRomanNumerals("C", ["I", "vi", "ii7", "V7", "viio"]);
// => ["C", "Am", "Dm7", "G7", "Bo"]
```

An applied (secondary) chord, like `V7/V`, is a chord on a degree of another degree's major scale. Applied chords can nest:

```js
Progression.fromRomanNumerals("C", ["I", "V7/ii", "ii", "V7/V", "V7", "I"]);
// => ["C", "A7", "Dm", "D7", "G7", "C"]
Progression.fromRomanNumerals("C", ["viio7/V", "V/V/V"]);
// => ["F#o7", "A"]
```

A chord type can also be a listed type plus alterations, like in `Chord.get`:

```js
Progression.fromRomanNumerals("C", ["V7(b9)", "IV(add9)", "ii(add9)"]);
// => ["G7(b9)", "F(add9)", "Dm(add9)"]
```

A note after a slash is the bass: `I/E` is `C/E`. A numeral whose chord type isn't a known chord type gives an empty string:

```js
Progression.fromRomanNumerals("C", ["I/E", "V65", "It6"]);
// => ["C/E", "", ""]
```

### `Progression.toRomanNumerals`

`toRomanNumerals(keyTonic: string, chordProgression: string[]) => string[]`

The opposite of `fromRomanNumerals`. Given a tonic and a chord progression expressed in leadsheet chords, returns the progression using roman numeral analysis chords.

```js
Progression.toRomanNumerals("C", ["CMaj7", "Dm7", "G7"]);
// => "IMaj7", "IIm7", "V7"]
```

## References

- [Roman numeral analysis](https://en.wikipedia.org/wiki/Roman_numeral_analysis)
- [Leadsheet chord symbols](https://en.wikipedia.org/wiki/Lead_sheet)
