# note-interval [![npm version](https://img.shields.io/npm/v/note-interval.svg)](https://www.npmjs.com/package/note-interval)

[![tonal](https://img.shields.io/badge/tonal-note--interval-yellow.svg)](https://www.npmjs.com/package/tonal)


`note-interval` is a function to calculate the interval between two notes:

```js
var interval = require('note-interval')
interval('C3', 'E4') // => '3M'
```

## Install

Only via npm: `npm i --save note-interval`

## Usage

There's only one function with two params. The function can be partially applied:

```js
var fromC = interval('C4')
fromC('Eb3') // => '3m'
```

#### Get interval between two notes (pitches)

This is the simplest use case. Can be descending intervals:

```js
interval('C3', 'F3') // => '4P'
interval('C3', 'F2') // => '-5P'
```

#### Get interval between two pitch classes

If one or both notes are pitch classes (no octave) an ascending interval is always returned:

```js
interval('C', 'F') // => '4P'
interval('B', 'C') // => '2m'
```

#### Distance between intervals

It can be used to subtract intervals:

```js
interval('3M', '5P') // => '3m'
```

## License

MIT License
