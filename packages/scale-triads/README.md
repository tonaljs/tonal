# scale-triads [![npm](https://img.shields.io/npm/v/scale-triads.svg)](https://www.npmjs.com/package/scale-triads)

[![license](https://img.shields.io/npm/l/scale-triads.svg)](https://www.npmjs.com/package/scale-triads)
[![tonal](https://img.shields.io/badge/tonal-scale--triads-yellow.svg)](https://www.npmjs.com/package/tonal)

Get a triad from a scale:

```js
var triads = require('scale-triad')
triad('C D E F G A B', 4, 'II') // => ['C', 'E', 'G', 'B']
triad('C D E F G A B', 4) // => ['C', 'E', 'F']
majorChords('II', null) // => 'IIm7'
majorChords('II', 'C') // => ['D', 'F', 'A', 'C']
majorChords('II', false) // => ['1P', '3m', '5P', '7m']
majorChords(null, null) // => ['Imaj7', 'IIm7', ...]
majorChords(null, 'C') // => ['Cmaj7', 'Dm7', ...]
```

This is part of [tonal](https://www.npmjs.com/package/tonal)

## Installation

Via npm: `npm i --save scale-triads`

## Usage

## License

MIT License
