# scale-dictionary [![npm](https://img.shields.io/npm/v/scale-dictionary.svg)](https://www.npmjs.com/package/scale-dictionary)

[![license](https://img.shields.io/npm/l/scale-dictionary.svg)](https://www.npmjs.com/package/scale-dictionary)
[![tonal](https://img.shields.io/badge/tonal-scale--dictionary-yellow.svg)](https://www.npmjs.com/browse/keyword/tonal)

A dictionary of music scales. This contains a [json file](https://github.com/danigb/scale-dictionary/blob/master/scales.json) with scale definitions (currently 89), and a javascript function to access them:

```js
var scale = require('scale-dictionary')
scale('Bb bebop') // => [ 'Bb', 'C', 'D', 'Eb', 'F', 'G', 'Ab', 'A' ]
```

This is part of [tonal](https://github.com/danigb/tonal)

## Installation

Install via npm: `npm install --save scale-dictionary`. For browsers use the browserify or similar tool or get [tonal.scale](https://github.com/danigb/tonal.scale)

## Usage

#### Get scales by name

You can get a scale by name and tonic:
```js
var scale = require('scale-dictionary')
scale('Eb locrian pentatonic') // => [ 'Eb', 'Gb', 'Ab', 'Bbb', 'Db' ]
```

Or with the scale name and tonic as second parameter:

```js
scale('locrian pentatonic', 'Eb') // => [ 'Eb', 'Gb', 'Ab', 'Bbb', 'Db' ]
```

#### Get scale intervals

If the tonic is `false` you get the intervals:

```js
// set tonic to false to get intervals
scale('locrian pentatonic', false)// => [ '1P', '3m', '4P', '5d', '7m' ]
```

#### Partial apply

You can partial apply the function:

```js
var dorian = scale('dorian')
dorian('D') // => ['D', 'E', 'F', 'G', 'A', 'B']
```

#### Get scale properties

```js
scale.props('locrian pentatonic')
  // => { name: 'locrian pentatonic',
  //  aliases: [ 'minor seven flat five pentatonic' ],
  //  intervals: [ '1', '3b', '4', '5b', '7b' ],
  //  steps: [ [ 0, 0 ], [ -3, 2 ], [ -1, 1 ], [ -6, 4 ], [ -2, 2 ] ],
  //  binary: '100101100010',
  //  decimal: 2402 }
```

- name: the name of the scale
- aliases: an array with the alternative names of the scale
- intervals: an array with the intervals in array notation
- steps: an array with the intervals in __array notation__
- binary: a binary representation of the scale set
- decimal: the decimal representation of the scale set

#### Get scale names

```js
scale.names() // => ['Maj7', 'm7', ...] (names without aliases)
scale.names().length // => 89
scale.names(true) // => [ ...] (names with aliases)
scale.names(true).length // => 108
```

#### Require the json directly

You can get or require [json data file](https://github.com/danigb/scale-dictionary/blob/master/scales.json) directly:

```js
var data = require('scale-dictionary/scales.json')
```

## License

MIT License
