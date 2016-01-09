## `intervalClass`

Get the [interval class](https://en.wikipedia.org/wiki/Interval_class)
number of a given interval.

In musical set theory, an interval class is the shortest distance in
pitch class space between two unordered pitch classes

### Parameters

* `interval` **`String or Interval`** the Interval


### Examples

```js
var ic = require('interal-class')
ic('P8') // => 0
ic('m6') // => 4
['P1', 'M2', 'M3', 'P4', 'P5', 'M6', 'M7'].map(ic) // => [0, 2, 4, 5, 5, 3, 1]
```

Returns `Integer` A value between 0 and 6


