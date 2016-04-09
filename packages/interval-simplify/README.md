# interval-simplify [![npm version](https://img.shields.io/npm/v/interval-simplify.svg)](https://www.npmjs.com/package/interval-simplify)

[![tonal](https://img.shields.io/badge/tonal-interval--simplify-yellow.svg)](https://www.npmjs.com/browse/keyword/tonal)

Simplify musical intervals:

```js
var simplify = require('interval-simplify')
simplify('9M') // => '2M'
['8P', '9M', '10M', '11P', '12P', '13M', '14M', '15P'].map(simplify)
// => [ '8P', '2M', '3M', '4P', '5P', '6M', '7M', '8P' ]
simplify('2M') // => '2M'
simplify('-2M') // => '7m'
```

This is part of [tonal](https://github.com/danigb/tonal):

```js
var tonal = require('tonal')
tonal.interval.simplify('9M') // => '2M'
```

## License

MIT License
