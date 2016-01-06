# music-chord [![npm version](https://img.shields.io/npm/v/music-chord.svg)](https://www.npmjs.com/package/music-chord)

[![tonal](https://img.shields.io/badge/tonal-music--gamut-yellow.svg)](https://www.npmjs.com/package/tonal)

`music-chord` is a versatile function to create chords and harmonizer-like structures:

```js
var chord = require('music-chord')
var maj7 = chord('1 3 5 7')
var maj7('A4') // => ['A4', 'C#5', 'E5', 'G#5']
```

This is part of [tonal](https://www.npmjs.com/package/tonal)

## Install

Via npm: `npm i --save music-chord`

## Usage

You can create chords by a list of intervals and a tonic:

```js
chord('1 b3 5 b7', 'C') // => ['C', 'Eb', 'G', 'Bb']
```

Like most tonal functions, it can be partially applied:

```js
var m7 = chord('1 b3 5 b7')
m7('C') // => ['C', 'Eb', 'G', 'Bb']
```

You can create a chord from a list of notes (the first is considered to be the tonic):

```js
var dom = chord('A C# E G')
dom('D') // => ['D', 'F#', 'G', 'C']
```

## License

MIT License
