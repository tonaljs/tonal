# music-chord [![npm version](https://img.shields.io/npm/v/music-chord.svg)](https://www.npmjs.com/package/music-chord)

[![tonal](https://img.shields.io/badge/tonal-music--gamut-yellow.svg)](https://www.npmjs.com/package/tonal)

`music-chord` is a function to create music chords and harmonizers-like structures:

```js
var chord = require('music-chord')
var maj7 = chord('1 3 5 7')
var maj7('A4') // => ['A4', 'C#5', 'E5', 'G#5']
```

This is part of [tonal](https://www.npmjs.com/package/tonal)

If you need chords by name, see [chord-dictionary](https://www.npmjs.com/package/chord-dictionary)

## Install

Via npm: `npm i --save music-chord`

## Usage

Chords are arrays of notes ordered by pitch. Not always the first not is the tonic of the chord.

#### Create chords

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

If `false` is passed as tonic, you can extract chord intervals:

```js
chord('D F A C', false) // => ['1P', '3m', '5P', '7m']
```

## License

MIT License
