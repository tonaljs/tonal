# chord-dictionary [![npm](https://img.shields.io/npm/v/chord-dictionary.svg)](https://www.npmjs.com/package/chord-dictionary)

[![license](https://img.shields.io/npm/l/chord-dictionary.svg)](https://www.npmjs.com/package/chord-dictionary)
[![tonal](https://img.shields.io/badge/tonal-chord--dictionary-yellow.svg)](https://www.npmjs.com/browse/keyword/tonal)

A dictionary of music chords. This contains a [json file](https://github.com/danigb/chord-dictionary/blob/master/chords.json) with chord definitions (currently 108), and a javascript function to access them:

```js
var chord = require('chord-dictionary')
chord('Abm7b5') // => [ 'Ab', 'Cb', 'Ebb', 'Gb' ]
```

This is part of [tonal](https://github.com/danigb/tonal)

## Installation

Install via npm: `npm install --save chord-dictionary`. For browsers use the browserify or similar tool or get [tonal.chord](https://github.com/danigb/tonal.chord)

## Usage

#### Get chords by name

You can get a chord by name and tonic:

```js
var chord = require('chord-dictionary')
chord('Abm7b5') // => [ 'Ab', 'Cb', 'Ebb', 'Gb' ]
```

Or with the chord name and tonic as second parameter:

```js
chord('m7b5', 'Ab') // => [ 'Ab', 'Cb', 'Ebb', 'Gb' ]
```

#### Get chord intervals

If the tonic is `false` you get the intervals:

```js
// set tonic to false to get intervals
chord('m7b5', false)// => [ '1P', '3m', '5d', '7m' ]
```

#### Partial apply

You can partial apply the function:

```js
var maj13 = chord('Maj13#11')
maj13('D4') // => [ 'D4', 'F#4', 'A4', 'C#5', 'E5', 'G#5', 'B5' ]
```

#### Get chord properties

```js
chord.props('maj13#11')
// => { name: 'M13#11',
//      aliases: [ 'maj13#11', 'Maj13#11', 'M13+4', 'M13#4' ],
//      intervals: [ '1', '3', '5', '7', '9', '11#', '13' ],
//      steps: [ [ 0, 0 ], [ 4, -2 ], [ 1, 0 ], [ 5, -2 ], [ 2, 0 ], [ 6, -2 ], [ 3, 0 ] ],
//      binary: '101010110101',
//      decimal: 2741 }
```

- name: the name of the chord
- aliases: an array with the alternative names of the chord
- intervals: an array with the intervals in array notation
- steps: an array with the intervals in __array notation__
- binary: a binary representation of the chord set
- decimal: the decimal representation of the chord set

#### Get chord names

```js
chord.names() // => ['Maj7', 'm7', ...] (names without aliases)
chord.names().length // => 108
chord.names(true) // => [ ...] (names with aliases)
chord.names(true).length // => 223
```

#### Require the json directly

You can get or require [json data file](https://github.com/danigb/chord-dictionary/blob/master/chords.json) directly:

```js
var data = require('chord-dictionary/chords.json')
```

## License

MIT License
