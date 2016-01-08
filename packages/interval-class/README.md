# interval-class [![npm version](https://img.shields.io/npm/v/interval-class.svg)](https://www.npmjs.com/package/interval-class)

[![tonal](https://img.shields.io/badge/tonal-interval--class-yellow.svg)](https://www.npmjs.com/browse/keyword/tonal)

Get the [interval class](https://en.wikipedia.org/wiki/Interval_class) of an interval:

> The interval class is the shortest distance in pitch class space between two unordered pitch classes

```js
var ic = require('interval-class')
ic('P4') // => 5
ic('P5') // => 5
```

This tiny function is part of [tonal](https://github.com/danigb/tonal)
