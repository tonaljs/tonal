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
//   of: "",
//   alt: -1,
//   step: 6,
//   major: true,
//   oct: 0,
//   dir: 1
// }
```

An applied (secondary) chord, like `V7/V`, is a chord on a degree of another degree's major scale. `of` is the degree it's applied to, and `interval`, `step` and `alt` locate the chord's root from the tonic: the root of `V7/V` is the second degree (`D` in C). Applied chords can nest (`V/V/V`):

```js
RomanNumeral.get("V7/V");
// => { name: "V7/V", roman: "V", chordType: "7", of: "V", interval: "2M", step: 1, alt: 0, ... }
RomanNumeral.get("viio7/V").interval; // => "4A"
RomanNumeral.get("V/V/V").interval; // => "6M"
```

The degrees are counted on the major scale of the degree the chord is applied to, as everywhere else in tonal: `VI/ii` is `B` in C. Write `bVI/ii` for `Bb`. This differs from classical analysis and music21, where a lowercase target is a minor key: there `VI/ii` is `Bb` and `bVI/ii` is `Bbb`. The two agree on the usual applied chords (`V`, `V7` and `viio7` of any degree).

### `RomanNumeral.names`

`names(major?: boolean) => string[]`

Get the roman numerals of the seven degrees, in upper case (major, the default) or lower case (minor):

```js
RomanNumeral.names(); // => ["I", "II", "III", "IV", "V", "VI", "VII"]
RomanNumeral.names(false); // => ["i", "ii", "iii", "iv", "v", "vi", "vii"]
```

### `RomanNumeral.tokenize`

`tokenize(name: string) => [string, string, string, string, string]`

Split a roman numeral symbol into the whole match, its accidentals, the roman numeral, the chord type and the degree it's applied to. Invalid symbols give empty strings:

```js
RomanNumeral.tokenize("bVIIMaj7"); // => ["bVIIMaj7", "b", "VII", "Maj7", ""]
RomanNumeral.tokenize("#iv"); // => ["#iv", "#", "iv", "", ""]
RomanNumeral.tokenize("V7/V"); // => ["V7/V", "", "V", "7", "V"]
RomanNumeral.tokenize("viidim7"); // => ["viidim7", "", "vii", "dim7", ""]
RomanNumeral.tokenize("C"); // => ["", "", "", "", ""]
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
