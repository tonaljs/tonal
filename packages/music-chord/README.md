# music-chord [![npm version](https://img.shields.io/npm/v/music-chord.svg)](https://www.npmjs.com/package/music-chord)

[![tonal](https://img.shields.io/badge/tonal-music--chord-yellow.svg)](https://www.npmjs.com/package/tonal)

`music-chord` is a function to create music chords. They can be created from a chord name (it includes a chord dictionary) or from a list of intervals:

```js
var chord = require('music-chord')
// get chord notes using name
chord('Cmaj7') // => ['C', 'E', 'G', 'B']
// get chord notes using type and tonic
chord('maj7', 'C2') // => ['C2', 'E2', 'G2', 'B2']
// get chord intervals (tonic false)
chord('maj7', false) // => ['1P', '3M', '5P', '7M']
// partially applied
var maj7 = chord('maj7')
maj7('C') // => ['C', 'E', 'G', 'B']
// create chord from intervals
chord('1 3 5 m7 m9', 'C') // => ['C', 'E', 'G', 'Bb', 'Db']
```

This is part of [tonal](https://www.npmjs.com/package/tonal):

```js
var tonal = require('tonal')
tonal.chord('C7') // => ['C', 'E', 'G', 'Bb']
```

Install via npm: `npm i --save music-chord`

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

#### Get chord names

The `names` function return the available chord names:

```js
chord.names() // => ['Maj7', 'm7', ...]
chord.names(true) // => ['Maj7', 'm7', ...] <= with aliases
```

## License

MIT License
