# chord-dictionary [![npm](https://img.shields.io/npm/v/chord-dictionary.svg)](https://www.npmjs.com/package/chord-dictionary)

[![license](https://img.shields.io/npm/l/chord-dictionary.svg)](https://www.npmjs.com/package/chord-dictionary)
[![tonal](https://img.shields.io/badge/tonal-chord--dictionary-yellow.svg)](https://www.npmjs.com/browse/keyword/tonal)

A dictionary of music chords. This is basically a [json file](https://github.com/danigb/chord-dictionary/blob/master/chords.json) with chord definitions (currently 108, 220 including aliases):

```js
var chord = require('chord-dictionary')
chord['Maj7'] // => [ '1', '3', '5', '7' ]
chord['maj7'] // => 'Maj7'
```

This is part of [tonal](https://github.com/danigb/tonal):

```js
var tonal = require('tonal')
tonal.chords['Maj7']
```

Install via npm: `npm install --save chord-dictionary`.

## License

MIT License
