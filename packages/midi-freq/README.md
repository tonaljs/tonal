# midi-freq [![npm version](https://img.shields.io/npm/v/midi-freq.svg)](https://www.npmjs.com/package/midi-freq)

[![tonal](https://img.shields.io/badge/tonal-midi--freq-yellow.svg)](https://www.npmjs.com/browse/keyword/tonal)

Get frequency of a midi note:

```js
var freq = require('midi-freq')(440)
freq(69) // => 440
```

Basically it's just: `Math.pow(2, (midi - 69) / 12) * tuning` with a couple of goodies.

This tiny (165 bytes) function is part of [tonal](https://github.com/danigb/tonal)

## API

### `freq(tuning, midi)`

Get the frequency of a midi note with the custom tuning. If not specified, is 440Hz by default. It can be partially applied to set the default tunning (see below).

## Usage

Get the frequency:

```js
// 69 is note A4
var freq = require('midi-freq')
freq(440, 69) // => 440
freq(null, 69) // => 440
freq(444, 69) /// => 444
// 57 is note A3
freq(null, 57) // => 220
freq(444, 57) // => 222
```

#### Set default tuning

Normally you use the same tuning for all your app. You can partially applied the function:

```js
var freq = require('midi-freq')(444)
// the freq function uses 444 as custom tuning
freq(57) // => 222
```

## License

MIT License
