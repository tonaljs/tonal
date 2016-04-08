# music-scale [![npm version](https://img.shields.io/npm/v/music-scale.svg)](https://www.npmjs.com/package/music-scale)

[![tonal](https://img.shields.io/badge/tonal-music--scale-yellow.svg)](https://www.npmjs.com/package/tonal)

`music-scale` is a function to create music scales, either by name or by intervals. It includes a scale dictionary:

```js
var scale = require('music-scale')

// get scale from name
scale('A major') // => ['A', 'B', 'C#', 'D', 'E', 'F#', 'G#']

// get scale from type and tonic
scale('major', 'A4') // => ['A4', 'B4', 'C#4', 'D4', 'E4', 'F#4', 'G#4']

// get scale from intervals and tonic
scale('1 2 3 4 5 6 7', 'A') // => ['A', 'B', 'C#', 'D', 'E', 'F#', 'G#']

// partially applied
var major = scale('major')
major('A') // => ['A', 'B', 'C#', 'D', 'E', 'F#', 'G#']
major('A4') // => ['A4', 'B4', 'C#4', 'D4', 'E4', 'F#4', 'G#4']
```

This is part of [tonal](https://www.npmjs.com/package/tonal)

## Install

Via npm: `npm i --save music-scale`

## Usage

Scales are a pitch sets with a tonic. Scales can be created from a list of intervals and a tonic, from a scale type and tonic, or from scale name.

#### Create scales from name

If you provide the scale and tonic in one string, it retunrs its notes:

```js
scale('C major') // => ['C', 'D', 'E', 'F', 'G', 'A', 'B']
```

You pass the scale type and tonic as two parameters:

```js
scale('major', 'C') // => ['C', 'D', 'E', 'F', 'G', 'A', 'B']
```

And then partially apply it:

```js
var major = scale('major')
major('A') // => ['A', 'B', 'C#', 'D', 'E', 'F#', 'G#']
```

#### Get available names and scale properties

The `names` and `props` functions from [scale-dictionary]() are exposed:

```js
scale.names() // => ['Maj7', 'm7', ...]
scale.names(true) // => ['Maj7', 'm7', ...] <= with aliases
scale.props('major') // => { name: 'major',
  //  aliases: [ 'ionian' ],
  //  intervals: [ '1', '2', '3', '4', '5', '6', '7' ],
  //  steps: [ [ 0, 0 ], [ 2, -1 ], [ 4, -2 ], [ -1, 1 ], [ 1, 0 ], [ 3, -1 ], [ 5, -2 ] ],
  //  binary: '101011010101', decimal: 2773 })
```

#### Create scale from intervals

```js
scale('1 2 3m 4 5 6m 7', 'D') // => ['D', 'E', 'F', 'G', 'A', 'Bb', 'C#']
```

This function can be partially applied:

```js
var dorian = set('1 2 3b 4 5 6 7b')
dorian('eb') // => [ 'Eb', 'F', 'Gb', 'Ab', 'Bb', 'C', 'Db' ]
```

The source can be also another scale:

```js
scale('C D E F G A B C', 'A') // => ['A', 'B', 'C#' 'D', 'E', 'F#', 'G#']
```

Or even a collection of notes:

```js
scale('C2 d4 g7 a2', 'C') // => ['C', 'D', 'G', 'A']
```

#### Scale tonics

If the tonic of a scale is a pitch class (a note without octave) the notes of the scale are pitch classes:

```js
var major = scale('C D E F G A B C')
major('A') // => ['A', 'B', 'C#' 'D', 'E', 'F#', 'G#']
```

If the tonic of the scale is a note with octave, the notes of the scale will have octave numbers:

```js
major('A4') // => ['A4', 'B4', 'C#5' ,'D5', 'E5', 'F#5', 'G#5']
```

If the tonic is null and the source are notes, the first pitch class of the scale source will be the tonic:

```js
major(null) // => ['C', 'D', 'E', 'F', 'G', 'A', 'B']
scale('d4 f5 g2 c6 a1', null) // => [ 'D', 'F', 'G', 'A', 'C' ]
```

#### Get scale intervals

If the tonic of a scale is false, the intervals are returned:

```js
scale('major', false) // => ['P1', 'M2', 'M3', 'P4', 'P5', 'M6', 'M7']
```

## License

MIT License
