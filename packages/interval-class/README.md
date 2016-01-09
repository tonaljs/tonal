# interval-class [![npm version](https://img.shields.io/npm/v/interval-class.svg)](https://www.npmjs.com/package/interval-class)

[![tonal](https://img.shields.io/badge/tonal-interval--class-yellow.svg)](https://www.npmjs.com/browse/keyword/tonal)

Get the [interval class](https://en.wikipedia.org/wiki/Interval_class) of an interval:

> The interval class is the shortest distance in pitch class space between two unordered pitch classes

In practice, an interval class is an integer between 0 and 6:

```js
var ic = require('interval-class')
ic('P4') // => 5
ic('P5') // => 5
ic('P8') // => 0
ic('M7') // => 1
ic('m7') // => 2
```

This tiny function is part of [tonal](https://github.com/danigb/tonal)

## License

MIT License
