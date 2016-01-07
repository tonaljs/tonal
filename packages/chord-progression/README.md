# chord-progression [![npm](https://img.shields.io/npm/v/chord-progression.svg)](https://www.npmjs.com/package/chord-progression)

[![license](https://img.shields.io/npm/l/chord-progression.svg)](https://www.npmjs.com/package/chord-progression)
[![tonal](https://img.shields.io/badge/tonal-chord--progression-yellow.svg)](https://www.npmjs.com/package/tonal)


```js
var progression = require('chord-progression')
progression('I IIm7 V7', 'C') // => ['C', 'Cm7', 'G7']
```

With `key-chord`

```js
progression('I II V', keyChord('C major')) // => ['C', 'Dm7', 'G7']
```

This is part of [tonal](https://www.npmjs.com/package/tonal)

## Installation

Via npm: `npm i --save chord-progression`

## Usage

## License

MIT License
