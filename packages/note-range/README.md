# note-range [![npm version](https://img.shields.io/npm/v/note-range.svg)](https://www.npmjs.com/package/note-range)

[![tonal](https://img.shields.io/badge/tonal-note-range-yellow.svg)](https://www.npmjs.com/browse/keyword/tonal)

```js
var range = require('note-range')

// create a chromatic scale of two octaves starting from A4
range(null, 'A4', 24) // => [ 'A4', 'Bb4', 'B4', 'C5', ..., 'G#6' ]
// create a chromatic scale from A4 to D4
range(null, 'A4', 'D4')
// create a major scale with tonic in A2 and length of 5 elements
range('1 2 3 4 5 6 7', 'A2', 5) // => ['A2', 'C#3', 'E3', 'A3', 'C#4']
range('1 3 5', 'A2', 'A4') // => ['A2', 'C#3', 'E3', 'A3', 'C#4', 'E4', 'A4']
range('1 3 5', 'A2', -5) // => ['A2', 'E3', 'C#3', 'A1', 'E0']
range('C D E F G A Bb', 'A3', 'D2') // => ['A3', 'Bb3', 'C2', 'D2']
range('C D E F G A Bb', 'A3', 4) // => ['A3', 'Bb3', 'C2', 'D2']
```
