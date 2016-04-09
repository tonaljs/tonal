## `interval.simplify`

Get the simplified version of an interval.

### Parameters

* `interval` **`String or Array`** the interval to simplify


### Examples

```js
var simplify = require('interval-simplify')
simplify('9M') // => '2M'
['8P', '9M', '10M', '11P', '12P', '13M', '14M', '15P'].map(simplify)
// => [ '8P', '2M', '3M', '4P', '5P', '6M', '7M', '8P' ]
simplify('2M') // => '2M'
simplify('-2M') // => '7m'
```

Returns  the simplified interval


