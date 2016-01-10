## `sort`

Sort a collection of notes or intervals using a comparator

This function is currified

### Parameters

* `comparator` **`Function or Boolean`** the comparator function or true to sort in ascending pitch order or false to sort in descending pitch order
* `source` **`String or Array`** the notes or intervals list


### Examples

```js
var sort = require('note-sorter')
sort('c5 d2 f4 D2') // => ['D2', 'D2', 'F4', 'C5']
```

Returns `Array` the notes or intervals sorted


