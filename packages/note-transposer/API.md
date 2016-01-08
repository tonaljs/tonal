## `transpose`

Transposes a note by an interval.

Given a note and an interval it returns the transposed note. It can be used
to add intervals if both parameters are intervals.

The order of the parameters is indifferent.

This function is currified so it can be used to map arrays of notes.

### Parameters

* `interval` **`String or Array`** the interval. If its false, the note is not transposed.
* `note` **`String or Array`** the note to transpose


### Examples

```js
var transpose = require('note-transposer')
transpose('3m', 'C4') // => 'Eb4'
transpose('C4', '3m') // => 'Eb4'
tranpose([1, 0, 2], [3, -1, 0]) // => [3, 0, 2]
['C', 'D', 'E'].map(transpose('3M')) // => ['E', 'F#', 'G#']
```

Returns  the note transposed


