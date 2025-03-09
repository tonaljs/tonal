---
title: Roman Numerals
description: Functions to parse roman numerals
package: RomanNumeral
---

A roman numeral symbol is a string like `"bVIImaj7"` that can be used to represent chords in an abstract tonality.

```js
import { RomanNumeral } from "tonal";
```

## API

### `RomanNumeral.get(src: string | Pitch): => RomanNumeral`

Get the properties of a roman numeral:

Example:

```js
RomanNumeral.get("bVIIMaj7");
// =>
// {
//   empty: false,
//   name: "bVIIMaj7",
//   roman: "VII",
//   acc: "b",
//   chordType: "Maj7",
//   alt: -1,
//   step: 6,
//   major: true,
//   oct: 0
// }
```

## FAQ

#### How do I get a roman numeral from an interval

`romanNumeral` function accepts a `Pitch` as argument:

```js
import { Interval, RomanNumeral } from "tonal";

RomanNumeral.get(Interval.get("3m")).name; // => "bIII"
```

## Related

Take a look to [@tonal/progression](https://github.com/tonaljs/tonal/tree/master/packages/progression) or [@tonal/key](https://github.com/tonaljs/tonal/tree/master/packages/key)
