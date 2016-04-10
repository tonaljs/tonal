# pitch-set [![npm version](https://img.shields.io/npm/v/pitch-set.svg)](https://www.npmjs.com/package/pitch-set)

[![tonal](https://img.shields.io/badge/tonal-pitch--set-yellow.svg)](https://www.npmjs.com/package/tonal)

`pitch-set` is a function to create pitch sets (a collection of unique pitch classes or simplified intervals) from an arbitrary collection of notes or intervals:

```js
var pitchSet = require('pitch-set')

// pitch sets from a collection of notes (using first note as tonic)
pitchSet('C2 d4 g6 g3 f5') // => ['C', 'D', 'F', 'G']
// pitch set from intervals (simplified and ordered by size)
pitchSet('11 10 9 8') // => ['1P', '2M', '3M', '4P']
```

This is part of [tonal](https://www.npmjs.com/package/tonal):

```js
var tonal = require('tonal')
tonal.pitchSet(...)
```

Install via npm: `npm i --save pitch-set`

## License

MIT License
