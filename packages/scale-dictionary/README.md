# scale-dictionary [![npm](https://img.shields.io/npm/v/scale-dictionary.svg)](https://www.npmjs.com/package/scale-dictionary)

[![tonal](https://img.shields.io/badge/tonal-scale--dictionary-yellow.svg)](https://www.npmjs.com/browse/keyword/tonal)

A dictionary of music scales. This contains a [json file](https://github.com/danigb/scale-dictionary/blob/master/scales.json) with scale definitions (currently 89):

```js
var scale = require('scale-dictionary')
scale['bebop'] // => [ '1', '2', '3', '4', '5', '6', '7b', '7' ]
// can have alias
scales['arabian'] // => 'locrian major'
```

This is part of [tonal](https://github.com/danigb/tonal):

```js
var tonal = require('tonal')
tonal.scales['major'] // => ...
```

Install via npm: `npm install --save scale-dictionary`

## License

MIT License
