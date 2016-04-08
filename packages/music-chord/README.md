# music-chord [![npm version](https://img.shields.io/npm/v/music-chord.svg)](https://www.npmjs.com/package/music-chord)

[![tonal](https://img.shields.io/badge/tonal-music--chord-yellow.svg)](https://www.npmjs.com/package/tonal)

`music-chord` is a function to create music chords. They can be created from a chord name (it includes a chord dictionary) or from chord intervals:

```js
var chord = require('music-chord')

// create from chord name
chord('Cmaj7') // => ['C', 'E', 'G', 'B']

// create from name and tonic
chord('maj7', 'A') // => ['A', 'C#', 'E', 'G#']

// create from intervals and tonic
chord('1 3 5 7', 'A4') // => ['A4', 'C#5', 'E5', 'G#5']

// partially applied
var maj7 = chord('maj7')
var maj7('A4') // => ['A4', 'C#5', 'E5', 'G#5']
```

This is part of [tonal](https://www.npmjs.com/package/tonal)

## Install

Via npm: `npm i --save music-chord`

## Usage

Chords are arrays of notes ordered by pitch. Not always the first not is the tonic of the chord.

#### Create chords from a collection of notes or intervals

You can create chords by a list of intervals and a tonic. If the tonic is a pitch class (a note with octave) the chord notes are pitch classes:

```js
chord('1 b3 5 b7 9', 'C2') // => ['C2', 'Eb2', 'G2', 'Bb2', 'D3']
chord('1 b3 5 b7 9', 'C') // => ['C', 'Eb', 'G', 'Bb', 'D']
```

Like most tonal functions, it can be partially applied:

```js
var m7 = chord('1 b3 5 b7')
m7('C') // => ['C', 'Eb', 'G', 'Bb']
```

You can also create a chord from a list of notes (the first is considered to be the tonic):

```js
var dom = chord('A C# E G')
dom('D') // => ['D', 'F#', 'G', 'C']
```

#### Get chord intervals

If `false` is passed as tonic, you can get chord intervals:

```js
chord('maj7', false) // => ['1P', '3m', '5P', '7M']
```

#### Get chord names and properties

The `names` and `props` functions from [chord-dictionary]() are exposed:

```js
chord.names() // => ['Maj7', 'm7', ...]
chord.names(true) // => ['Maj7', 'm7', ...] <= with aliases
chord.props('m7b5') // => { name: 'm7b5',
  // aliases: [ 'half-diminished', 'h7', '_7b5' ],
  // intervals: [ '1', '3b', '5d', '7b' ],
  // steps: [ [ 0, 0 ], [ -3, 2 ], [ -6, 4 ], [ -2, 2 ] ],
  // binary: '100100100010', decimal: 2338 }
```

## License

MIT License
