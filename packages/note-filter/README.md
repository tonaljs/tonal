# note-filter [![npm version](https://img.shields.io/npm/v/note-filter.svg)](https://www.npmjs.com/package/note-filter)

[![tonal](https://img.shields.io/badge/tonal-filter--notes-yellow.svg)](https://www.npmjs.com/package/tonal)

Filter notes using using a function or collection of notes:

```js
var filter = require('note-filter')

// filter by pitch class
filter('C', 'c3 c#2 c2 c4 cb2') // => ['C3', 'C2', 'C4'])
// filter by note
filter('c3', 'c1 c2 c3 c4 c5 c6') // => ['C3']
// filter by collection
filter('C E G3', 'c2 db2 c3 eb2 gb2 g3 ab g4') // => [ 'C2', 'C3', 'G3' ])

// partially applied
var cMajorFilter = filter('C D E F G A B')
cMajorFilter('c3') // => 'C3'
cMajorFilter('c#3') // => null
```

Install via npm: `npm i --save note-filter`

This is part of [tonal](https://www.npmjs.com/package/tonal):

```js
var tonal = require('tonal')
tonal.filter('A B C', 'c2 d2 e2 f2 g2 a2 b2') // => ['C2', 'A2', 'B2']
```

## Usage

#### Filter using a function

You can create a filter with a function. The function will receive notes in array notation:

```js
var f = filter(function (n) { return n[0] === 0 }) // only 'C' notes
f('c2 e2 g2 c3') // => ['C2', 'C3']
```

#### Filter using allowed notes

You can pass a list of allowed notes to create a filter:

```js
var cMajor = filter('c d e f g a b')
cMajor('c c# d d#') // => ['C', 'D']
```

#### Filter midi notes

The `filter.midi` function works with collection of midi numbers. It returns properly named notes:

```js
var cMinor = filter.midi('c d eb f g ab bb')
cMinor('60 61 62 63 64 65 66 67 68 69 70 71 72') // => [ 'C4', 'D4', 'Eb4', 'F4', 'G4', 'Ab4', 'Bb4', 'C5' ]
```

## License

MIT License
