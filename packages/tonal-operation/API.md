## `operation`

Decorate a function to work with intervals, notes or pitches in
[array notation](https://github.com/danigb/tonal/tree/next/packages/array-notation)
with independence of string representations.

This is the base of the pluggable notation system of
[tonal](https://github.com/danigb/tonal)

### Parameters

* `parse` **`Function`** the parser
* `str` **`Function`** the string builder
* `op` **`Function`** the operation to decorate


### Examples

```js
var operation = require('tonal-operation')
var parse = require('array-notation/interval/parse')
var str = require('array-notation/interval/str')
var add = operation(parse, str, function(a, b) {
  return [a[0] + b[0], a[1] + b[1]]
})
add('3m', '3M') // => '5P'
```



