# note-filter [![npm version](https://img.shields.io/npm/v/note-filter.svg)](https://www.npmjs.com/package/note-filter)

[![tonal](https://img.shields.io/badge/tonal-filter--notes-yellow.svg)](https://www.npmjs.com/package/tonal)

Filter notes using a pitch set:

```js
var filter = require('note-filter')

// filter by pitch class
filter('C E G', 'c2 db2 c3 eb2 gb2 g3 ab g4') // => [ 'C2', 'C3', 'G3', 'G4' ])

// single note set
filter('C', 'c3 c#2 c2 c4 cb2') // => ['C3', 'C2', 'C4'])

// filter single note by pitch class
filter('C D E F G G A B', 'C3') // => 'C3'
filter('C D E F G G A B', 'c#') // => null

// enharmonic substitution
filter('C', 'C2 B#3 Dbb3') // => [ 'C2', 'C4', 'C3' ])

// example
var scale = require('music-scale')
var notes = ... // <- get some notes from midi device
filter(scale('Eb major'), notes)
```

This is part of [tonal](https://www.npmjs.com/package/tonal)

Install via npm: `npm i --save note-filter`

## License

MIT License
