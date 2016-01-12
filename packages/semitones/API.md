## `semitones`

Get the size in semitones of an interval or a note. If applied to a note, it
get the size in semitones from 'C0' to that note.

### Parameters

* `pitch` **`String or Array`** the pitch to get the semitones size from (in string or array notetion)


### Examples

```js
var semitones = require('semitones')
semitones('P4') // => 5
```

Returns `Integer` the size in semitones, null if not valid pitch


