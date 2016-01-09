# semitones [![npm version](https://img.shields.io/npm/v/semitones.svg)](https://www.npmjs.com/package/semitones)

[![tonal](https://img.shields.io/badge/tonal-semitones-yellow.svg)](https://www.npmjs.com/browse/keyword/tonal)

Get the size in semitones of an interval:

```js
var semitones = require('semitones')
semitones('P4') // => 5
```

You can install it via npm: `npm i --save semitones`

This tiny function is part of [tonal](https://github.com/danigb/tonal)

## Usage

This straightforward use is to get the size of an interval:

```js
['P1', 'M2', 'M3', 'P4', 'P5', 'M6', 'M7'].map(semitones)
// => [ 0, 2, 4, 5, 7, 9, 11, 12 ]
```

#### With notes

If you use it with notes, it returns the size in semitones from `C0` to that note:

```js
['C0', 'C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7'].map(semitones)
// =>  [ 0, 12, 24, 36, 48, 60, 72, 84 ]
```

So it can be used to find distances (in semitones) between notes:

```js
function distance(from, to) { return semitones(to) - semitones(from) }
distance('c3', 'd4') // => 14
```

#### With pitch classes

When used with pitch classes (notes without octaves) it returns the pitch class in [integer notation](https://en.wikipedia.org/wiki/Pitch_class#Integer_notation):

```js
['c', 'd', 'e', 'f', 'g', 'a', 'b'].map(semitones)
// => [ 0, 2, 4, 5, 7, 9, 11, 0 ]
```
