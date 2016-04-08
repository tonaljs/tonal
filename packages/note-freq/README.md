# note-freq [![npm version](https://img.shields.io/npm/v/note-freq.svg)](https://www.npmjs.com/package/note-freq)

[![tonal](https://img.shields.io/badge/tonal-note--freq-yellow.svg)](https://www.npmjs.com/browse/keyword/tonal)

Get frequency of a note:

```js
var freq = require('note-freq')
freq(440, 'a4') // => 440
```

It works with midi numbers too:

```js
freq(440, 57) // => 222
```

## Usage

Get the frequency using a custom tunning:

```js
// 69 is note A4
var freq = require('note-freq')
freq(440, 'a4') // => 440
freq(null, 'a4') // => 440
freq(444, 'a4') /// => 444
freq(null, 'a3') // => 220
// 57 is note A3
freq(444, 57) // => 222
```

#### Set default tuning

Normally you use the same tuning for all your app. You can partially apply the function to set the default tuning:

```js
var freq = require('note-freq')(444)
// the freq function uses 444 as custom tuning
freq('A3') // => 222
```

## License

MIT License
