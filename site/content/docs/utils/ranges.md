---
title: Ranges
package: ranges
---

Functions to create note ranges

### `Range.numeric`

`Range.numeric(notes: Array<string|number>) => number[]`

Create a numeric (midi) range. You supply a list of notes or numbers (peaks and valleys) and they will be connected to create complex ranges.

Arguments can be note names or midi numbers, ranges can be ascending or descending.

```js
Range.numeric([10, 5]); // => [ 10, 9, 8, 7, 6, 5 ]
Range.numeric([-5, 5]); // => [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5]
Range.numeric(["C5", "C4"]); // => [ 72, 71, 70, 69, 68, 67, 66, 65, 64, 63, 62, 61, 60 ]
Range.numeric(["C4", "E4", "Bb3"]); // => [60, 61, 62, 63, 64, 63, 62, 61, 60, 59, 58]
```

### `Range.chromatic`

`Range.chromatic(notes: Array<string|number>, options) => string[]`

Create a range of chromatic notes. The same as `numeric` but the result will be note names instead of midi numbers.

The optional `options` object defines how note names are built:

- sharps: if `true` sharps will be used in altered notes. Default is `false`
- pitchClass: if `true` octaves are omitted. Default is `false`

```js
Range.chromatic(["C2", "E2", "D2"]);
// => ["C2", "Db2", "D2", "Eb2", "E2", "Eb2", "D2"]
Range.chromatic(["C2", "C3"], { sharps: true });
// => [ "C2", "C#2", "D2", "D#2", "E2", "F2", "F#2", "G2", "G#2", "A2", "A#2", "B2", "C3" ]
```
