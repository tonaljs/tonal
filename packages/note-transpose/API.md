## `note.transpose`

Transpose a note by an interval.

This function is currified. The order of the parameters is indifferent.

### Parameters

* `interval` **`String or Array`** the interval. If its false, the note is not transposed.
* `note` **`String or Array`** the note to transpose


### Examples

```js
var transpose = require('note-transpose')
transpose('3m', 'C4') // => 'Eb4'
transpose('C4', '3m') // => 'Eb4'
tranpose([1, 0, 2], [3, -1, 0]) // => [3, 0, 2]
['C', 'D', 'E'].map(transpose('3M')) // => ['E', 'F#', 'G#']
```

Returns  the note transposed
