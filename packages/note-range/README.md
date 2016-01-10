# note-range [![npm version](https://img.shields.io/npm/v/note-range.svg)](https://www.npmjs.com/package/note-range)

[![tonal](https://img.shields.io/badge/tonal-note-range-yellow.svg)](https://www.npmjs.com/browse/keyword/tonal)

```js
var range = require('note-range')

range('1 3 5', 'A2', 'A4') // => ['A2', 'C#3', 'E3', 'A3', 'C#4', 'E4', 'A4']
range('1 3 5', 'A2', 5) // => ['A2', 'C#3', 'E3', 'A3', 'C#4']
range('1 3 5', 'A2', -5) // => ['A2', 'E3', 'C#3', 'A1', 'E0']
range('C D E F G A Bb', 'A3', 'D2') // => ['A3', 'Bb3', 'C2', 'D2']
range('C D E F G A Bb', 'A3', 4) // => ['A3', 'Bb3', 'C2', 'D2']
```
