# interval-class [![npm version](https://img.shields.io/npm/v/interval-class.svg)](https://www.npmjs.com/package/interval-class)

[![tonal](https://img.shields.io/badge/tonal-interval--class-yellow.svg)](https://www.npmjs.com/browse/keyword/tonal)

Get the [interval class](https://en.wikipedia.org/wiki/Interval_class) of an interval:

> The interval class is the shortest distance in pitch class space between two unordered pitch classes

In practice, an interval class is an integer between 0 and 6:

```js
var ic = require('interval-class')
ic('P4') // => 5
ic('P5') // => 5
```

Install it via npm: `npm i --save interval-class`

This tiny function is part of [tonal](https://github.com/danigb/tonal)

## Usage

Work with intervals in shorthand notation:

```js
['1P', '2M', '3M', '4P', '5P', '6M', '7M'].map(ic)
// => [ 0, 2, 4, 5, 5, 3, 1, 0 ]
```

You can pass the interval in semitones:

```js
ic(7) // => 5 (a perfect fifth)
```

Or using [array notation]():

```js
ic([ 2, -1 ]) // => 2 (a major second)
```

## License

MIT License
