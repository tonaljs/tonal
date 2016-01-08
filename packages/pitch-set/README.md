# pitch-set [![npm version](https://img.shields.io/npm/v/pitch-set.svg)](https://www.npmjs.com/package/pitch-set)

[![tonal](https://img.shields.io/badge/tonal-music--scale-yellow.svg)](https://www.npmjs.com/package/tonal)

`pitch-set` is a module with a function to create pitch sets. It can be used to create music scales:

```js
var pitchSet = require('pitch-set')

// pitch sets from a collection of notes (using first note as tonic)
pitchSet('C2 d4 g6 g3 f5', null) // => ['C', 'D', 'F', 'G']

// create scales
var major = pitchSet('C D E F G A B C')
major('A') // => ['A', 'B', 'C#' 'D', 'E', 'F#', 'G#']
```

This is part of [tonal](https://www.npmjs.com/package/tonal)

## Install

Via npm: `npm i --save pitch-set`

## Usage

#### Create pitch sets

Pitch sets are collection of uniq pitch classes ordered by pitch. You can create a pitch set from a collection of notes (the null means 'use first note of the collection as first note of the set'):

```js
var set = pitchSet('C2 g5 e4 d6 d2', null) // => ['C', 'D', 'E', 'G']
```

#### Create scales

Since scales are a pitch sets with a tonic, they can be created from a list of intervals and a tonic:

```js
pitchSet('1 2 3m 4 5 6m 7', 'D') // => ['D', 'E', 'F', 'G', 'A', 'Bb', 'C#']
```

This function can be partially applied:

```js
var dorian = set('1 2 3b 4 5 6 7b')
dorian('eb') // => [ 'Eb', 'F', 'Gb', 'Ab', 'Bb', 'C', 'Db' ]
```

The source can be also another scale:

```js
pitchSet('C D E F G A B C', 'A') // => ['A', 'B', 'C#' 'D', 'E', 'F#', 'G#']
```

Or even a collection of notes:

```js
pitchSet('C2 d4 g7 a2', 'C') // => ['C', 'D', 'G', 'A']
```

#### Scale tonics

If the tonic of a scale is a pitch class (a note without octave) the notes of the scale are pitch classes:

```js
var major = pitchSet('C D E F G A B C')
major('A') // => ['A', 'B', 'C#' 'D', 'E', 'F#', 'G#']
```

If the tonic of the scale is a note with octave, the notes of the scale will have octave numbers:

```js
major('A4') // => ['A4', 'B4', 'C#5' ,'D5', 'E5', 'F#5', 'G#5']
```

If the tonic of a scale is false, the intervals are returned:

```js
major(false) // => ['P1', 'M2', 'M3', 'P4', 'P5', 'M6', 'M7']
```

Finally, if the tonic is null and the source are notes, the first pitch class of the scale source will be the tonic:

```js
major(null) // => ['C', 'D', 'E', 'F', 'G', 'A', 'B']
pitchSet('d4 f5 g2 c6 a1', null) // => [ 'D', 'F', 'G', 'A', 'C' ]
```

## License

MIT License
